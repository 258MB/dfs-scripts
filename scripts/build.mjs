// Builds dist/ from main.js and styles.css:
//   dist/main.min.js     the script the website loads
//   dist/styles.min.css  the stylesheet the website loads
//   dist/main.js, dist/styles.css  readable copies (handy for debugging)
//   dist/version.json which version is in this build
// Usage: node scripts/build.mjs            (version from the latest git tag + "-dev")
//        DFS_VERSION=v1.2.0 node scripts/build.mjs
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { minify } from 'terser';
import CleanCSS from 'clean-css';

function git(cmd) {
  try { return execSync('git ' + cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); }
  catch (e) { return ''; }
}

const version = process.env.DFS_VERSION || ((git('describe --tags --abbrev=0') || 'v0.0.0') + '-dev');
const commit = git('rev-parse --short HEAD') || 'unknown';

const source = await readFile('main.js', 'utf8');
const result = await minify(source, {
  compress: true,
  mangle: true,
  format: { comments: false, preamble: `/* dfs-scripts ${version} (${commit}) */` }
});
if (!result.code) throw new Error('Minify produced no output');

await mkdir('dist', { recursive: true });
await writeFile('dist/main.min.js', result.code + '\n');
await writeFile('dist/main.js', source);
const css = await readFile('styles.css', 'utf8');
const cssResult = new CleanCSS({ level: 1 }).minify(css);
if (cssResult.errors.length) throw new Error('CSS errors: ' + cssResult.errors.join('; '));
await writeFile('dist/styles.min.css', `/* dfs-scripts ${version} (${commit}) */\n` + cssResult.styles + '\n');
await writeFile('dist/styles.css', css);

await writeFile('dist/version.json', JSON.stringify({
  version, commit, built: new Date().toISOString()
}, null, 2) + '\n');

console.log(`Built ${version} (${commit}): main.min.js ${result.code.length} bytes, styles.min.css ${cssResult.styles.length} bytes`);
