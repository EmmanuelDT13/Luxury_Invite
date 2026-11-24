/* ==========================================================================
   INVITACIÓN LUXURY · Lógica
   Construye toda la invitación a partir de window.INVITACION (config.js).
   No es necesario editar este archivo para personalizar a un cliente.
   ========================================================================== */
(function () {
  "use strict";

  const C = window.INVITACION || {};
  const D = document;
  const $ = (s, el = D) => el.querySelector(s);
  const $$ = (s, el = D) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const REDUCIDO = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  /* ---------------- Datos base ---------------- */
  const COL = Object.assign({
    papel: "#F7F2E9", papelOscuro: "#ECE3D2", tinta: "#3A3026", tintaSuave: "#76695A",
    oroProfundo: "#5C4A28", oro: "#A58C5A", oroClaro: "#C9B07C", oroBrillo: "#E8D9B0", nocturno: "#1E1813"
  }, (C.tema && C.tema.colores) || {});
  const FUENTES = Object.assign({ caligrafica: "Pinyon Script", grabada: "Cinzel", texto: "Cormorant Garamond" }, (C.tema && C.tema.fuentes) || {});
  const T = Object.assign({
    desliza: "Desliza", comoLlegar: "Cómo llegar", waze: "Waze",
    dias: "Días", horas: "Horas", minutos: "Min", segundos: "Seg",
    ellas: "Ellas", ellos: "Ellos", verMesa: "Ver mesa", copiar: "Copiar CLABE", copiado: "Copiado al portapapeles",
    verUbicacion: "Ver ubicación", nombre: "Nombre", nombrePh: "Tu nombre completo", asistencia: "Asistencia",
    si: "Con gusto asistiré", no: "No podré asistir", personas: "Número de personas", menu: "Menú",
    mensaje: "Mensaje para los novios", mensajePh: "Opcional", confirmaAntes: "Confirma antes del",
    faltaNombre: "Escribe tu nombre, por favor", asistenciaSi: "Confirmo con mucho gusto mi asistencia.",
    asistenciaNo: "Lamentablemente no podré asistir.", lugarUno: "Un lugar reservado en su honor",
    lugaresVarios: "{n} lugares reservados en su honor", pase: "pase", pases: "pases",
    sinInvitado: "Nos casamos", googleCal: "Google Calendar", appleCal: "Apple · Outlook",
    musicaOn: "Pausar música", musicaOff: "Activar música", abrir: "Abrir la invitación"
  }, C.textos || {});

  const N = Object.assign({ ella: "", el: "", conector: "&", iniciales: [] }, C.novios || {});
  const INICIALES = (N.iniciales && N.iniciales.length ? N.iniciales : [String(N.ella).charAt(0), String(N.el).charAt(0)]).map(String);
  const ELLA = esc(N.ella), EL = esc(N.el), Y = esc(N.conector || "&");
  const P = C.portada || {};

  // Fecha: se leen los componentes tal cual del ISO para mostrar la hora local del evento
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  function partes(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(iso || "") || [];
    const y = +m[1] || 2030, mo = +m[2] || 1, d = +m[3] || 1;
    return { y, mo, d, h: +m[4] || 0, mi: +m[5] || 0, dow: new Date(Date.UTC(y, mo - 1, d)).getUTCDay() };
  }
  const FI = (C.fecha && C.fecha.iso) || "2030-01-01T17:00:00-06:00";
  const F = partes(FI);
  const pad = (n) => String(n).padStart(2, "0");
  const hexRgb = (h) => { const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})/i.exec(h || "") || [0, "b8", "92", "4a"]; return [1, 2, 3].map((i) => parseInt(m[i], 16)).join(","); };
  const fechaLarga = (p) => `${p.d} de ${MESES[p.mo - 1]} de ${p.y}`;
  const fechaCaps = `${DIAS[F.dow]} · ${F.d} · ${MESES[F.mo - 1]} · ${F.y}`.toUpperCase();

  /* ---------------- Invitado (parámetros del enlace) ---------------- */
  function leerInvitado() {
    const q = new URLSearchParams(location.search);
    const I = C.invitados || {}, lista = I.lista || {};
    const codigo = (q.get("c") || q.get("codigo") || "").trim();
    let g = null;
    if (codigo) {
      const k = Object.keys(lista).find((k) => k.toLowerCase() === codigo.toLowerCase());
      if (k) g = Object.assign({}, lista[k]);
    }
    const nom = q.get("invitado") || q.get("i");
    if (!g && nom) g = { nombre: nom.slice(0, 90), pases: parseInt(q.get("pases") || q.get("p"), 10) || 0 };
    if (g) return Object.assign({ pases: 0 }, g, { personalizado: true });
    return Object.assign({ nombre: "", pases: 0 }, I.porDefecto || {}, { personalizado: false });
  }
  const G = leerInvitado();

  /* ---------------- Tema: variables CSS, fuentes y filtros SVG ---------------- */
  function aplicarTema() {
    const r = D.documentElement.style;
    const mapa = { papel: "--papel", papelOscuro: "--papel-oscuro", tinta: "--tinta", tintaSuave: "--tinta-suave", oroProfundo: "--oro-profundo", oro: "--oro", oroClaro: "--oro-claro", oroBrillo: "--oro-brillo", nocturno: "--nocturno" };
    Object.keys(mapa).forEach((k) => COL[k] && r.setProperty(mapa[k], COL[k]));
    if (P.colorSobre) r.setProperty("--sobre", P.colorSobre);
    if (P.colorForro) r.setProperty("--forro", P.colorForro);
    if (P.colorListon) r.setProperty("--liston", P.colorListon);
    // Tamaños (1 = diseño original). Las imágenes tienen tope para no romper la cuadrícula.
    const TAM = (C.tema && C.tema.tamanos) || {};
    const num = (v) => (isFinite(+v) && +v > 0 ? +v : 1);
    ["texto", "titulos", "nombres", "etiquetas", "numeros"].forEach((k) => r.setProperty(`--t-${k}`, num(TAM[k])));
    const MAR = TAM.marcos || {};
    ["hero", "capitulos", "videos", "cierre", "galeria", "eventos"].forEach((k) => r.setProperty(`--m-${k}`, num(MAR[k])));
    r.setProperty("--f-script", `"${FUENTES.caligrafica}", cursive`);
    r.setProperty("--f-caps", `"${FUENTES.grabada}", "Times New Roman", serif`);
    r.setProperty("--f-texto", `"${FUENTES.texto}", Georgia, serif`);

    const cargar = (nombre, ejes) => {
      const fam = nombre.trim().replace(/\s+/g, "+");
      const l = D.createElement("link");
      l.rel = "stylesheet";
      l.href = `https://fonts.googleapis.com/css2?family=${fam}${ejes ? ":" + ejes : ""}&display=swap`;
      if (ejes) l.onerror = () => { l.onerror = null; l.href = `https://fonts.googleapis.com/css2?family=${fam}&display=swap`; };
      D.head.appendChild(l);
    };
    // Normalmente js/arranque.js ya pidió las fuentes desde el <head>; esto es solo un respaldo
    if (!$('link[data-fuentes]')) {
      cargar(FUENTES.caligrafica);
      cargar(FUENTES.grabada, "wght@400;500");
      cargar(FUENTES.texto, "ital,wght@0,300;0,400;0,600;1,400");
    }

    D.title = `${N.ella} ${N.conector || "&"} ${N.el} · ${(C.hero && C.hero.titulo) || "Nos casamos"}`;
    const tc = $('meta[name="theme-color"]'); if (tc) tc.content = COL.papel;
    D.body.insertAdjacentHTML("afterbegin", ORN.defs(Object.assign({}, COL, { lacre: P.colorLacre || "#A88B56", relieve: (C.tema && C.tema.relieve) || {} })));
    $(".precarga__mono").textContent = INICIALES.join(" · ");
  }

  /* ---------------- Piezas reutilizables ---------------- */
  const ICON = ORN.icon;
  let ESQ_SVG = "";
  const esquinas = () => ["ti", "td"].map((p) => ESQ_SVG.replace('class="esquinero"', `class="esquinero esquinero--${p}"`)).join("");
  const encabezado = (etq, tit, extra) => `
    <header class="encabezado" data-rev>
      ${etq ? `<p class="etiqueta">${esc(etq)}</p>` : ""}
      ${tit ? `<h2 class="titulo script foil escritura">${esc(tit)}</h2>` : ""}
      ${ORN.divider("desplegar")}
      ${extra || ""}
    </header>`;

  /* ==========================================================================
     PORTADA
     ========================================================================== */
  function svgSobre() {
    const S = P.colorSobre || "#EFE7D8";
    const oro = COL.oro;
    const motivo = ORN.crestPaths({ shell: true });
    const patron = `
      <pattern id="s-damasco" patternUnits="userSpaceOnUse" width="56" height="56">
        <rect width="56" height="56" fill="${P.colorForro || "#E7DABF"}"/>
        <g fill="${oro}" opacity=".55">
          <g transform="translate(28 34) scale(.17)">${motivo}</g>
          <g transform="translate(0 6) scale(.17)">${motivo}</g><g transform="translate(56 6) scale(.17)">${motivo}</g>
          <g transform="translate(0 62) scale(.17)">${motivo}</g><g transform="translate(56 62) scale(.17)">${motivo}</g>
        </g>
      </pattern>`;
    const sombraPliegue = `<filter id="s-pliegue" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx="0" dy="0" stdDeviation="1.4" flood-color="#3c280c" flood-opacity=".3"/></filter>`;
    const pieza = (d, grad) => `<g filter="url(#s-pliegue)"><path d="${d}" fill="${S}"/></g><path d="${d}" fill="url(#${grad})"/><path d="${d}" fill="#000" filter="url(#f-grano)"/>`;

    const IZQ = "M0 0 L276 212 Q291 225 276 238 L0 400 Z";
    const DER = "M600 0 L324 212 Q309 225 324 238 L600 400 Z";
    const INF = "M0 400 L266 232 Q300 210 334 232 L600 400 Z";
    const SOL = "M0 0 H600 L327 219 Q300 238 273 219 Z";

    const fondo = `<svg viewBox="0 0 600 400" preserveAspectRatio="none"><defs>${patron}
        <linearGradient id="s-int" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".16"/><stop offset="1" stop-color="#000" stop-opacity=".06"/></linearGradient></defs>
      <rect width="600" height="400" fill="${S}"/><rect width="600" height="400" fill="url(#s-int)"/>
      <rect x="12" y="10" width="576" height="330" fill="url(#s-damasco)"/>
      <rect x="12" y="10" width="576" height="330" fill="url(#s-int)"/></svg>`;

    const bolsa = `<svg viewBox="0 0 600 400" preserveAspectRatio="none"><defs>${sombraPliegue}
        <linearGradient id="s-gi" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#000" stop-opacity=".06"/></linearGradient>
        <linearGradient id="s-gd" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".03"/></linearGradient>
        <linearGradient id="s-gb" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".07"/><stop offset="1" stop-color="#fff" stop-opacity=".22"/></linearGradient></defs>
      ${pieza(IZQ, "s-gi")}${pieza(DER, "s-gd")}${pieza(INF, "s-gb")}
      <path d="M0 400 L266 232 Q300 210 334 232 L600 400" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1.1"/></svg>`;

    const solapa = `<svg viewBox="0 0 600 232" preserveAspectRatio="none"><defs>
        <linearGradient id="s-gs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".7" stop-color="#000" stop-opacity=".0"/><stop offset="1" stop-color="#000" stop-opacity=".07"/></linearGradient></defs>
      <path d="${SOL}" fill="${S}"/><path d="${SOL}" fill="url(#s-gs)"/><path d="${SOL}" fill="#000" filter="url(#f-grano)"/>
      <path d="M0 .5 L273 219 Q300 238 327 219 L600 .5" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.2"/></svg>`;

    const forro = `<svg viewBox="0 0 600 232" preserveAspectRatio="none">
      <path d="${SOL}" fill="${S}"/><path d="${SOL}" fill="#000" fill-opacity=".08"/>
      <path d="M20 8 H580 L322 204 Q300 220 278 204 Z" fill="url(#s-damasco)"/>
      <path d="M20 8 H580 L322 204 Q300 220 278 204 Z" fill="none" stroke="${oro}" stroke-opacity=".5" stroke-width="1"/></svg>`;
    return { fondo, bolsa, solapa, forro };
  }

  function tarjetaInterior() {
    const esq = ORN.corner();
    return `<div class="tarjeta">
      <span class="tarjeta__borde"></span>
      ${["ti", "td", "bi", "bd"].map((p) => `<span class="tarjeta__esq tarjeta__esq--${p}">${esq}</span>`).join("")}
      <div class="tarjeta__contenido">
        <p class="tarjeta__pre">${esc(((C.hero && C.hero.titulo) || "Nos casamos").toUpperCase())}</p>
        <p class="tarjeta__nombres"><span class="foil">${ELLA} <span class="y">${Y}</span> ${EL}</span></p>
        ${ORN.divider()}
        <p class="tarjeta__fecha">${esc(fechaCaps)}</p>
        <p class="tarjeta__ciudad">${esc(C.fecha && C.fecha.ciudad)}</p>
      </div>
    </div>`;
  }

  function construirPortada() {
    const el = $("#portada");
    const s = svgSobre();
    const sello = ORN.seal(INICIALES, FUENTES.grabada);
    const etq = G.personalizado ? P.textoSuperior : (P.textoSinInvitado || T.sinInvitado);
    const nombre = G.personalizado ? esc(G.nombre) : `${ELLA} ${Y} ${EL}`;
    const mostrarPases = G.personalizado && G.pases > 0 && !(C.invitados && C.invitados.mostrarPases === false);
    el.innerHTML = `
      <div class="portada__fondo"></div>
      <div class="portada__sombras"></div>
      <div class="portada__luz"></div>
      <div class="portada__contenido">
        <p class="portada__para">
          <span class="etiqueta">${esc(etq)}</span>
          <span class="portada__nombre">${nombre}</span>
          ${mostrarPases ? `<span class="portada__pases">${G.pases} ${G.pases === 1 ? T.pase : T.pases}</span>` : ""}
        </p>
        <div class="escena">
          <div class="sobre">
            <div class="sobre__sombra"></div>
            <div class="sobre__fondo">${s.fondo}</div>
            <div class="sobre__tarjeta">${tarjetaInterior()}</div>
            <div class="sobre__bolsa">${s.bolsa}</div>
            <div class="sobre__solapa">
              <div class="solapa__cara solapa__exterior">${s.solapa}</div>
              <div class="solapa__cara solapa__forro">${s.forro}</div>
            </div>
            <div class="sobre__brillo"></div>
            <div class="sobre__liston"><i></i><i></i></div>
            <button class="sobre__lacre" type="button" aria-label="${esc(T.abrir)}">
              <span class="lacre__pulso"></span>
              <span class="lacre__entero">${sello}</span>
              <span class="lacre__mitad lacre__mitad--izq">${sello}</span>
              <span class="lacre__mitad lacre__mitad--der">${sello}</span>
            </button>
          </div>
        </div>
        <p class="portada__instruccion"><span>${esc(P.instruccion || "Toca el sello para abrir")}</span></p>
      </div>`;
  }

  /* ==========================================================================
     SECCIONES
     ========================================================================== */
  const S = {};

  S.hero = () => {
    const H = C.hero || {};
    return `
    <section class="seccion hero" id="inicio" data-scrub="pasa">
      ${esquinas()}
      <canvas class="polvo" data-polvo="claro"></canvas>
      <div class="contenedor">
        <p class="etiqueta" data-rev style="--d:.1s">${esc(H.sobreTitulo)}</p>
        <div class="hero__marco${(H.marco || "rectangular") === "oval" ? "" : " hero__marco--rect"}" data-rev="escala" style="--d:.15s">
          <div class="hero__marco-par" data-p>${(H.marco || "rectangular") === "oval"
            ? ORN.frameOval(esc(H.foto), { alt: `${ELLA} y ${EL}`, pos: esc(H.posicionFoto || "50% 30%"), prioridad: true })
            : ORN.framePhoto(esc(H.foto), { variante: "retrato", alt: `${ELLA} y ${EL}`, pos: esc(H.posicionFoto || "50% 30%"), prioridad: true })}</div>
        </div>
        <h1 class="hero__nombres" data-rev style="--d:.4s">
          <span class="script foil escritura" style="--d:.6s">${ELLA}</span>
          <span class="hero__y">${Y}</span>
          <span class="script foil escritura" style="--d:1.4s">${EL}</span>
        </h1>
        <p class="hero__titulo" data-rev style="--d:1.9s">${esc(H.titulo)}</p>
        <div data-rev style="--d:2s">${ORN.divider("desplegar")}</div>
        <p class="hero__fecha" data-rev style="--d:2.2s"><span>${pad(F.d)}</span><i>◆</i><span>${pad(F.mo)}</span><i>◆</i><span>${F.y}</span></p>
        <p class="hero__frase" data-rev style="--d:2.4s">${esc(H.frase)}</p>
        <div class="desliza" data-rev style="--d:2.9s"><span>${esc(T.desliza).toUpperCase()}</span><i></i></div>
      </div>
    </section>`;
  };

  S.manifiesto = () => {
    const M = C.manifiesto || {};
    let dentro = false;
    const palabras = String(M.texto || "").split(/\s+/).filter(Boolean).map((w) => {
      if (w.startsWith("*")) dentro = true;
      const oro = dentro;
      if (/\*[.,;:!?»"”]*$/.test(w)) dentro = false;
      return `<span class="palabra${oro ? " oro" : ""}">${esc(w.replace(/\*/g, ""))}</span>`;
    }).join(" ");
    return `
    <section class="seccion manifiesto" data-scrub="fijo" data-accion="manifiesto">
      <div class="manifiesto__fijo">
        ${M.etiqueta ? `<p class="etiqueta">${esc(M.etiqueta)}</p>` : ""}
        <p class="manifiesto__texto">${palabras}</p>
        ${M.cita ? `<blockquote class="manifiesto__cita">${esc(M.cita)}${M.autorCita ? `<cite>${esc(M.autorCita)}</cite>` : ""}</blockquote>` : ""}
      </div>
    </section>`;
  };

  // Normaliza los medios de un capítulo: acepta "foto" (compatibilidad), "fotos", "videos" o "medios"
  const RX_VIDEO = /\.(mp4|webm|mov|m4v)(\?|#|$)/i;
  function mediosDe(c) {
    let m = [].concat(c.medios || [], c.fotos || [], c.videos || []);
    if (!m.length && c.foto) m = [c.foto];
    return m.map((x) => (typeof x === "string" ? (RX_VIDEO.test(x) ? { video: x } : { foto: x }) : x))
      .filter((x) => x && (x.foto || x.video || x.youtube));
  }
  const RX_IMG = /\.(jpe?g|png|webp|avif|gif)(\?|#|$)/i;
  function htmlVideo(v, titulo) {
    const H = C.historia || {};
    // sonido: false → sin reproductor ni audio: se reproduce solo, silenciado y en bucle mientras se ve
    const mudo = v.sonido === false || (v.sonido == null && H.sonidoVideos === false);
    const auto = mudo || (v.reproduccion || H.reproduccionVideos || "manual") === "auto";
    // El póster debe ser una imagen; si se indicó un video (o nada), se muestra su primer cuadro
    const poster = v.poster && RX_IMG.test(v.poster) ? v.poster : (v.youtube ? `https://i.ytimg.com/vi/${encodeURIComponent(v.youtube)}/hqdefault.jpg` : "");
    let dentro;
    if (v.youtube) {
      // YouTube se carga solo al tocar: hasta entonces es una imagen ligera (sin el reproductor de ~1 MB)
      dentro = `<div class="video video--yt" data-yt="${esc(v.youtube)}"${mudo ? ' data-mudo="1"' : ""}>
        <img class="marco-rect__foto" src="${esc(poster)}" alt="${esc(v.titulo || titulo)}" loading="lazy" decoding="async">
        <button class="video__play" type="button" aria-label="Reproducir video">${ICON("play")}</button></div>`;
    } else {
      const src = esc(v.video) + (poster ? "" : "#t=0.1");
      dentro = `<div class="video${auto ? " video--auto" : ""}${mudo ? " video--mudo" : ""}">
        <video class="marco-rect__video" playsinline preload="none" ${auto ? "muted loop" : ""} ${mudo ? 'disablepictureinpicture disableremoteplayback tabindex="-1"' : ""} ${poster ? `poster="${esc(poster)}"` : ""} data-src="${src}" aria-label="${esc(v.titulo || titulo)}"></video>
        ${auto ? "" : `<button class="video__play" type="button" aria-label="Reproducir video">${ICON("play")}</button>`}</div>`;
    }
    return `<div class="capitulo__video">${ORN.frameRect(dentro, { variante: "video" })}</div>`;
  }

  S.historia = () => {
    const H = C.historia || {};
    const marcoFotos = H.marcoFotos || "oval";
    const caps = (H.capitulos || []).map((c) => {
      const medios = mediosDe(c);
      const nFotos = medios.filter((m) => m.foto).length;
      const hayVideo = medios.some((m) => m.video || m.youtube);
      // El orden del arreglo "medios" es el orden en pantalla (fotos de 2 en 2; cada video en su fila)
      const items = medios.map((m) => {
        if (!m.foto) return htmlVideo(m, c.titulo);
        const alt = esc(m.alt || c.titulo), pos = esc(m.posicion || c.posicionFoto || "50% 40%");
        const marco = (m.marco || marcoFotos) === "rectangular"
          ? ORN.framePhoto(esc(m.foto), { variante: "foto", alt, pos })
          : ORN.frameOval(esc(m.foto), { sencillo: true, alt, pos });
        return `<div class="capitulo__foto">${marco}</div>`;
      }).join("");
      const clases = ["capitulo", hayVideo ? "capitulo--video" : "", hayVideo && !nFotos ? "capitulo--solo-video" : "", nFotos > 1 ? "capitulo--varias" : ""].join(" ").replace(/\s+/g, " ").trim();
      return `
      <article class="${clases}" data-rev${c.fondo ? ` data-fondo-cap="${esc(c.fondo)}" style="--fondo-cap:${esc(c.fondo)}"` : ""}>
        ${items ? `<div class="capitulo__medios">${items}</div>` : ""}
        <div class="capitulo__texto">
          <span class="capitulo__fecha">${esc(c.fecha)}</span>
          <h3 class="capitulo__titulo script foil escritura">${esc(c.titulo)}</h3>
          <p>${esc(c.texto)}</p>
        </div>
      </article>`;
    }).join("");
    return `
    <section class="seccion historia" id="historia">
      ${esquinas()}
      <div class="contenedor" style="max-width:1040px">
        ${encabezado(H.etiqueta, H.titulo)}
        <div class="linea-tiempo" data-scrub="hilo"><div class="linea-tiempo__hilo"><i></i></div>${caps}</div>
      </div>
    </section>`;
  };

  S.interludio = (i) => {
    const it = (C.interludios || [])[i];
    if (!it) return "";
    return `
    <section class="interludio" data-scrub="pasa">
      <div class="interludio__foto" data-fondo="${esc(it.foto)}"${it.posicion ? ` style="background-position:${esc(it.posicion)}"` : ""}></div>
      <div class="interludio__velo"></div>
      <div class="interludio__marco"></div>
      ${it.frase ? `<p class="interludio__frase script escritura" data-rev>${esc(it.frase)}</p>` : ""}
    </section>`;
  };

  S.padres = () => {
    const Pd = C.padres || {};
    const grupo = (g, i) => `<div class="grupo" data-rev style="--d:${(i % 4) * 0.12}s"><p class="etiqueta">${esc(g.titulo)}</p>${(g.nombres || []).map((n) => `<span class="grupo__nombre">${esc(n)}</span>`).join("")}</div>`;
    return `
    <section class="seccion seccion--alt padres">
      ${esquinas()}
      <div class="contenedor">
        ${encabezado(Pd.etiqueta, Pd.titulo)}
        <div class="grupos">${(Pd.grupos || []).map(grupo).join("")}</div>
        ${(Pd.padrinos || []).length ? `
          <div class="padrinos">
            <span class="sep-diamante" data-rev></span>
            <h3 class="titulo script foil escritura" data-rev style="font-size:clamp(2.3rem,9vw,3.4rem)">${esc(Pd.padrinosTitulo)}</h3>
            <div class="padrinos__lista">${Pd.padrinos.map(grupo).join("")}</div>
          </div>` : ""}
      </div>
    </section>`;
  };

  S.fecha = () => {
    const K = C.cuentaRegresiva || {};
    const primero = (new Date(Date.UTC(F.y, F.mo - 1, 1)).getUTCDay() + 6) % 7;
    const total = new Date(Date.UTC(F.y, F.mo, 0)).getUTCDate();
    let celdas = ["L", "M", "M", "J", "V", "S", "D"].map((d) => `<span class="calendario__dia-sem">${d}</span>`).join("");
    for (let i = 0; i < primero; i++) celdas += "<span></span>";
    for (let d = 1; d <= total; d++) {
      celdas += d === F.d
        ? `<span class="calendario__dia calendario__dia--boda">${d}
             <svg class="circulo-mano" viewBox="0 0 60 54" aria-hidden="true"><path pathLength="1" d="M47 8C37 1 14 3 7 16S8 47 27 49s30-9 27-25C51 9 37 4 21 8"/></svg>
             <svg class="corazoncito" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 20s-7.5-4.6-7.5-10.1A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.3C19.5 15.4 12 20 12 20z"/></svg>
           </span>`
        : `<span class="calendario__dia">${d}</span>`;
    }
    const caja = (k, lbl) => `<div class="cuenta__caja"><span class="cuenta__num foil" data-k="${k}">00</span><span class="cuenta__lbl">${esc(lbl).toUpperCase()}</span></div>`;
    return `
    <section class="seccion seccion--noche fecha" id="fecha">
      <canvas class="polvo" data-polvo="noche"></canvas>
      <div class="contenedor">
        ${encabezado(K.etiqueta, K.titulo)}
        <div class="calendario" data-rev>
          <p class="calendario__mes">${MESES[F.mo - 1].toUpperCase()} ${F.y}</p>
          <div class="calendario__rejilla">${celdas}</div>
        </div>
        <div class="cuenta" data-rev style="--d:.2s">
          ${caja("d", T.dias)}<i class="cuenta__sep"></i>${caja("h", T.horas)}<i class="cuenta__sep"></i>${caja("m", T.minutos)}<i class="cuenta__sep"></i>${caja("s", T.segundos)}
        </div>
        <div data-rev style="--d:.3s;margin-top:clamp(34px,6vh,54px)">
          <button class="boton" type="button" data-accion="calendario">${ICON("calendario")} ${esc(K.botonCalendario || "Agregar a mi calendario")}</button>
          <div class="menu-cal">
            <a class="boton" href="${esc(urlGoogleCal())}" target="_blank" rel="noopener">${esc(T.googleCal)}</a>
            <button class="boton" type="button" data-accion="ics">${esc(T.appleCal)}</button>
          </div>
        </div>
      </div>
    </section>`;
  };

  S.eventos = () => {
    const E = C.eventos || {};
    const tarjeta = (e, i) => `
      <article class="evento" data-rev="carta" style="--d:${i * 0.15}s" data-scrub="pasa">
        ${e.foto ? `<div class="evento__foto"><img src="${esc(e.foto)}" alt="${esc(e.lugar)}" loading="lazy" decoding="async"></div>` : `<div style="height:34px"></div>`}
        <div class="evento__cuerpo">
          <span class="medalla">${ICON(e.icono || "pin")}</span>
          <p class="etiqueta evento__tipo">${esc(e.tipo)}</p>
          <p class="evento__hora">${esc(e.hora)}</p>
          <h3 class="evento__lugar script foil">${esc(e.lugar)}</h3>
          <p class="evento__dir">${esc(e.direccion)}</p>
          <div class="botones">
            ${e.mapa ? `<a class="boton" href="${esc(e.mapa)}" target="_blank" rel="noopener">${ICON("pin")} ${esc(T.comoLlegar)}</a>` : ""}
            ${e.waze ? `<a class="boton" href="${esc(e.waze)}" target="_blank" rel="noopener">${ICON("mapa")} ${esc(T.waze)}</a>` : ""}
          </div>
        </div>
      </article>`;
    return `
    <section class="seccion eventos-sec" id="eventos">
      ${esquinas()}
      <div class="contenedor" style="max-width:1000px">
        ${encabezado(E.etiqueta, E.titulo)}
        <div class="eventos">${(E.lista || []).map(tarjeta).join("")}</div>
      </div>
    </section>`;
  };

  S.itinerario = () => {
    const I = C.itinerario || {};
    const items = (I.items || []).map((it, i) => `
      <li class="programa__item" data-rev style="--d:${(i % 2) * 0.1}s">
        <span class="programa__hora">${esc(it.hora)}</span>
        <span class="medalla">${ICON(it.icono || "estrella")}</span>
        <span class="programa__titulo">${esc(it.titulo)}</span>
      </li>`).join("");
    return `
    <section class="seccion seccion--alt itinerario">
      ${esquinas()}
      <div class="contenedor">
        ${encabezado(I.etiqueta, I.titulo)}
        <ol class="programa" data-scrub="hilo">${items}</ol>
      </div>
    </section>`;
  };

  S.vestimenta = () => {
    const V = C.vestimenta || {};
    const paleta = (V.paleta || []).map((p) => `<div class="muestra"><i style="--c:${esc(p.color)}"></i><span>${esc(p.nombre)}</span></div>`).join("");
    return `
    <section class="seccion vestimenta">
      ${esquinas()}
      <div class="contenedor">
        ${encabezado(V.etiqueta, V.titulo)}
        <div class="atuendos">
          <div class="atuendo" data-rev>${ORN.vestido}<h3>${esc(V.etiquetaEllas || T.ellas)}</h3><p>${esc(V.ellas)}</p></div>
          <div class="atuendo" data-rev style="--d:.2s">${ORN.smoking}<h3>${esc(V.etiquetaEllos || T.ellos)}</h3><p>${esc(V.ellos)}</p></div>
        </div>
        ${paleta ? `<p class="etiqueta" data-rev style="margin-top:1.6em">${esc(V.paletaTitulo)}</p><div class="paleta" data-rev>${paleta}</div>` : ""}
        ${V.nota ? `<p class="nota" data-rev>${esc(V.nota)}</p>` : ""}
      </div>
    </section>`;
  };

  S.galeria = () => {
    const Ga = C.galeria || {};
    const fotos = Ga.fotos || [];
    if (!fotos.length) return "";
    return `
    <section class="seccion seccion--alt galeria-sec" style="padding-left:0;padding-right:0">
      ${esquinas()}
      <div class="contenedor" style="padding:0 22px">${encabezado(Ga.etiqueta, Ga.titulo)}</div>
      <div class="galeria" data-rev>
        <div class="galeria__pista">
          ${fotos.map((f, i) => `<figure class="galeria__item" data-i="${i}"><div class="marco-dorado"><div class="marco-dorado__paspartu"><img src="${esc(f)}" alt="Fotografía ${i + 1}" loading="lazy" decoding="async"></div></div></figure>`).join("")}
        </div>
        <div class="galeria__controles">
          <button class="galeria__flecha galeria__flecha--izq" type="button" aria-label="Anterior">${ICON("flecha")}</button>
          <div class="galeria__puntos">${fotos.map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("")}</div>
          <button class="galeria__flecha galeria__flecha--der" type="button" aria-label="Siguiente">${ICON("flecha")}</button>
        </div>
      </div>
    </section>`;
  };

  S.regalos = () => {
    const R = C.regalos || {};
    const Tr = R.transferencia;
    const mesas = (R.mesas || []).map((m, i) => `
      <div class="ficha" data-rev style="--d:${i * 0.1}s">
        <span class="medalla">${ICON("tienda")}</span>
        <h3>${esc(m.nombre)}</h3><p>${esc(m.detalle)}</p>
        ${m.url ? `<a class="boton" href="${esc(m.url)}" target="_blank" rel="noopener">${esc(T.verMesa)}</a>` : ""}
      </div>`).join("");
    const fila = (k, v) => v ? `<li><b>${esc(k)}</b><span>${esc(v)}</span></li>` : "";
    const trans = Tr ? `
      <div class="ficha" data-rev style="--d:.2s">
        <span class="medalla">${ICON("regalo")}</span>
        <h3>${esc(Tr.titulo || "Transferencia")}</h3>
        <ul class="datos">${fila("BANCO", Tr.banco)}${fila("TITULAR", Tr.titular)}${fila("CLABE", Tr.clabe)}${fila("CUENTA", Tr.cuenta)}${fila("CONCEPTO", Tr.concepto)}</ul>
        ${Tr.clabe ? `<button class="boton" type="button" data-copiar="${esc(String(Tr.clabe).replace(/\s+/g, ""))}">${ICON("copiar")} ${esc(T.copiar)}</button>` : ""}
      </div>` : "";
    return `
    <section class="seccion regalos">
      ${esquinas()}
      <div class="contenedor" style="max-width:960px">
        ${encabezado(R.etiqueta, R.titulo, R.texto ? `<p class="parrafo">${esc(R.texto)}</p>` : "")}
        <div class="tarjetas">${mesas}${trans}</div>
        ${R.sobres ? `<p class="sobres" data-rev>${ICON("sobre")} <span>${esc(R.sobres)}</span></p>` : ""}
      </div>
    </section>`;
  };

  S.hospedaje = () => {
    const H = C.hospedaje || {};
    const fichas = (H.hoteles || []).map((h, i) => `
      <div class="ficha" data-rev style="--d:${i * 0.1}s">
        <span class="medalla">${ICON("hotel")}</span>
        <h3>${esc(h.nombre)}</h3><p>${esc(h.detalle)}</p>
        ${h.telefono ? `<p><a href="tel:${esc(String(h.telefono).replace(/\s+/g, ""))}">${esc(h.telefono)}</a></p>` : ""}
        ${h.url ? `<a class="boton" href="${esc(h.url)}" target="_blank" rel="noopener">${ICON("pin")} ${esc(T.verUbicacion)}</a>` : ""}
      </div>`).join("");
    return `
    <section class="seccion seccion--alt hospedaje">
      ${esquinas()}
      <div class="contenedor" style="max-width:960px">${encabezado(H.etiqueta, H.titulo)}<div class="tarjetas">${fichas}</div></div>
    </section>`;
  };

  S.notas = () => {
    const No = C.notas || {};
    const fichas = (No.items || []).map((n, i) => `
      <div class="ficha" data-rev style="--d:${i * 0.1}s">
        <span class="medalla">${ICON(n.icono || "estrella")}</span>
        <h3>${esc(n.titulo)}</h3><p>${esc(n.texto)}</p>
      </div>`).join("");
    return `
    <section class="seccion notas">
      ${esquinas()}
      <div class="contenedor" style="max-width:960px">
        ${encabezado(No.etiqueta, No.titulo)}
        <div class="tarjetas">${fichas}</div>
        ${No.hashtag ? `<p class="hashtag foil" data-rev>${esc(No.hashtag)}</p>` : ""}
      </div>
    </section>`;
  };

  S.rsvp = () => {
    const R = C.rsvp || {};
    const lim = R.fechaLimite ? partes(R.fechaLimite) : null;
    const cerrado = lim && Date.now() > new Date(`${R.fechaLimite}T23:59:59`).getTime();
    const max = G.pases > 0 ? G.pases : (R.maxPersonas || 6);
    let opPers = "";
    for (let i = 1; i <= max; i++) opPers += `<option value="${i}">${i}</option>`;
    const menu = R.preguntarMenu ? `
      <div class="campo" data-si><label for="r-menu">${esc(T.menu)}</label>
        <select id="r-menu" name="menu">${(R.opcionesMenu || []).map((o) => `<option>${esc(o)}</option>`).join("")}</select></div>` : "";
    const form = `
      <form class="formulario" novalidate>
        <div class="campo"><label for="r-nombre">${esc(T.nombre)}</label>
          <input id="r-nombre" name="nombre" autocomplete="name" placeholder="${esc(T.nombrePh)}" value="${G.personalizado ? esc(G.nombre) : ""}"></div>
        <fieldset class="campo"><legend>${esc(T.asistencia)}</legend>
          <div class="opciones">
            <label class="opcion"><input type="radio" name="asistencia" value="si" checked><span>${esc(T.si)}</span></label>
            <label class="opcion"><input type="radio" name="asistencia" value="no"><span>${esc(T.no)}</span></label>
          </div>
        </fieldset>
        <div class="campo" data-si><label for="r-personas">${esc(T.personas)}</label><select id="r-personas" name="personas">${opPers}</select></div>
        ${menu}
        <div class="campo"><label for="r-msg">${esc(T.mensaje)}</label><textarea id="r-msg" name="mensaje" placeholder="${esc(T.mensajePh)}"></textarea></div>
        <button class="boton boton--oro" type="submit">${ICON("whatsapp")} ${esc(R.textoBoton || "Enviar")}</button>
      </form>`;
    const pases = G.personalizado && G.pases > 0
      ? `<span class="rsvp__pases">${G.pases === 1 ? esc(T.lugarUno) : esc(T.lugaresVarios.replace("{n}", G.pases))}</span>` : "";
    return `
    <section class="seccion seccion--alt rsvp" id="rsvp">
      ${esquinas()}
      <div class="contenedor">
        <div class="rsvp__tarjeta" data-rev>
          <p class="etiqueta">${esc(R.etiqueta)}</p>
          <h2 class="rsvp__titulo foil">${esc(R.titulo)}</h2>
          ${ORN.divider()}
          <p class="parrafo">${esc(R.texto)}</p>
          ${pases}
          ${cerrado ? `<p class="parrafo cursiva">${esc(R.textoCerrado)}</p>` : form}
          ${lim && !cerrado ? `<p class="rsvp__limite">${esc(T.confirmaAntes).toUpperCase()} ${esc(fechaLarga(lim)).toUpperCase()}</p>` : ""}
        </div>
      </div>
    </section>`;
  };

  S.cierre = () => {
    const Ci = C.cierre || {};
    const cr = C.creditos || {};
    const m = C.musica || {};
    return `
    <section class="seccion seccion--noche cierre">
      <canvas class="polvo" data-polvo="noche"></canvas>
      <div class="contenedor">
        ${Ci.foto ? `<div class="cierre__marco" data-rev="escala">${ORN.frameOval(esc(Ci.foto), { alt: `${ELLA} y ${EL}`, pos: esc(Ci.posicionFoto || "50% 35%") })}</div>` : ""}
        <h2 class="cierre__frase script foil escritura" data-rev>${esc(Ci.frase)}</h2>
        <p class="parrafo" data-rev>${esc(Ci.texto)}</p>
        <p class="cierre__firma" data-rev>${esc(Ci.firma)}</p>
        <p class="cierre__nombres script foil escritura" data-rev>${ELLA} ${Y} ${EL}</p>
        <div class="cierre__lacre" data-rev>${ORN.seal(INICIALES, FUENTES.grabada)}</div>
        <p class="etiqueta" data-rev style="margin-top:2.2em">${pad(F.d)} · ${pad(F.mo)} · ${F.y}</p>
      </div>
    </section>
    <footer class="pie">
      ${cr.mostrar !== false && cr.texto ? `<p>${cr.url ? `<a href="${esc(cr.url)}" target="_blank" rel="noopener">${esc(cr.texto)}</a>` : esc(cr.texto)}</p>` : ""}
      ${m.activa !== false && m.credito ? `<p>${esc(m.credito)}</p>` : ""}
    </footer>`;
  };

  function construirInvitacion() {
    const orden = C.orden || ["hero", "manifiesto", "historia", "padres", "fecha", "eventos", "itinerario", "vestimenta", "galeria", "regalos", "hospedaje", "notas", "rsvp", "cierre"];
    const html = orden.map((clave) => {
      const [k, arg] = String(clave).split(":");
      const datos = C[k === "fecha" ? "cuentaRegresiva" : k];
      if (datos && datos.mostrar === false) return "";
      try { return S[k] ? S[k](arg != null ? +arg : undefined) : ""; } catch (e) { console.warn("Sección con error:", k, e); return ""; }
    }).join("");
    $("#invitacion").innerHTML = html;
  }

  /* ==========================================================================
     CALENDARIO (Google / .ics)
     ========================================================================== */
  function rangoUTC() {
    const ini = new Date(FI);
    const fin = new Date(ini.getTime() + ((C.fecha && C.fecha.duracionHoras) || 8) * 3600e3);
    const f = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    return { ini: f(ini), fin: f(fin) };
  }
  function lugarPrincipal() {
    const e = ((C.eventos && C.eventos.lista) || [])[0];
    return e ? `${e.lugar}, ${e.direccion}` : (C.fecha && C.fecha.ciudad) || "";
  }
  function urlGoogleCal() {
    const r = rangoUTC();
    const q = new URLSearchParams({ action: "TEMPLATE", text: `Boda ${N.ella} ${N.conector || "&"} ${N.el}`, dates: `${r.ini}/${r.fin}`, details: location.href.split("#")[0], location: lugarPrincipal() });
    return `https://calendar.google.com/calendar/render?${q.toString()}`;
  }
  function descargarICS() {
    const r = rangoUTC();
    const e = (s) => String(s).replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Invitacion//ES", "BEGIN:VEVENT",
      `UID:${r.ini}-${INICIALES.join("")}@invitacion`, `DTSTAMP:${rangoUTC().ini}`, `DTSTART:${r.ini}`, `DTEND:${r.fin}`,
      `SUMMARY:${e(`Boda ${N.ella} ${N.conector || "&"} ${N.el}`)}`, `LOCATION:${e(lugarPrincipal())}`, `DESCRIPTION:${e(location.href.split("#")[0])}`,
      "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:Mañana es la boda", "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const a = D.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    a.download = "boda.ics";
    D.body.appendChild(a); a.click(); a.remove();
  }

  /* ==========================================================================
     COMPORTAMIENTOS
     ========================================================================== */
  // Imágenes que no cargan: respaldo elegante sin romper el diseño
  D.addEventListener("error", (e) => {
    const t = e.target;
    if (t && t.tagName === "IMG") { t.classList.add("sin-imagen"); t.parentElement && t.parentElement.classList.add("respaldo-img"); }
  }, true);

  function precargar(src, ms) {
    return new Promise((res) => {
      if (!src) return res(false);
      const im = new Image(); let ok = false;
      im.onload = () => { ok = true; res(true); }; im.onerror = () => res(false);
      im.src = src; setTimeout(() => !ok && res(false), ms || 6000);
    });
  }

  // Revelado progresivo
  let io;
  function iniciarRevelado() {
    /* Fase 1 (≈1 pantalla antes): se crea la capa del elemento y se decodifican sus fotos, para que
       el trabajo pesado NO coincida con la animación. Fase 2 (al entrar): solo se anima. */
    const preparar = (el) => {
      if (el._listo) return; el._listo = true;
      el.style.willChange = "opacity, transform, filter";
      $$("img", el).forEach((im) => {
        if (im.loading === "lazy") im.loading = "eager";
        const dec = () => { if (im.decode) im.decode().catch(() => {}); };
        if (im.complete) dec(); else im.addEventListener("load", dec, { once: true });
      });
    };
    const prep = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { prep.unobserve(e.target); preparar(e.target); }
    }), { rootMargin: "0px 0px 110% 0px" });
    io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      io.unobserve(el); prep.unobserve(el);
      const yaListo = el._listo;
      preparar(el);
      const mostrar = () => el.classList.add("visible");
      if (yaListo) mostrar(); else requestAnimationFrame(mostrar);
      const liberar = (ev) => { if (ev.target === el && ev.propertyName === "opacity") { el.style.willChange = ""; el.removeEventListener("transitionend", liberar); } };
      el.addEventListener("transitionend", liberar);
      setTimeout(() => (el.style.willChange = ""), 4500);
    }), { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    $$("[data-rev]").forEach((el) => { prep.observe(el); io.observe(el); });

    const fondos = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target; fondos.unobserve(el);
      const im = new Image();
      im.onload = () => {
        el.style.backgroundImage = `url("${el.dataset.fondo}")`;
        // Proporción real de la foto: en móvil la sección se adapta a ella para no recortar de más
        const sec = el.closest(".interludio");
        if (sec && im.naturalHeight) sec.style.setProperty("--ar", (im.naturalWidth / im.naturalHeight).toFixed(3));
      };
      im.src = el.dataset.fondo;
    }), { rootMargin: "900px 0px" });
    $$("[data-fondo]").forEach((el) => fondos.observe(el));

    // Las animaciones continuas (brillo del foil, etc.) se pausan en secciones fuera de pantalla
    const pausa = new IntersectionObserver((es) => es.forEach((e) => {
      e.target.classList.toggle("en-pausa", !e.isIntersecting);
      e.target.classList.toggle("en-vista", e.isIntersecting);
    }), { rootMargin: "200px 0px" });
    $$("#invitacion > section").forEach((el) => pausa.observe(el));
  }

  // Motor de scroll: progreso 0..1 por elemento (parallax, hilos, texto que se ilumina)
  const scrubs = [];
  let tic = false;
  function iniciarScroll() {
    // --p se escribe solo en los elementos que lo usan (no en toda la sección) para no recalcular
    // estilos de cientos de nodos en cada cuadro de scroll.
    const objetivos = (el) => {
      const t = $$("[data-p], .hero .marco-oval__foto, .hero .marco-rect__foto, .evento__foto img, .interludio__foto, .linea-tiempo__hilo i", el);
      if (el.matches(".programa")) t.push(el);
      return t;
    };
    $$("[data-scrub]").forEach((el) => scrubs.push({ el, modo: el.dataset.scrub, p: -1, t: objetivos(el) }));
    const barra = $(".progreso");
    let alto = 0, vh = innerHeight;
    // Geometría en caché: se mide una vez (y al cambiar el tamaño del documento) y cada cuadro de
    // scroll solo hace aritmética con scrollY, sin forzar lecturas de layout.
    const medir = () => {
      vh = innerHeight; alto = D.documentElement.scrollHeight - vh;
      const y = scrollY;
      for (const s of scrubs) { const r = s.el.getBoundingClientRect(); s.top = r.top + y; s.h = r.height; }
    };
    let pendienteMedir = false;
    const remedir = () => { pendienteMedir = true; pedir(); };
    const actualizar = () => {
      tic = false;
      if (pendienteMedir) { pendienteMedir = false; medir(); }
      const y = scrollY;
      for (const s of scrubs) {
        const top = s.top - y, h = s.h;
        if (top + h < -200 || top > vh + 200) continue;
        let p;
        if (s.modo === "fijo") p = -top / Math.max(1, h - vh);
        else if (s.modo === "hilo") p = (vh * 0.62 - top) / Math.max(1, h);
        else p = (vh - top) / (vh + h);
        p = clamp(p);
        if (Math.abs(p - s.p) < 0.0004) continue;
        s.p = p;
        const v = p.toFixed(4);
        for (const t of s.t) t.style.setProperty("--p", v);
        if (s.el.dataset.accion === "manifiesto") manifiesto(s.el, p);
      }
      barra.style.setProperty("--avance", alto > 0 ? (y / alto).toFixed(4) : 0);
    };
    const pedir = () => { if (!tic) { tic = true; requestAnimationFrame(actualizar); } };
    if ("ResizeObserver" in window) new ResizeObserver(remedir).observe($("#invitacion"));
    addEventListener("scroll", pedir, { passive: true });
    addEventListener("resize", remedir);
    addEventListener("load", remedir);
    medir();
    actualizar();
  }

  function manifiesto(el, p) {
    if (!el._pal) { el._pal = $$(".palabra", el); el._cita = $(".manifiesto__cita", el); }
    const n = el._pal.length, lit = Math.round(clamp(p / 0.78) * n);
    if (lit === el._lit) return;          // solo se toca el DOM cuando cambia el número de palabras
    el._lit = lit;
    el._pal.forEach((w, i) => w.classList.toggle("on", i < lit));
    if (el._cita) el._cita.classList.toggle("on", p > 0.8);
  }

  // Cuenta regresiva
  function iniciarCuenta() {
    const nums = {}; $$(".cuenta__num").forEach((n) => (nums[n.dataset.k] = n));
    if (!nums.d) return;
    const meta = new Date(FI).getTime();
    const tick = () => {
      const t = meta - Date.now();
      if (t <= 0) {
        const c = $(".cuenta");
        if (c) c.outerHTML = `<p class="cuenta__fin script foil">${esc((C.cuentaRegresiva || {}).textoFinal || "¡Hoy es el gran día!")}</p>`;
        return clearInterval(iv);
      }
      const v = { d: Math.floor(t / 864e5), h: Math.floor(t / 36e5) % 24, m: Math.floor(t / 6e4) % 60, s: Math.floor(t / 1e3) % 60 };
      Object.keys(v).forEach((k) => {
        const txt = k === "d" ? String(v[k]).padStart(2, "0") : pad(v[k]);
        if (nums[k].textContent !== txt) {
          nums[k].textContent = txt;
          nums[k].classList.remove("cambia"); void nums[k].offsetWidth; nums[k].classList.add("cambia");
        }
      });
    };
    const iv = setInterval(tick, 1000); tick();
  }

  // Galería tipo carrusel + visor
  function iniciarGaleria() {
    const pista = $(".galeria__pista"); if (!pista) return;
    const items = $$(".galeria__item", pista), puntos = $$(".galeria__puntos i");
    let activo = 0, t = false, geo = [], ancho = 0;
    const previo = items.map(() => ({ k: "", s: "" }));

    // Las posiciones de las fotos solo cambian al redimensionar: se miden una vez, no en cada cuadro
    const medirGeo = () => { ancho = pista.clientWidth; geo = items.map((it) => ({ c: it.offsetLeft + it.offsetWidth / 2, w: it.offsetWidth || 1 })); };
    const medir = () => {
      t = false;
      const cx = pista.scrollLeft + ancho / 2;
      let nuevo = activo;
      items.forEach((it, i) => {
        const off = (geo[i].c - cx) / geo[i].w;
        const k = Math.min(1, Math.abs(off)).toFixed(3), sg = clamp(off, -1, 1).toFixed(3);
        // Solo se escribe lo que cambió (las fotos lejanas se quedan quietas sin tocar el DOM)
        if (k !== previo[i].k) { it.style.setProperty("--k", k); previo[i].k = k; }
        if (sg !== previo[i].s) { it.style.setProperty("--s", sg); previo[i].s = sg; }
        if (Math.abs(off) < 0.5) nuevo = i;
      });
      if (nuevo !== activo || !puntos[activo].classList.contains("on")) {
        activo = nuevo;
        puntos.forEach((p, i) => p.classList.toggle("on", i === activo));
      }
    };
    pista.addEventListener("scroll", () => { if (!t) { t = true; requestAnimationFrame(medir); } }, { passive: true });
    addEventListener("resize", () => { medirGeo(); medir(); });
    const ir = (i) => { const g = geo[clamp(i, 0, items.length - 1)]; pista.scrollTo({ left: g.c - ancho / 2, behavior: "smooth" }); };
    $(".galeria__flecha--izq").addEventListener("click", () => ir(activo - 1));
    $(".galeria__flecha--der").addEventListener("click", () => ir(activo + 1));
    items.forEach((it, i) => it.addEventListener("click", () => (i === activo ? abrirVisor(i) : ir(i))));
    medirGeo(); medir();

    // Las fotos del carrusel se descargan y decodifican ANTES de llegar a la galería:
    // al pulsar "siguiente" ya están listas (antes cada una empezaba a cargar al aparecer).
    const imgs = $$("img", pista);
    const adelantar = () => imgs.forEach((im) => {
      im.loading = "eager";
      const listo = () => { if (im.decode) im.decode().catch(() => {}); };
      if (im.complete) listo(); else im.addEventListener("load", listo, { once: true });
    });
    if ("IntersectionObserver" in window) {
      const io2 = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io2.disconnect(); adelantar(); } }, { rootMargin: "1200px 0px" });
      io2.observe(pista);
    } else adelantar();
  }

  function abrirVisor(i) {
    const fotos = (C.galeria && C.galeria.fotos) || [];
    const v = $("#visor");
    let idx = i;
    v.innerHTML = `<button class="visor__cerrar" type="button" aria-label="Cerrar">×</button>
      <button class="visor__ant" type="button" aria-label="Anterior">${ICON("flecha")}</button>
      <img alt=""><button class="visor__sig" type="button" aria-label="Siguiente">${ICON("flecha")}</button>`;
    const img = $("img", v);
    const mostrar = () => { img.src = fotos[idx]; img.alt = `Fotografía ${idx + 1}`; };
    const mover = (d) => { idx = (idx + d + fotos.length) % fotos.length; mostrar(); };
    const cerrar = () => { v.hidden = true; v.innerHTML = ""; D.removeEventListener("keydown", tecla); D.body.style.overflow = ""; };
    const tecla = (e) => { if (e.key === "Escape") cerrar(); if (e.key === "ArrowRight") mover(1); if (e.key === "ArrowLeft") mover(-1); };
    $(".visor__cerrar", v).onclick = cerrar;
    $(".visor__ant", v).onclick = () => mover(-1);
    $(".visor__sig", v).onclick = () => mover(1);
    v.onclick = (e) => { if (e.target === v) cerrar(); };
    let x0 = null;
    v.ontouchstart = (e) => (x0 = e.touches[0].clientX);
    v.ontouchend = (e) => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) mover(dx < 0 ? 1 : -1); x0 = null; };
    D.addEventListener("keydown", tecla);
    D.body.style.overflow = "hidden";
    mostrar(); v.hidden = false; $(".visor__cerrar", v).focus();
  }

  /* Fondo de la historia: cada capítulo puede tener su color y entre uno y otro hay un degradado
     largo y suave. Se calcula UNA vez como un solo degradado del fondo de la sección (sin capas extra)
     y solo se recalcula si cambia la altura (fuentes, fotos, rotación del teléfono). */
  function iniciarFondosHistoria() {
    const sec = $(".historia"); if (!sec) return;
    const caps = $$(".capitulo", sec);
    if (!caps.some((c) => c.dataset.fondoCap)) return;
    const H = C.historia || {};
    const base = H.fondo || getComputedStyle(D.documentElement).getPropertyValue("--papel").trim() || COL.papel;
    const D2 = Math.max(0, +H.difuminado || 380) / 2;
    let ultimo = "";
    const pintar = () => {
      const top0 = sec.getBoundingClientRect().top;
      const r = caps.map((c) => { const b = c.getBoundingClientRect(); return { t: b.top - top0, b: b.bottom - top0, col: c.dataset.fondoCap || base }; });
      const stops = [`${base} 0px`];
      let prev = base;
      r.forEach((c, i) => {
        const limite = i === 0 ? c.t - 40 : (r[i - 1].b + c.t) / 2;
        if (c.col !== prev) stops.push(`${prev} ${Math.round(limite - D2)}px`, `${c.col} ${Math.round(limite + D2)}px`);
        prev = c.col;
      });
      stops.push(`${prev} 100%`);
      const fondo = `var(--grano), linear-gradient(180deg, ${stops.join(", ")})`;
      if (fondo !== ultimo) { sec.style.backgroundImage = fondo; ultimo = fondo; }
    };
    pintar();
    if ("ResizeObserver" in window) { let tt = 0; new ResizeObserver(() => { cancelAnimationFrame(tt); tt = requestAnimationFrame(pintar); }).observe(sec); }
  }

  /* Videos de los capítulos: no se descarga nada hasta que hacen falta.
     · manual: póster + botón dorado; al tocar se carga y reproduce (con controles).
     · auto:   silenciado y en bucle solo mientras está en pantalla; se pausa al salir.
     Mientras un video suena, la música de fondo se pausa y vuelve al terminar o pausar. */
  function iniciarVideos() {
    const vids = $$(".capitulo__video");
    if (!vids.length) return;
    const pausarMusica = !(C.historia && C.historia.pausarMusicaConVideo === false);
    let musicaPausadaPorVideo = false;
    const cargar = (v) => { if (v && !v.src && v.dataset.src) { v.src = v.dataset.src; } };
    const silenciarMusica = () => { if (pausarMusica && audio && !audio.paused) { callar(); musicaPausadaPorVideo = true; } };
    const reanudarMusica = () => { if (musicaPausadaPorVideo && !$$("video").some((x) => !x.paused && !x.muted)) { musicaPausadaPorVideo = false; sonar(); } };

    vids.forEach((cont) => {
      const v = $("video", cont), yt = $(".video--yt", cont), btn = $(".video__play", cont);
      if (yt && btn) {
        btn.addEventListener("click", () => {
          const id = encodeURIComponent(yt.dataset.yt);
          const mudo = yt.dataset.mudo === "1";
          yt.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1${mudo ? `&mute=1&controls=0&loop=1&playlist=${id}` : ""}" title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
          if (!mudo) silenciarMusica();
        });
        return;
      }
      if (!v) return;
      if (btn) {
        btn.addEventListener("click", () => {
          cargar(v); v.controls = true; btn.hidden = true;
          const pr = v.play(); if (pr && pr.catch) pr.catch(() => {});
        });
        v.addEventListener("play", () => { if (!v.muted) silenciarMusica(); });
        v.addEventListener("volumechange", () => { if (!v.muted && !v.paused) silenciarMusica(); });
        ["pause", "ended"].forEach((ev) => v.addEventListener(ev, reanudarMusica));
      }
    });

    // Precarga ligera (solo metadatos / primer cuadro) al acercarse
    const cerca = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      cerca.unobserve(e.target);
      const v = $("video", e.target);
      if (v && !v.poster && v.preload === "none") { v.preload = "metadata"; cargar(v); }
    }), { rootMargin: "400px 0px" });
    // Reproducción automática (modo "auto") solo mientras al menos la mitad está en pantalla
    const vista = new IntersectionObserver((es) => es.forEach((e) => {
      const v = $("video", e.target); if (!v) return;
      const auto = !!e.target.querySelector(".video--auto");
      if (auto && e.intersectionRatio >= 0.5) { cargar(v); const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); }
      else if (!v.paused && (auto || !e.isIntersecting)) v.pause();
    }), { threshold: [0, 0.5] });
    vids.forEach((cont) => { cerca.observe(cont); vista.observe(cont); });
  }

  // Avisos
  let avisoT;
  function aviso(txt) {
    const a = $("#aviso"); a.textContent = txt; a.classList.add("on");
    clearTimeout(avisoT); avisoT = setTimeout(() => a.classList.remove("on"), 2400);
  }
  function copiar(txt) {
    const ok = () => aviso(T.copiado);
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(txt).then(ok).catch(() => viejo());
    viejo();
    function viejo() {
      const ta = D.createElement("textarea"); ta.value = txt; ta.style.cssText = "position:fixed;opacity:0";
      D.body.appendChild(ta); ta.select(); try { D.execCommand("copy"); ok(); } catch (e) { aviso(txt); } ta.remove();
    }
  }

  // Confirmación por WhatsApp
  function iniciarRSVP() {
    const f = $(".formulario"); if (!f) return;
    const R = C.rsvp || {};
    const sincronizar = () => {
      const si = f.asistencia.value === "si";
      $$("[data-si]", f).forEach((c) => (c.style.display = si ? "" : "none"));
    };
    $$('input[name="asistencia"]', f).forEach((r) => r.addEventListener("change", sincronizar));
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombre = f.nombre.value.trim();
      if (!nombre) { aviso(T.faltaNombre); f.nombre.focus(); return; }
      const si = f.asistencia.value === "si";
      const msg = String(R.plantilla || "{nombre}\n{asistencia}\n{personas}\n{mensaje}")
        .replace("{nombre}", nombre)
        .replace("{asistencia}", si ? T.asistenciaSi : T.asistenciaNo)
        .replace("{personas}", si ? f.personas.value : "0")
        .replace("{menu}", si && f.menu ? f.menu.value : "—")
        .replace("{mensaje}", f.mensaje.value.trim() || "—");
      const url = `https://wa.me/${String(R.whatsapp || "").replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
      const w = window.open(url, "_blank", "noopener");
      if (!w) location.href = url;
    });
    sincronizar();
  }

  // Delegación de clics
  D.addEventListener("click", (e) => {
    const b = e.target.closest("[data-accion],[data-copiar]");
    if (!b) return;
    if (b.dataset.copiar) return copiar(b.dataset.copiar);
    if (b.dataset.accion === "calendario") b.nextElementSibling.classList.toggle("abierto");
    if (b.dataset.accion === "ics") descargarICS();
  });

  /* ---------------- Polvo dorado (partículas) ---------------- */
  function polvo(cv) {
    if (REDUCIDO) return;
    const ctx = cv.getContext("2d"), noche = cv.dataset.polvo === "noche";
    const rgb = hexRgb(noche ? COL.oroBrillo : COL.oro);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, vivo = false;
    const ps = Array.from({ length: noche ? 48 : 30 }, () => ({
      x: Math.random(), y: Math.random(), r: 0.5 + Math.random() * 1.7, v: 0.00004 + Math.random() * 0.00012,
      a: Math.random() * 6.28, tw: 0.4 + Math.random() * 1.4
    }));
    let sucias = [];
    const medir = () => {
      if (cv.clientWidth === w && cv.clientHeight === h) return;   // no reasignar el lienzo si no cambió
      w = cv.clientWidth; h = cv.clientHeight;
      // En secciones muy altas se limita el tamaño interno del lienzo (~1.5 MP): son puntos de luz
      // difuminados, así que la diferencia no se percibe y la GPU mueve mucha menos memoria por cuadro.
      const d = Math.min(dpr, Math.sqrt(1.5e6 / Math.max(1, w * h)));
      cv.width = Math.round(w * d); cv.height = Math.round(h * d); ctx.setTransform(d, 0, 0, d, 0, 0); sucias = [];
    };
    let ult = 0;
    const cuadro = (t) => {
      if (vivo) raf = requestAnimationFrame(cuadro);
      if (t - ult < 32) return;            // ~30 fps: movimiento lento, imperceptible y la mitad de trabajo
      const paso = Math.min(3, (t - ult) / 16); ult = t;
      // Solo se borra donde hubo partículas (no el lienzo entero) y solo se dibujan las que están en pantalla:
      // el resultado es idéntico, con una fracción del trabajo en secciones altas.
      const top = cv.getBoundingClientRect().top, y0 = -top - 12, y1 = -top + innerHeight + 12;
      for (let i = 0; i < sucias.length; i += 3) ctx.clearRect(sucias[i], sucias[i + 1], sucias[i + 2], sucias[i + 2]);
      sucias.length = 0;
      for (const p of ps) {
        p.y -= p.v * 16 * paso; if (p.y < -0.03) { p.y = 1.03; p.x = Math.random(); }
        const x = (p.x + Math.sin(t / 4000 + p.a) * 0.012) * w, y = p.y * h;
        if (y < y0 || y > y1) continue;
        const al = (noche ? 0.25 : 0.18) + (noche ? 0.55 : 0.4) * (0.5 + 0.5 * Math.sin(t / 900 * p.tw + p.a));
        const R = p.r * 3.2;
        ctx.fillStyle = `rgba(${rgb},${al * 0.16})`; ctx.beginPath(); ctx.arc(x, y, R, 0, 6.29); ctx.fill();
        ctx.fillStyle = `rgba(${rgb},${al})`; ctx.beginPath(); ctx.arc(x, y, p.r, 0, 6.29); ctx.fill();
        sucias.push(x - R - 2, y - R - 2, 2 * R + 4);
      }
    };
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !vivo) { vivo = true; medir(); raf = requestAnimationFrame(cuadro); }
      else if (!e.isIntersecting && vivo) { vivo = false; cancelAnimationFrame(raf); }
    }).observe(cv);
    let ancho = 0;
    addEventListener("resize", () => { if (vivo && cv.clientWidth !== ancho) { ancho = cv.clientWidth; medir(); } });
  }

  /* ---------------- Lluvia de hojas de oro al abrir ---------------- */
  function confeti() {
    if (REDUCIDO) return;
    const cv = $("#confeti"), ctx = cv.getContext("2d");
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = innerWidth, h = innerHeight;
    cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const tonos = [COL.oroBrillo, COL.oroClaro, COL.oro, COL.oroProfundo, "#FFF8E6"];
    const ps = Array.from({ length: Math.round(Math.min(140, w / 5)) }, () => ({
      x: Math.random() * w, y: -20 - Math.random() * h * 0.7, s: 3 + Math.random() * 6, vy: 0.7 + Math.random() * 1.4,
      vx: (Math.random() - 0.5) * 0.6, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.12, f: Math.random() * 6.28,
      c: tonos[(Math.random() * tonos.length) | 0], forma: Math.random() < 0.5
    }));
    const t0 = performance.now();
    const cuadro = (t) => {
      const e = t - t0;
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = e > 4200 ? Math.max(0, 1 - (e - 4200) / 1400) : 1;
      for (const p of ps) {
        p.y += p.vy; p.x += p.vx + Math.sin(e / 600 + p.f) * 0.6; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.scale(1, Math.cos(e / 300 + p.f));
        ctx.fillStyle = p.c;
        if (p.forma) ctx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * 0.66);
        else { ctx.beginPath(); ctx.ellipse(0, 0, p.s * 0.6, p.s * 0.3, 0, 0, 6.29); ctx.fill(); }
        ctx.restore();
      }
      if (e < 5600) requestAnimationFrame(cuadro); else { cv.width = 0; cv.height = 0; }   // libera la memoria del lienzo
    };
    requestAnimationFrame(cuadro);
  }

  /* ---------------- Música ---------------- */
  const M = C.musica || {};
  let audio = null;
  function iniciarMusica() {
    const btn = $("#musica");
    if (M.activa === false || !M.src) return;
    audio = new Audio(M.src);
    audio.loop = true; audio.preload = "none";
    btn.hidden = false;
    btn.innerHTML = `<span class="musica__barras" aria-hidden="true"><i></i><i></i><i></i><i></i></span>`;
    btn.addEventListener("click", () => (audio.paused ? sonar() : callar()));
    let estabaSonando = false;
    D.addEventListener("visibilitychange", () => {
      if (D.hidden) { estabaSonando = !audio.paused; audio.pause(); actualizarBoton(); }
      else if (estabaSonando) sonar();
    });
  }
  function actualizarBoton() {
    const btn = $("#musica"); if (!audio) return;
    const on = !audio.paused;
    btn.classList.toggle("sonando", on);
    btn.setAttribute("aria-label", on ? T.musicaOn : T.musicaOff);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  }
  function sonar(primera) {
    if (!audio) return;
    if (primera && M.inicioSegundos) { try { audio.currentTime = M.inicioSegundos; } catch (e) {} }
    const meta = clamp(M.volumen == null ? 0.6 : M.volumen);
    audio.volume = 0;
    const pr = audio.play();
    const subir = () => {
      actualizarBoton();
      const t0 = performance.now();
      const paso = (t) => { const k = clamp((t - t0) / 2500); audio.volume = meta * k; if (k < 1 && !audio.paused) requestAnimationFrame(paso); };
      requestAnimationFrame(paso);
    };
    if (pr && pr.then) pr.then(subir).catch(actualizarBoton); else subir();
  }
  function callar() { if (audio) { audio.pause(); actualizarBoton(); } }

  /* ==========================================================================
     APERTURA DEL SOBRE
     ========================================================================== */
  let abierto = false;
  async function abrir() {
    if (abierto) return;
    abierto = true;
    const portada = $("#portada"), sobre = $(".sobre", portada);
    sonar(true);

    portada.classList.add("abriendo");
    await new Promise(requestAnimationFrame);
    portada.classList.add("p-rompe");
    await sleep(REDUCIDO ? 50 : 620);
    portada.classList.add("p-solapa");
    await sleep(REDUCIDO ? 50 : 580);
    sobre.classList.add("solapa-atras");
    await sleep(REDUCIDO ? 50 : 520);
    portada.classList.add("p-tarjeta");
    await sleep(REDUCIDO ? 50 : 1250);

    // La tarjeta sale del sobre y vuela al centro de la pantalla
    const original = $(".sobre__tarjeta", portada);
    const r = original.getBoundingClientRect();
    const w0 = original.offsetWidth, h0 = original.offsetHeight;
    const vuelo = original.cloneNode(true);
    vuelo.classList.add("tarjeta-vuelo");
    const vw = innerWidth, vh = innerHeight;
    const esc1 = Math.min((vw * 0.92) / w0, (vh * 0.62) / h0, 1.9);
    const w1 = w0 * esc1, h1 = h0 * esc1;
    // La tarjeta se maqueta UNA vez a su tamaño final y se anima solo con transform
    // (escala + traslación en GPU) en lugar de cambiar left/top/width/height en cada cuadro.
    vuelo.style.cssText = `left:${(vw - w1) / 2}px;top:${(vh - h1) / 2}px;width:${w1}px;height:${h1}px;transition:none;transform-origin:50% 50%;will-change:transform,opacity`;
    const dx = r.left + r.width / 2 - vw / 2, dy = r.top + r.height / 2 - vh / 2;
    D.body.appendChild(vuelo);
    original.style.visibility = "hidden";
    portada.classList.add("p-sale");

    const anim = vuelo.animate([
      { transform: `translate(${dx}px, ${dy}px) scale(${1 / esc1}) rotate(-2deg)` },
      { transform: "translate(0px, 0px) scale(1) rotate(0deg)" }
    ], { duration: REDUCIDO ? 10 : 1400, easing: "cubic-bezier(.65,0,.25,1)", fill: "forwards" });
    await anim.finished.catch(() => {});
    await sleep(REDUCIDO ? 0 : 900);

    // Se revela la invitación
    window.scrollTo(0, 0);
    const main = $("#invitacion");
    main.classList.add("activa"); main.removeAttribute("aria-hidden");
    D.body.classList.remove("bloqueado");
    iniciarRevelado();
    iniciarFondosHistoria();
    $$(".polvo").forEach(polvo);
    confeti();
    $("#musica").classList.add("visible");
    const fuera = vuelo.animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(1.06)" }], { duration: REDUCIDO ? 10 : 1100, easing: "ease", fill: "forwards" });
    portada.style.transition = "opacity .9s"; portada.style.opacity = "0";
    await fuera.finished.catch(() => {});
    vuelo.remove(); portada.remove();
  }

  /* ==========================================================================
     ARRANQUE
     ========================================================================== */
  async function iniciar() {
    aplicarTema();
    ESQ_SVG = ORN.corner();
    construirPortada();
    construirInvitacion();

    iniciarScroll();
    iniciarCuenta();
    iniciarGaleria();
    iniciarVideos();
    iniciarRSVP();
    iniciarMusica();

    const portada = $("#portada");
    const fondo = P.fondo;
    const fuentes = D.fonts && D.fonts.ready ? Promise.race([D.fonts.ready, sleep(3000)]) : sleep(300);
    const [okFondo] = await Promise.all([precargar(fondo, 5000), fuentes, sleep(900)]);
    if (okFondo) $(".portada__fondo", portada).style.backgroundImage = `url("${fondo}")`;
    // Re-render de SVG con texto una vez cargadas las fuentes (lacre)
    $$(".svg-defs text").forEach((t) => t.setAttribute("font-family", `'${FUENTES.grabada}', serif`));

    const pre = $("#precarga");
    pre.classList.add("fuera");
    // Al terminar de desvanecerse se elimina: sus animaciones infinitas seguían corriendo ocultas toda la visita
    setTimeout(() => pre.remove(), 1200);
    await sleep(250);
    portada.classList.add("lista");
    // Mientras el invitado ve el sobre: se adelanta la foto principal y se empieza a cargar la música
    setTimeout(() => {
      if (C.hero && C.hero.foto) precargar(C.hero.foto, 15000);
      if (audio && !abierto) { audio.preload = "auto"; try { audio.load(); } catch (e) {} }
    }, 600);

    if (P.mostrar === false || location.hash === "#sin-portada") { abrir(); return; }
    $(".sobre", portada).addEventListener("click", abrir);
    D.addEventListener("keydown", (e) => { if (!abierto && (e.key === "Enter" || e.key === " ") && D.activeElement === D.body) abrir(); });
  }

  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", iniciar); else iniciar();
})();