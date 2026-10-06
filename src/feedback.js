// DFS · Feedback page — NPS branching + form validation
// Page-local copy. The global form-validation script must NOT load on this page.
//
// Attributes:
//   data-form-validate      on the form wrapper (once)
//   data-validate           on every form-field-group
//   data-radiocheck-group   on the radio/checkbox group inside a field group
//   data-nps-group          on the 1–10 scale's radio group
//   data-nps-branch         "promoter" | "passive" | "detractor" (comma-separated ok)
//   data-nps-min / -max     custom range instead of a named branch
//   data-nps-display        override the default display mode for one element

(function () {

  /* ---------------------------------------------------------------
     1. NPS BRANCHING
     --------------------------------------------------------------- */

  var DISPLAY_MODE = 'flex'; // default; override per element with data-nps-display
  var DURATION = 650; // ms — baseline for a ~400px tall branch
  var EASING = 'cubic-bezier(0.33, 0, 0.2, 1)';
  var SLIDE = 12; // px the content lifts from

  var RANGES = {
    promoter: [8, 10],
    passive: [6, 7],
    detractor: [1, 5]
  };

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Lenis caches the document height, so it has to be told when the page
  // grows or shrinks — otherwise you can't scroll to newly revealed content.
  function refreshScroll() {
    var l = window.lenis || window.Lenis || window.smoothScroll ||
      (window.dfs && window.dfs.lenis);

    if (l && typeof l.resize === 'function') {
      l.resize();
      return;
    }

    // Fallback: a resize event makes most smooth-scroll libraries remeasure.
    window.dispatchEvent(new Event('resize'));
  }

  function initNpsBranching() {
    var group = document.querySelector('[data-nps-group]');
    if (!group) return;

    var branches = Array.prototype.slice.call(
      document.querySelectorAll('[data-nps-branch], [data-nps-min], [data-nps-max]')
    );
    if (!branches.length) return;

    branches.forEach(function (el) {
      var min = el.getAttribute('data-nps-min');
      var max = el.getAttribute('data-nps-max');

      if (min !== null || max !== null) {
        el._npsRanges = [
          [
            min !== null ? parseInt(min, 10) : 0,
            max !== null ? parseInt(max, 10) : 10
          ]
        ];
      } else {
        el._npsRanges = (el.getAttribute('data-nps-branch') || '')
          .split(',')
          .map(function (name) { return RANGES[name.trim()]; })
          .filter(Boolean);
      }

      el._npsMode = el.getAttribute('data-nps-display') || DISPLAY_MODE;
      el._npsOpen = false;
      el.style.display = 'none';
    });

    function clearTimer(el) {
      if (el._npsTimer) {
        clearTimeout(el._npsTimer);
        el._npsTimer = null;
      }
      if (el._npsEnd) {
        el.removeEventListener('transitionend', el._npsEnd);
        el._npsEnd = null;
      }
      if (el._npsTick) {
        cancelAnimationFrame(el._npsTick);
        el._npsTick = null;
      }
    }

    function resetStyles(el) {
      el.style.transition = '';
      el.style.height = '';
      el.style.opacity = '';
      el.style.transform = '';
      el.style.overflow = '';
    }

    // Duration scales with distance so tall and short branches feel the same.
    function durationFor(px) {
      var d = DURATION * Math.sqrt(px / 400);
      return Math.max(400, Math.min(1100, d));
    }

    // Keep the scroll length in sync while the height is actually changing.
    function trackWhileAnimating(el, ms) {
      var start = Date.now();

      function tick() {
        refreshScroll();
        if (Date.now() - start < ms + 100) {
          el._npsTick = requestAnimationFrame(tick);
        } else {
          el._npsTick = null;
        }
      }

      el._npsTick = requestAnimationFrame(tick);
    }

    // Cleanup runs once — on transitionend, or on the fallback timer.
    function onSettled(el, ms, fn) {
      var done = false;

      function finish(e) {
        if (e && e.target !== el) return; // ignore children
        if (e && e.propertyName !== 'height') return; // only the height tween
        if (done) return;
        done = true;
        clearTimer(el);
        fn();
        refreshScroll();
      }

      el._npsEnd = finish;
      el.addEventListener('transitionend', finish);
      el._npsTimer = setTimeout(function () { finish(null); }, ms + 80);
    }

    function openBranch(el) {
      clearTimer(el);
      el.style.display = el._npsMode;

      if (reduceMotion) {
        resetStyles(el);
        refreshScroll();
        return;
      }

      // Fade-only elements (the submit button) skip the height tween.
      if (el.hasAttribute('data-nps-fade')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(' + SLIDE + 'px)';
        void el.offsetHeight;
        el.style.transition = 'opacity 400ms ' + EASING +
          ', transform 400ms ' + EASING;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        refreshScroll();
        return;
      }

      resetStyles(el);

      // Force layout before measuring, so the first open gets a real height.
      void el.offsetHeight;
      var target = el.scrollHeight;
      var ms = durationFor(target);

      el.style.overflow = 'hidden';
      el.style.height = '0px';
      el.style.opacity = '0';
      el.style.transform = 'translateY(' + SLIDE + 'px)';

      void el.offsetHeight;

      el.style.transition = 'height ' + ms + 'ms ' + EASING +
        ', opacity ' + ms + 'ms ' + EASING +
        ', transform ' + ms + 'ms ' + EASING;
      el.style.height = target + 'px';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';

      trackWhileAnimating(el, ms);

      onSettled(el, ms, function () {
        resetStyles(el);
      });
    }

    function closeBranch(el, instant) {
      clearTimer(el);

      if (reduceMotion || instant) {
        resetStyles(el);
        el.style.display = 'none';
        refreshScroll();
        return;
      }

      if (el.hasAttribute('data-nps-fade')) {
        resetStyles(el);
        el.style.display = 'none';
        refreshScroll();
        return;
      }

      var start = el.scrollHeight;
      var ms = durationFor(start);

      el.style.overflow = 'hidden';
      el.style.height = start + 'px';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';

      void el.offsetHeight;

      el.style.transition = 'height ' + ms + 'ms ' + EASING +
        ', opacity ' + ms + 'ms ' + EASING +
        ', transform ' + ms + 'ms ' + EASING;
      el.style.height = '0px';
      el.style.opacity = '0';
      el.style.transform = 'translateY(' + SLIDE + 'px)';

      trackWhileAnimating(el, ms);

      onSettled(el, ms, function () {
        resetStyles(el);
        el.style.display = 'none';
      });
    }

    function setBranch(el, open) {
      if (el._npsOpen === open) return;
      el._npsOpen = open;

      if (open) {
        openBranch(el);
      } else {
        closeBranch(el);

        var groups = el.querySelectorAll('[data-validate]');
        Array.prototype.forEach.call(groups, function (g) {
          g.classList.remove('is--error', 'is--success', 'is--filled');
        });
      }
    }

    function getScore() {
      var checked = group.querySelector('input[type="radio"]:checked');
      if (!checked) return null;

      var raw = checked.value || '';
      var n = parseInt(String(raw).replace(/[^0-9-]/g, ''), 10);
      return isNaN(n) ? null : n;
    }

    function update() {
      var score = getScore();

      branches.forEach(function (el) {
        var hit = score !== null && el._npsRanges.some(function (r) {
          return score >= r[0] && score <= r[1];
        });

        setBranch(el, hit);
      });
    }

    group.addEventListener('change', update);
    group.addEventListener('click', function () { setTimeout(update, 0); });

    update();
  }

  /* ---------------------------------------------------------------
     2. FORM VALIDATION
     Local copy. Changes from the global version:
       · hidden field groups are skipped, so closed branches don't block submit
       · validateAll is exposed on the form element as __dfsValidate, so the
         overlay script can call it directly instead of firing a submit event
     --------------------------------------------------------------- */

  var SPAM_THRESHOLD = 3000; // ms since load before a submit is accepted

  function initFormValidation() {
    var forms = document.querySelectorAll('[data-form-validate]');

    Array.prototype.forEach.call(forms, function (formContainer) {
      if (formContainer.__validationInitialized) return;
      formContainer.__validationInitialized = true;

      var form = formContainer.querySelector('form');
      if (!form) return;

      var startTime = new Date().getTime();
      var validateFields = form.querySelectorAll('[data-validate]');
      var realSubmitInput = form.querySelector('input[type="submit"]');
      if (!realSubmitInput) return;

      function isSpam() {
        return (new Date().getTime() - startTime) < SPAM_THRESHOLD;
      }

      // Skip anything inside a closed branch.
      function isHidden(el) {
        return !el.offsetParent && getComputedStyle(el).position !== 'fixed';
      }

      // Disable select options with invalid values on page load.
      Array.prototype.forEach.call(validateFields, function (fieldGroup) {
        var select = fieldGroup.querySelector('select');
        if (!select) return;

        Array.prototype.forEach.call(select.querySelectorAll('option'), function (
          option) {
          if (option.value === '' || option.value === 'disabled' ||
            option.value === 'null' || option.value === 'false') {
            option.setAttribute('disabled', 'disabled');
          }
        });
      });

      function isValid(fieldGroup) {
        var radioCheckGroup = fieldGroup.querySelector('[data-radiocheck-group]');

        if (radioCheckGroup) {
          var inputs = radioCheckGroup.querySelectorAll(
            'input[type="radio"], input[type="checkbox"]');
          var checkedInputs = radioCheckGroup.querySelectorAll('input:checked');
          var gMin = parseInt(radioCheckGroup.getAttribute('min'), 10) || 1;
          var gMax = parseInt(radioCheckGroup.getAttribute('max'), 10) || inputs.length;

          if (!inputs.length) return true;

          if (inputs[0].type === 'radio') {
            return checkedInputs.length >= 1;
          }
          if (inputs.length === 1) {
            return inputs[0].checked;
          }
          return checkedInputs.length >= gMin && checkedInputs.length <= gMax;
        }

        var input = fieldGroup.querySelector('input, textarea, select');
        if (!input) return false;

        var value = input.value.trim();
        var length = value.length;
        var min = parseInt(input.getAttribute('min'), 10) || 0;
        var max = parseInt(input.getAttribute('max'), 10) || Infinity;
        var valid = true;

        if (input.tagName.toLowerCase() === 'select') {
          if (value === '' || value === 'disabled' ||
            value === 'null' || value === 'false') {
            valid = false;
          }
        } else if (input.type === 'email') {
          valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        } else {
          if (input.hasAttribute('min') && length < min) valid = false;
          if (input.hasAttribute('max') && length > max) valid = false;
        }

        return valid;
      }

      function updateFieldStatus(fieldGroup) {
        if (isHidden(fieldGroup)) {
          fieldGroup.classList.remove('is--error', 'is--success', 'is--filled');
          return;
        }

        var radioCheckGroup = fieldGroup.querySelector('[data-radiocheck-group]');
        var valid = isValid(fieldGroup);

        if (radioCheckGroup) {
          var inputs = radioCheckGroup.querySelectorAll(
            'input[type="radio"], input[type="checkbox"]');
          var checkedInputs = radioCheckGroup.querySelectorAll('input:checked');

          fieldGroup.classList.toggle('is--filled', checkedInputs.length > 0);

          if (valid) {
            fieldGroup.classList.add('is--success');
            fieldGroup.classList.remove('is--error');
          } else {
            fieldGroup.classList.remove('is--success');
            var started = Array.prototype.some.call(inputs, function (i) {
              return i.__validationStarted;
            });
            fieldGroup.classList.toggle('is--error', started);
          }
          return;
        }

        var input = fieldGroup.querySelector('input, textarea, select');
        if (!input) return;

        fieldGroup.classList.toggle('is--filled', !!input.value.trim());

        if (valid) {
          fieldGroup.classList.add('is--success');
          fieldGroup.classList.remove('is--error');
        } else {
          fieldGroup.classList.remove('is--success');
          fieldGroup.classList.toggle('is--error', !!input.__validationStarted);
        }
      }

      function validateAll() {
        var allValid = true;
        var firstInvalid = null;

        Array.prototype.forEach.call(validateFields, function (fieldGroup) {
          if (isHidden(fieldGroup)) {
            fieldGroup.classList.remove('is--error', 'is--success', 'is--filled');
            return;
          }

          var input = fieldGroup.querySelector('input, textarea, select');
          var radioCheckGroup = fieldGroup.querySelector('[data-radiocheck-group]');
          if (!input && !radioCheckGroup) return;

          if (input) input.__validationStarted = true;

          if (radioCheckGroup) {
            radioCheckGroup.__validationStarted = true;
            Array.prototype.forEach.call(
              radioCheckGroup.querySelectorAll(
                'input[type="radio"], input[type="checkbox"]'),
              function (i) { i.__validationStarted = true; }
            );
          }

          updateFieldStatus(fieldGroup);

          if (!isValid(fieldGroup)) {
            allValid = false;
            if (!firstInvalid) {
              firstInvalid = input || radioCheckGroup.querySelector('input');
            }
          }
        });

        if (!allValid && firstInvalid) firstInvalid.focus();
        return allValid;
      }

      // Exposed so the overlay script can validate without firing an event.
      form.__dfsValidate = validateAll;
      form.__dfsIsSpam = isSpam;

      // Live validation listeners.
      Array.prototype.forEach.call(validateFields, function (fieldGroup) {
        var input = fieldGroup.querySelector('input, textarea, select');
        var radioCheckGroup = fieldGroup.querySelector('[data-radiocheck-group]');

        if (radioCheckGroup) {
          var inputs = radioCheckGroup.querySelectorAll(
            'input[type="radio"], input[type="checkbox"]');

          Array.prototype.forEach.call(inputs, function (i) {
            i.__validationStarted = false;

            i.addEventListener('change', function () {
              requestAnimationFrame(function () {
                if (!i.__validationStarted) {
                  var checkedCount = radioCheckGroup.querySelectorAll(
                    'input:checked').length;
                  var gMin = parseInt(radioCheckGroup.getAttribute('min'),
                    10) || 1;
                  if (checkedCount >= gMin) i.__validationStarted = true;
                }
                if (i.__validationStarted) updateFieldStatus(fieldGroup);
              });
            });

            i.addEventListener('blur', function () {
              i.__validationStarted = true;
              updateFieldStatus(fieldGroup);
            });
          });

          return;
        }

        if (!input) return;

        input.__validationStarted = false;

        if (input.tagName.toLowerCase() === 'select') {
          input.addEventListener('change', function () {
            input.__validationStarted = true;
            updateFieldStatus(fieldGroup);
          });
        } else {
          input.addEventListener('input', function () {
            var length = input.value.trim().length;
            var min = parseInt(input.getAttribute('min'), 10) || 0;
            var max = parseInt(input.getAttribute('max'), 10) || Infinity;

            if (!input.__validationStarted) {
              if (input.type === 'email') {
                if (isValid(fieldGroup)) input.__validationStarted = true;
              } else if ((input.hasAttribute('min') && length >= min) ||
                (input.hasAttribute('max') && length <= max)) {
                input.__validationStarted = true;
              }
            }

            if (input.__validationStarted) updateFieldStatus(fieldGroup);
          });

          input.addEventListener('blur', function () {
            input.__validationStarted = true;
            updateFieldStatus(fieldGroup);
          });
        }
      });

      // Belt and braces: block any native submit that gets this far.
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }, true);

      form.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
        }
      });
    });
  }

  /* ---------------------------------------------------------------
     3. BOOT
     --------------------------------------------------------------- */

  initNpsBranching();
  initFormValidation();

})();

