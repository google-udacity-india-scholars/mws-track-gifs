let static_cache = 'static-v1';

const static_assets = [
  '/',
  'index.html',
  'categories.html',
  'category.html',
  'favorites.html',
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
  '/js/idb.js'
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
   return self.clients.claim();
 });

 /**
  *
  * @description Intercept fetch request
  * @author Sourya
  */
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request)
      .then(response => {
        if (response){
          return response;
        } else {
          return fetch(event.request)
          .then(response => {
            return response;
          })
        }
      })
    )
  });
