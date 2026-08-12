// Service worker ResitLog — cache shell app asas (Fasa 6, J. PWA dan pemasangan).
// Strategi: rangkaian dahulu untuk navigasi (data sentiasa terkini bila online),
// jatuh balik ke cache bila luar talian. Aset statik: cache dahulu, kemas kini latar.

const NAMA_CACHE = "resitlog-shell-v1";
const SHELL = ["/utama", "/manifest.webmanifest", "/ikon/icon-192.png", "/ikon/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(NAMA_CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((kunci) => Promise.all(kunci.filter((k) => k !== NAMA_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match(request).then((r) => r ?? caches.match("/utama"))),
    );
    return;
  }

  const url = new URL(request.url);
  if (url.origin === self.location.origin && url.pathname.startsWith("/ikon/")) {
    event.respondWith(
      caches.match(request).then(
        (cache) =>
          cache ??
          fetch(request).then((res) => {
            const salinan = res.clone();
            caches.open(NAMA_CACHE).then((c) => c.put(request, salinan));
            return res;
          }),
      ),
    );
  }
});