// DFS · Feedback page — submit overlay + save
// Intercepts the submit, validates, slides the panel up, then posts to Make
// and flags the member as having given feedback.

(function () {

  var overlay = document.querySelector('.onboarding-overlay');
  var panel = overlay && overlay.querySelector('.transition-panel');
  var capTop = overlay && overlay.querySelector('.panel-cap-top');
  var capBottom = overlay && overlay.querySelector('.panel-cap-bottom');
  var content = overlay && overlay.querySelector('.feedback_success');

  var formEl = document.querySelector('[data-form-validate] form');
  var submitBtn = formEl && formEl.querySelector('input[type="submit"]');

  if (!overlay || !panel || !formEl || !submitBtn) {
    return console.warn('feedback overlay: missing element');
  }

  var CAP_START = 1;
  var CAP_END = 0.35;
  var DURATION = 1.4;
  var HOOK = "https://hook.eu1.make.com/qhe2n9ssb9vogd73tssm6zg71wwyphc2";

  var submitting = false;

  function pauseAllVideos() {
    document.querySelectorAll('video').forEach(function (v) {
      try { v.pause(); } catch (_) {}
    });
  }

  function coverIn() {
    pauseAllVideos();

    gsap.set(panel, { yPercent: 0, y: '30vw' });
    gsap.set(capTop, { scaleY: CAP_START });
    gsap.set(capBottom, { scaleY: 1 });
    if (content) gsap.set(content, { autoAlpha: 0, y: 20 });

    overlay.style.display = 'block';

    var tl = gsap.timeline()
      .to(panel, { yPercent: -100, y: 0, duration: DURATION, ease: 'power2.inOut' }, 0)
      .to(capTop, { scaleY: CAP_END, duration: DURATION, ease: 'none' }, 0);

    if (content) {
      tl.to(content, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        DURATION * 0.75);
    }

    return tl;
  }

  function readAnswers() {
    var data = {};

    Array.prototype.forEach.call(
      formEl.querySelectorAll('input, textarea, select'),
      function (f) {
        if (!f.name || f.type === 'submit') return;

        if (f.type === 'checkbox' || f.type === 'radio') {
          if (!f.checked) return;
          var label = f.closest('.radiocheck-field');
          var val = label ? label.textContent.trim() : f.value;
          data[f.name] = data[f.name] ? data[f.name] + ', ' + val : val;
          return;
        }

        var v = f.value.trim();
        if (v) data[f.name] = v;
      }
    );

    return data;
  }

  // promoter / passive / detractor, derived from the score.
  function segmentFor(score) {
    var n = parseInt(score, 10);
    if (isNaN(n)) return '';
    if (n >= 8) return 'Promoters 8-10';
    if (n >= 6) return 'Passives 6-7';
    return 'Detractors 1-5';
  }

  async function save(data) {
    var member = {};

    try {
      if (window.$memberstackDom) {
        var res = await window.$memberstackDom.updateMember({
          customFields: { "feedback-given": "true" }
        });
        member = res?.data || {};
      }
    } catch (err) {
      console.error('feedback: memberstack update failed', err);
    }

    var payload = Object.assign({
      formType: "feedback",
      memberId: member.id || "",
      email: member.auth?.email || "",
      firstName: member.customFields?.["first-name"] || "",
      segment: segmentFor(data.scale)
    }, data);

    try {
      await fetch(HOOK, {
        method: "POST",
        body: new URLSearchParams(payload)
      });
    } catch (err) {
      console.error('feedback webhook failed', err);
    }
  }

  submitBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if (submitting) return;

    // Call the validator directly — no synthetic submit event, so
    // Webflow's own handler never hears about this.
    if (formEl.__dfsValidate && !formEl.__dfsValidate()) return;
    if (formEl.__dfsIsSpam && formEl.__dfsIsSpam()) return;

    submitting = true;

    var data = readAnswers();
    coverIn();
    save(data);
  }, true);

})();
