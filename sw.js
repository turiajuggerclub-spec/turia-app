/*
 * Turia Jugger Club - Service Worker
 * PWA + Firebase Cloud Messaging
 */

/* =========================================================
   CONFIGURACIÓN DE FIREBASE PARA EL SERVICE WORKER
   ========================================================= */

importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js"
);

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAsU2pCBgfyM_W7zVQPYkWixp40k_E5u6w",
  authDomain: "turia-3519f.firebaseapp.com",
  projectId: "turia-3519f",
  storageBucket: "turia-3519f.firebasestorage.app",
  messagingSenderId: "257867676656",
  appId: "1:257867676656:web:682be9768e12b5bbbdfb35"
};

let firebaseMessagingReady = false;

try {
  firebase.initializeApp(FIREBASE_CONFIG);

  const messaging = firebase.messaging();

  firebaseMessagingReady = true;

  /*
   * Notificaciones recibidas cuando la aplicación está cerrada
   * o en segundo plano.
   */
  messaging.onBackgroundMessage(payload => {
    console.log(
      "[Turia SW] Notificación recibida en segundo plano:",
      payload
    );

    const notification = payload.notification || {};
    const data = payload.data || {};

    const title =
      notification.title ||
      data.title ||
      "Turia Jugger Club";

    const options = {
      body:
        notification.body ||
        data.body ||
        "Tienes una nueva notificación.",

      icon: "./icons/icon-192.png",
      badge: "./icons/icon-192.png",

      image: notification.image || undefined,

      data: {
        ...data,
        url: data.url || "./index.html"
      },

      tag:
        data.tag ||
        "turia-jugger-notification",

      renotify: true,

      actions: [
        {
          action: "open",
          title: "Abrir aplicación"
        }
      ]
    };

    return self.registration.showNotification(title, options);
  });

} catch (error) {
  console.warn(
    "[Turia SW] Firebase Messaging no se pudo inicializar:",
    error
  );
}


/* =========================================================
   CACHE DE LA PWA
   ========================================================= */

const CACHE_NAME = "turia-jugger-shell-v6";

const PRECACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./app-config.js",
  "./logo.svg",

  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];


/* =========================================================
   INSTALACIÓN
   ========================================================= */

self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(async cache => {
        /*
         *
