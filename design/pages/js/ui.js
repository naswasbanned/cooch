/* ui.js - small shared page behaviors. UI only; real storage comes with the backend.
   Hooks: [data-chip-group] single-select chips (buttons with aria-pressed),
          .card__fav favorite toggle, [data-text-size] / [data-theme-select] preference previews. */
(function () {
  function initChipGroup(group) {
    group.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip || chip.disabled || !group.contains(chip)) return;
      group.querySelectorAll(".chip").forEach(function (c) {
        c.setAttribute("aria-pressed", String(c === chip));
      });
      group.dispatchEvent(new CustomEvent("chipchange", { bubbles: true, detail: chip.getAttribute("data-value") }));
    });
  }

  function initFav(btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var on = btn.getAttribute("aria-pressed") !== "true";
      btn.setAttribute("aria-pressed", String(on));
      btn.setAttribute("aria-label", on ? "Hapus dari favorit" : "Tambah ke favorit");
      if (window.Cooch && window.Cooch.toast) {
        window.Cooch.toast(on ? "Ditambahkan ke favorit" : "Dihapus dari favorit", on ? "success" : "info");
      }
    });
  }

  document.querySelectorAll("[data-chip-group]").forEach(initChipGroup);
  document.querySelectorAll(".card__fav").forEach(initFav);
})();
