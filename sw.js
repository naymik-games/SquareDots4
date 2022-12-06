var cacheName = 'Square Dots 4 v1.00';
var filesToCache = [
  '/',
  '/index.html',
  '/game.js',
  '/phaser.min.js',



  '/scenes/preload.js',
  '/scenes/startGame.js',
  '/scenes/selectGame.js',
  '/scenes/preview.js',
  '/scenes/endGame.js',
  // '/scenes/levelBuilder.js',
  '/scenes/UI.js',

  '/assets/fonts/topaz.png',
  '/assets/fonts/topaz.xml',
  '/assets/fonts/mago1.tff',
  '/assets/fonts/mago3.tff',

  '/classes/board.js',
  '/classes/settings.js',
  '/classes/dot.js',

  '/assets/particle.png',
  '/assets/particles.png',


  '/assets/sprites/arow.png',
  '/assets/sprites/blank.png',
  '/assets/sprites/burst.png',
  '/assets/sprites/icons.png',
  '/assets/sprites/dot.png',
  '/assets/sprites/dot2.png',
  '/assets/sprites/dot3.png',
  '/assets/sprites/gems.png',
  '/assets/sprites/modal.png',
  '/assets/sprites/rover.png',

  //'https://cdn.jsdelivr.net/gh/photonstorm/phaser@3.10.1/dist/phaser.min.js'
];
self.addEventListener('install', function (event) {
  console.log('sw install');
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('sw caching files');
      return cache.addAll(filesToCache);
    }).catch(function (err) {
      console.log(err);
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('sw fetch');
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }).catch(function (error) {
      console.log(error);
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('sw activate');
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('sw removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});