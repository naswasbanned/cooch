/* pick-list.js - keeps a confirm button disabled until a choice is made, and writes the
   chosen name into it. Hooks: [data-pick-confirm="<radio name>"], optional
   [data-pick-template="Eksekusi {name}"]. Each radio carries data-name.
   [data-pick-echo="<radio name>"] elements elsewhere show the chosen name (e.g. Seer result). */
(function () {
  function initConfirm(btn) {
    var name = btn.getAttribute("data-pick-confirm");
    var template = btn.getAttribute("data-pick-template");
    var radios = document.querySelectorAll('input[type="radio"][name="' + name + '"]');

    function sync() {
      var picked = null;
      radios.forEach(function (r) { if (r.checked) picked = r; });
      btn.disabled = !picked;
      if (picked) {
        document.querySelectorAll('[data-pick-echo="' + name + '"]').forEach(function (el) {
          el.textContent = picked.getAttribute("data-name");
        });
      }
      if (template) {
        btn.textContent = picked ? template.replace("{name}", picked.getAttribute("data-name")) : btn.getAttribute("data-pick-empty");
      }
    }

    radios.forEach(function (r) { r.addEventListener("change", sync); });
    sync();
  }

  document.querySelectorAll("[data-pick-confirm]").forEach(initConfirm);
})();
