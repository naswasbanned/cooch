/* form.js - stepper +/- and simple required validation.
   Hooks: [data-stepper] (with [data-stepper-dec], [data-stepper-inc], input), [data-validate] form. */
(function () {
  function initStepper(root) {
    var input = root.querySelector("input");
    var dec = root.querySelector("[data-stepper-dec]");
    var inc = root.querySelector("[data-stepper-inc]");
    if (!input || !dec || !inc) return;
    var min = Number(input.min || 0);
    var max = Number(input.max || 99);

    function clamp(v) {
      return Math.min(max, Math.max(min, isNaN(v) ? min : v));
    }

    function sync() {
      var v = clamp(Number(input.value));
      input.value = v;
      dec.disabled = v <= min;
      inc.disabled = v >= max;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    dec.addEventListener("click", function () { input.value = Number(input.value) - 1; sync(); });
    inc.addEventListener("click", function () { input.value = Number(input.value) + 1; sync(); });
    input.addEventListener("blur", sync);
    sync();
  }

  function initValidate(form) {
    form.addEventListener("submit", function (e) {
      var firstBad = null;
      form.querySelectorAll("[required]").forEach(function (el) {
        var field = el.closest(".field");
        var bad = !el.value.trim();
        el.setAttribute("aria-invalid", String(bad));
        if (field) field.classList.toggle("field--error", bad);
        if (bad && !firstBad) firstBad = el;
      });
      e.preventDefault();
      if (firstBad) firstBad.focus();
    });
  }

  document.querySelectorAll("[data-stepper]").forEach(initStepper);
  document.querySelectorAll("form[data-validate]").forEach(initValidate);
})();
