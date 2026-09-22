/*
 * Turia Jugger Club - Service Worker
 *
 * Incluye:
 * - Instalación del Service Worker.
 * - Activación y limpieza de cachés antiguas.
 * - Caché de los archivos principales de la PWA.
 * - Firebase Cloud Messaging en segundo plano.
 * - Apertura de la aplicación al pulsar una notificación.
 *
 * IMPORTANTE:
 * Este archivo NO importa firebase-config.js.
 * firebase-config.js utiliza módulos ES y no puede cargarse
 * con importScripts() desde este Service Worker clásico.
 */


/* =========================================================
   1. FIREBASE CLOUD MESSAGING
   ========================================================= */

importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js"
);


/*
 * Configuración del proyecto Firebase.
 *
 * Sustituye estos valores solamente si tu proyecto Firebase
 * utiliza una configuración diferente.
 */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAsU2pCBgfyM_W7zVQPYkWixp40k_E5u6w",
  authDomain: "turia-3519f.firebaseapp.com",
  projectId: "turia-3519f",
  storageBucket: "turia-3519f.firebasestorage.app",
  messagingSenderId: "257867676656",
  appId: "1:257867676656:web:682be9768e12b5bbbdfb35"
};


try {
  firebase.initializeApp(FIREBASE_CONFIG);

  const messaging = firebase.messaging();

  /*
   * Recibe mensajes cuando la aplicación está cerrada
   * o funcionando en segundo plano.
   */
  messaging.onBackgroundMessage(payload => {
    console.log(
      "[Turia SW] Notificación recibida en segundo plano:",
      payload
    );

    const notification =
      payload.notification || {};

    const data =
      payload.data || {};

    const title =
      notification.title ||
      data.title ||
      "Turia Jugger Club";

    const body =
      notification.body ||
      data.body ||
      "Tienes una nueva notificación.";

    /*
     * Estas rutas presuponen que los iconos están en:
     *
     * /icons/icon-192.png
     * /icons/icon-512.png
     * /icons/icon-maskable-512.png
     * /icons/apple-touch-icon.png
     */
    const icon =
      notification.icon ||
      data.icon ||
      "./icons/icon-192.png";

    const badge =
      notification.badge ||
      data.badge ||
      "./icons/icon-192.png";

    /*
     * URL que se abrirá al pulsar la notificación.
     * Puede enviarse desde Firebase dentro de data.url.
     */
    const targetUrl =
      data.url ||
      "./index.html";

    const options = {
      body,
      icon,
      badge,

      data: {
        ...data,
        url: targetUrl
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

    if (notification.image) {
      options.image = notification.image;
    }

    return self.registration.showNotification(
      title,
      options
    );
  });

} catch (error) {
  console.error(
    "[Turia SW] Error al inicializar Firebase Messaging:",
    error
  );
}


/* =========================================================
   2. CONFIGURACIÓN DE CACHÉ
   =========================================================
   IMPORTANTE:

   Cada vez que publiques cambios importantes en la PWA,
   cambia el número final:

   v5-18 → v5-19
   v5-19 → v5-20

   Esto obliga al navegador a crear una caché nueva.
   */

const CACHE_NAME =
  "turia-jugger-shell-v5-19";


/*
 * Archivos que se guardan durante la instalación.
 *
 * Si alguno de estos archivos tiene otra ruta o nombre,
 * debes cambiarlo aquí.
 */
const PRECACHE_FILES = [
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
   3. INSTALACIÓN
   ========================================================= */

self.addEventListener(
  "install",
  event => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(async cache => {
          /*
           * Se añaden los recursos individualmente.
           * Así, si falta un archivo, no se rompe toda
           * la instalación del Service Worker.
           */
          for (const file of PRECACHE_FILES) {
            try {
              await cache.add(file);

              console.log(
                "[Turia SW] Recurso guardado en caché:",
                file
              );

            } catch (error) {
              console.warn(
                "[Turia SW] No se pudo guardar:",
                file,
                error
              );
            }
          }
        })
        .then(() => {
          return self.skipWaiting();
        })
    );
  }
);


/* =========================================================
   4. ACTIVACIÓN Y LIMPIEZA DE CACHÉS ANTIGUAS
   ========================================================= */

self.addEventListener(
  "activate",
  event => {
    event.waitUntil(
      caches.keys()
        .then(cacheNames => {
          return Promise.all(
            cacheNames
              .filter(cacheName => {
                return (
                  cacheName.startsWith(
                    "turia-jugger-shell-"
                  ) &&
                  cacheName !== CACHE_NAME
                );
              })
              .map(cacheName => {
                console.log(
                  "[Turia SW] Eliminando caché antigua:",
                  cacheName
                );

                return caches.delete(cacheName);
              })
          );
        })
        .then(() => {
          return self.clients.claim();
        })
    );
  }
);


/* =========================================================
   5. PETICIONES Y CACHÉ
   ========================================================= */

self.addEventListener(
  "fetch",
  event => {
    const request = event.request;
    const url = new URL(request.url);

    /*
     * Solo interceptamos archivos del mismo dominio
     * que la PWA.
     *
     * No interceptamos:
     * - Google Apps Script.
     * - Firebase.
     * - APIs externas.
     * - CDN de Firebase.
     */
    if (
      url.origin !== self.location.origin
    ) {
      return;
    }

    const isNavigation =
      request.mode === "navigate";

    const isLauncherFile =
      url.pathname.endsWith("/index.html") ||
      url.pathname.endsWith("/app-config.js") ||
      url.pathname.endsWith("/manifest.webmanifest");

    /*
     * Para index.html y archivos de configuración:
     * primero se intenta obtener la versión online.
     * Si falla, se utiliza la caché.
     */
    if (
      isNavigation ||
      isLauncherFile
    ) {
      event.respondWith(
        fetch(request)
          .then(response => {
            if (
              response &&
              response.ok
            ) {
              const responseCopy =
                response.clone();

              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(
                    request,
                    responseCopy
                  );
                });
            }

            return response;
          })
          .catch(() => {
            return caches.match(request)
              .then(cachedResponse => {
                return (
                  cachedResponse ||
                  caches.match("./index.html")
                );
              });
          })
      );

      return;
    }

    /*
     * Para imágenes, SVG y demás recursos:
     * primero caché y después red.
     */
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request)
            .then(response => {
              if (
                !response ||
                response.status !== 200
              ) {
                return response;
              }

              const responseCopy =
                response.clone();

              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(
                    request,
                    responseCopy
                  );
                });

              return response;
            })
            .catch(() => {
              return new Response(
                "",
                {
                  status: 503,
                  statusText: "Sin conexión"
                }
              );
            });
        })
    );
  }
);


