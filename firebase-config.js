// github/firebase-config.js
import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import { getFirestore } from
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import {
  getMessaging,
  getToken,
  onMessage
} from
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyAsU2pCBgfyM_W7zVQPYkWixp40k_E5u6w",
  authDomain: "turia-3519f.firebaseapp.com",
  projectId: "turia-3519f",
  storageBucket: "turia-3519f.firebasestorage.app",
  messagingSenderId: "257867676656",
  appId: "1:257867676656:web:682be9768e12b5bbbdfb35"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const messaging = getMessaging(app);

const VAPID_KEY =
  "BOlZ_aJbMA_oUQ7R4wXG5xRpKwQVJ0h2n2cIiEcvesbQx56AYRlmEPEuuD18Ol1teMbbpVL9p1BtfFkpmT24BJM";

export async function solicitarPermisoNotificaciones() {
  try {
    if (!("Notification" in window)) {
      throw new Error("Este navegador no soporta notificaciones.");
    }

    if (!("serviceWorker" in navigator)) {
      throw new Error("Este navegador no soporta service workers.");
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("Permiso de notificaciones denegado.");
      return null;
    }

    console.log("Permiso de notificaciones aprobado.");

    const registration = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    if (!token) {
      console.warn("Firebase no devolvió ningún token FCM.");
      return null;
    }

    console.log("Token FCM generado con éxito:", token);
    return token;

  } catch (error) {
    console.error(
      "Error al configurar las notificaciones push:",
      error
    );

    return null;
  }
}

onMessage(messaging, payload => {
  console.log("Notificación en primer plano recibida:", payload);

  const title = payload.notification?.title || "Turia Jugger Club";
  const body = payload.notification?.body || "";

  // Evita usar alert, porque bloquea toda la aplicación.
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body });
  }
});
