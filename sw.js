/*
 * Turia Jugger Club
 * Service Worker
 *
 * Funciones:
 * - Instalación y activación de la PWA.
 * - Caché de archivos principales.
 * - Firebase Cloud Messaging en segundo plano.
 * - Apertura de la aplicación al pulsar una notificación.
 *
 * IMPORTANTE:
 * Este service worker NO importa firebase-config.js con importScripts().
 * La configuración de Firebase está definida directamente en este archivo.
 */

/* =========================================================
   1. CARGA DE FIREBASE PARA SERVICE WORKER
   =========================================================
   Este service worker es clásico, por eso se utiliza la variante
   compat de Firebase mediante importScripts().
*/

importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js"
);


/* =========================================================
   2. CONFIGURACIÓN DE FIREBASE
   =========================================================
   Sustituye únicamente estos valores si tu proyecto Firebase
   utiliza otros datos.

   Los valores de configuración web de Firebase y la clave VAPID
   pública no son secretos. No incluyas aquí claves privadas de
   cuentas de servicio.
*/

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAsU2pCBgfyM_W7zVQPYkWixp40k_E5u6w",

  // Debe ser el dominio real de Firebase Authentication.
  // El valor que tenías antes, "://firebaseapp.com", era incorrecto.
  authDomain: "turia-3519f.firebaseapp.com",

  projectId: "turia-3519f",

  storageBucket: "turia-3519f.fireba
