(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function launchCvCelebration() {
    if (reducedMotion) return;
    var root = document.getElementById("cv-celebration-root");
    if (!root) return;

    root.innerHTML = "";
    var frag = document.createDocumentFragment();
    for (var i = 0; i < 28; i++) {
      var el = document.createElement("span");
      el.className = "cv-mini-doc";
      el.style.left = Math.random() * 100 + "%";
      el.style.animationDelay = Math.random() * 0.45 + "s";
      el.style.animationDuration = 1.95 + Math.random() * 0.95 + "s";
      el.style.setProperty("--cv-rot", (Math.random() - 0.5) * 52 + "deg");
      el.style.setProperty("--cv-drift", (Math.random() - 0.5) * 110 + "px");
      frag.appendChild(el);
    }
    root.appendChild(frag);
    window.setTimeout(function () {
      root.innerHTML = "";
    }, 3600);
  }

  function initDownloadCv() {
    var btn = document.getElementById("download-cv");
    var thanks = document.getElementById("download-thanks");
    if (!btn || !thanks) return;

    var text = btn.querySelector(".btn-text");
    var hoverText = btn.querySelector(".btn-hover-text");

    if (!reducedMotion && text && hoverText) {
      btn.addEventListener("mouseenter", function () {
        text.classList.add("hidden");
        hoverText.classList.remove("hidden");
      });
      btn.addEventListener("mouseleave", function () {
        text.classList.remove("hidden");
        hoverText.classList.add("hidden");
      });
    }

    btn.addEventListener("click", function () {
      thanks.classList.remove("hidden");
      launchCvCelebration();
      window.setTimeout(function () {
        thanks.classList.add("hidden");
      }, 3200);
    });
  }

  function initNav() {
    var nav = document.getElementById("site-nav");
    var toggle = document.getElementById("nav-toggle");
    var menu = document.getElementById("nav-menu");
    if (!nav || !toggle || !menu) return;

    function setOpen(open) {
      nav.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    }

    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("nav-open"));
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });

    var waFloat = document.querySelector(".wa-float");
    function onScroll() {
      nav.classList.toggle("is-scrolled", window.scrollY > 24);
      if (waFloat) waFloat.classList.toggle("is-shown", window.scrollY > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initScrollSpy() {
    var links = document.querySelectorAll(".nav-link[href^='#']");
    if (!links.length || !("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var activeId = "#" + entry.target.id;
          links.forEach(function (link) {
            var match = link.getAttribute("href") === activeId;
            link.classList.toggle("active", match);
            if (match) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    links.forEach(function (a) {
      var section = document.querySelector(a.getAttribute("href"));
      if (section) observer.observe(section);
    });
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (reducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    // Stagger siblings that enter together (cards in a grid, timeline items).
    items.forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
        return c.classList.contains("reveal");
      });
      var index = siblings.indexOf(el);
      if (index > 0) el.style.setProperty("--reveal-delay", Math.min(index * 0.09, 0.45) + "s");
    });

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    items.forEach(function (el) {
      obs.observe(el);
    });
  }

  function initCountUp() {
    if (reducedMotion) return;
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      if (!target) return;
      var start = null;
      var duration = 1100;
      el.textContent = "0";
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) window.requestAnimationFrame(step);
      }
      window.setTimeout(function () {
        window.requestAnimationFrame(step);
      }, 350);
      // Never leave a stat at 0 if animation frames are throttled (background tab).
      window.setTimeout(function () {
        el.textContent = String(target);
      }, 350 + duration + 400);
    });
  }

  initDownloadCv();
  initNav();
  initScrollSpy();
  initReveal();
  initCountUp();
})();
