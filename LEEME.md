# Invitación Luxury · Plantilla

Plantilla de invitación digital de lujo en HTML, CSS y JavaScript puro, sin dependencias ni compilación. Se abre directo en el navegador o se publica tal cual en GitHub Pages, Netlify o cualquier hosting estático.

```
invitacion-luxury/
├── index.html          ← estructura base (solo se editan las 4 líneas de vista previa)
├── config.js           ← TODO el contenido del cliente
├── css/estilos.css     ← diseño
├── js/arranque.js      ← pide fuentes y foto del sobre desde el primer instante
├── js/ornamentos.js    ← marcos dorados, filigranas, lacre e iconos (SVG generado)
├── js/app.js           ← construcción de la invitación y animaciones
└── assets/
    ├── img/            ← fotos del cliente
    └── musica/         ← canción del cliente
```

## Personalizar para un cliente

Todo vive en **`config.js`**:

| Bloque | Qué controla |
|---|---|
| `orden` | Qué secciones aparecen y en qué orden. Quita una línea para ocultar una sección. |
| `tema.colores` / `tema.fuentes` | Paleta (marfil, oros, tinta, nocturno) y cualquier fuente de Google Fonts. |
| `novios`, `fecha` | Nombres, iniciales del lacre, fecha ISO con zona horaria y ciudad. |
| `portada` | Foto de fondo del sobre, textos, color del sobre, forro, listón y lacre. |
| `hero`, `manifiesto`, `historia`, `interludios` | Narrativa: retrato, texto que se ilumina al hacer scroll (palabras entre `*asteriscos*` salen en dorado), capítulos con fotos, fotos a pantalla completa. |
| `padres`, `cuentaRegresiva`, `eventos`, `itinerario` | Padres y padrinos, calendario con cuenta regresiva, ceremonia/recepción con mapas, programa. |
| `vestimenta`, `galeria`, `regalos`, `hospedaje`, `notas` | Código de vestimenta con paleta, carrusel con visor, mesas de regalo y CLABE con botón copiar, hoteles, indicaciones y hashtag. |
| `rsvp` | Número de WhatsApp, fecha límite, menú y plantilla del mensaje. |
| `musica` | Canción, volumen, segundo de inicio y crédito. |
| `textos` | Todas las etiquetas y botones de la interfaz. |

**Fotos:** pon los archivos en `assets/img/` y usa rutas como `"assets/img/novios.jpg"`. Lo ideal son JPG de 1600 a 2000 px por el lado largo y menos de 400 KB cada uno. Si una foto no carga, se muestra un fondo marfil elegante en su lugar.

**Música:** copia el MP3 en `assets/musica/` y cambia `musica.src`. La pista de ejemplo es “Canon in D Major” de Kevin MacLeod, con licencia CC BY 3.0: si la usas, deja el crédito en `musica.credito`. Por políticas de los navegadores, la música empieza cuando el invitado toca el sello, y se puede pausar con el botón dorado.

## Enlaces personalizados por invitado

```
https://tusitio.com/boda/?c=FH01                         → busca el código en invitados.lista
https://tusitio.com/boda/?invitado=Familia%20Ruiz&pases=3  → nombre y pases directos
https://tusitio.com/boda/#sin-portada                      → salta el sobre (útil para revisar)
https://tusitio.com/boda/#con-portada                      → fuerza el sobre aunque ya se haya abierto
```

**Sobre recordado:** cuando un invitado abre el sobre, el dispositivo lo recuerda durante `portada.recordarHoras` (24 h por defecto). En ese plazo entra directo a la invitación, sin la animación; al vencer, el sobre vuelve a aparecer. Con `0` se muestra siempre. La música empieza con su primer toque en la página.

El nombre aparece en la portada, en el formulario de confirmación y en el número de lugares reservados. El selector de personas se limita a los pases.

## Vista previa al compartir (WhatsApp, Facebook)

WhatsApp no ejecuta JavaScript, así que el título, la descripción y la imagen de la vista previa son las 4 líneas `<meta>` marcadas con ✏️ en `index.html`. Es lo único que se edita fuera de `config.js`.

## Publicar en GitHub Pages

1. Sube la carpeta completa a un repositorio.
2. En *Settings → Pages*, elige la rama `main` y la carpeta raíz.
3. Comparte `https://usuario.github.io/repositorio/?c=CODIGO`.

## Notas

- Las fotos de ejemplo vienen de Unsplash (licencia libre). Para clientes, usa sus fotos locales: así la carga es más rápida y no dependes de servicios externos.
- La confirmación abre WhatsApp con el mensaje ya escrito; no requiere servidor.
- Funciona en Chrome, Safari (iOS 15 o posterior), Edge y Firefox. Si el dispositivo tiene activado “reducir movimiento”, las animaciones se simplifican de forma automática.

## Rendimiento: fotos y música

Lo que más pesa en la carga son los archivos del cliente, no el código. Antes de publicar:

- **Fotos:** 1600–2000 px por el lado largo (el retrato y las fotos de la historia bastan con 1200 px), en AVIF o WebP, idealmente < 300 KB cada una. Una foto directa del celular pesa 3–6 MB.
- **Música:** MP3 a 128 kbps (o 96 kbps) y recortada a 2–3 minutos con bucle: de ~8 MB baja a ~2–3 MB.
