const cacheName = 'v1';

const cacheAssests = [
    '/',
    '/static/css/styles.css',
    '/static/css/book.css',
    '/static/images/bg.jpg',
    '/static/js/main.js',
    '/login/',
    '/book/',
    '/static/images/favicon/android-icon-144x144.png',
    '/static/images/favicon/android-icon-192x192.png',
    '/register/',
    '/search/',
    '/404/',
    '/static/js/jquery.star-rating-svg.js',
    '/static/js/css/jquery.star-rating-svg.css',
    'https://fonts.googleapis.com/css?family=Lato|Lora'

]

// Call Install Event 

self.addEventListener('install', (e) => {
    console.log('Service Worker : Install')
    e.waitUntil(
        caches
        .open(cacheName)
        .then(cache => {
            console.log('Service Worker: Caching Files');
            cache.addAll(cacheAssests);
        })
        .then(() => self.skipWaiting())
    )
})


self.addEventListener('activate', (e) => {
    console.log('Service Worker : Activate')
    // Remove unwanted Caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log('Service Worker Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
})

//Calling Fetch Event 

self.addEventListener('fetch', e => {
    console.log('Service worker Fetching ');
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    )
})