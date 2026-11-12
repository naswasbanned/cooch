/* reveal.js - hold-or-tap secret card + countdown timer demo.
   Hooks: [data-reveal] root, [data-reveal-card] button, [data-reveal-done] button,
          [data-timer="<seconds>"] with [data-timer-value], [data-timer-toggle].
   Secrets live in the DOM only inside the card face and are hidden via CSS until aria-pressed=true. */
(function () {
  function closeDelay() {
    var v = getComputedStyle(document.documentElement).getPropertyValue("--delay-reveal-close");
    return Number(v.trim()) || 5000;
  }

  function initReveal(root) {
    var card = root.querySelector("[data-reveal-card]");
    var done = root.querySelector("[data-reveal-done]");
    if (!card) return;
    var holding = false;
    var timeout = null;

    function setOpen(open) {
      card.setAttribute("aria-pressed", String(open));
      if (open && done) done.disabled = false;
      clearTimeout(timeout);
      if (open && !holding) timeout = setTimeout(function () { setOpen(false); }, closeDelay());
    }

    card.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      holding = true;
      clearTimeout(timeout);
      card.setAttribute("aria-pressed", "true");
      if (done) done.disabled = false;
    });

    function release() {
      if (!holding) return;
      holding = false;
      setOpen(false);
    }
    card.addEventListener("pointerup", release);
    card.addEventListener("pointerleave", release);
    card.addEventListener("pointercancel", release);

    // Keyboard: Space/Enter toggles; auto-closes after the token delay.
    card.addEventListener("keydown", function (e) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setOpen(card.getAttribute("aria-pressed") !== "true");
      }
    });
    card.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  }

  function format(s) {
    var m = Math.floor(s / 60);
    var r = s % 60;
    return String(m).padStart(2, "0") + ":" + String(r).padStart(2, "0");
  }

  function initTimer(root) {
    var total = Number(root.getAttribute("data-timer")) || 180;
    var left = total;
    var value = root.querySelector("[data-timer-value]");
    var toggle = root.querySelector("[data-timer-toggle]");
    var id = null;

    function render() {
      value.textContent = format(left);
      root.classList.toggle("timer--urgent", left <= 10 && left > 0);
    }

    function stop() {
      clearInterval(id);
      id = null;
      if (toggle) toggle.textContent = left === 0 ? "Ulangi" : "Mulai";
    }

    function start() {
      if (left === 0) left = total;
      id = setInterval(function () {
        left -= 1;
        render();
        if (left <= 0) stop();
      }, 1000);
      if (toggle) toggle.textContent = "Jeda";
      render();
    }

    if (toggle) toggle.addEventListener("click", function () { id ? stop() : start(); });
    render();
  }

  document.querySelectorAll("[data-reveal]").forEach(initReveal);
  document.querySelectorAll("[data-timer]").forEach(initTimer);
})();
