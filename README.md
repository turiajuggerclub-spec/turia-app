# Turia Jugger PWA

Esta carpeta es la capa instalable de Turia Jugger Club. La aplicación y los datos siguen estando en Google Apps Script + Google Sheets.

## 1. Apps Script

Sustituye tu `Code.gs` por el archivo `Code_Admin_PWA.gs` que se entrega aparte, guarda y publica una **nueva versión** de la misma implementación web.

La diferencia importante es que `doGet()` permite que la aplicación se muestre dentro de la PWA de GitHub Pages mediante `XFrameOptionsMode.ALLOWALL`.

## 2. GitHub Pages

1. Crea un repositorio nuevo, por ejemplo `turia-jugger-app`.
2. Si usas GitHub Free, déjalo **Public** para poder usar GitHub Pages gratuitamente.
3. Sube a la raíz del repositorio todo el contenido de esta carpeta, manteniendo la carpeta `icons`.
4. Ve a **Settings > Pages**.
5. En **Build and deployment**, selecciona **Deploy from a branch**.
6. Selecciona la rama **main** y la carpeta **/(root)** y pulsa **Save**.
7. Espera uno o dos minutos. GitHub mostrará una URL similar a `https://usuario.github.io/turia-jugger-app/`.

## 3. Instalar en Android

Abre la URL de GitHub Pages en Chrome normal. La página mostrará un botón **Instalar** cuando Chrome detecte que la PWA cumple los requisitos. También puede aparecer la opción desde el menú de Chrome.

## 4. Instalar en iPhone

Abre la URL de GitHub Pages en Safari y usa **Compartir > Añadir a pantalla de inicio**.

## 5. Si cambia la URL de Apps Script

Edita únicamente `app-config.js` y cambia el valor de `window.TURIA_APP_URL` por la nueva URL `/exec`.

## Nota

El shell de la PWA puede abrirse sin conexión, pero los datos de torneos y disponibilidad necesitan Internet porque siguen viviendo en Google Sheets y Apps Script.
