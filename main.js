/* ============================================================
   DIÓSDI MÉHES — landing page behaviour
   ============================================================ */

(function () {
  "use strict";

  /* --------------------------------------------------------
     BRAND — placeholder name. Swap these two strings (and the
     full/combined form) once the real branding lands. Every
     wordmark on the page reads from here.
  -------------------------------------------------------- */
  const BRAND = {
    first: "Diósdi",   // leading word
    second: "Méhes",   // emphasised (italic / brass) word
    get full() {
      return this.first + " " + this.second;
    },
  };

  function applyBrand() {
    document
      .querySelectorAll("[data-brand-first]")
      .forEach((el) => (el.textContent = BRAND.first));
    document
      .querySelectorAll("[data-brand-second]")
      .forEach((el) => (el.textContent = BRAND.second));
    document
      .querySelectorAll("[data-brand-full]")
      .forEach((el) => (el.textContent = BRAND.full));
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* --------------------------------------------------------
     1. ENTRANCE GATE
  -------------------------------------------------------- */
  function initGate() {
    const gate = document.getElementById("gate");
    const enter = document.getElementById("gateEnter");
    if (!gate || !enter) return;

    // Trigger the staggered entrance (CSS handles the timing).
    // Reduced motion: CSS shows everything immediately.
    requestAnimationFrame(() => gate.classList.add("is-ready"));

    // Focus the only interactive element for keyboard users.
    window.setTimeout(
      () => enter.focus({ preventScroll: true }),
      prefersReducedMotion ? 0 : 1100
    );

    function open() {
      gate.classList.add("is-hidden");
      document.body.classList.remove("is-locked");
      gate.setAttribute("aria-hidden", "true");
      // Remove from tab order / DOM flow once the fade completes.
      const cleanup = () => {
        gate.style.display = "none";
      };
      if (prefersReducedMotion) {
        cleanup();
      } else {
        gate.addEventListener("transitionend", cleanup, { once: true });
      }
    }

    enter.addEventListener("click", open);
  }

  /* --------------------------------------------------------
     2. NAV — translucent background on scroll
  -------------------------------------------------------- */
  function initNav() {
    const nav = document.getElementById("nav");
    if (!nav) return;
    const onScroll = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* --------------------------------------------------------
     SCROLL REVEAL — one-time IntersectionObserver
  -------------------------------------------------------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => io.observe(el));
  }

  /* --------------------------------------------------------
     FORMS — front-end only, inline confirmation
  -------------------------------------------------------- */
  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function initForms() {
    const signup = document.getElementById("signupForm");
    if (signup) {
      signup.addEventListener("submit", (e) => {
        e.preventDefault();
        const note = document.getElementById("signupNote");
        const email = signup.querySelector('input[type="email"]');
        if (!email.value || !isEmail(email.value)) {
          note.textContent = "Kérjük, adjon meg egy érvényes e-mail címet.";
          return;
        }
        note.textContent = "Köszönjük — hamarosan jelentkezünk a kedvezménnyel.";
        signup.reset();
      });
    }

    const contact = document.getElementById("contactForm");
    if (contact) {
      contact.addEventListener("submit", (e) => {
        e.preventDefault();
        const note = document.getElementById("contactNote");
        const name = contact.querySelector("#contactName");
        const email = contact.querySelector("#contactEmail");
        const message = contact.querySelector("#contactMessage");
        if (!name.value.trim() || !isEmail(email.value) || !message.value.trim()) {
          note.textContent = "Kérjük, töltse ki mindhárom mezőt érvényesen.";
          return;
        }
        note.textContent = "Köszönjük az üzenetet — hamarosan válaszolunk.";
        contact.reset();
      });
    }
  }

  /* --------------------------------------------------------
     BOOT
  -------------------------------------------------------- */
  function init() {
    applyBrand();
    initGate();
    initNav();
    initReveal();
    initForms();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
