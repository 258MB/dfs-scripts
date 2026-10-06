const hamburger = document.querySelector('.bold-nav-full__hamburger');
const menuWrap = document.querySelector('.absoulte_menu_wrap');
const menuToggle = document.querySelector('.Menu_toggle');
let isOpen = false;
let heightUpdateTimeout = null;
let preferredSpeed = 1;

// Breakpoint for mobile/tablet
const MOBILE_BREAKPOINT = 768;

// Function to check if we're on mobile/tablet
function isMobileView() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

// Function to close the menu
function closeMenu() {
  gsap.to(menuWrap, {
    minHeight: 0,
    duration: 0.4,
    ease: 'power2.inOut'
  });

  isOpen = false;
  document.body.classList.remove('menu-open');
}

// Function to update menu height when content changes
function updateMenuHeight() {
  if (!menuWrap || !isOpen) return;

  // Get current height
  const currentHeight = menuWrap.offsetHeight;

  // Temporarily remove minHeight to measure natural height
  menuWrap.style.minHeight = 'none';
  const newHeight = menuWrap.scrollHeight;

  // Set back to current before animating
  menuWrap.style.minHeight = currentHeight + 'px';

  // Animate to new height
  gsap.to(menuWrap, {
    minHeight: newHeight,
    duration: 0.3,
    ease: 'power2.out'
  });
}

// Function to open the menu
function openMenu() {
  // First, set to auto to get the natural height
  gsap.set(menuWrap, { minHeight: 'auto' });
  // Get the calculated height
  const fullHeight = menuWrap.scrollHeight;
  // Reset to 0
  gsap.set(menuWrap, { minHeight: 0 });
  // Now animate to the calculated height
  gsap.to(menuWrap, {
    minHeight: fullHeight,
    duration: 0.5,
    ease: 'power2.out'
  });

  isOpen = true;
  document.body.classList.add('menu-open');
}

// Function to toggle menu
function toggleMenu() {
  if (!isOpen) {
    openMenu();
  } else {
    closeMenu();
  }
}

// Hamburger click handler
if (hamburger && menuWrap) {
  hamburger.addEventListener('click', toggleMenu);

  // Listen for accordion clicks inside the menu (but not on the hamburger)
  menuWrap.addEventListener('click', (e) => {
    // Ignore if clicking the hamburger itself
    if (e.target.closest('.bold-nav-full__hamburger')) return;

    const accordionTrigger = e.target.closest('.course_module');
    if (accordionTrigger) {
      // Clear any pending update
      if (heightUpdateTimeout) clearTimeout(heightUpdateTimeout);
      // Wait for accordion animation to finish, then update
      heightUpdateTimeout = setTimeout(updateMenuHeight, 350);
    }
  });
}

// Also support .Menu_toggle for mobile/tablet
if (menuToggle && menuWrap) {
  menuToggle.addEventListener('click', toggleMenu);
}

//water horse
//water horse
//water horse

//water horse
gsap.registerPlugin(SplitText, CustomEase);

CustomEase.create("elastic",
  "M0,0 C0.0127,0.0956 0.0562,0.434 0.076,0.5737 C0.0958,0.7134 0.1077,0.7761 0.1187,0.8382 C0.1297,0.9003 0.1341,0.9145 0.1419,0.9463 C0.1497,0.9781 0.1574,1.0055 0.1654,1.0292 C0.1734,1.0529 0.1814,1.0725 0.1897,1.0886 C0.198,1.1047 0.2086,1.1177 0.2153,1.1258 C0.222,1.1339 0.2248,1.1342 0.2297,1.137 C0.2346,1.1398 0.2396,1.1415 0.2448,1.1424 C0.25,1.1433 0.2554,1.1433 0.261,1.1423 C0.2666,1.1413 0.2704,1.1409 0.2786,1.1366 C0.2868,1.1323 0.2922,1.1308 0.3101,1.1165 C0.328,1.1022 0.3669,1.0665 0.3862,1.0507 C0.4055,1.0349 0.4118,1.0304 0.4257,1.0219 C0.4397,1.0134 0.4548,1.0053 0.4699,0.9995 C0.485,0.9937 0.4967,0.9898 0.5163,0.9872 C0.5359,0.9846 0.5383,0.9819 0.5877,0.9842 C0.6371,0.9865 0.7439,0.9985 0.8126,1.0011 C0.8813,1.0037 0.9688,1.0002 1,1"
);

// ---- HYDRATION TIMER ----
const HYDRATION_INTERVAL = 30 * 60 * 1000; // 30 min — for testing use 20 * 1000
let hydrationEligible = false;
let hydrationTimer = null;

function startHydrationTimer() {
  clearTimeout(hydrationTimer);
  hydrationEligible = false;
  hydrationTimer = setTimeout(() => {
    hydrationEligible = true;
  }, HYDRATION_INTERVAL);
}

startHydrationTimer();

