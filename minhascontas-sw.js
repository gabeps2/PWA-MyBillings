// Define o nome do cache atual, considerando a sua versão.
var cacheName = 'minhascontas-v1.0';

// Armazena todos os arquivos no cache atual
self.addEventListener('install', function (event) {
    caches.open(cacheName).then((cache) => {
        cache.addAll([
            '/',
            '/index.html',
            '/manifest.webmanifest',
            '/styles.css',
            '/script.js',
            '/res/cancel-icon.svg',
            '/res/finish-icon.svg',
            '/res/nothing-to-show.svg',
            '/res/order-icon.svg',
            '/res/plus-icon.svg',
            '/res/icons/icon-48x48.png',
            '/res/icons/icon-72x72.png',
            '/res/icons/icon-96x96.png',
            '/res/icons/icon-128x128.png',
            '/res/icons/icon-144x144.png',
            '/res/icons/icon-152x152.png',
            '/res/icons/icon-192x192.png',
            '/res/icons/icon-384x384.png',
            '/res/icons/icon-512x512.png',
        ]);
    });
});


// Recupera todos os nomes de cache e apaga aqueles
// que forem diferentes do cache atual
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== cacheName) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});


// Tenta servir o arquivo do cache atual. Se não for possível,
// baixa o recurso da web e o armazena localmente, antes de entregar
// uma cópia para o usuário.
self.addEventListener('fetch', function (event) {
    let resposta = caches.open(cacheName).then((cache) => {
        return cache.match(event.request).then((recurso) => {
            if (recurso) return recurso;
            return fetch(event.request).then((recurso) => {
                cache.put(event.request, recurso.clone());
                return recurso;
            });
        });
    });
    event.respondWith(resposta);
}); 
