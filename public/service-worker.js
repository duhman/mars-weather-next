const CACHE_NAME = 'mars-weather-v1';
const API_CACHE_NAME = 'mars-weather-api-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.log('Error caching static assets:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== API_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/weather')) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        try {
          // Try network first
          const networkResponse = await fetch(request);
          
          // Cache successful responses
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
          
          return networkResponse;
        } catch (error) {
          // If network fails, try cache
          const cachedResponse = await cache.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Return offline fallback
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Offline - showing cached data',
              data: null,
            }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }
      })
    );
    return;
  }

  // Skip caching for Next.js dev server files
  if (url.pathname.includes('_next/static/webpack/') || 
      url.pathname.includes('_next/static/development/') ||
      url.hostname === 'localhost') {
    event.respondWith(fetch(request));
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(request).then((networkResponse) => {
        // Cache successful responses for static assets (but not in development)
        if (networkResponse.ok && 
            request.method === 'GET' && 
            !url.pathname.includes('webpack') &&
            !url.hostname.includes('localhost')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // Only cache specific file types
            if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico)$/)) {
              cache.put(request, responseToCache);
            }
          });
        }
        
        return networkResponse;
      }).catch(() => {
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/');
        }
        throw new Error('Network request failed');
      });
    })
  );
});

// Background sync for data updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-weather-data') {
    event.waitUntil(syncWeatherData());
  }
});

async function syncWeatherData() {
  try {
    const response = await fetch('/api/weather');
    const data = await response.json();
    
    // Cache the updated data
    const cache = await caches.open(API_CACHE_NAME);
    await cache.put('/api/weather', new Response(JSON.stringify(data)));
    
    // Notify clients of update
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'WEATHER_UPDATED',
        data: data,
      });
    });
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}