/* button.js - hold-to-confirm for .btn--hold[data-hold].
   A normal click does nothing; holding for --delay-hold ms fires the click.
   Works with pointer (touch/mouse) and keyboard (hold Space or Enter). */
(function () {
  function holdMs() {
    var v = getComputedStyle(document.documentElement).getPropertyValue("--delay-hold");
    return Number(v.trim()) || 500;
  }

  function initHold(btn) {
    var timer = null;
    var confirmed = false;

    function start() {
      if (btn.disabled || timer) return;
      btn.setAttribute("data-holding", "true");
      timer = setTimeout(function () {
        timer = null;
        btn.removeAttribute("data-holding");
        confirmed = true;
        btn.click();
      }, holdMs());
    }

    function cancel() {
      clearTimeout(timer);
      timer = null;
      btn.removeAttribute("data-holding");
    }

    btn.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      start();
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach(function (t) { btn.addEventListener(t, cancel); });
    btn.addEventListener("keydown", function (e) {
      if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); start(); }
    });
    btn.addEventListener("keyup", function (e) {
      if (e.key === " " || e.key === "Enter") cancel();
    });
    btn.addEventListener("contextmenu", function (e) { e.preventDefault(); });

    // Only the click fired by a completed hold may reach other listeners.
    btn.addEventListener("click", function (e) {
      if (confirmed) { confirmed = false; return; }
      e.preventDefault();
      e.stopImmediatePropagation();
    });
  }

  document.querySelectorAll(".btn--hold[data-hold]").forEach(initHold);
})();
