/*var cacheName = 'gasta-sw-V4';

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(cacheName)
			.then(cache => cache.addAll([
				'/'
			]))
	);
});

self.addEventListener('message', function (event) {
	if (event.data.action === 'skipWaiting') {
		self.skipWaiting();
	}
});

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request)
			.then(function (response) {
				if (response) {
					return response;
				}
				return fetch(event.request);
			})
	);
});*/



var CACHE = 'gasta-sw-V5';

self.addEventListener('install', function (evt) {
	evt.waitUntil(precache());
});

self.addEventListener('fetch', function (evt) {
	evt.respondWith(fromCache(evt.request));
	evt.waitUntil(update(evt.request));
});

self.addEventListener('message', function (event) {
	if (event.data.action === 'skipWaiting') {
		self.skipWaiting();
	}
});

function precache() {
	return caches.open(CACHE).then(function (cache) {
		return cache.addAll([
			'/'
		]);
	});
}

function fromCache(request) {
	return caches.open(CACHE).then(function (cache) {
		return cache.match(request).then(function (matching) {
			return matching || Promise.reject('no-match');
		});
	});
}

function update(request) {
	return caches.open(CACHE).then(function (cache) {
		return fetch(request).then(function (response) {
			return cache.put(request, response);
		});
	});
}