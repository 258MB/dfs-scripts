// timer
// timer
// timer
// timer

// single interval timer (updates all [data-timer] elements)
(function () {
  const deadline = '2026/10/15 00:00';
  const elTimers = Array.from(document.querySelectorAll('[data-timer]'));

  function pad(num, size = 2) {
    let s = "0" + Math.abs(num);
    return s.substr(s.length - size);
  }

  function parseDate(date) {
    const parsed = Date.parse(date);
    if (!isNaN(parsed)) return parsed;
    return Date.parse(date.replace(/-/g, '/').replace(/[a-z]+/gi, ' '));
  }

  function getTimeRemaining(endtimeMs) {
    const total = endtimeMs - Date.now();
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return { total, days, hours, minutes, seconds };
  }

  const endMs = parseDate(deadline);
  if (elTimers.length === 0) return;

  // cache nodes to avoid querying every tick
  const cached = elTimers.map(el => ({
    el,
    days: el.querySelector('[data-days]'),
    hours: el.querySelector('[data-hours]'),
    minutes: el.querySelector('[data-minutes]'),
    seconds: el.querySelector('[data-seconds]')
  }));

  const tick = () => {
    const t = getTimeRemaining(endMs);
    if (t.total <= 0) {
      cached.forEach(c => {
        if (c.days) c.days.textContent = '00';
        if (c.hours) c.hours.textContent = '00';
        if (c.minutes) c.minutes.textContent = '00';
        if (c.seconds) c.seconds.textContent = '00';
      });
      clearInterval(intervalId);
      return;
    }
    cached.forEach(c => {
      if (c.days) c.days.textContent = pad(t.days);
      if (c.hours) c.hours.textContent = pad(t.hours);
      if (c.minutes) c.minutes.textContent = pad(t.minutes);
      if (c.seconds) c.seconds.textContent = pad(t.seconds);
    });
  };

  tick(); // initial render
  const intervalId = setInterval(tick, 1000);
})();

// //testing osmo text
// //testing osmo text\
// //testing osmo text
const splitConfig = {
  lines: { duration: 0.8, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.01 }
}

async function initMaskTextScrollReveal() {
  document.querySelectorAll('[data-split="heading"]').forEach(heading => {
    // Find the split type, the default is 'lines'
    const type = heading.dataset.splitReveal || 'lines'
    const typesToSplit =
      type === 'lines' ? ['lines'] :
      type === 'words' ? ['lines', 'words'] : ['lines', 'words', 'chars']

    const offset = parseFloat(heading.dataset.splitDelay) || 0
    const startPct = 80 - (offset * 25)

    // Split the text
    SplitText.create(heading, {
      type: typesToSplit.join(', '), // split into required elements
      mask: 'lines', // wrap each line in an overflow:hidden div
      autoSplit: true,
      linesClass: 'line',
      wordsClass: 'word',
      charsClass: 'letter',
      onSplit: function (instance) {
        const targets = instance[type] // Register animation targets
        const config = splitConfig[
          type] // Find matching duration and stagger from our splitConfig
        return gsap.from(targets, {
          yPercent: 110,
          duration: config.duration,
          stagger: config.stagger,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: heading,
            start: `clamp(top ${startPct}%)`,
            scrub: true
            // once: true
          }
        });
      }
    })
  })
}
initMaskTextScrollReveal()

//360

document.querySelectorAll("[rotate360], [rotate360_F]").forEach(el => {
  const duration = parseFloat(el.getAttribute("rotate360")) || 12;
  const forward = !el.hasAttribute("rotate360_F");
  gsap.to(el, {
    rotation: forward ? 360 : -360,
    repeat: -1,
    ease: "none",
    duration,
    transformOrigin: "center center"
  });
});

//logo movement

let angle = 0;
setInterval(() => {
  angle += 45;
  gsap.to("#LOGO_ICON, #LOGO_ICON_2", {
    rotation: angle,
    duration: 0.6,
    ease: "ease",
    transformOrigin: "center center",
  });
}, 4400);

//paralax
//paralax
//paralax
//paralax
//paralax
//paralax

