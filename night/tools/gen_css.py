"""Generate night.css from the site's own stylesheets.

Every rule in the Webflow CSS and the DFS CSS that sets a colour gets a night
twin under `html.dfs-night`, with the colour moved onto the night palette:

- Neutrals (the beige/grey scale) are flipped on a fixed ramp: the warm page
  beige becomes deep night navy, the dark "Gari" text becomes moonlit beige.
  Order is kept, so "slightly darker panel" by day is "slightly lighter panel"
  by night and every contrast pair stays a contrast pair.
- Very light blues (highlight boxes) become a deep blue highlight.
- Real colours (Calm/Spark Blue, green, red) stay as they are.
- Shadows are left alone (black shadows work on navy).

Run (from the repo root):  python night/tools/gen_css.py  ->  night/night.css
Inputs: night/tools/snapshot/wf.css (download the current Webflow CSS there first),
styles.css (our own CSS) and night/extras.css (hand-tuned rules, appended).
"""
import re, pathlib, tinycss2

HERE = pathlib.Path(__file__).parent
REPO = HERE.parent.parent
SOURCES = [HERE / 'snapshot/wf.css', REPO / 'styles.css']
SCOPE = 'html.dfs-night'

# Day lightness (0..1) -> night colour. v2 (7 Oct): deeper ink-navy page, and
# anything that sat above or beside the page by day (white boxes, mid-beige
# panels) now RISES a step lighter, like real dark-mode elevation, instead of
# sinking into a darker hole. Text is moonlight, a touch softer than v1.
RAMP = [
    (0.00, (242, 238, 229)),  # black text          -> brightest moonlight
    (0.08, (236, 232, 222)),
    (0.22, (222, 217, 205)),  # #3d3a35 Gari text   -> #ded9cd
    (0.37, (180, 178, 172)),  # #625f5a             -> soft grey-beige
    (0.43, (152, 155, 166)),  # #6f6e6b             -> muted
    (0.52, (122, 128, 146)),  # #868480             -> quiet blue-grey
    (0.72, (58, 70, 98)),
    (0.84, (35, 48, 78)),     # #dfd5c9 lines       -> #23304e
    (0.915, (20, 30, 52)),    # #f1ede2 panels      -> #141e34 (raised)
    (0.96, (14, 22, 40)),     # #fbf7ee page        -> #0e1628
    (1.00, (23, 33, 56)),     # #fff boxes          -> #172138 (raised most)
]
HIGHLIGHT = (17, 35, 61)      # #eff9fd light blue  -> #11233d
PAGE = (14, 22, 40)
LINE_ALPHA = 0.45             # faint dark lines/grids: keep them a whisper
# Brand blues at night: the exact brand Calm Blue / Spark Blue.
BLUES = {(2, 151, 219): (26, 151, 215), (0, 172, 255): (29, 171, 250)}  # site blues -> brand Calm/Spark Blue
VAR_OVERRIDE = {'--brand-colors--blue': '#1a97d7', '--brand-colors--bleu-pop': '#1dabfa'}

PALETTE_VARS = {
    '--brand-colors--light-bage': '#fbf7ee',
    '--brand-colors--bage': '#f1ede2',
    '--brand-colors--dark-bage': '#dfd5c9',
    '--brand-colors--dark_gray': '#3d3a35',
    '--brand-colors--80-dark_gray': '#625f5a',
    '--brand-colors--light-gray': '#6f6e6b',
    '--brand-colors--ll-gray': '#868480',
    '--brand-colors--light-bleu': '#eff9fd',
    '--brand-colors--blue': '#0297db',
    '--brand-colors--bleu-pop': '#00acff',
}

COLOR_PROPS = {
    'color', 'background', 'background-color', 'background-image', 'border', 'border-color',
    'border-top', 'border-right', 'border-bottom', 'border-left', 'border-top-color',
    'border-right-color', 'border-bottom-color', 'border-left-color', 'outline', 'outline-color',
    'fill', 'stroke', 'text-decoration-color', 'caret-color', 'column-rule', 'column-rule-color',
    '-webkit-text-fill-color', '-webkit-text-stroke-color', 'accent-color',
}
NAMED = {'white': (255, 255, 255, 1), 'black': (0, 0, 0, 1)}
# white/black only as a colour word, not inside a name like --colors--white
COLOR_RE = re.compile(r'#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|(?<![\w-])(?:white|black)(?![\w-])')


def parse(tok):
    if tok in NAMED:
        return NAMED[tok]
    if tok.startswith('#'):
        h = tok[1:]
        if len(h) in (3, 4):
            h = ''.join(c * 2 for c in h)
        r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
        a = int(h[6:8], 16) / 255 if len(h) == 8 else 1
        return r, g, b, a
    nums = [float(x) for x in re.findall(r'[\d.]+', tok)]
    return (*nums[:3], nums[3] if len(nums) > 3 else 1)