document.fonts.ready.then(() => {
  const wrap = document.querySelector('[data-hydration="component"]');
  if (!wrap) return;

  const horse = wrap.querySelector('[data-hydration="horse"]');
  const text = wrap.querySelector('[data-hydration="text"]');
  const reset = wrap.querySelector('[data-hydration="reset"]');

  let tlIn, tlOut, words, idle;

  function startIdle() {
    stopIdle();
    idle = gsap.timeline({ repeat: -1, yoyo: true })
      .to(horse, {
        y: -4,
        rotation: 2,
        duration: 1.8,
        ease: 'sine.inOut',
        transformOrigin: '50% 60%'
      })
      .to(horse, {
        y: 0,
        rotation: -1,
        duration: 2.2,
        ease: 'sine.inOut'
      });
  }

  function stopIdle() {
    if (idle) {
      idle.kill();
      idle = null;
    }
    gsap.set(horse, { y: 0, rotation: 0 });
  }

  SplitText.create(text, {
    type: 'lines, words',
    mask: 'lines',
    autoSplit: true,
    onSplit(instance) {
      words = instance.words;

      tlIn = gsap.timeline({ paused: true, onComplete: startIdle })
        .set(wrap, { visibility: 'visible' })
        .from(horse, {
          yPercent: 110,
          duration: 1,
          ease: 'elastic'
        })
        .from(words, {
          yPercent: 110,
          duration: 0.9,
          stagger: 0.06,
          ease: 'elastic'
        }, '-=0.7')
        .from(reset, {
          yPercent: 110,
          duration: 0.9,
          ease: 'elastic'
        }, '-=0.75');

      return tlIn;
    }
  });

  function playExit() {
    if (!words) return;
    if (tlOut && tlOut.isActive()) return;

    stopIdle();

    tlOut = gsap.timeline({
        onComplete() {
          gsap.set(wrap, { visibility: 'hidden' });
          startHydrationTimer(); // next cycle begins on dismissal
        }
      })
      .fromTo(reset, { rotation: 0 }, {
        rotation: -720,
        duration: 1,
        ease: 'power2.inOut',
        transformOrigin: '50% 50%'
      }, 0)
      .to(horse, {
        yPercent: 110,
        duration: 0.5,
        ease: 'power2.in'
      }, 0)
      .to(words, {
        yPercent: 110,
        duration: 0.4,
        stagger: 0.04,
        ease: 'power2.in'
      }, 0.25)
      .to(reset, {
        yPercent: 110,
        duration: 0.4,
        ease: 'power2.in'
      }, 1);
  }

  document.addEventListener('click', (e) => {
    if (!tlIn) return;

    // SHOW — only when the 30-min cycle has elapsed
    if (e.target.closest('[data-hydration-trigger]')) {
      if (!hydrationEligible) return;
      hydrationEligible = false;
      if (tlOut) tlOut.kill();
      stopIdle();
      gsap.set(reset, { rotation: 0 });
      gsap.set([horse, reset], { yPercent: 110 });
      if (words) gsap.set(words, { yPercent: 110 });
      tlIn.timeScale(0.5).restart();
      return;
    }

    // HIDE — click anywhere on the component
    if (e.target.closest('[data-hydration="component"]')) {
      playExit();
    }
  }, true);
});

// ==============================================
// AUTO-DETECT COURSE FROM URL
// e.g., /courses/fundamentals → "fundamentals"
const currentCourse = window.location.pathname.split('/courses/')[1]?.split('/')[0] ||
  'fundamentals';
console.log('Current course:', currentCourse);
const lessons = [
  { id: "lesson-0.1", complete: false },
  { id: "lesson-0.2", complete: false },
  { id: "lesson-1.1", complete: false },
  { id: "lesson-1.2", complete: false },
  { id: "lesson-1.3", complete: false },
  { id: "lesson-1.4", complete: false },
  { id: "lesson-2.1", complete: false },
  { id: "lesson-2.2", complete: false },
  { id: "lesson-3.1", complete: false },
  { id: "lesson-3.2", complete: false },
  { id: "lesson-3.3", complete: false },
  { id: "lesson-4.1", complete: false },
  { id: "lesson-4.2", complete: false },
  { id: "lesson-4.3", complete: false },
  { id: "lesson-4.4", complete: false },
  { id: "lesson-5.1", complete: false },
  { id: "lesson-5.2", complete: false },
  { id: "lesson-5.3", complete: false },
  { id: "lesson-5.4", complete: false },
  { id: "lesson-5.5", complete: false },
  { id: "lesson-5.6", complete: false },
  { id: "lesson-6.1", complete: false },
  { id: "lesson-6.2", complete: false },
  { id: "lesson-6.3", complete: false },
  { id: "lesson-6.4", complete: false },
  { id: "lesson-7.1", complete: false },
  { id: "lesson-7.2", complete: false },
  { id: "lesson-7.3", complete: false },
  { id: "lesson-7.4", complete: false },
  { id: "lesson-7.5", complete: false },
  { id: "lesson-8.1", complete: false },
  { id: "lesson-8.2", complete: false },
  { id: "lesson-8.3", complete: false },
  { id: "lesson-8.4", complete: false }
];
// PROGRESS FUNCTION
const progressBar = document.querySelector(".progress_juice");
const completeButtons = document.querySelectorAll("[data-action='complete-lesson']");
// Initial bar state
if (progressBar) {
  gsap.set(progressBar, { xPercent: -100 });
}
// COMPLETE BUTTONS (marks complete and goes to next)
completeButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    let lessonId = btn.getAttribute('data-lesson-id');
    if (!lessonId) {
      const activeLesson = document.querySelector('.c_item.is-active');
      lessonId = activeLesson?.id;
    }
    if (lessonId) {
      markLessonComplete(lessonId);
      goToNextLesson(lessonId);
    }
  });
});
// TOGGLE BUTTONS (toggle complete/incomplete)
const toggleButtons = document.querySelectorAll("[data-action='toggle-lesson']");
toggleButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    let lessonId = btn.getAttribute('data-lesson-id');
    if (!lessonId) {
      const closestItem = btn.closest('.c_item');
      lessonId = closestItem?.id;
    }
    if (lessonId) {
      toggleLessonComplete(lessonId);
    }
  });
});
// PREVIOUS BUTTON (navigate to previous lesson)
const previousButton = document.getElementById("previous");
if (previousButton) {
  previousButton.addEventListener("click", (e) => {
    e.stopPropagation();
    const activeLesson = document.querySelector('.c_item.is-active');
    if (activeLesson) {
      goToPreviousLesson(activeLesson.id);
    }
  });
}

function markLessonComplete(lessonId) {
  const lesson = lessons.find(l => l.id === lessonId);
  if (!lesson) return;
  // Only mark as complete (doesn't toggle)
  if (!lesson.complete) {
    lesson.complete = true;
    updateLessonUI(lessonId, true);
    updateProgress();
  }
}

function goToNextLesson(currentLessonId) {
  const currentIndex = lessons.findIndex(l => l.id === currentLessonId);
  if (currentIndex === -1 || currentIndex >= lessons.length - 1) return;
  const nextLesson = lessons[currentIndex + 1];
  const nextLessonElement = document.getElementById(nextLesson.id);
  if (!nextLessonElement) return;
  nextLessonElement.click();
}

function goToPreviousLesson(currentLessonId) {
  const currentIndex = lessons.findIndex(l => l.id === currentLessonId);
  if (currentIndex === -1 || currentIndex <= 0) return;
  const previousLesson = lessons[currentIndex - 1];
  const previousLessonElement = document.getElementById(previousLesson.id);
  if (!previousLessonElement) return;
  previousLessonElement.click();
}

