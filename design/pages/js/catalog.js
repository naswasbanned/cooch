/* catalog.js - filters the static game grid on games.html. In Next.js this list comes
   from the game registry; the data-* attributes mirror the module metadata contract.
   Card hooks: data-name, data-tags (space-separated), data-min, data-max, data-minutes, data-level.
   Controls: [data-filter-search], [data-filter-cat] chip group, [data-filter-players],
             [data-filter-duration], [data-filter-level], [data-filter-count], [data-filter-empty],
             [data-filter-reset], [data-filter-active] (number of active sheet filters).
             URL ?kategori=<tag> preselects a chip. */
(function () {
  var grid = document.querySelector("[data-catalog]");
  if (!grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-name]"));
  var search = document.querySelector("[data-filter-search]");
  var cats = document.querySelector("[data-filter-cat]");
  var players = document.querySelector("[data-filter-players]");
  var duration = document.querySelector("[data-filter-duration]");
  var level = document.querySelector("[data-filter-level]");
  var count = document.querySelector("[data-filter-count]");
  var empty = document.querySelector("[data-filter-empty]");
  var active = document.querySelectorAll("[data-filter-active]");

  function activeCat() {
    var on = cats && cats.querySelector('[aria-pressed="true"]');
    return on ? on.getAttribute("data-value") : "semua";
  }

  function matches(card) {
    var q = search ? search.value.trim().toLowerCase() : "";
    var cat = activeCat();
    var p = players ? Number(players.value) : 0;
    var d = duration ? Number(duration.value) : 0;
    var l = level ? level.value : "";
    if (q && card.getAttribute("data-name").toLowerCase().indexOf(q) === -1) return false;
    if (cat !== "semua" && (" " + card.getAttribute("data-tags") + " ").indexOf(" " + cat + " ") === -1) return false;
    if (p && (p < Number(card.getAttribute("data-min")) || p > Number(card.getAttribute("data-max")))) return false;
    if (d && Number(card.getAttribute("data-minutes")) > d) return false;
    if (l && card.getAttribute("data-level") !== l) return false;
    return true;
  }

  function apply() {
    var shown = 0;
    cards.forEach(function (card) {
      var ok = matches(card);
      card.hidden = !ok;
      if (ok) shown += 1;
    });
    if (count) count.textContent = shown + " game";
    if (empty) empty.hidden = shown > 0;
    grid.hidden = shown === 0;
    var n = [players, duration, level].filter(function (sel) { return sel && sel.value; }).length;
    active.forEach(function (el) { el.textContent = n; el.hidden = n === 0; });
  }

  function reset() {
    if (search) search.value = "";
    [players, duration, level].forEach(function (s) { if (s) s.selectedIndex = 0; });
    if (cats) cats.querySelectorAll(".chip").forEach(function (c, i) { c.setAttribute("aria-pressed", String(i === 0)); });
    apply();
  }

  var preset = new URLSearchParams(location.search).get("kategori");
  if (preset && cats) {
    var target = cats.querySelector('[data-value="' + CSS.escape(preset) + '"]');
    if (target) cats.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c === target)); });
  }

  if (search) search.addEventListener("input", apply);
  if (cats) cats.addEventListener("chipchange", apply);
  [players, duration, level].forEach(function (s) { if (s) s.addEventListener("change", apply); });
  document.querySelectorAll("[data-filter-reset]").forEach(function (b) { b.addEventListener("click", reset); });
  apply();
})();
