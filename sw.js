const CACHE = "trainfor-v34";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=1.3.6",
  "./app.js?v=1.3.6",
  "./manifest.webmanifest?v=1.3.6",
  "./sw.js"
];
const INDEX_URL = new URL("./index.html", self.registration.scope).href;
const CORE_URLS = new Set(ASSETS.map(path => new URL(path, self.registration.scope).href));

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(
        ASSETS.map(path => new Request(new URL(path, self.registration.scope).href, { cache: "reload" }))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("message", event => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => (key.startsWith("mountain-beast-") || key.startsWith("trainfor-")) && key !== CACHE)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request, fallbackUrl = request.url) {
  try {
    const response = await fetch(request, { cache: "no-store" });
    if (response.ok) {
      const cache = await caches.open(CACHE);
      await cache.put(fallbackUrl, response.clone());
    }
    return response;
  } catch {
    return (await caches.match(fallbackUrl)) || Response.error();
  }
}

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(event.request, INDEX_URL));
    return;
  }

  if (CORE_URLS.has(url.href)) {
    event.respondWith(networkFirst(event.request));
  }
});
