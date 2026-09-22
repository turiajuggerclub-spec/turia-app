// firebase-config.js
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

// Clave VAPID Pública proporcionada
const VAPID_KEY = "BOlZ_aJbMA_oUQ7R4wXG5xRpKwQVJ0h2n2cIiEcvesbQx56AYRlmEPEuuD18Ol1teMbbpVL9p1BtfFkpmT24BJM";

/**
 * Solicita permisos de notificación y obtiene el Token vinculando tu sw.js actual
 */
export async function solicitarPermisoNotificaciones() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Permiso de notificaciones concedido.");
      
      // Esperamos a que tu Service Worker actual esté listo en el navegador
      const registration = await navigator.serviceWorker.ready;
      
      // Obtenemos el token forzando el uso de tu sw.js
      const token = await getToken(messaging, { 
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration 
      });
      
      if (token) {
        console.log("Token FCM generado con éxito:", token);
        return token; // Guarda este token en Firestore bajo el perfil del jugador
      } else {
        console.log("No se pudo obtener el token de notificación.");
      }
    } else {
      console.warn("El usuario denegó el permiso de notificaciones.");
    }
  } catch (error) {
    console.error("Error al configurar las notificaciones push:", error);
  }
}

// Escuchar notificaciones cuando el usuario tiene la APP ABIERTA en pantalla
onMessage(messaging, (payload) => {
  console.log("Notificación recibida en primer plano: ", payload);
  // Opcional: Mostrar un aviso visual personalizado dentro de la interfaz web
  alert(`[${payload.notification.title}]: ${payload.notification.body}`);
});
// firebase-config.js
// Archivo de configuración integrado con Firebase Firestore y Cloud Messaging (Notificaciones Push)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, doc, updateDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging.js";

// Configuración de tu aplicación web en Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAsU2pCBgfyM_W7zVQPYkWixp40k_E5u6w",
  authDomain: "turia-3519f.firebaseapp.com",
  projectId: "turia-3519f",
  storageBucket: "turia-3519f.firebasestorage.app",
  messagingSenderId: "257867676656",
  appId: "1:257867676656:web:682be9768e12b5bbbdfb35"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios principales
export const db = getFirestore(app);
export const messaging = getMessaging(app);

// Clave VAPID pública proporcionada para activar las notificaciones push
const VAPID_KEY = "BOlZ_aJbMA_oUQ7R4wXG5xRpKwQVJ0h2n2cIiEcvesbQx56AYRlmEPEuuD18Ol1teMbbpVL9p1BtfFkpmT24BJM";

/**
 * Solicita los permisos de notificación al usuario y obtiene el Token del dispositivo
 */
export async function solicitarPermisoNotificaciones() {
  try {
    const permiso = await Notification.requestPermission();
    if (permiso === "granted") {
      console.log("Permiso de notificaciones concedido.");
      
      // Obtener el token de registro pasando la clave VAPID obligatoria
      const tokenActual = await getToken(messaging, { vapidKey: VAPID_KEY });
      
      if (tokenActual) {
        console.log("Token de notificación generado con éxito:", tokenActual);
        return tokenActual;
      } else {
        console.warn("No se pudo obtener ningún token de registro disponible. Asegúrate de tener un Service Worker activo.");
      }
    } else {
      console.error("El usuario rechazó los permisos para recibir notificaciones.");
    }
  } catch (error) {
    console.error("Ocurrió un error al intentar gestionar las notificaciones push:", error);
  }
}

/**
 * Escucha notificaciones en primer plano cuando la aplicación web está abierta
 */
onMessage(messaging, (payload) => {
  console.log("Notificación recibida en primer plano: ", payload);
  // Aquí puedes ejecutar lógica personalizada, como alertas visuales en tu HTML
});
