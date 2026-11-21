// Theme: apply saved choice early (also inlined in <head> to avoid a flash).
(function () {
  var root = document.documentElement;

  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function updateIcon() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    var dark = currentTheme() === "dark";
    btn.innerHTML = dark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateIcon();

    var themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        var next = currentTheme() === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try { localStorage.setItem("theme", next); } catch (e) {}
        updateIcon();
      });
    }

    // Mobile nav
    var navBtn = document.getElementById("nav-toggle");
    var links = document.getElementById("nav-links");
    if (navBtn && links) {
      navBtn.addEventListener("click", function () {
        var open = links.classList.toggle("open");
        navBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    // Publication Abs / BibTeX toggles
    document.querySelectorAll("[data-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = document.getElementById(btn.getAttribute("data-toggle"));
        if (!target) return;
        var open = target.classList.toggle("open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        // Close the sibling panel so only one is open at a time
        var parent = btn.closest(".pub-body");
        if (open && parent) {
          parent.querySelectorAll(".pub-hidden.open").forEach(function (el) {
            if (el !== target) {
              el.classList.remove("open");
              var other = parent.querySelector('[data-toggle="' + el.id + '"]');
              if (other) other.setAttribute("aria-expanded", "false");
            }
          });
        }
      });
    });

    // Email assembled at runtime so scrapers can't read it from the HTML
    document.querySelectorAll("[data-email]").forEach(function (el) {
      var parts = el.getAttribute("data-email").split("|");
      var addr = parts[0] + "@" + parts[1];
      el.setAttribute("href", "mailto:" + addr);
      if (el.hasAttribute("data-email-show")) el.textContent = addr;
    });

    // Footer year
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  });
})();