/* =========================================================
   6. CLIC EN UNA NOTIFICACIÓN
   ========================================================= */

self.addEventListener(
  "notificationclick",
  event => {
    event.notification.close();

    const data =
      event.notification.data || {};

    const targetUrl =
      data.url ||
      "./index.html";

    /*
     * La acción "open" es la definida en la notificación.
     * Si no hay acción, también se abre la aplicación.
     */
    if (
      event.action &&
      event.action !== "open"
    ) {
      return;
    }

    event.waitUntil(
      self.clients.matchAll({
        type: "window",
        includeUncontrolled: true
      })
      .then(clientList => {
        /*
         * Si la app ya está abierta, se reutiliza.
         */
        for (const client of clientList) {
          if (
            "navigate" in client &&
            "focus" in client
          ) {
            return client.navigate(
              targetUrl
            )
            .then(() => {
              return client.focus();
            });
          }
        }

        /*
         * Si la app no está abierta,
         * se abre una ventana nueva.
         */
        if (
          self.clients.openWindow
        ) {
          return self.clients.openWindow(
            targetUrl
          );
        }

        return null;
      })
    );
  }
);


/* =========================================================
   7. CIERRE DE UNA NOTIFICACIÓN
   ========================================================= */

self.addEventListener(
  "notificationclose",
  event => {
    console.log(
      "[Turia SW] Notificación cerrada:",
      event.notification.tag
    );
  }
);
