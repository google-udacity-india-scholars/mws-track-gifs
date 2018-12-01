let static_cache = 'gify-static-v3';
let dynamic_cache = 'gify-dynamic-v2';

const static_assets = [
  '/',
  'index.html',
  'categories.html',
  'category.html',
  'favorites.html',
  '/css/large.css',
  '/css/medium.css',
  '/css/small.css',
  '/css/style.css',
  '/css/snackbar.css',
  '/js/dbhelper.js',
  '/js/categories.js',
  '/js/category.js',
  '/js/favorites.js',
  '/js/register.js',
  '/js/main.js',
  '/js/snackbar.js',
  '/js/util.js',
  '/js/idb.js',
  '/js/search.js',
  '/icon/favorite-icon.svg',
  '/icon/share-icon.svg',
  '/img/angry.webp',
  '/img/anniversary.webp',
  '/img/awkward.webp',
  '/img/aww.webp',
  '/img/birthday.webp'
];

/**
 *
 * @description Install and Activate Service-worker
 * @author Sourya
 */

self.addEventListener('install', (event) => {
  console.log("Service worker is installing...", event);
  event.waitUntil(
    caches.open(static_cache)
      .then(cache => {
        console.log("Pre-caching static content.");
        cache.addAll(static_assets);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log("Service worker is activating...", event);
  event.waitUntil(
    caches.keys()
      .then(keyList => {
        return Promise.all(keyList.map(key => {
          if (key != static_cache && key != dynamic_cache) {
            console.log("deleting old cache: ", key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

/**
 *
 * @description Function to check if request url is in static_assets
 * @author Sourya
 */

function isInArray(string, array) {
  var cachePath;
  if (string.indexOf(self.origin) === 0) {
    cachePath = string.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
  } else {
    cachePath = string; // store the full request (for CDNs)
  }
  return array.indexOf(cachePath) > -1;
}
/**
 *
 * @description Intercept fetch request
 * @author Sourya
 */
self.addEventListener('fetch', (event) => {
  if (isInArray(event.request.url, static_assets)) { //if url in staticassets, return from static_cache
    event.respondWith(
      caches.match(event.request)
    );
  } else {
    // if url not in static_assets, cache it to dynamic_cache
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          } else {
            return fetch(event.request)
              .then(response => {
                return caches.open(dynamic_cache)
                  .then(cache => {
                    cache.put(event.request, response.clone());
                    return response;
                  })
              })
              .catch(err => {

              })
          }
        })
    )
  }
});
