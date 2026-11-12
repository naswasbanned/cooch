/* toast.js - shows toasts in [data-toast-region].
   Trigger: [data-toast="message"] with optional [data-toast-type="success|error|info"].
   Duration read from --delay-toast token. Exposes window.Cooch.toast(msg, type). */
(function () {
  var ICONS = { success: "#i-check-circle", error: "#i-x-circle", info: "#i-info" };

  function delay() {
    var v = getComputedStyle(document.documentElement).getPropertyValue("--delay-toast");
    return Number(v.trim()) || 4000;
  }

  function region() {
    var r = document.querySelector("[data-toast-region]");
    if (!r) {
      r = document.createElement("div");
      r.className = "toast-region";
      r.setAttribute("data-toast-region", "");
      document.body.appendChild(r);
    }
    r.setAttribute("role", "status");
    r.setAttribute("aria-live", "polite");
    return r;
  }

  function show(message, type) {
    type = ICONS[type] ? type : "info";
    var el = document.createElement("div");
    el.className = "toast toast--" + type;
    el.innerHTML =
      '<svg class="icon" aria-hidden="true"><use href="' + ICONS[type] + '"></use></svg>' +
      '<span class="toast__text"></span>' +
      '<button class="btn btn--ghost btn--sm btn--icon" type="button" aria-label="Tutup notifikasi">' +
      '<svg class="icon icon--sm" aria-hidden="true"><use href="#i-close"></use></svg></button>';
    el.querySelector(".toast__text").textContent = message;

    function dismiss() {
      el.setAttribute("data-leaving", "true");
      setTimeout(function () { el.remove(); }, 250);
    }

    el.querySelector("button").addEventListener("click", dismiss);
    region().appendChild(el);
    setTimeout(dismiss, delay());
  }

  document.querySelectorAll("[data-toast]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      show(btn.getAttribute("data-toast"), btn.getAttribute("data-toast-type"));
    });
  });

  window.Cooch = window.Cooch || {};
  window.Cooch.toast = show;
})();
