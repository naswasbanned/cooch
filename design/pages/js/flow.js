/* flow.js - switches pass-and-play screens on play pages. UI only: no game logic.
   Hooks: [data-flow] root, [data-screen="id"] sections with optional
            data-phase      text for the game bar [data-phase]
            data-theme      "night" forces the night theme on this screen
            data-secret     screen shows secret info; leaving the tab sends players to "resume"
          [data-go="id"] buttons; [data-go="back"] returns to the previous screen
            (data-back-steps="2" skips further back, data-fallback="id" when there is no history)
          [data-wait] button inside a screen: busy for a random 3-8 s each time the screen opens
            (DESIGN.md 7.2: dead or missing roles are still called with a random pause).
   Opening any [data-modal-open] (Jeda, Aturan) covers secret cards first. #id opens a screen. */
(function () {
  var root = document.querySelector("[data-flow]");
  if (!root) return;
  var screens = Array.prototype.slice.call(root.querySelectorAll("[data-screen]"));
  var phase = document.querySelector("[data-phase]");
  var baseTheme = document.body.getAttribute("data-theme");
  var stack = [];
  var current = null;
  var waitTimer = null;

  function find(id) {
    return screens.find(function (s) { return s.getAttribute("data-screen") === id; });
  }

  function coverSecrets(scope) {
    scope.querySelectorAll("[data-reveal-card]").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
  }

  function startWait(screen) {
    clearTimeout(waitTimer);
    screen.querySelectorAll("[data-wait]").forEach(function (btn) {
      btn.disabled = true;
      btn.setAttribute("aria-busy", "true");
      var ms = 3000 + Math.round(Math.random() * 5000);
      waitTimer = setTimeout(function () {
        btn.disabled = false;
        btn.removeAttribute("aria-busy");
      }, ms);
    });
  }

  function show(id, remember) {
    var next = find(id) || screens[0];
    if (remember && current && current !== next) stack.push(current.getAttribute("data-screen"));
    screens.forEach(function (s) { s.hidden = s !== next; });
    current = next;

    var theme = next.getAttribute("data-theme") || baseTheme;
    if (theme) document.body.setAttribute("data-theme", theme);
    else document.body.removeAttribute("data-theme");
    if (phase && next.hasAttribute("data-phase")) phase.textContent = next.getAttribute("data-phase");

    // A screen always opens with its secret card covered.
    coverSecrets(next);
    next.querySelectorAll("[data-reveal-done]").forEach(function (b) { b.disabled = true; });
    startWait(next);

    var hash = "#" + next.getAttribute("data-screen");
    if (location.hash !== hash) history.replaceState(null, "", hash);
    window.scrollTo({ top: 0, behavior: "instant" });
    var heading = next.querySelector("h1, h2");
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-modal-open]") && current) coverSecrets(current);
    var trigger = e.target.closest("[data-go]");
    if (!trigger || trigger.disabled) return;
    e.preventDefault();
    var id = trigger.getAttribute("data-go");
    if (id === "back") {
      var steps = Number(trigger.getAttribute("data-back-steps")) || 1;
      var target = null;
      while (steps-- > 0 && stack.length) target = stack.pop();
      show(target || trigger.getAttribute("data-fallback") || screens[0].getAttribute("data-screen"), false);
    } else {
      show(id, true);
    }
  });

  // DESIGN.md 5.11: coming back from a call or another app never shows a secret.
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && current && current.hasAttribute("data-secret") && find("resume")) show("resume", true);
  });

  window.addEventListener("hashchange", function () { show(location.hash.slice(1), false); });
  show(location.hash.slice(1) || screens[0].getAttribute("data-screen"), false);
})();
