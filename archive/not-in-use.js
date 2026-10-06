// Not loaded on the site — snippets kept for possible reuse later.
// (Was Slater "NOT IN USE.js".)

// txt experience
// txt experience
// txt experience

function initStickyTitleScroll() {
  const wraps = document.querySelectorAll('[data-sticky-title="wrap"]');

  wraps.forEach(wrap => {
    const headings = Array.from(wrap.querySelectorAll('[data-sticky-title="heading"]'));

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top 40%",
        end: "bottom bottom",
        scrub: true,
      }
    });

    const revealDuration = 0.7,
      fadeOutDuration = 0.7,
      overlapOffset = 0.15;

    headings.forEach((heading, index) => {
      // Save original heading content for screen readers
      heading.setAttribute("aria-label", heading.textContent);

      const split = new SplitText(heading, { type: "words,chars" });

      // Hide all the separate words from screenreader
      split.words.forEach(word => word.setAttribute("aria-hidden", "true"));

      // Reset visibility on the 'stacked' headings
      gsap.set(heading, { visibility: "visible" });

      const headingTl = gsap.timeline();
      headingTl.from(split.chars, {
        autoAlpha: 0,
        stagger: { amount: revealDuration, from: "start" },
        duration: revealDuration
      });

      // Animate fade-out for every heading except the last one.
      if (index < headings.length - 1) {
        headingTl.to(split.chars, {
          autoAlpha: 0,
          stagger: { amount: fadeOutDuration, from: "end" },
          duration: fadeOutDuration
        });
      }

      // Overlap the start of fade-in of the new heading a little bit
      if (index === 0) {
        masterTl.add(headingTl);
      } else {
        masterTl.add(headingTl, `-=${overlapOffset}`);
      }
    });
  });
}

initStickyTitleScroll();

// Spin animation for Bleu_scroll. circle
// Spin animation for Bleu_scroll. circle
// Spin animation for Bleu_scroll. circle

const stickyCircle = document.getElementById("Sticky_circle");
const startHere = document.getElementById("START_HERE");
const bleuScroll = document.getElementById("Bleu_scroll");
const bleuArrow = document.querySelector("[data-bleu-arrow]");

gsap.set(stickyCircle, { opacity: 1 });

gsap.to(bleuScroll, {
  rotation: -160,
  transformOrigin: "center center",
  ease: "none",
  scrollTrigger: {
    trigger: startHere,
    start: "top bottom",
    end: "bottom bottom",
    scrub: true
  }
});

gsap.to([bleuArrow, stickyCircle], {
  opacity: 0,
  ease: "power2.out",
  scrollTrigger: {
    trigger: startHere,
    start: "bottom 100%",
    end: "bottom 70%",
    scrub: true,
    // markers: true
  }
});

// document.querySelectorAll('[data-email="btn"]').forEach((btn) => {
//   btn.addEventListener("click", (e) => {
//     e.preventDefault();

//     const section = btn.closest(".sign_in_section");
//     const wrap = section.querySelector('[data-email="wrap"]');

//     // Select the new wrapper you added
//     const btnWrap = btn.closest(".btn_wrap_hide");

//     const tl = gsap.timeline({
//       defaults: { duration: 0.6, ease: "power2.out" }
//     });

//     // Animate the main wrap to auto height
//     tl.to(wrap, { height: "auto" })
//       // Animate the button wrap to 0 height at the same time
//       .to(btnWrap, { height: 0 }, "<");
//   });
// });
// });

// // --- check-out SIGN-IN --------------------------------------------
// // Already guarded internally (skips a box if it has no popup).
// qa('.cta_content').forEach((box) => {
//   const popup = box.querySelector('.get_started_container');
//   const openButton = box.querySelector('[start-popup]');
//   const closeButton = box.querySelector('[close_btn]');
//   if (!popup) return;

//   const popupTimeline = gsap.timeline({ paused: true });
//   popupTimeline.to(popup, { y: 0, duration: 0.6, ease: "power2.out" });

//   if (openButton) {
//     openButton.addEventListener('click', () => popupTimeline.play());
//   }
//   if (closeButton) {
//     closeButton.addEventListener('click', () => popupTimeline.reverse());
//   }

//   // Email button (scoped to this box)
//   const emailBtn = box.querySelector('[data-email="btn"]');
//   if (emailBtn) {
//     emailBtn.addEventListener("click", (e) => {
//       e.preventDefault();
//       const wrap = box.querySelector('[data-email="wrap"]');
//       const btnWrap = emailBtn.closest(".btn_wrap_hide");
//       const tl = gsap.timeline({
//         defaults: { duration: 0.6, ease: "power2.out" },
//         onComplete: () => {
//           const formContainer = popup.querySelector('[data-form-validate]');
//           if (formContainer) {
//             formContainer.__validationInitialized = false;
//             formContainer.querySelectorAll('input, textarea, select').forEach((
//               input) => {
//               input.__validationStarted = false;
//             });
//             initSingleFormValidation(formContainer);
//           }
//         }
//       });
//       tl.to(wrap, { height: "auto" })
//         .to(btnWrap, { height: 0 }, "<");
//     });
//   }
// });
