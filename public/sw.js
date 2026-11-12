/*
 * Cooch offline shell.
 * The app is a client-side demo: game state and settings live in localStorage,
 * so caching the shell is enough to keep a session running offline.
 */
const CACHE = "cooch-v5";
const PRECACHE = [
  "/",
  "/games",
  "/how-to",
  "/history",
  "/settings",
  "/privacy",
  "/word-bank",
  "/art/bg-waves-sky.svg",
  "/art/bg-waves-night.svg",
  "/art/bg-waves-sun.svg",
  "/art/empty-cards.svg",
  "/art/not-found.svg",
  "/art/games/impostor.svg",
  "/art/games/werewolf.svg",
  "/art/games/spyfall.svg",
  "/art/games/tebak-gaya.svg",
  "/art/games/kuis-tim.svg",
  "/art/games/jujur-berani.svg",
  "/art/games/misi-rahasia.svg",
  "/art/games/tebak-kata-kilat.svg",
  "/art/games/kartu-memori.svg",
  "/art/games/tangkas.svg",
  "/art/games/tiga-sebaris.svg",
  "/art/games/catur.svg",
  "/icon.svg",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigations: try the network, then the exact page, then the cached shell.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
          return response;
        })
        .catch(() =>
          caches.match(request).then((hit) => hit || caches.match("/")),
        ),
    );
    return;
  }

  // Build assets and icons: cache-first, then fill the cache.
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icon") ||
    url.pathname.startsWith("/art/") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".woff2")
  ) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
            return response;
          }),
      ),
    );
  }
});