function initGlobalParallax() {
  const mm = gsap.matchMedia()

  mm.add(
    {
      isMobile: "(max-width:479px)",
      isMobileLandscape: "(max-width:767px)",
      isTablet: "(max-width:991px)",
      isDesktop: "(min-width:992px)"
    },
    (context) => {
      const { isMobile, isMobileLandscape, isTablet } = context.conditions

      const ctx = gsap.context(() => {
        document.querySelectorAll('[data-parallax="trigger"]').forEach((trigger) => {
          // Check if this trigger has to be disabled on smaller breakpoints
          const disable = trigger.getAttribute("data-parallax-disable")
          if (
            (disable === "mobile" && isMobile) ||
            (disable === "mobileLandscape" && isMobileLandscape) ||
            (disable === "tablet" && isTablet)
          ) {
            return
          }

          // Optional: you can target an element inside a trigger if necessary
          const target = trigger.querySelector('[data-parallax="target"]') || trigger

          // Get the direction value to decide between xPercent or yPercent tween
          const direction = trigger.getAttribute("data-parallax-direction") || "vertical"
          const prop = direction === "horizontal" ? "xPercent" : "yPercent"

          // Get the scrub value, our default is 'true' because that feels nice with Lenis
          const scrubAttr = trigger.getAttribute("data-parallax-scrub")
          const scrub = scrubAttr ? parseFloat(scrubAttr) : true

          // Get the start position in %
          const startAttr = trigger.getAttribute("data-parallax-start")
          const startVal = startAttr !== null ? parseFloat(startAttr) : 20

          // Get the end position in %
          const endAttr = trigger.getAttribute("data-parallax-end")
          const endVal = endAttr !== null ? parseFloat(endAttr) : -20

          // Get the start value of the ScrollTrigger
          const scrollStartRaw = trigger.getAttribute("data-parallax-scroll-start") ||
            "top bottom"
          const scrollStart = `clamp(${scrollStartRaw})`

          // Get the end value of the ScrollTrigger
          const scrollEndRaw = trigger.getAttribute("data-parallax-scroll-end") ||
            "bottom top"
          const scrollEnd = `clamp(${scrollEndRaw})`

          gsap.fromTo(
            target, {
              [prop]: startVal
            },
            {
              [prop]: endVal,
              ease: "none",
              scrollTrigger: {
                trigger,
                start: scrollStart,
                end: scrollEnd,
                scrub,
              },
            }
          )
        })
      })

      return () => ctx.revert()
    }
  )
}
initGlobalParallax()

// button

function initButtonCharacterStagger() {
  const offsetIncrement = 0.01; // Transition offset increment in seconds
  const buttons = document.querySelectorAll('[data-button-animate-chars]');

  buttons.forEach(button => {
    const text = button.textContent; // Get the button's text content
    button.innerHTML = ''; // Clear the original content

    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.transitionDelay = `${index * offsetIncrement}s`;

      // Handle spaces explicitly
      if (char === ' ') {
        span.style.whiteSpace = 'pre'; // Preserve space width
      }

      button.appendChild(span);
    });
  });
}

initButtonCharacterStagger();

gsap.to("#progress_bar", {
  width: "85%",
  ease: "none",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
});

//FAQ
//FAQ

function initAccordionCSS() {
  document.querySelectorAll('[data-accordion-css-init]').forEach((accordion) => {
    const closeSiblings = accordion.getAttribute('data-accordion-close-siblings') === 'true';

    accordion.addEventListener('click', (event) => {
      const toggle = event.target.closest('[data-accordion-toggle]');
      if (!toggle) return; // Exit if the clicked element is not a toggle

      const singleAccordion = toggle.closest('[data-accordion-status]');
      if (!singleAccordion) return; // Exit if no accordion container is found

      const isActive = singleAccordion.getAttribute('data-accordion-status') === 'active';
      singleAccordion.setAttribute('data-accordion-status', isActive ? 'not-active' :
        'active');

      // When [data-accordion-close-siblings="true"]
      if (closeSiblings && !isActive) {
        accordion.querySelectorAll('[data-accordion-status="active"]').forEach((
          sibling) => {
          if (sibling !== singleAccordion) sibling.setAttribute('data-accordion-status',
            'not-active');
        });
      }
    });
  });
}

initAccordionCSS();
