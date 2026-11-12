/* settings.js - previews preferences on the settings page and handles the custom-category
   dialog (DESIGN.md 5.9). UI only: saving to device storage comes with the app layer.
   Hooks: [data-theme-option] radios (gelap|terang|sistem), [data-text-size-option] radios,
          [data-motion-toggle], [data-saved-toggle], [data-category-form] inside a dialog,
          [data-category-list], [data-clear-data]. */
(function () {
  function toast(msg, type) {
    if (window.Cooch && window.Cooch.toast) window.Cooch.toast(msg, type);
  }

  function applyTheme(value) {
    var dark = value === "gelap" || (value === "sistem" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (dark) document.body.setAttribute("data-theme", "night");
    else document.body.removeAttribute("data-theme");
  }

  document.querySelectorAll("[data-theme-option]").forEach(function (r) {
    r.addEventListener("change", function () { if (r.checked) { applyTheme(r.value); toast("Tema diganti", "success"); } });
  });

  document.querySelectorAll("[data-text-size-option]").forEach(function (r) {
    r.addEventListener("change", function () {
      if (!r.checked) return;
      if (r.value === "besar") document.documentElement.setAttribute("data-text-size", "lg");
      else document.documentElement.removeAttribute("data-text-size");
    });
  });

  var motion = document.querySelector("[data-motion-toggle]");
  if (motion) {
    motion.addEventListener("change", function () {
      if (motion.checked) document.documentElement.setAttribute("data-motion", "reduce");
      else document.documentElement.removeAttribute("data-motion");
    });
  }

  document.querySelectorAll("[data-saved-toggle]").forEach(function (el) {
    el.addEventListener("change", function () { toast("Pengaturan tersimpan", "success"); });
  });

  var form = document.querySelector("[data-category-form]");
  var list = document.querySelector("[data-category-list]");
  if (form && list) {
    // form.js handles required-field errors first; this runs after it on the same submit.
    form.addEventListener("submit", function () {
      if (form.querySelector(".field--error")) return;
      var name = form.querySelector("[data-category-name]").value.trim();
      var words = form.querySelector("[data-category-words]").value.split("\n").filter(function (w) { return w.trim(); });
      var item = list.querySelector("li").cloneNode(true);
      item.querySelector("[data-category-title]").textContent = name;
      item.querySelector("[data-category-meta]").textContent = words.length + " kata";
      list.appendChild(item);
      form.reset();
      form.closest("dialog").close();
      toast("Kategori " + name + " ditambahkan", "success");
    });
  }

  var clear = document.querySelector("[data-clear-data]");
  if (clear) clear.addEventListener("click", function () { toast("Data di perangkat ini dihapus", "info"); });
})();
