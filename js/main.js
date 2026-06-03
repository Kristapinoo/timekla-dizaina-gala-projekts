/* ==========================================================================
   main.js — krāsu režīma pārslēgšana un mobilā navigācija
   "Viena darba nedēļa Datorikas nodaļas studenta dzīvē"
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var STORAGE_KEY = "timekla-dizains-tema";

  /* --- Tēmas noteikšana: saglabātā izvēle vai sistēmas iestatījums --- */
  function getInitialTheme() {
    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* localStorage var nebūt pieejams */
    }
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    var prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      var isDark = theme === "dark";
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.setAttribute(
        "aria-label",
        isDark ? "Ieslēgt gaišo režīmu" : "Ieslēgt tumšo režīmu"
      );
    }
  }

  /* Pielieto tēmu pēc iespējas ātrāk */
  applyTheme(getInitialTheme());

  document.addEventListener("DOMContentLoaded", function () {
    /* atkārtoti pielieto, lai sakārtotu pogas aria stāvokli */
    applyTheme(root.getAttribute("data-theme") || getInitialTheme());

    /* --- Režīma pārslēgs --- */
    var toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var next =
          root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch (e) {
          /* ignorējam, ja saglabāt nevar */
        }
      });
    }

    /* --- Mobilā navigācija --- */
    var navToggle = document.querySelector(".nav-toggle");
    var navLinks = document.querySelector(".nav-links");
    if (navToggle && navLinks) {
      navToggle.addEventListener("click", function () {
        var open = navLinks.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(open));
      });
      /* aizver izvēlni pēc saites izvēles */
      navLinks.addEventListener("click", function (ev) {
        if (ev.target.tagName === "A") {
          navLinks.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
      /* aizver izvēlni, klikšķinot ārpus tās */
      document.addEventListener("click", function (ev) {
        if (
          navLinks.classList.contains("open") &&
          !navLinks.contains(ev.target) &&
          !navToggle.contains(ev.target)
        ) {
          navLinks.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    }
  });
})();