function toggleLessonComplete(lessonId) {
  const lesson = lessons.find(l => l.id === lessonId);
  if (!lesson) return;
  lesson.complete = !lesson.complete;
  updateLessonUI(lessonId, lesson.complete);
  updateProgress();
}

function updateLessonUI(lessonId, isComplete) {
  const lessonItem = document.getElementById(lessonId);
  if (!lessonItem) return;
  const checkFill = lessonItem.querySelector(".check_fill");
  if (checkFill) {
    if (isComplete) {
      checkFill.classList.add("is-complete");
    } else {
      checkFill.classList.remove("is-complete");
    }
  }
}

function updateProgress(isPageLoad = false) {
  const completed = lessons.filter(l => l.complete).length;
  const total = lessons.length;
  const percent = Math.round((completed / total) * 100);
  // Slower animation on page load, faster on lesson complete
  const duration = isPageLoad ? 1.2 : 0.6;
  // Animate number wheels
  animateProgressNumbers(currentCourse, percent, duration);
  // Animate progress bar
  gsap.to(progressBar, {
    xPercent: percent - 100,
    duration: duration,
    ease: "power2.out"
  });
  // Save progress to Memberstack whenever it changes (but not on page load)
  if (!isPageLoad) {
    saveMemberProgress();
  }
}
// Animate the rolling number wheels
function animateProgressNumbers(courseName, percent, duration = 0.6) {
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
// INITIAL STATE - Load first incomplete lesson
function setInitialState() {
  document.querySelectorAll('.c_item').forEach(el => el.classList.remove('is-active'));
  document.querySelectorAll('.course_module').forEach(el => el.classList.remove('is-active'));
  document.querySelectorAll('.course_content').forEach(el => el.classList.remove(
    'is-active'));
  // Find first incomplete lesson
  const firstIncompleteLesson = lessons.find(l => !l.complete);
  // If all complete, use last lesson; otherwise use first incomplete
  const targetLesson = firstIncompleteLesson || lessons[lessons.length - 1];
  const targetLessonElement = document.getElementById(targetLesson.id);
  if (!targetLessonElement) return;
  // Activate the lesson
  targetLessonElement.classList.add('is-active');
  // Activate corresponding module
  const module = targetLessonElement.closest('.accordion-css__item')?.querySelector(
    '.course_module');
  if (module) module.classList.add('is-active');
  // Use existing switchLessonContent function
  switchLessonContent(targetLessonElement);
}
// LESSON NAVIGATION
function switchLessonContent(item) {
  // ---- CLOSE MENU ON MOBILE/TABLET ----
  if (isMobileView() && isOpen) {
    closeMenu();
  }

  const videoSrc = item.getAttribute('data-video-src');
  const textId = item.getAttribute('data-text-id');
  const placeholderSrc = item.getAttribute('data-placeholder');
  // ---- CLOSE FINISH LINK BLOCK ----
  if (finishLinkBlock) {
    finishLinkBlock.style.display = 'none';
  }
  // ---- RESET VIDEO PROGRESS BAR ----
  const oldPlayer = document.getElementById('video-player');
  if (oldPlayer) {
    const progressBar = oldPlayer.querySelector('[data-player-progress]');
    const handle = oldPlayer.querySelector('[data-player-timeline-handle]');
    const timeProgressEls = oldPlayer.querySelectorAll('[data-player-time-progress]');
    if (progressBar) {
      progressBar.style.transform = 'translateX(-100%)';
    }
    if (handle) {
      handle.style.left = '0%';
    }
    if (timeProgressEls.length) {
      timeProgressEls.forEach(function (el) {
        el.textContent = '00:00';
      });
    }
  }
  // ---- TEXT SWITCH ----
  document.querySelectorAll('.course_content').forEach(el => {
    el.classList.remove('is-active');
  });
  const activeText = document.getElementById(textId);
  if (activeText) {
    activeText.classList.add('is-active');
  }
  // ---- PLACEHOLDER SWITCH ----
  const placeholder = document.getElementById('placeholder_img');
  if (placeholder) {
    if (placeholderSrc) {
      placeholder.removeAttribute('srcset'); // Remove srcset so src takes priority
      placeholder.setAttribute('src', placeholderSrc);
    } else {
      console.warn(`No data-placeholder attribute found for ${item.id}`);
    }
  }
  // ---- FULL VIDEO PLAYER RESET ----
  if (!oldPlayer || !videoSrc) return;
  const newPlayer = oldPlayer.cloneNode(true);
  // Reset required attributes
  newPlayer.setAttribute('data-player-src', videoSrc);
  newPlayer.setAttribute('data-player-activated', 'false');
  newPlayer.setAttribute('data-player-status', 'idle');
  // Replace the old player in DOM
  oldPlayer.parentNode.replaceChild(newPlayer, oldPlayer);
  // Reinitialize Bunny player
  initBunnyPlayer();
}

function setupCourseItemClicks() {
  document.querySelectorAll('.c_item').forEach(item => {
    item.addEventListener('click', () => {
      // Check if this lesson is already active
      if (item.classList.contains('is-active')) {
        return; // Don't reload if already active
      }
      // --- Close menu on mobile/tablet ---
      if (isMobileView() && isOpen) {
        closeMenu();
      }
      // --- Update active lesson ---
      document.querySelectorAll('.c_item').forEach(el => el.classList.remove(
        'is-active'));
      item.classList.add('is-active');
      // --- Update active module ---
      document.querySelectorAll('.course_module').forEach(mod => mod.classList.remove(
        'is-active'));
      const module = item.closest('.accordion-css__item')?.querySelector(
        '.course_module');
      if (module) module.classList.add('is-active');
      // --- Update accordion status attributes ---
      updateAccordionStatus();
      // --- Switch content + video ---
      switchLessonContent(item);
    });
  });
}
// Function to update accordion status based on active module
function updateAccordionStatus() {
  // First, set all accordion items to not-active
  document.querySelectorAll('.accordion-css__item').forEach(accordionItem => {
    accordionItem.setAttribute('data-accordion-status', 'not-active');
  });
  // Then find the active module and set its parent accordion item to active
  const activeModule = document.querySelector('.course_module.is-active');
  if (activeModule) {
    const accordionItem = activeModule.closest('.accordion-css__item');
    if (accordionItem) {
      accordionItem.setAttribute('data-accordion-status', 'active');
    }
  }
}
// Init on page load
setTimeout(async () => {
  // Remove srcset immediately so placeholder images work correctly
  const placeholder = document.getElementById('placeholder_img');
  if (placeholder) {
    placeholder.removeAttribute('srcset');
  }
  // Load member progress first (before setting initial state)
  await loadMemberProgress();
  setInitialState();
  setupCourseItemClicks();
  updateAccordionStatus(); // Set initial accordion status
}, 200);
// Function to load member's progress from Memberstack
async function loadMemberProgress() {
  try {
    const memberData = await window.$memberstackDom.getMemberJSON();
    console.log('=== LOADING MEMBER DATA ===');
    console.log('Current course:', currentCourse);
    console.log('Full member data:', memberData);
    // Check if member has saved progress for this course
    if (memberData && memberData.data && memberData.data.courses && memberData.data.courses[
        currentCourse]) {
      console.log('✅ Found saved progress for', currentCourse);
      const savedLessons = memberData.data.courses[currentCourse].lessons;
      console.log('Saved lessons:', savedLessons);
      // Update our lessons array with saved progress
      savedLessons.forEach(savedLesson => {
        const lesson = lessons.find(l => l.id === savedLesson.id);
        if (lesson) {
          lesson.complete = savedLesson.complete;
        }
      });
      // Update UI to reflect loaded progress
      lessons.forEach(lesson => {
        updateLessonUI(lesson.id, lesson.complete);
      });
      updateProgress(true); // true = page load, slower animation
      console.log('Current lessons state after loading:', lessons);
      console.log('=========================');
    } else {
      console.log('❌ No saved progress found for', currentCourse, '- using defaults');
      console.log('=========================');
    }
  } catch (error) {
    console.error('❌ Error loading member data:', error);
  }
}
// Function to save progress to Memberstack
async function saveMemberProgress() {
  try {
    console.log('=== SAVING PROGRESS ===');
    console.log('Course:', currentCourse);
    console.log('Lessons being saved:', lessons);
    // First get existing data to preserve other courses
    const memberData = await window.$memberstackDom.getMemberJSON();
    const existingCourses = (memberData && memberData.data && memberData.data.courses) || {};
    // Update only the current course
    const updatedCourses = {
      ...existingCourses,
      [currentCourse]: {
        lessons: lessons
      }
    };
    const result = await window.$memberstackDom.updateMemberJSON({
      json: {
        courses: updatedCourses
      }
    });
    console.log('✅ Progress saved successfully!');
    console.log('Save result:', result);
    console.log('======================');
  } catch (error) {
    console.error('❌ Error saving progress:', error);
  }
}
// VIDEO PLAYER
// VIDEO PLAYER
// VIDEO PLAYER
// Get the finish link block element (available globally)
var finishLinkBlock = document.getElementById('finish_video');
// Add click listener to close the finish link block
if (finishLinkBlock) {
  finishLinkBlock.addEventListener('click', function () {
    finishLinkBlock.style.display = 'none';
  });
}

function initBunnyPlayer() {
  document.querySelectorAll('[data-bunny-player-init]').forEach(function (player) {
    var src = player.getAttribute('data-player-src');
    if (!src) return;
    var video = player.querySelector('video');
    if (!video) return;
    try { video.pause(); } catch (_) {}
    try {
      video.removeAttribute('src');
      video.load();
    } catch (_) {}
    // Attribute helpers
    function setStatus(s) {
      if (player.getAttribute('data-player-status') !== s) {
        player.setAttribute('data-player-status', s);
      }
    }

    function setMutedState(v) {
      video.muted = !!v;
      player.setAttribute('data-player-muted', video.muted ? 'true' : 'false');
    }

    function setFsAttr(v) {
      player.setAttribute('data-player-fullscreen', v ? 'true' : 'false');
    }

    function setActivated(v) {
      player.setAttribute('data-player-activated', v ? 'true' : 'false');
    }
    if (!player.hasAttribute('data-player-activated')) setActivated(false);
    // Elements
    var timeline = player.querySelector('[data-player-timeline]');
    var progressBar = player.querySelector('[data-player-progress]');
    var bufferedBar = player.querySelector('[data-player-buffered]');
    var handle = player.querySelector('[data-player-timeline-handle]');
    var timeDurationEls = player.querySelectorAll('[data-player-time-duration]');
    var timeProgressEls = player.querySelectorAll('[data-player-time-progress]');
    // Flags
    var updateSize = player.getAttribute(
      'data-player-update-size'); // "true" | "cover" | null
    var lazyMode = player.getAttribute('data-player-lazy'); // "true" | "meta" | null
    var isLazyTrue = lazyMode === 'true';
    var isLazyMeta = lazyMode === 'meta';
    var autoplay = player.getAttribute('data-player-autoplay') === 'true';
    var initialMuted = player.getAttribute('data-player-muted') === 'true';
    // Used to suppress 'ready' flicker when user just pressed play in lazy modes
    var pendingPlay = false;
    // Autoplay forces muted; IO will trigger "fake click"
    if (autoplay) {
      setMutedState(true);
      video.loop = true;
    } else { setMutedState(initialMuted); }
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.playsInline = true;
    if (typeof video.disableRemotePlayback !== 'undefined') video.disableRemotePlayback =
      true;
    if (autoplay) video.autoplay = false;
    var isSafariNative = !!video.canPlayType('application/vnd.apple.mpegurl');
    var canUseHlsJs = !!(window.Hls && Hls.isSupported()) && !isSafariNative;
    // Minimal ratio fetch when requested (and not already handled by lazy meta)
    if (updateSize === 'true' && !isLazyMeta) {
      if (isLazyTrue) {
        // Do nothing: no fetch, no <video> touch when lazy=true
      } else {
        var prev = video.preload;
        video.preload = 'metadata';
        var onMeta2 = function () {
          setBeforeRatio(player, updateSize, video.videoWidth, video.videoHeight);
          video.removeEventListener('loadedmetadata', onMeta2);
          video.preload = prev || '';
        };
        video.addEventListener('loadedmetadata', onMeta2, { once: true });
        video.src = src;
      }
    }
    //  Lazy meta fetch (duration + aspect) without attaching playback
    function fetchMetaOnce() {
      getSourceMeta(src, canUseHlsJs).then(function (meta) {
        if (meta.width && meta.height) setBeforeRatio(player, updateSize, meta.width,
          meta
          .height);
        if (timeDurationEls.length && isFinite(meta.duration) && meta.duration > 0) {
          setText(timeDurationEls, formatTime(meta.duration));
        }
        readyIfIdle(player, pendingPlay);
      });
    }
    // Attach media only once (for actual playback)
    var isAttached = false;
    var userInteracted = false;
    var lastPauseBy = '';

    function attachMediaOnce() {
      if (isAttached) return;
      isAttached = true;
      if (player._hls) { try { player._hls.destroy(); } catch (_) {} player._hls = null; }
      if (isSafariNative) {
        video.preload = (isLazyTrue || isLazyMeta) ? 'auto' : video.preload;
        video.src = src;
        video.addEventListener('loadedmetadata', function () {
          readyIfIdle(player, pendingPlay);
          if (updateSize === 'true') setBeforeRatio(player, updateSize, video
            .videoWidth,
            video.videoHeight);
          if (timeDurationEls.length) setText(timeDurationEls, formatTime(video
            .duration));
        }, { once: true });
      } else if (canUseHlsJs) {
        var hls = new Hls({ maxBufferLength: 10 });
        hls.attachMedia(video);
        hls.on(Hls.Events.MEDIA_ATTACHED, function () { hls.loadSource(src); });
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          readyIfIdle(player, pendingPlay);
          if (updateSize === 'true') {
            var lvls = hls.levels || [];
            var best = bestLevel(lvls);
            if (best && best.width && best.height) setBeforeRatio(player, updateSize,
              best
              .width, best.height);
          }
        });
        hls.on(Hls.Events.LEVEL_LOADED, function (e, data) {
          if (data && data.details && isFinite(data.details.totalduration)) {
            if (timeDurationEls.length) setText(timeDurationEls, formatTime(data
              .details
              .totalduration));
          }
        });
        player._hls = hls;
      } else {
        video.src = src;
      }
    }
    // Initialize based on lazy mode
    if (isLazyMeta) {
      fetchMetaOnce();
      video.preload = 'none';
    } else if (isLazyTrue) {
      video.preload = 'none';
    } else {
      attachMediaOnce();
    }
    // Toggle play/pause
    function togglePlay() {
      userInteracted = true;
      if (video.paused || video.ended) {
        if ((isLazyTrue || isLazyMeta) && !isAttached) attachMediaOnce();
        pendingPlay = true;
        lastPauseBy = '';
        setStatus('loading');
        safePlay(video);
      } else {
        lastPauseBy = 'manual';
        video.pause();
      }
    }
    // Toggle mute
    function toggleMute() {
      video.muted = !video.muted;
      player.setAttribute('data-player-muted', video.muted ? 'true' : 'false');
    }

    // Playback speed
    var speeds = [1, 1.2, 1.5, 2];
    var speedIndex = Math.max(0, speeds.indexOf(preferredSpeed));

    function applySpeed() {
      video.playbackRate = speeds[speedIndex];
      var newText = speeds[speedIndex].toFixed(1) + 'x'; // toFixed(1) → "1.0x", "2.0x"
      var labels = player.querySelectorAll('[data-player-speed-label]');
      labels.forEach(function (el) {
        gsap.to(el, {
          opacity: 0,
          duration: 0.12,
          ease: 'power1.in',
          onComplete: function () {
            el.textContent = newText;
            gsap.to(el, { opacity: 1, duration: 0.12, ease: 'power1.out' });
          }
        });
      });
      player.setAttribute('data-player-speed', speeds[speedIndex]);
    }

    function cycleSpeed() {
      speedIndex = (speedIndex + 1) % speeds.length;
      preferredSpeed = speeds[speedIndex]; // remember across lessons
      applySpeed();
    }

    applySpeed();

    // Fullscreen helpers
    function isFsActive() {
      return !!(document.fullscreenElement || document.webkitFullscreenElement);
    }

    function enterFullscreen() {
      if (player.requestFullscreen) return player.requestFullscreen();
      if (video.requestFullscreen) return video.requestFullscreen();
      if (video.webkitSupportsFullscreen && typeof video.webkitEnterFullscreen ===
        'function')
        return video.webkitEnterFullscreen();
    }

    function exitFullscreen() {
      if (document.exitFullscreen) return document.exitFullscreen();
      if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
      if (video.webkitDisplayingFullscreen && typeof video.webkitExitFullscreen ===
        'function')
        return video.webkitExitFullscreen();
    }

    function toggleFullscreen() {
      if (isFsActive() || video.webkitDisplayingFullscreen)
        exitFullscreen();
      else enterFullscreen();
    }
    document.addEventListener('fullscreenchange', function () {
      setFsAttr(
        isFsActive());
    });
    document.addEventListener('webkitfullscreenchange', function () {
      setFsAttr(
        isFsActive());
    });
    video.addEventListener('webkitbeginfullscreen', function () { setFsAttr(true); });
    video.addEventListener('webkitendfullscreen', function () { setFsAttr(false); });
    // Controls (delegated)
    player.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-player-control]');
      if (!btn || !player.contains(btn)) return;
      var type = btn.getAttribute('data-player-control');
      if (type === 'play' || type === 'pause' || type === 'playpause') togglePlay();
      else if (type === 'mute') toggleMute();
      else if (type === 'fullscreen') toggleFullscreen();
      else if (type === 'speed') cycleSpeed();
    });
    // Time text (not in rAF)
    function updateTimeTexts() {
      if (timeDurationEls.length) setText(timeDurationEls, formatTime(video.duration));
      if (timeProgressEls.length) setText(timeProgressEls, formatTime(video.currentTime));
    }
    video.addEventListener('timeupdate', updateTimeTexts);
    video.addEventListener('loadedmetadata', function () {
      updateTimeTexts();
      maybeSetRatioFromVideo(player, updateSize, video);
    });
    video.addEventListener('loadeddata', function () {
      maybeSetRatioFromVideo(player,
        updateSize, video);
    });
    video.addEventListener('playing', function () {
      maybeSetRatioFromVideo(player, updateSize,
        video);
    });
    video.addEventListener('durationchange', updateTimeTexts);
    // Check if video has finished and show finish link block
    function checkVideoFinished() {
      if (finishLinkBlock && video.duration > 0) {
        // Check if current time is at or very close to duration (within 0.5 seconds)
        if (video.currentTime >= video.duration - 0.5) {
          // Smooth fade in with GSAP after a small delay
          gsap.to(finishLinkBlock, {
            display: 'flex',
            opacity: 1,
            duration: 0.5,
            delay: 0.3,
            ease: 'power2.out'
          });
        }
      }
    }
    // Listen for timeupdate to check if video finished
    video.addEventListener('timeupdate', checkVideoFinished);
    // Also show on 'ended' event for reliability
    video.addEventListener('ended', function () {
      if (finishLinkBlock) {
        // Smooth fade in with GSAP after a small delay
        gsap.to(finishLinkBlock, {
          display: 'flex',
          opacity: 1,
          duration: 0.5,
          delay: 0.3,
          ease: 'power2.out'
        });
      }
    });
    // Hide finish link block when video starts playing again
    video.addEventListener('play', function () {
      if (finishLinkBlock && video.currentTime < video.duration - 0.5) {
        gsap.to(finishLinkBlock, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: function () {
            finishLinkBlock.style.display = 'none';
          }
        });
      }
    });
    // rAF visuals (progress + handle only)
    var rafId;

    function updateProgressVisuals() {
      if (!video.duration) return;
      var playedPct = (video.currentTime / video.duration) * 100;
      if (progressBar) progressBar.style.transform = 'translateX(' + (-100 + playedPct) +
        '%)';
      if (handle) handle.style.left = playedPct + '%';
    }

    function loop() {
      updateProgressVisuals();
      if (!video.paused && !video.ended) rafId = requestAnimationFrame(loop);
    }
    // Buffered bar (not in rAF)
    function updateBufferedBar() {
      if (!bufferedBar || !video.duration || !video.buffered.length) return;
      var end = video.buffered.end(video.buffered.length - 1);
      var buffPct = (end / video.duration) * 100;
      bufferedBar.style.transform = 'translateX(' + (-100 + buffPct) + '%)';
    }
    video.addEventListener('progress', updateBufferedBar);
    video.addEventListener('loadedmetadata', updateBufferedBar);
    video.addEventListener('durationchange', updateBufferedBar);
    // Media event wiring
    video.addEventListener('play', function () {
      setActivated(true);
      cancelAnimationFrame(rafId);
      loop();
      setStatus('playing');
    });
    video.addEventListener('playing', function () {
      pendingPlay = false;
      setStatus('playing');
    });
    video.addEventListener('pause', function () {
      pendingPlay = false;
      cancelAnimationFrame(rafId);
      updateProgressVisuals();
      setStatus('paused');
    });
    video.addEventListener('waiting', function () { setStatus('loading'); });
    video.addEventListener('canplay', function () { readyIfIdle(player, pendingPlay); });
    video.addEventListener('canplay', applySpeed);
    video.addEventListener('ended', function () {
      pendingPlay = false;
      cancelAnimationFrame(rafId);
      updateProgressVisuals();
      setStatus('paused');
      setActivated(false);
    });
    // Scrubbing (pointer events)
    if (timeline) {
      var dragging = false,
        wasPlaying = false,
        targetTime = 0,
        lastSeekTs = 0,
        seekThrottle = 180,
        rect = null;
      window.addEventListener('resize', function () { if (!dragging) rect = null; });

      function getFractionFromX(x) {
        if (!rect) rect = timeline.getBoundingClientRect();
        var f = (x - rect.left) / rect.width;
        if (f < 0) f = 0;
        if (f > 1) f = 1;
        return f;
      }

      function previewAtFraction(f) {
        if (!video.duration) return;
        var pct = f * 100;
        if (progressBar) progressBar.style.transform = 'translateX(' + (-100 + pct) +
          '%)';
        if (handle) handle.style.left = pct + '%';
        if (timeProgressEls.length) setText(timeProgressEls, formatTime(f * video
          .duration));
      }

      function maybeSeek(now) {
        if (!video.duration) return;
        if ((now - lastSeekTs) < seekThrottle) return;
        lastSeekTs = now;
        video.currentTime = targetTime;
      }

      function onPointerDown(e) {
        if (!video.duration) return;
        // If video has ended, auto-play on timeline click
        var videoHasEnded = video.ended;
        dragging = true;
        wasPlaying = !video.paused && !video.ended;
        if (wasPlaying) video.pause();
        player.setAttribute('data-timeline-drag', 'true');
        rect = timeline.getBoundingClientRect();
        var f = getFractionFromX(e.clientX);
        targetTime = f * video.duration;
        previewAtFraction(f);
        maybeSeek(performance.now());
        timeline.setPointerCapture && timeline.setPointerCapture(e.pointerId);
        window.addEventListener('pointermove', onPointerMove, { passive: false });
        window.addEventListener('pointerup', onPointerUp, { passive: true });
        // Store if video was ended when drag started
        timeline._videoWasEnded = videoHasEnded;
        e.preventDefault();
      }

      function onPointerMove(e) {
        if (!dragging) return;
        var f = getFractionFromX(e.clientX);
        targetTime = f * video.duration;
        previewAtFraction(f);
        maybeSeek(performance.now());
        e.preventDefault();
      }

      function onPointerUp() {
        if (!dragging) return;
        var shouldAutoPlay = timeline._videoWasEnded;
        dragging = false;
        player.setAttribute('data-timeline-drag', 'false');
        rect = null;
        video.currentTime = targetTime;
        // Auto-play if video was ended when drag started
        if (shouldAutoPlay) {
          safePlay(video);
        } else if (wasPlaying) {
          safePlay(video);
        } else {
          updateProgressVisuals();
          updateTimeTexts();
        }
        timeline._videoWasEnded = false;
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      }
      timeline.addEventListener('pointerdown', onPointerDown, { passive: false });
      if (handle) handle.addEventListener('pointerdown',
        onPointerDown, { passive: false });
    }
    // Hover/idle detection (pointer-based)
    var hoverTimer;
    var hoverHideDelay = 3000;

    function setHover(state) {
      if (player.getAttribute('data-player-hover') !== state) {
        player.setAttribute('data-player-hover', state);
      }
    }

    function scheduleHide() {
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function () { setHover('idle'); }, hoverHideDelay);
    }

    function wakeControls() {
      setHover('active');
      scheduleHide();
    }
    player.addEventListener('pointerdown', wakeControls);
    document.addEventListener('fullscreenchange', wakeControls);
    document.addEventListener('webkitfullscreenchange', wakeControls);
    var trackingMove = false;

    function onPointerMoveGlobal(e) {
      var r = player.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e
        .clientY <= r
        .bottom) wakeControls();
    }
    player.addEventListener('pointerenter', function () {
      wakeControls();
      if (!trackingMove) {
        trackingMove = true;
        window.addEventListener('pointermove',
          onPointerMoveGlobal, { passive: true });
      }
    });
    player.addEventListener('pointerleave', function () {
      setHover('idle');
      clearTimeout(hoverTimer);
      if (trackingMove) {
        trackingMove = false;
        window.removeEventListener('pointermove', onPointerMoveGlobal);
      }
    });
    // In-view auto play/pause (only when autoplay is true)
    if (autoplay) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var inView = entry.isIntersecting && entry.intersectionRatio > 0;
          if (inView) {
            if ((isLazyTrue || isLazyMeta) && !isAttached) attachMediaOnce();
            if ((lastPauseBy === 'io') || (video.paused && lastPauseBy !==
                'manual')) {
              setStatus('loading');
              if (video.paused) togglePlay();
              lastPauseBy = '';
            }
          } else {
            if (!video.paused && !video.ended) {
              lastPauseBy = 'io';
              video.pause();
            }
          }
        });
      }, { threshold: 0.1 });
      io.observe(player);
    }
  });
  // Helper: time/text/meta/ratio utilities
  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) return '00:00';
    var s = Math.floor(sec),
      h = Math.floor(s / 3600),
      m = Math.floor((s % 3600) / 60),
      r = s % 60;
    return h > 0 ? (h + ':' + pad2(m) + ':' + pad2(r)) : (pad2(m) + ':' + pad2(r));
  }

  function setText(nodes, text) { nodes.forEach(function (n) { n.textContent = text; }); }
  // Helper: Choose best HLS level by resolution --- */
  function bestLevel(levels) {
    if (!levels || !levels.length) return null;
    return levels.reduce(function (a, b) {
        return ((b.width || 0) > (a.width || 0)) ? b :
          a;
      },
      levels[0]);
  }
  // Helper: Safe programmatic play
  function safePlay(video) {
    var p = video.play();
    if (p && typeof p.then === 'function') p.catch(function () {});
  }
  // Helper: Ready status guard
  function readyIfIdle(player, pendingPlay) {
    if (!pendingPlay &&
      player.getAttribute('data-player-activated') !== 'true' &&
      player.getAttribute('data-player-status') === 'idle') {
      player.setAttribute('data-player-status', 'ready');
    }
  }
  // Helper: Ratio Setter
  function setBeforeRatio(player, updateSize, w, h) {
    if (updateSize !== 'true' || !w || !h) return;
    var before = player.querySelector('[data-player-before]');
    if (!before) return;
    before.style.paddingTop = (h / w * 100) + '%';
  }

  function maybeSetRatioFromVideo(player, updateSize, video) {
    if (updateSize !== 'true') return;
    var before = player.querySelector('[data-player-before]');
    if (!before) return;
    var hasPad = before.style.paddingTop && before.style.paddingTop !== '0%';
    if (!hasPad && video.videoWidth && video.videoHeight) {
      setBeforeRatio(player, updateSize, video.videoWidth, video.videoHeight);
    }
  }
  // Helper: simple URL resolver
  function resolveUrl(base, rel) {
    try { return new URL(rel, base).toString(); } catch (_) { return rel; }
  }
  // Helper: Unified meta fetch (hls.js or native fetch)
  function getSourceMeta(src, useHlsJs) {
    return new Promise(function (resolve) {
      if (useHlsJs && window.Hls && Hls.isSupported()) {
        try {
          var tmp = new Hls();
          var out = { width: 0, height: 0, duration: NaN };
          var haveLvls = false,
            haveDur = false;
          tmp.on(Hls.Events.MANIFEST_PARSED, function (e, data) {
            var lvls = (data && data.levels) || tmp.levels || [];
            var best = bestLevel(lvls);
            if (best && best.width && best.height) {
              out.width = best.width;
              out.height = best.height;
              haveLvls = true;
            }
          });
          tmp.on(Hls.Events.LEVEL_LOADED, function (e, data) {
            if (data && data.details && isFinite(data.details.totalduration)) {
              out.duration = data.details.totalduration;
              haveDur = true;
            }
          });
          tmp.on(Hls.Events.ERROR, function () {
            try { tmp.destroy(); } catch (_) {}
            resolve(out);
          });
          tmp.on(Hls.Events.LEVEL_LOADED, function () {
            try { tmp.destroy(); } catch (_) {}
            resolve(out);
          });
          tmp.loadSource(src);
          return;
        } catch (_) {
          resolve({ width: 0, height: 0, duration: NaN });
          return;
        }
      }

      function parseMaster(masterText) {
        var lines = masterText.split(/\r?\n/);
        var bestW = 0,
          bestH = 0,
          firstMedia = null,
          lastInf = null;
        for (var i = 0; i < lines.length; i++) {
          var line = lines[i];
          if (line.indexOf('#EXT-X-STREAM-INF:') === 0) {
            lastInf = line;
          } else if (lastInf && line && line[0] !== '#') {
            if (!firstMedia) firstMedia = line.trim();
            var m = /RESOLUTION=(\d+)x(\d+)/.exec(lastInf);
            if (m) {
              var w = parseInt(m[1], 10),
                h = parseInt(m[2], 10);
              if (w > bestW) {
                bestW = w;
                bestH = h;
              }
            }
            lastInf = null;
          }
        }
        return { bestW: bestW, bestH: bestH, media: firstMedia };
      }

      function sumDuration(mediaText) {
        var dur = 0,
          re = /#EXTINF:([\d.]+)/g,
          m;
        while ((m = re.exec(mediaText))) dur += parseFloat(m[1]);
        return dur;
      }
      fetch(src, { credentials: 'omit', cache: 'no-store' }).then(function (r) {
        if (!r.ok) throw new Error('master');
        return r.text();
      }).then(function (master) {
        var info = parseMaster(master);
        if (!info.media) {
          resolve({
            width: info.bestW || 0,
            height: info.bestH || 0,
            duration: NaN
          });
          return;
        }
        var mediaUrl = resolveUrl(src, info.media);
        return fetch(mediaUrl, { credentials: 'omit', cache: 'no-store' }).then(
          function (
            r) {
            if (!r.ok) throw new Error('media');
            return r.text();
          }).then(function (mediaText) {
          resolve({
            width: info.bestW || 0,
            height: info.bestH || 0,
            duration: sumDuration(mediaText)
          });
        });
      }).catch(function () { resolve({ width: 0, height: 0, duration: NaN }); });
    });
  }
}
initBunnyPlayer();