def lerp_ramp(l):
    for (x0, c0), (x1, c1) in zip(RAMP, RAMP[1:]):
        if x0 <= l <= x1:
            t = (l - x0) / (x1 - x0)
            return tuple(round(a + (b - a) * t) for a, b in zip(c0, c1))
    return RAMP[-1][1]


def night(r, g, b, a):
    """Return the night version of one colour, or None to keep it."""
    if a == 0:
        return None
    exact = BLUES.get((round(r), round(g), round(b)))
    if exact:
        return (*exact, a)
    mx, mn = max(r, g, b), min(r, g, b)
    light = (mx + mn) / 2 / 255
    if light > 0.88 and b > r + 6 and mx - mn < 40:   # pale blue highlight
        return (*HIGHLIGHT, a)
    if mx - mn > 26:                                   # a real colour: keep
        return None
    nr = lerp_ramp(light)
    if a < 1 and light < 0.3:                          # faint dark lines/tints
        a = round(a * LINE_ALPHA, 3)
    return (*nr, a)


def fmt(c):
    r, g, b, a = c
    if a >= 1:
        return '#%02x%02x%02x' % (round(r), round(g), round(b))
    return 'rgba(%d,%d,%d,%s)' % (r, g, b, ('%.3f' % a).rstrip('0').rstrip('.'))


def remap_value(v):
    changed = False

    def sub(m):
        nonlocal changed
        n = night(*parse(m.group(0)))
        if n is None:
            return m.group(0)
        changed = True
        return fmt(n)
    # Leave url(...) alone: a file name like chevron-down-white.svg is not a colour.
    parts = re.split(r'(url\([^)]*\))', v)
    out = ''.join(p if p.startswith('url(') else COLOR_RE.sub(sub, p) for p in parts)
    return out, changed


# The night twins carry no extra weight: `:where()` scores zero, so a night rule
# weighs exactly what its day rule weighs and day modifiers keep winning
# (e.g. the red `.form-field-icon.is--error` over the night `.form-field-icon`).
WHERE = ':where(html.dfs-night)'


def scope_selector(sel):
    parts = []
    for s in sel.split(','):
        s = s.strip()
        if not s:
            continue
        if re.match(r'^(html|:root)\b', s):
            parts.append(re.sub(r'^(html|:root)', 'html:where(.dfs-night)', s, count=1))
        else:
            parts.append(f'{WHERE} {s}')
    return ','.join(parts)


def rules(nodes):
    out = []
    for n in nodes:
        if n.type == 'qualified-rule':
            sel = tinycss2.serialize(n.prelude).strip()
            decls = tinycss2.parse_declaration_list(n.content, skip_whitespace=True, skip_comments=True)
            new = []
            for d in decls:
                if d.type != 'declaration' or d.lower_name not in COLOR_PROPS:
                    continue
                val = tinycss2.serialize(d.value).strip()
                nv, ch = remap_value(val)
                if ch:
                    new.append(f'{d.lower_name}:{nv}{" !important" if d.important else ""}')
            if new:
                out.append(f'{scope_selector(sel)}{{{";".join(new)}}}')
        elif n.type == 'at-rule' and n.lower_at_keyword in ('media', 'supports') and n.content:
            inner = rules(tinycss2.parse_rule_list(n.content, skip_whitespace=True, skip_comments=True))
            if inner:
                out.append(f'@{n.lower_at_keyword} {tinycss2.serialize(n.prelude).strip()}{{{"".join(inner)}}}')
    return out


generated = []
for src in SOURCES:
    sheet = tinycss2.parse_stylesheet(src.read_text(), skip_whitespace=True, skip_comments=True)
    generated.append(f'/* from {src.name} */\n' + '\n'.join(rules(sheet)))

vars_css = ';'.join(f'{k}:{VAR_OVERRIDE.get(k) or fmt(night(*parse(v)) or parse(v))}' for k, v in PALETTE_VARS.items())
hand = (REPO / 'night/extras.css').read_text()

(REPO / 'night/night.css').write_text(
    '/* DFS night mode, generated by night/tools/gen_css.py. Do not edit by hand: edit night/extras.css and regenerate. */\n'
    f'{SCOPE}{{{vars_css};color-scheme:dark;background-color:{fmt((*PAGE, 1))}}}\n'
    + '\n'.join(generated) + '\n\n/* hand-tuned extras */\n' + hand)
print('rules:', sum(g.count('{') for g in generated), 'vars:', vars_css)
