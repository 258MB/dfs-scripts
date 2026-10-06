// DASHBOARD - Load progress for all courses
async function loadDashboardProgress() {
  try {
    const memberData = await window.$memberstackDom.getMemberJSON();
    console.log('=== LOADING DASHBOARD PROGRESS ===');
    console.log('Member data:', memberData);

    if (memberData && memberData.data && memberData.data.courses) {
      const courses = memberData.data.courses;
      console.log('Found courses:', Object.keys(courses));

      // Update progress for courses that have saved data
      Object.keys(courses).forEach(courseName => {
        const courseData = courses[courseName];
        if (!courseData.lessons) return;

        const lessons = courseData.lessons;
        const completed = lessons.filter(l => l.complete).length;
        const total = lessons.length;
        const percent = Math.round((completed / total) * 100);

        console.log(`${courseName}: ${completed}/${total} = ${percent}%`);

        // Animate progress bar with GSAP
        const progressBar = document.querySelector(`[progress_bar="${courseName}"]`);
        if (progressBar) {
          gsap.to(progressBar, {
            width: percent + '%',
            duration: 1.5,
            ease: 'power2.out'
          });
        }

        // Animate number wheels
        animateProgressNumbers(courseName, percent);
      });

      console.log('=================================');
    } else {
      console.log('No course data found');
      console.log('=================================');
    }
  } catch (error) {
    console.error('Error loading dashboard progress:', error);
  }
}

// Animate the rolling number wheels
function animateProgressNumbers(courseName, percent) {
  const container = document.querySelector(`[data-progress-numbers="${courseName}"]`);
  if (!container) return;

  const firstWrap = container.querySelector(
    '.loading__number-group.is--first .loading__number-wrap');
  const secondWrap = container.querySelector(
    '.loading__number-group.is--second .loading__number-wrap');
  const thirdWrap = container.querySelector(
    '.loading__number-group.is--third .loading__number-wrap');

  // Calculate digit positions
  let firstIndex, secondIndex, thirdIndex;

  if (percent === 100) {
    // 100% → show "1", "0", "0"
    firstIndex = 1; // "1" is at index 1
    secondIndex = 10; // final "0" is at index 10
    thirdIndex = 10; // final "0" is at index 10
  } else if (percent >= 10) {
    // 10-99% → empty, tens digit, ones digit
    const tens = Math.floor(percent / 10);
    const ones = percent % 10;
    firstIndex = 0; // empty
    secondIndex = tens; // 1-9 are at index 1-9
    thirdIndex = ones; // 0-9 are at index 0-9
  } else {
    // 0-9% → empty, empty, ones digit
    firstIndex = 0; // empty
    secondIndex = 0; // empty
    thirdIndex = percent; // 0-9 are at index 0-9
  }

  // Animate each wheel
  // First group has 2 items, so each step = 50%
  // Second group has 11 items, so each step = 100/11 ≈ 9.09%
  // Third group has 11 items, so each step = 100/11 ≈ 9.09%
  const duration = 1.5;
  const ease = 'power2.out';

  if (firstWrap) {
    gsap.to(firstWrap, {
      yPercent: firstIndex * -50, // 2 items: 100/2 = 50% per step
      duration: duration,
      ease: ease
    });
  }

  if (secondWrap) {
    gsap.to(secondWrap, {
      yPercent: secondIndex * -(100 / 11), // 11 items
      duration: duration,
      ease: ease
    });
  }

  if (thirdWrap) {
    gsap.to(thirdWrap, {
      yPercent: thirdIndex * -(100 / 11), // 11 items
      duration: duration,
      ease: ease
    });
  }
}

// Run when page loads
loadDashboardProgress();

// CARD HOVER ANIMATIONS (your existing code)
const cards = document.querySelectorAll('[course_card]');
cards.forEach(card => {
  const topPart = card.querySelector('[top-card]');
  const button = card.querySelector('[cc_btn]');
  const arrowBox = card.querySelector('[cc_arwbox]');
  const arrowIcon = card.querySelector('.cr_arrow');
  if (!arrowBox) return;

  // Create the Timeline
  const tl = gsap.timeline({ paused: true });

  // 1. Animate the Box: Background and Border
  tl.to(arrowBox, {
    backgroundColor: "#EDF5F9",
    duration: 0.4,
    ease: "power2.out"
  }, 0);

  // 2. Animate the Arrow: Color and Juggle
  if (arrowIcon) {
    tl.to(arrowIcon, {
      color: "#0297DB",
      rotation: -45,
      transformOrigin: "50% 50%",
      duration: 0.4,
      ease: "back.out(2)",
    }, 0);
  }

  // Hover Functions
  const playAnim = () => tl.play();
  const reverseAnim = () => tl.reverse();

  // Listeners
  if (topPart) {
    topPart.addEventListener('mouseenter', playAnim);
    topPart.addEventListener('mouseleave', reverseAnim);
    topPart.style.cursor = 'pointer';
  }
  if (button) {
    button.addEventListener('mouseenter', playAnim);
    button.addEventListener('mouseleave', reverseAnim);
  }
});

// TAB SWITCHING FUNCTIONALITY
// TAB SWITCHING FUNCTIONALITY
// TAB SWITCHING FUNCTIONALITY
// TAB SWITCHING FUNCTIONALITY
function initDashboardTabs() {
  // Define your tabs
  const tabs = {
    'Courses': 'courses',
    'my account': 'accountd',
    'Orders': 'orders',
    'tools': 'tools'
  };
  // Set initial state - show courses, hide everything else
  document.getElementById('courses').style.display = 'flex';
  document.getElementById('accountd').style.display = 'none';
  document.getElementById('orders').style.display = 'none';
  document.getElementById('tools').style.display = 'none';

  // Get all menu items
  const menuItems = document.querySelectorAll('.menu_item');

  menuItems.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();

      const tabName = this.querySelector('.menu_txt').textContent.trim();
      const targetId = tabs[tabName];

      // If this tab isn't set up yet, ignore
      if (!targetId) return;

      // Remove is-active from all menu items
      menuItems.forEach(mi => mi.classList.remove('is-active'));

      // Add is-active to clicked item
      this.classList.add('is-active');

      // Hide all tab content
      Object.values(tabs).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
      });

      // Show the target tab
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.style.display = 'flex';

        // Re-run animations if switching to courses
        if (targetId === 'courses') {
          loadDashboardProgress();
        }
      }
    });
  });
}

// Initialize tabs when DOM is ready
initDashboardTabs();
