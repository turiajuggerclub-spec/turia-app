// github/firebase-config.js
import { initializeApp } from "https://gstatic.com";
import { getFirestore } from "https://gstatic.com";
import { getMessaging, getToken, onMessage } from "https://gstatic.com";

const firebaseConfig = {
  apiKey: "AIzaSyAsU2pCBgfyM_W7zVQPYkWixp40k_E5u6w",
  authDomain: "://firebaseapp.com",
  projectId: "turia-3519f",
  storageBucket: "turia-3519f.firebasestorage.app",
  messagingSenderId: "257867676656",
  appId: "1:257867676656:web:682be9768e12b5bbbdfb35"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const messaging = getMessaging(app);

// Tu clave VAPID pública proporcionada para firmar los mensajes push
const VAPID_KEY = "BOlZ_aJbMA_oUQ7R4wXG5xRpKwQVJ0h2n2cIiEcvesbQx56AYRlmEPEuuD18Ol1teMbbpVL9p1BtfFkpmT24BJM";

/**
 * Solicita permiso al usuario y obtiene el Token de FCM vinculando tu sw.js
 */
export async function solicitarPermisoNotificaciones() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Permiso de notificaciones aprobado.");
      
      // Vincula de forma segura el service worker integrado que tienes en la raíz
      const registration = await navigator.serviceWorker.ready;
      
      const token = await getToken(messaging, { 
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration 
      });
      
      if (token) {
        console.log("Token FCM generado con éxito:", token);
        return token;
      }
    } else {
      console.warn("Permiso de notificaciones denegado por el usuario.");
    }
  } catch (error) {
    console.error("Error al configurar las notificaciones push:", error);
  }
}

// Escucha activa cuando el usuario tiene la app abierta
onMessage(messaging, (payload) => {
  console.log("Notificación en primer plano recibida: ", payload);
  if (payload.notification) {
    alert(`[${payload.notification.title}]: ${payload.notification.body}`);
  }
});
