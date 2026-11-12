/* setup.js - session setup UI (DESIGN.md 5.4). UI only; the backend validates and creates
   the session. Hooks on the form [data-setup]:
     [data-players]            player-count stepper input
     [data-player-list]        container for player rows (rendered here)
     [data-add-player]         "Tambah pemain" button
     [data-shuffle]            "Acak urutan" button
     [data-player-count]       text "N pemain siap"
     [data-start]              start link; aria-disabled while the setup is invalid
     [data-setup-error]        inline message next to the start button
     data-composition='[...]'  suggested roles per player range, applied when the count changes
     [data-role="<key>"]       role stepper inputs; [data-role-toggle="<key>"] optional role toggle
     [data-role-rest]          villagers = players - special roles
     [data-max-third]          stepper whose max = floor(players / 3) (impostors)
     [data-min-players="6"]    toggle that needs at least N players (chameleon)
     [data-evil]               inputs/toggles counted as the evil team (impostor, chameleon) */
(function () {
  var form = document.querySelector("[data-setup]");
  if (!form) return;
  var players = form.querySelector("[data-players]");
  var list = form.querySelector("[data-player-list]");
  var start = form.querySelector("[data-start]");
  var errorBox = form.querySelector("[data-setup-error]");
  var composition = JSON.parse(form.getAttribute("data-composition") || "null");
  var sample = JSON.parse(form.getAttribute("data-sample-names") || "[]");
  var names = sample.slice();

  function toast(msg, type) {
    if (window.Cooch && window.Cooch.toast) window.Cooch.toast(msg, type);
  }

  function count() {
    return Number(players.value);
  }

  function syncStepper(input) {
    var stepper = input.closest("[data-stepper]");
    if (!stepper) return;
    stepper.querySelector("[data-stepper-inc]").disabled = Number(input.value) >= Number(input.max);
    stepper.querySelector("[data-stepper-dec]").disabled = Number(input.value) <= Number(input.min);
  }

  function setPlayers(n) {
    players.value = Math.min(Number(players.max), Math.max(Number(players.min), n));
    players.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function readNames() {
    if (!list) return;
    list.querySelectorAll("input").forEach(function (input, i) { names[i] = input.value; });
  }

  function renderRows() {
    if (!list) return;
    var n = count();
    list.innerHTML = "";
    for (var i = 0; i < n; i += 1) {
      var id = "player-" + (i + 1);
      var field = document.createElement("div");
      field.className = "field player-field";
      field.innerHTML =
        '<div class="player-row">' +
        '<span class="player-row__num" aria-hidden="true">' + (i + 1) + "</span>" +
        '<label class="sr-only" for="' + id + '">Nama pemain ' + (i + 1) + "</label>" +
        '<input class="input" id="' + id + '" type="text" maxlength="16" autocomplete="off" aria-describedby="' + id + '-err">' +
        '<button class="btn btn--ghost btn--icon" type="button" data-remove="' + i + '" aria-label="Hapus pemain ' + (i + 1) + '">' +
        '<svg class="icon" aria-hidden="true"><use href="#i-close"></use></svg></button>' +
        "</div>" +
        '<span class="field__error" id="' + id + '-err"><svg class="icon" aria-hidden="true"><use href="#i-alert"></use></svg>Nama sudah dipakai pemain lain.</span>';
      var input = field.querySelector("input");
      input.placeholder = "Pemain " + (i + 1);
      input.value = names[i] || "";
      list.appendChild(field);
    }
    list.querySelectorAll("[data-remove]").forEach(function (b) { b.disabled = n <= Number(players.min); });
  }

  function duplicates() {
    if (!list) return 0;
    var seen = {};
    var inputs = list.querySelectorAll("input");
    inputs.forEach(function (input) {
      var key = input.value.trim().toLowerCase();
      if (key) seen[key] = (seen[key] || 0) + 1;
    });
    var bad = 0;
    inputs.forEach(function (input) {
      var key = input.value.trim().toLowerCase();
      var dup = !!key && seen[key] > 1;
      input.setAttribute("aria-invalid", String(dup));
      input.closest(".field").classList.toggle("field--error", dup);
      if (dup) bad += 1;
    });
    return bad;
  }

  function applyComposition(n) {
    if (!composition) return;
    var row = composition.find(function (r) { return n >= r.min && n <= r.max; });
    if (!row) return;
    Object.keys(row.roles).forEach(function (key) {
      var input = form.querySelector('[data-role="' + key + '"]');
      if (!input) return;
      input.value = row.roles[key];
      syncStepper(input);
    });
  }

  function roleTotal() {
    var used = 0;
    form.querySelectorAll("[data-role]").forEach(function (input) { used += Number(input.value) || 0; });
    form.querySelectorAll("[data-role-toggle]").forEach(function (t) { if (t.checked) used += 1; });
    return used;
  }

  function evilTotal() {
    var evil = 0;
    form.querySelectorAll("[data-evil]").forEach(function (el) {
      if (el.type === "checkbox") evil += el.checked && !el.disabled ? 1 : 0;
      else evil += Number(el.value) || 0;
    });
    return evil;
  }

  function applyLimits(n) {
    form.querySelectorAll("[data-max-third]").forEach(function (input) {
      var max = Math.max(1, Math.floor(n / 3));
      input.max = max;
      if (Number(input.value) > max) input.value = max;
      syncStepper(input);
      var hint = form.querySelector('[data-max-third-hint="' + input.id + '"]');
      if (hint) hint.textContent = "Maksimal " + max + " untuk " + n + " pemain.";
    });
    form.querySelectorAll("[data-min-players]").forEach(function (toggle) {
      var off = n < Number(toggle.getAttribute("data-min-players"));
      toggle.disabled = off;
      if (off) toggle.checked = false;
    });
  }

  // Returns a message when the setup can't start, or "".
  function problem(n) {
    var rest = form.querySelector("[data-role-rest]");
    if (rest) {
      var left = n - roleTotal();
      rest.textContent = Math.max(0, left);
      var wolves = Number((form.querySelector('[data-role="wolf"]') || {}).value || 0);
      if (left < 0) return "Jumlah peran melebihi " + n + " pemain.";
      if (wolves * 2 >= n) return "Werewolf terlalu banyak untuk " + n + " pemain.";
    }
    if (form.querySelector("[data-evil]") && evilTotal() * 2 >= n) return "Tim jahat terlalu banyak untuk " + n + " pemain.";
    if (duplicates()) return "Ada nama pemain yang sama.";
    return "";
  }

  function validate() {
    var n = count();
    var msg = problem(n);
    if (errorBox) {
      errorBox.hidden = !msg;
      var text = errorBox.querySelector("[data-setup-error-text]");
      if (text) text.textContent = msg;
    }
    if (start) {
      if (msg) { start.setAttribute("aria-disabled", "true"); start.tabIndex = -1; }
      else { start.removeAttribute("aria-disabled"); start.removeAttribute("tabindex"); }
    }
    document.querySelectorAll("[data-player-count]").forEach(function (el) { el.textContent = n + " pemain siap"; });
  }

  function onPlayersChange() {
    readNames();
    var n = count();
    renderRows();
    applyComposition(n);
    applyLimits(n);
    validate();
  }

  players.addEventListener("change", onPlayersChange);
  form.addEventListener("input", function (e) { if (list && list.contains(e.target)) validate(); });
  form.addEventListener("change", function (e) {
    if (e.target !== players && (e.target.hasAttribute("data-role") || e.target.hasAttribute("data-role-toggle") || e.target.hasAttribute("data-evil"))) validate();
  });
  form.addEventListener("click", function (e) {
    var remove = e.target.closest("[data-remove]");
    if (remove) {
      readNames();
      names.splice(Number(remove.getAttribute("data-remove")), 1);
      setPlayers(count() - 1);
    }
    if (e.target.closest("[data-add-player]")) {
      readNames();
      if (count() >= Number(players.max)) toast("Maksimal " + players.max + " pemain", "error");
      else setPlayers(count() + 1);
    }
    if (e.target.closest("[data-shuffle]")) {
      readNames();
      var shown = names.slice(0, count());
      for (var i = shown.length - 1; i > 0; i -= 1) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = shown[i]; shown[i] = shown[j]; shown[j] = t;
      }
      names = shown.concat(names.slice(count()));
      renderRows();
      validate();
      toast("Urutan reveal diacak", "info");
    }
  });
  if (start) {
    start.addEventListener("click", function (e) {
      if (start.getAttribute("aria-disabled") === "true") e.preventDefault();
    });
  }
  // Nothing is submitted from this prototype; Enter must not reload the page.
  form.addEventListener("submit", function (e) { e.preventDefault(); });

  // Category sheet summary (Impostor): "Semua kategori" or "N kategori".
  var catSummary = document.querySelector("[data-category-summary]");
  var catBoxes = document.querySelectorAll("[data-category-option]");
  function syncCategories() {
    if (!catSummary) return;
    var on = Array.prototype.filter.call(catBoxes, function (b) { return b.checked; });
    catSummary.textContent = on.length === catBoxes.length ? "Semua kategori, acak" : on.length === 0 ? "Belum ada kategori" : on.length + " kategori";
  }
  catBoxes.forEach(function (b) { b.addEventListener("change", syncCategories); });
  document.querySelectorAll("[data-category-all]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var all = btn.getAttribute("data-category-all") === "on";
      catBoxes.forEach(function (b) { b.checked = all; });
      syncCategories();
    });
  });

  renderRows();
  applyLimits(count());
  validate();
  syncCategories();
})();
