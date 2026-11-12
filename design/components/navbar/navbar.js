/* navbar.js - mobile menu toggle. Hooks: [data-navbar], [data-navbar-toggle], [data-navbar-menu]. */
(function () {
  function initNavbar(root) {
    var toggle = root.querySelector("[data-navbar-toggle]");
    var menu = root.querySelector("[data-navbar-menu]");
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
      menu.setAttribute("data-open", String(open));
      var use = toggle.querySelector("use");
      if (use) use.setAttribute("href", open ? "#i-close" : "#i-menu");
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    root.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    setOpen(false);
  }

  document.querySelectorAll("[data-navbar]").forEach(initNavbar);
})();
