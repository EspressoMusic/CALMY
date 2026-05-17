(function () {
  "use strict";

  const TARGET_VOLUME = 0.42;
  const FADE_MS = 900;

  function initYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  function initBackgroundVideo() {
    const video = document.getElementById("bg-video");
    if (!video) return;

    video.muted = true;
    video.volume = 0;
    video.defaultMuted = true;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      if (motionQuery.matches) {
        video.pause();
        video.removeAttribute("autoplay");
        return;
      }
      video.play().catch(() => {});
    };

    sync();
    motionQuery.addEventListener("change", sync);
  }

  function initRippleCanvas() {
    const canvas = document.getElementById("ripple-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fillParent = true;
    const MAX_ACTIVE = 12;
    const ripples = [];
    let raf = 0;
    let lastSpawn = 0;
    let lastX = 0;
    let lastY = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (x, y, strength = 1) => {
      if (ripples.length >= MAX_ACTIVE) ripples.shift();
      ripples.push({
        x,
        y,
        age: 0,
        life: 2.6 + strength * 0.35,
        speed: 58 + strength * 22,
        intensity: 0.09 + strength * 0.03,
      });
    };

    const pointerToCanvas = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;
      return { x, y };
    };

    const onPointerMove = (event) => {
      const pos = pointerToCanvas(event);
      if (!pos) return;

      const now = performance.now();
      const dx = pos.x - lastX;
      const dy = pos.y - lastY;
      const dist2 = dx * dx + dy * dy;

      if (now - lastSpawn < 55 && dist2 < 900) return;

      lastSpawn = now;
      lastX = pos.x;
      lastY = pos.y;

      const strength = Math.min(1.25, Math.sqrt(dist2) / 220 + 0.35);
      spawn(pos.x, pos.y, strength);
    };

    const onPointerDown = (event) => {
      const pos = pointerToCanvas(event);
      if (!pos) return;
      spawn(pos.x, pos.y, 1.35);
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const ripple = ripples[i];
        ripple.age += 1 / 60;

        if (ripple.age > ripple.life) {
          ripples.splice(i, 1);
          continue;
        }

        const progress = ripple.age / ripple.life;
        const fade = 1 - progress;
        const radius = ripple.speed * ripple.age;

        ctx.lineWidth = 1.2;
        ctx.strokeStyle = `rgba(30, 58, 138, ${ripple.intensity * fade})`;

        for (let ring = 0; ring < 3; ring += 1) {
          const ringRadius = Math.max(0, radius - ring * 14);
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ringRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      raf = window.requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => resize());
      const target = canvas.parentElement;
      if (target) resizeObserver.observe(target);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    raf = window.requestAnimationFrame(render);
  }

  function fadeVolume(audio, from, to, durationMs) {
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - t) * (1 - t);
      audio.volume = from + (to - from) * eased;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function isAudible(audio) {
    return !audio.paused && !audio.muted && audio.volume > 0.001;
  }

  function initAmbientAudio() {
    const btn = document.getElementById("ambient-audio-btn");
    const audio = document.getElementById("ambient-audio");
    if (!btn || !audio) return;

    const STORAGE_KEY = "water-ambient-enabled";
    const iconMuted = btn.querySelector(".icon-muted");
    const iconUnmuted = btn.querySelector(".icon-unmuted");
    let userMuted = sessionStorage.getItem(STORAGE_KEY) === "0";
    let fadeToken = 0;
    let unlockListenersBound = false;

    const syncUi = () => {
      const audible = isAudible(audio);
      btn.setAttribute("aria-pressed", audible ? "true" : "false");
      btn.setAttribute(
        "aria-label",
        audible ? "Mute ambient river sound" : "Play ambient river sound"
      );
      iconMuted?.classList.toggle("hidden", audible);
      iconUnmuted?.classList.toggle("hidden", !audible);
    };

    const markEnabled = () => {
      sessionStorage.setItem(STORAGE_KEY, "1");
    };

    const markDisabled = () => {
      sessionStorage.setItem(STORAGE_KEY, "0");
    };

    const hardStop = () => {
      fadeToken += 1;
      audio.pause();
      audio.muted = true;
      audio.volume = 0;
      syncUi();
    };

    const unmuteAndFadeIn = () => {
      const token = ++fadeToken;
      audio.muted = false;
      const from = audio.volume > 0.001 ? audio.volume : 0;
      fadeVolume(audio, from, TARGET_VOLUME, FADE_MS);
      window.setTimeout(() => {
        if (token === fadeToken && !userMuted && audio.volume < TARGET_VOLUME * 0.5) {
          audio.volume = TARGET_VOLUME;
        }
      }, FADE_MS + 80);
    };

    const startAmbient = async () => {
      if (userMuted) return false;
      if (isAudible(audio)) {
        markEnabled();
        syncUi();
        return true;
      }

      try {
        if (audio.paused) {
          audio.muted = true;
          audio.volume = 0;
          await audio.play();
        }

        unmuteAndFadeIn();
        markEnabled();
        removeUnlockListeners();
        syncUi();
        return true;
      } catch {
        syncUi();
        return false;
      }
    };

    const tryAutoStart = () => {
      if (!userMuted) void startAmbient();
    };

    const onUserUnlock = () => {
      if (!userMuted) void startAmbient();
    };

    const unlockEvents = ["pointerdown", "touchstart", "keydown", "click"];

    const removeUnlockListeners = () => {
      if (!unlockListenersBound) return;
      unlockEvents.forEach((eventName) => {
        document.removeEventListener(eventName, onUserUnlock, true);
      });
      unlockListenersBound = false;
    };

    const addUnlockListeners = () => {
      if (unlockListenersBound) return;
      unlockEvents.forEach((eventName) => {
        document.addEventListener(eventName, onUserUnlock, { capture: true, passive: true });
      });
      unlockListenersBound = true;
    };

    const bootAudio = () => {
      if (userMuted) {
        syncUi();
        return;
      }

      if (!audio.paused) {
        unmuteAndFadeIn();
        markEnabled();
        removeUnlockListeners();
        syncUi();
        return;
      }

      tryAutoStart();
    };

    audio.addEventListener(
      "playing",
      () => {
        if (userMuted) return;
        if (!isAudible(audio)) {
          unmuteAndFadeIn();
          markEnabled();
          removeUnlockListeners();
          syncUi();
        }
      },
      { passive: true }
    );

    audio.addEventListener(
      "canplaythrough",
      () => {
        bootAudio();
      },
      { passive: true }
    );

    if (audio.readyState >= 3) {
      bootAudio();
    } else {
      audio.load();
    }

    addUnlockListeners();

    window.addEventListener("load", bootAudio);
    window.addEventListener("pageshow", bootAudio);

    [50, 150, 400, 900, 1800, 3500].forEach((ms) => {
      window.setTimeout(bootAudio, ms);
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") bootAudio();
    });

    ["play", "playing", "pause", "volumechange"].forEach((evt) => {
      audio.addEventListener(evt, syncUi);
    });

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (isAudible(audio)) {
        userMuted = true;
        markDisabled();
        hardStop();
        addUnlockListeners();
      } else {
        userMuted = false;
        markEnabled();
        void startAmbient();
      }
    });

    syncUi();
  }

  function initScrollReveal() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = document.querySelectorAll(
      ".scroll-reveal, .fluid-stone, .fluid-stone-footer"
    );
    const contactPanel = document.querySelector(".contact-panel");

    if (reduced) {
      targets.forEach((el) => el.classList.add("is-visible"));
      contactPanel?.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    targets.forEach((el) => observer.observe(el));

    if (contactPanel) {
      const panelObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            contactPanel.classList.add("is-visible");
            panelObserver.unobserve(contactPanel);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
      );
      panelObserver.observe(contactPanel);
    }
  }

  function initHeroOnLoad() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const heroItems = document.querySelectorAll(".hero-on-load");

    if (reduced) {
      heroItems.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    requestAnimationFrame(() => {
      heroItems.forEach((el) => el.classList.add("is-visible"));
    });
  }

  function initParallax() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = document.querySelectorAll(".scroll-section");
    if (reduced || !sections.length) return;

    let ticking = false;

    const update = () => {
      const vh = window.innerHeight;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const center = rect.top + rect.height * 0.5;
        const distance = (center - vh * 0.5) / vh;
        const offset = Math.max(-28, Math.min(28, distance * -18));
        section.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );

    update();
  }

  function initHeroTitleWords() {
    const words = document.querySelectorAll(".hero-title-word:not(.hero-title-word-dash)");
    words.forEach((word) => {
      word.setAttribute("tabindex", "0");
    });
  }

  function initPlanningButton() {
    const btn = document.querySelector(".btn-hero");
    const contact = document.getElementById("contact-heading");
    if (!btn || !contact) return;

    btn.addEventListener("click", () => {
      contact.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  initYear();
  initBackgroundVideo();
  initRippleCanvas();
  initScrollReveal();
  initAmbientAudio();
  initHeroOnLoad();
  initHeroTitleWords();
  initParallax();
  initPlanningButton();
})();
