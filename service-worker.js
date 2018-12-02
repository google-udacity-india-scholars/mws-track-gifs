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
  '/img/placeholder.png'
];

const static_img_assets = [
  '/img/angry.webp',
  '/img/anniversary.webp',
  '/img/awkward.webp',
  '/img/aww.webp',
  '/img/birthday.webp',
  '/img/bored.webp',
  '/img/bye.webp',
  '/img/cats.webp',
  '/img/cheers.webp',
  '/img/chill out.webp',
  '/img/christmas.webp',
  '/img/clapping.webp',
  '/img/classics.webp',
  '/img/cold.webp',
  '/img/compliments.webp',
  '/img/confused.webp',
  '/img/congratulations.webp',
  '/img/creep.webp',
  '/img/dancing.webp',
  '/img/diwali.webp',
  '/img/dogs.webp',
  '/img/done.webp',
  '/img/eid mubarak.webp',
  '/img/engagement & wedding.webp',
  '/img/excited.webp',
  '/img/excuse me.webp',
  '/img/eye roll.webp',
  '/img/father\'s day.webp',
  '/img/friendship.webp',
  '/img/get well.webp',
  '/img/good luck.webp',
  '/img/good morning.webp',
  '/img/good night.webp',
  '/img/graduation.webp',
  '/img/halloween.webp',
  '/img/high five.webp',
  '/img/hugs.webp',
  '/img/hungry.webp',
  '/img/laughing.webp',
  '/img/loser.webp',
  '/img/love.webp',
  '/img/mind blown.webp',
  '/img/miss you.webp',
  '/img/mother\'s day.webp',
  '/img/nervous.webp',
  '/img/new baby.webp',
  '/img/new year.webp',
  '/img/no.webp',
  '/img/omg.webp',
  '/img/oops.webp',
  '/img/party.webp',
  '/img/please.webp',
  '/img/popcorn.webp',
  '/img/scared.webp',
  '/img/shocked.webp',
  '/img/shrug.webp',
  '/img/sleepy.webp',
  '/img/sorry.webp',
  '/img/stop.webp',
  '/img/sympathy.webp',
  '/img/thank you.webp',
  '/img/thumbs up.webp',
  '/img/valentine\'s day.webp',
  '/img/waiting.webp',
  '/img/what.webp',
  '/img/wink.webp',
  '/img/wow.webp',
  '/img/yes.webp',
  '/img/yikes.webp'
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
        cache.addAll(static_img_assets);
        return cache.addAll(static_assets);
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
