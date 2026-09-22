// github/sw.js - AÑADIR EN LA LÍNEA 1

// 1. Importar librerías de compatibilidad del CDN de Google Firebase
importScripts('https://gstatic.com');
importScripts('https://gstatic.com');

// 2. Inicializar el entorno nativo
firebase.initializeApp({
  apiKey: "AIzaSyAsU2pCBgfyM_W7zVQPYkWixp40k_E5u6w",
  authDomain: "://firebaseapp.com",
  projectId: "turia-3519f",
  storageBucket: "turia-3519f.firebasestorage.app",
  messagingSenderId: "257867676656",
  appId: "1:257867676656:web:682be9768e12b5bbbdfb35"
});

// 3. Inicializar el interceptor de mensajería en segundo plano
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Alerta push recibida en segundo plano: ', payload);

  const title = payload.notification?.title || "Turia Jugger Club";
  const options = {
    body: payload.notification?.body || "Tienes una actualización del equipo.",
    icon: './icons/icon-192.png', // Usa tus iconos declarados en el repositorio
    badge: './icons/icon-192.png',
    data: payload.data
  };

  self.registration.showNotification(title, options);
});

// ===================================================
// TU CÓDIGO ACTUAL DE CACHÉ PWA CONTINÚA DEBAJO AQUÍ
// ===================================================
// github/sw.js - AÑADIR EN LA LÍNEA 1

// 1. Importar librerías de compatibilidad del CDN de Google Firebase
importScripts('https://gstatic.com');
importScripts('https://gstatic.com');

// 2. Inicializar el entorno nativo
firebase.initializeApp({
  apiKey: "AIzaSyAsU2pCBgfyM_W7zVQPYkWixp40k_E5u6w",
  authDomain: "://firebaseapp.com",
  projectId: "turia-3519f",
  storageBucket: "turia-3519f.firebasestorage.app",
  messagingSenderId: "257867676656",
  appId: "1:257867676656:web:682be9768e12b5bbbdfb35"
});

// 3. Inicializar el interceptor de mensajería en segundo plano
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Alerta push recibida en segundo plano: ', payload);

  const title = payload.notification?.title || "Turia Jugger Club";
  const options = {
    body: payload.notification?.body || "Tienes una actualización del equipo.",
    icon: './icons/icon-192.png', // Usa tus iconos declarados en el repositorio
    badge: './icons/icon-192.png',
    data: payload.data
  };

  self.registration.showNotification(title, options);
});

// ===================================================
// TU CÓDIGO ACTUAL DE CACHÉ PWA CONTINÚA DEBAJO AQUÍ
// ===================================================
// sw.js - Añadir al inicio del archivo

// 1. Importar los scripts de compatibilidad de Firebase
importScripts('https://gstatic.com');
importScripts('https://gstatic.com');

// 2. Inicializar Firebase dentro del Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyAsU2pCBgfyM_W7zVQPYkWixp40k_E5u6w",
  authDomain: "://firebaseapp.com",
  projectId: "turia-3519f",
  storageBucket: "turia-3519f.firebasestorage.app",
  messagingSenderId: "257867676656",
  appId: "1:257867676656:web:682be9768e12b5bbbdfb35"
});

// 3. Inicializar el motor de mensajería en segundo plano
const messaging = firebase.messaging();

// 4. Capturar y gestionar la visualización de la alerta push en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Notificación en segundo plano recibida: ', payload);

  const notificationTitle = payload.notification.title || "Aviso Turia Jugger Club";
  const notificationOptions = {
    body: payload.notification.body || "Tienes una nueva actualización.",
    icon: payload.notification.icon || './icons/icon-192x192.png', // Ajusta la ruta a tus iconos si varía
    badge: './icons/icon-72x72.png',
    data: payload.data // Permite enviar datos extra (como el ID de un torneo)
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// ==========================================
// TU CÓDIGO PREVIO DE CACHÉ PWA COMIENZA AQUÍ
// ==========================================
// self.addEventListener('install', ... )
