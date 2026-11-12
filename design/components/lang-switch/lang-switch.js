/* lang-switch.js - keeps every [data-lang-switch] on the page in sync and sets <html lang>.
   UI only: translated copy comes from translation keys in the app (DESIGN.md 9). */
(function () {
  var switches = document.querySelectorAll("[data-lang-switch]");
  if (!switches.length) return;

  function set(lang, announce) {
    document.documentElement.lang = lang;
    switches.forEach(function (sw) {
      sw.querySelectorAll("input").forEach(function (r) { r.checked = r.value === lang; });
    });
    if (announce && window.Cooch && window.Cooch.toast) {
      window.Cooch.toast(lang === "en" ? "Language: English (terjemahan menyusul)" : "Bahasa: Indonesia", "info");
    }
  }

  switches.forEach(function (sw) {
    sw.addEventListener("change", function (e) { if (e.target.checked) set(e.target.value, true); });
  });
})();
