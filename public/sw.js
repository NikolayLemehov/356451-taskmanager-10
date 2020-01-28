const CACHE_PREFIX = `taskmanager-cache`;
const CACHE_VER = `v1`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          `/`,
          `/index.html`,
          `/bundle.js`,
          `/css/normalize.css`,
          `/css/style.css`,
          `/fonts/HelveticaNeueCyr-Bold.woff`,
          `/fonts/HelveticaNeueCyr-Bold.woff2`,
          `/fonts/HelveticaNeueCyr-Medium.woff`,
          `/fonts/HelveticaNeueCyr-Medium.woff2`,
          `/fonts/HelveticaNeueCyr-Roman.woff`,
          `/fonts/HelveticaNeueCyr-Roman.woff2`,
          `/img/add-photo.svg`,
          `/img/close.svg`,
          `/img/sample-img.jpg`,
          `/img/wave.svg`,
        ]);
      })
  );
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys
      .reduce((acc, key) => {
        if (key.indexOf(CACHE_PREFIX) === 0 && key !== CACHE_NAME) {
          acc.push(caches.delete(key));
        }
        return acc;
      }, []))));
});

self.addEventListener(`fetch`, (evt) => {
  const {request} = evt;

  evt.respondWith(caches.match(request)
    .then((cacheResponse) => cacheResponse ? cacheResponse : fetch(request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type !== `basic`) {
          return response;
        }
        const cloneResponse = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => cache.put(request, cloneResponse));
        return response;
      })));
});