// ONBOARDING
(function () {
  const overlay = document.querySelector(".onboarding-overlay");
  const panel = overlay?.querySelector(".transition-panel");
  const capTop = overlay?.querySelector(".panel-cap-top");
  const capBottom = overlay?.querySelector(".panel-cap-bottom");
  const form = overlay?.querySelector(".onboarding-form");
  const formEl = overlay?.querySelector("form");
  const submitBtn = formEl?.querySelector("[data-submit]");
  if (!overlay || !panel) return console.warn("onboarding: missing element");

  const CAP_START = 1;
  const CAP_END = 0.35;
  const DURATION = 1.4;
  const HOOK = "https://hook.eu1.make.com/qhe2n9ssb9vogd73tssm6zg71wwyphc2";

  let submitting = false;

  function pauseAllVideos() {
    document.querySelectorAll("video").forEach(v => {
      try { v.pause(); } catch (_) {}
    });
  }

  function coverIn() {
    pauseAllVideos();
    gsap.set(panel, { yPercent: 0, y: "30vw" });
    gsap.set(capTop, { scaleY: CAP_START });
    gsap.set(capBottom, { scaleY: 1 });
    gsap.set(form, { autoAlpha: 0, y: 20 });
    overlay.style.display = "block";
    document.body.style.overflow = "hidden";
    return gsap.timeline()
      .to(panel, { yPercent: -100, y: 0, duration: DURATION, ease: "power2.inOut" }, 0)
      .to(capTop, { scaleY: CAP_END, duration: DURATION, ease: "none" }, 0)
      .to(form, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, DURATION * 0.75);
  }

  function coverOut() {
    return gsap.timeline({
        onComplete: () => {
          overlay.style.display = "none";
          document.body.style.overflow = "";
        }
      })
      .to(form, { autoAlpha: 0, y: -20, duration: 0.4, ease: "power2.in" }, 0)
      .to(panel, { yPercent: -200, y: "-25vw", duration: DURATION, ease: "power2.inOut" }, 0.4)
      .to(capBottom, { scaleY: 0.35, duration: DURATION, ease: "none" }, 0.4);
  }

  function isFormValid() {
    const name = formEl.querySelector('[name="name"]')?.value.trim() || "";
    const problems = formEl.querySelectorAll('[name="problems"]:checked').length;
    const planning = formEl.querySelectorAll('[name="planning"]:checked').length;
    const nudge = formEl.querySelectorAll('[name="Nudge"]:checked').length;
    return name.length >= 2 && problems >= 1 && planning >= 1 && nudge >= 1;
  }

  function readAnswers() {
    const problems = [...formEl.querySelectorAll('[name="problems"]:checked')]
      .map(i => i.closest(".radiocheck-field")?.textContent.trim() || i.value);
    const getChecked = (n) => [...formEl.querySelectorAll(`[name="${n}"]:checked`)].map(i => i
      .value);
    return {
      firstName: formEl.querySelector('[name="name"]')?.value.trim() || "",
      problems: problems.join(", "),
      planning: getChecked("planning")[0] || "",
      nudge: getChecked("Nudge")[0] || "",
    };
  }

  async function save(data) {
    const res = await window.$memberstackDom.updateMember({
      customFields: {
        "first-name": data.firstName,
        "onboarded": "true",
        "problems": data.problems,
        "planning": data.planning,
        "nudge": data.nudge
      }
    });

    const member = res?.data || {};

    document.querySelectorAll('[data-ms-content="first-name"], [data-ms-member="first-name"]')
      .forEach(el => { el.textContent = data.firstName; });

    try {
      await fetch(HOOK, {
        method: "POST",
        body: new URLSearchParams({
          formType: "onboarding",
          memberId: member.id || "",
          email: member.auth?.email || "",
          firstName: data.firstName,
          problems: data.problems,
          planning: data.planning,
          nudge: data.nudge
        })
      });
    } catch (err) {
      console.error("onboarding webhook failed", err);
    }
  }

  submitBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    if (submitting) return;
    submitting = true;

    await new Promise(r => setTimeout(r, 0));

    if (!isFormValid()) {
      submitting = false;
      return;
    }

    const data = readAnswers();
    coverOut();
    try {
      await save(data);
    } catch (err) {
      console.error("onboarding save failed", err);
      submitting = false;
    }
  });

  async function gate() {
    try {
      for (let i = 0; i < 50 && !window.$memberstackDom; i++) {
        await new Promise(r => setTimeout(r, 100));
      }
      if (!window.$memberstackDom) return console.warn("onboarding: memberstack never loaded");

      const member = await window.$memberstackDom.getCurrentMember();
      const fields = member?.data?.customFields || {};

      if (fields["onboarded"] !== "true") {
        setTimeout(coverIn, 200);
      }
    } catch (err) {
      console.error("onboarding gate failed", err);
    }
  }

  document.querySelector("[test-button]")?.addEventListener("click", coverIn);
  gate();
  window.dfsOnboarding = { coverIn, coverOut };
})();
