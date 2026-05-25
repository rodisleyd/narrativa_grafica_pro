const CACHE_NAME = "narrativa-grafica-pro-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

// Install Event
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event (Stale-While-Revalidate)
self.addEventListener("fetch", (e) => {
  // Ignorar requisições de API, desenvolvimento HMR ou externas
  if (
    e.request.method !== "GET" || 
    e.request.url.includes("/api/") || 
    e.request.url.includes("/@vite") ||
    e.request.url.includes("/src/") ||
    !e.request.url.startsWith(self.location.origin)
  ) {
    return;
  }

  e.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(e.request).then((cachedResponse) => {
        const fetchedResponse = fetch(e.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            cache.put(e.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          if (e.request.mode === "navigate") {
            return cache.match("/");
          }
        });

        return cachedResponse || fetchedResponse;
      });
    })
  );
});
