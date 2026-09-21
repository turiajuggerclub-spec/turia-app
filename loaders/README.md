# Imágenes de carga de Turia Jugger

La app busca automáticamente una imagen personalizada al iniciar sesión.

## Imagen personalizada de un jugador

Sube aquí un archivo con el nombre del jugador normalizado seguido de `-loader`.

Ejemplos:

- `Antoñico` -> `antonico-loader.png`
- `Silvia` -> `silvia-loader.webp`
- `María José` -> `maria-jose-loader.gif`

También puedes usar el ID del miembro en lugar del nombre. Por ejemplo, si su ID es `M003`:

- `m003-loader.png`

Usar el ID es más estable si el jugador cambia su nombre en el perfil.

La app prueba estas extensiones: `.webp`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`.

## Imagen por defecto

`default-loader.svg` es el murciélago actual.

Para cambiar el cargador general de todos los usuarios que NO tengan imagen personalizada, basta con subir por ejemplo:

- `default-loader.png`

No hace falta borrar el SVG: PNG se prueba antes que SVG y tendrá prioridad.

Si borras todos los `default-loader.*`, la app seguirá mostrando el murciélago incrustado en `Index.html` como respaldo.
