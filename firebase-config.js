/*
 * Turia Jugger Club - Firebase Configuration
 * Código modular para index.html y la aplicación web.
 */

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import {
  getMessaging,
  getToken,
  deleteToken,
  onMessage,
  isSupported
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging.js";


/* =========================================================
   CONFIGURACIÓN DEL PROYECTO FIREBASE
   ========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyAsU2pCBgfyM_W7zVQPYkWixp40k_E5u6w",
  authDomain: "turia-3519f.firebaseapp.com",
  projectId: "turia-3519f",
  storageBucket: "turia-3519f.firebasestorage.app",
  messagingSenderId: "257867676656",
  appId: "1:257867676656:web:682be9768e12b5bbbdfb35"
};


/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);


/*
 * Clave pública VAPID para Firebase Cloud Messaging.
 */
export const VAPID_KEY =
  "BOlZ_aJbMA_oUQ7R4wXG5xRpKwQVJ0h2n2cIiEcvesbQx56AYRlmEPEuuD18Ol1teMbbpVL9p1BtfFkpmT24BJM";


let messaging = null;


/* =========================================================
   INICIALIZACIÓN DE MESSAGING
   ========================================================= */

async function obtenerMessaging() {
  if (messaging) {
    return messaging;
  }

  const compatible = await isSupported();

  if (!compatible) {
    console.warn(
      "Firebase Messaging no es compatible con este navegador."
    );

    return null;
  }

  const { getMessaging } = await import(
    "https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging.js"
  );

  messaging = getMessaging(app);

  return messaging;
}

export {
  messaging
};


/* =========================================================
   SOLICITAR PERMISO Y OBTENER TOKEN FCM
   ========================================================= */

export async function solicitarPermisoNotificaciones() {
  try {
    if (!("Notification" in window)) {
      throw new Error(
        "Este navegador no soporta notificaciones."
      );
    }

    if (!("serviceWorker" in navigator)) {
      throw new Error(
        "Este navegador no soporta service workers."
      );
    }

    const permission =
      await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn(
        "El usuario ha denegado las notificaciones."
      );

      return null;
    }

    console.log(
      "Permiso de notificaciones aprobado."
    );

    const serviceWorkerRegistration =
      await navigator.serviceWorker.ready;

    const messagingInstance =
      await obtenerMessaging();

    if (!messagingInstance) {
      return null;
    }

    const token = await getToken(
      messagingInstance,
      {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration
      }
    );

    if (!token) {
      console.warn(
        "Firebase no devolvió ningún token FCM."
      );

      return null;
    }

    console.log(
      "Token FCM generado correctamente."
    );

    /*
     * Se guarda temporalmente en el navegador.
     * Más adelante debe guardarse también en Firestore
     * asociado al miembro correspondiente.
     */
    localStorage.setItem(
      "turiaFcmToken",
      token
    );

    return token;

  } catch (error) {
    console.error(
      "Error al configurar las notificaciones push:",
      error
    );

    return null;
  }
}


/* =========================================================
   DESACTIVAR NOTIFICACIONES
   ========================================================= */

export async function desactivarNotificaciones() {
  try {
    const messagingInstance =
      await obtenerMessaging();

    if (messagingInstance) {
      await deleteToken(messagingInstance);
    }

    localStorage.removeItem(
      "turiaFcmToken"
    );

    console.log(
      "Notificaciones desactivadas."
    );

    return true;

  } catch (error) {
    console.error(
      "No se pudieron desactivar las notificaciones:",
      error
    );

    return false;
  }
}


/* =========================================================
   NOTIFICACIONES EN PRIMER PLANO
   ========================================================= */

export async function activarEscuchaNotificaciones() {
  try {
    const messagingInstance =
      await obtenerMessaging();

    if (!messagingInstance) {
      return false;
    }

    onMessage(
      messagingInstance,
      payload => {
        console.log(
          "Notificación recibida en primer plano:",
          payload
        );

        const notification =
          payload.notification || {};

        const title =
          notification.title ||
          "Turia Jugger Club";

        const body =
          notification.body ||
          "Tienes una nueva notificación.";

        /*
         * No usamos alert porque bloquea la aplicación.
         */
        mostrarAvisoEnPantalla(title, body);
      }
    );

    return true;

  } catch (error) {
    console.error(
      "No se pudo activar la escucha de notificaciones:",
      error
    );

    return false;
  }
}


/* =========================================================
   AVISO VISUAL EN PRIMER PLANO
   ========================================================= */

function mostrarAvisoEnPantalla(title, body) {
  const existente =
    document.getElementById(
      "turia-firebase-notification"
    );

  if (existente) {
    existente.remove();
  }

  const aviso = document.createElement("div");

  aviso.id =
    "turia-firebase-notification";

  aviso.style.position = "fixed";
  aviso.style.top = "16px";
  aviso.style.left = "16px";
  aviso.style.right = "16px";
  aviso.style.zIndex = "99999";
  aviso.style.padding = "14px 16px";
  aviso.style.borderRadius = "12px";
  aviso.style.background = "#101010";
  aviso.style.color = "#FFFFFF";
  aviso.style.border = "1px solid #CFA866";
  aviso.style.boxShadow =
    "0 8px 30px rgba(0,0,0,.3)";
  aviso.style.fontFamily =
    "system-ui, sans-serif";
  aviso.style.cursor = "pointer";

  aviso.innerHTML = `
    <strong style="display:block;color:#CFA866;margin-bottom:4px;">
      ${escapeHtml(title)}
    </strong>
    <span>${escapeHtml(body)}</span>
  `;

  aviso.addEventListener("click", () => {
    aviso.remove();
  });

  document.body.appendChild(aviso);

  setTimeout(() => {
    if (aviso.isConnected) {
      aviso.remove();
    }
  }, 8000);
}


/* =========================================================
   ESCAPADO BÁSICO DEL TEXTO DE LA NOTIFICACIÓN
   ========================================================= */

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
