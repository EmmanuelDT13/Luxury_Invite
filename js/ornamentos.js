/* ==========================================================================
   ORNAMENTOS
   Generador de marcos dorados, filigranas, lacre e iconos (SVG puro).
   No requiere editar nada aquí: los colores vienen de config.js.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------- utilidades geométricas ---------------- */
  const f = (n) => (Math.round(n * 10) / 10).toString();
  const norm = (x, y) => { const l = Math.hypot(x, y) || 1; return { x: x / l, y: y / l }; };

  function bez(p0, p1, p2, p3, n) {
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, m = 1 - t;
      pts.push({
        x: m * m * m * p0.x + 3 * m * m * t * p1.x + 3 * m * t * t * p2.x + t * t * t * p3.x,
        y: m * m * m * p0.y + 3 * m * m * t * p1.y + 3 * m * t * t * p2.y + t * t * t * p3.y
      });
    }
    return pts;
  }

  // Espiral (voluta) que continúa la tangente "dir" desde el punto p
  function curl(p, dir, r0, sweep, k, s, n) {
    const nx = -s * dir.y, ny = s * dir.x;
    const c = { x: p.x + r0 * nx, y: p.y + r0 * ny };
    const th0 = Math.atan2(p.y - c.y, p.x - c.x);
    const pts = [];
    for (let i = 1; i <= n; i++) {
      const t = i / n, th = th0 + s * sweep * t, r = r0 * Math.exp(-k * t);
      pts.push({ x: c.x + r * Math.cos(th), y: c.y + r * Math.sin(th) });
    }
    return pts;
  }

  // Convierte una línea central en una forma rellena con grosor variable (trazo caligráfico)
  function taper(pts, wf) {
    const L = [], R = [], n = pts.length;
    for (let i = 0; i < n; i++) {
      const a = pts[Math.max(i - 1, 0)], b = pts[Math.min(i + 1, n - 1)];
      const nn = norm(-(b.y - a.y), b.x - a.x);
      const w = wf(i / (n - 1));
      L.push(f(pts[i].x + nn.x * w) + " " + f(pts[i].y + nn.y * w));
      R.push(f(pts[i].x - nn.x * w) + " " + f(pts[i].y - nn.y * w));
    }
    return "M" + L.join("L") + "L" + R.reverse().join("L") + "Z";
  }

  // Brazo con voluta: curva + espiral, grosor que crece y luego se afina
  function scrollArm(p0, p1, p2, p3, o) {
    const arm = bez(p0, p1, p2, p3, 26);
    const d = norm(p3.x - p2.x, p3.y - p2.y);
    const c = curl(p3, d, o.r, o.sweep || Math.PI * 1.55, o.k || 1.35, o.s || 1, 30);
    const pts = arm.concat(c);
    const w0 = o.w0 == null ? 0.6 : o.w0, wm = o.w || 3, w1 = o.w1 == null ? 0.7 : o.w1;
    const path = taper(pts, (t) => {
      if (t < 0.45) return w0 + (wm - w0) * Math.sin((t / 0.45) * Math.PI / 2);
      return w1 + (wm - w1) * Math.cos(((t - 0.45) / 0.55) * Math.PI / 2);
    });
    const end = pts[pts.length - 1];
    return path + circ(end.x, end.y, (o.ball || 1.6));
  }

  function leaf(b, t, w, bend) {
    const d = norm(t.x - b.x, t.y - b.y), nx = -d.y, ny = d.x;
    const L = Math.hypot(t.x - b.x, t.y - b.y);
    const p1 = { x: b.x + d.x * L * 0.33 + nx * bend, y: b.y + d.y * L * 0.33 + ny * bend };
    const p2 = { x: b.x + d.x * L * 0.66 + nx * bend * 0.4, y: b.y + d.y * L * 0.66 + ny * bend * 0.4 };
    return taper(bez(b, p1, p2, t, 22), (u) => w * Math.pow(Math.sin(Math.PI * Math.min(u * 1.08, 1)), 0.75) + 0.05);
  }

  function circ(cx, cy, r) {
    return `M${f(cx - r)} ${f(cy)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`;
  }

  const mirror = (d) => `<path d="${d}" transform="scale(-1 1)"/>`;
  const both = (d) => `<path d="${d}"/>` + mirror(d);

  /* ---------------- motivos ---------------- */

  // Concha / abanico central: gajos con borde festoneado
  function shell(R, n, spread) {
    let d = "";
    const a0 = (-90 - spread / 2) * Math.PI / 180, step = (spread * Math.PI / 180) / n, gap = step * 0.07;
    for (let i = 0; i < n; i++) {
      const k = Math.abs(i - (n - 1) / 2) / ((n - 1) / 2);
      const r = R * (1 - 0.18 * k * k);
      const a1 = a0 + i * step + gap, a2 = a0 + (i + 1) * step - gap, am = (a1 + a2) / 2;
      d += `M${f(Math.cos(am) * 3)} ${f(Math.sin(am) * 3)}L${f(Math.cos(a1) * r)} ${f(Math.sin(a1) * r)}Q${f(Math.cos(am) * r * 1.16)} ${f(Math.sin(am) * r * 1.16)} ${f(Math.cos(a2) * r)} ${f(Math.sin(a2) * r)}Z`;
    }
    return d;
  }

  // Cresta barroca (eje en 0,0, crece hacia arriba)
  function crestPaths(opts) {
    const o = Object.assign({ shell: true }, opts || {});
    let half = "";
    // gran voluta en C que nace del centro, se arquea y se enrolla hacia dentro
    half += scrollArm({ x: -5, y: -3 }, { x: -22, y: -26 }, { x: -54, y: -34 }, { x: -68, y: -16 }, { r: 9.5, w: 3.4, s: -1, sweep: Math.PI * 1.7, ball: 1.8 });
    // voluta en S que corre sobre el marco
    half += scrollArm({ x: -6, y: 3 }, { x: -40, y: 4 }, { x: -72, y: 10 }, { x: -96, y: 27 }, { r: 7, w: 2.6, s: 1, sweep: Math.PI * 1.6, ball: 1.4 });
    // hojas de acanto
    half += leaf({ x: -30.5, y: -22.7 }, { x: -38, y: -52 }, 3.6, -9);
    half += leaf({ x: -51, y: -25.5 }, { x: -78, y: -38 }, 3, 7);
    half += leaf({ x: -16.7, y: -14.9 }, { x: -13, y: -40 }, 2.4, -6);
    half += leaf({ x: -63.7, y: 11.5 }, { x: -80, y: -4 }, 2.4, 5);
    half += leaf({ x: -100, y: 33 }, { x: -118, y: 50 }, 2, -4);
    half += circ(-123, 56, 1.5) + circ(-127, 62, 1.1) + circ(-130, 67, .8);
    let d = both(half);
    if (o.shell) {
      d += `<path d="${shell(30, 11, 150)}"/>`;
      d += `<path d="${leaf({ x: 0, y: -33 }, { x: 0, y: -54 }, 3, 0)}${circ(0, -59, 2.2)}"/>`;
    } else {
      d += `<path d="${leaf({ x: 0, y: -2 }, { x: 0, y: -26 }, 4.2, 0)}"/>`;
    }
    d += `<path d="${circ(0, 0, 6.5)}"/>`;
    return d;
  }

  function rosette(r) {
    let d = "";
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      d += leaf({ x: Math.cos(a) * r * 0.35, y: Math.sin(a) * r * 0.35 }, { x: Math.cos(a) * r, y: Math.sin(a) * r }, r * 0.17, 0);
    }
    return `<path d="${d}"/><path d="${circ(0, 0, r * 0.32)}"/>`;
  }

  /* ---------------- definiciones globales (degradados y filtros) ---------------- */
  function defs(c) {
    const rv = Object.assign({ profundidad: 1, brillo: 1, patina: 1, colorPatina: "#3A2A12" }, c.relieve || {});
    const R = {
      ss: (4.8 * rv.profundidad).toFixed(2),
      sc: (1.15 * rv.brillo).toFixed(2),
      k2: (0.7 * rv.brillo).toFixed(2),
      patina: Math.min(1, 0.55 * rv.patina).toFixed(2),
      patinaColor: rv.colorPatina,
      luz: c.oroBrillo || "#fff4d6"
    };
    COLORES = c;
    const txt = `
<svg class="svg-defs" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
 <defs>
  <linearGradient id="g-oro" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${c.oroProfundo}"/>
    <stop offset=".2" stop-color="${c.oro}"/>
    <stop offset=".36" stop-color="${c.oroBrillo}"/>
    <stop offset=".52" stop-color="${c.oro}"/>
    <stop offset=".7" stop-color="${c.oroClaro}"/>
    <stop offset=".88" stop-color="${c.oroProfundo}"/>
    <stop offset="1" stop-color="${c.oro}"/>
  </linearGradient>
  <linearGradient id="g-oro-v" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${c.oroBrillo}"/>
    <stop offset=".45" stop-color="${c.oro}"/>
    <stop offset="1" stop-color="${c.oroProfundo}"/>
  </linearGradient>
  <radialGradient id="g-vineta-r" cx=".5" cy=".5" r=".72">
    <stop offset=".62" stop-color="#000" stop-opacity="0"/>
    <stop offset="1" stop-color="#2a1a05" stop-opacity=".38"/>
  </radialGradient>
  <radialGradient id="g-vineta" cx=".5" cy=".5" r=".5">
    <stop offset=".72" stop-color="#000" stop-opacity="0"/>
    <stop offset="1" stop-color="#2a1a05" stop-opacity=".42"/>
  </radialGradient>

  <!-- Relieve metálico (oro antiguo): volumen, brillo en lo alto y pátina oscura en los bordes del tallado -->
  <filter id="f-dorado" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">
    <feGaussianBlur in="SourceAlpha" stdDeviation="1.25" result="b"/>
    <feSpecularLighting in="b" surfaceScale="${R.ss}" specularConstant="${R.sc}" specularExponent="22" lighting-color="${R.luz}" result="s">
      <feDistantLight azimuth="235" elevation="34"/>
    </feSpecularLighting>
    <feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/>
    <feDiffuseLighting in="b" surfaceScale="${R.ss}" diffuseConstant="1" lighting-color="#ffffff" result="d">
      <feDistantLight azimuth="235" elevation="44"/>
    </feDiffuseLighting>
    <feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1.34" k2="0" k3="0" k4="0" result="sh"/>
    <feComposite in="s2" in2="sh" operator="arithmetic" k1="0" k2="${R.k2}" k3="1" k4="0" result="lit"/>
    <feMorphology in="SourceAlpha" operator="erode" radius=".9" result="er"/>
    <feComposite in="SourceAlpha" in2="er" operator="out" result="borde"/>
    <feGaussianBlur in="borde" stdDeviation=".4" result="borde2"/>
    <feFlood flood-color="${R.patinaColor}" flood-opacity="${R.patina}"/>
    <feComposite in2="borde2" operator="in" result="pat"/>
    <feMerge result="m"><feMergeNode in="lit"/><feMergeNode in="pat"/></feMerge>
    <feComposite in="m" in2="SourceAlpha" operator="in" result="g"/>
    <feDropShadow in="g" dx="0" dy="1.7" stdDeviation="1.35" flood-color="#2a1d09" flood-opacity=".45"/>
  </filter>

  <!-- Lacre: mapa de alturas en escala de grises -> cera con volumen -->
  <filter id="f-lacre" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
    <feColorMatrix in="SourceGraphic" type="luminanceToAlpha" result="h0"/>
    <feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="2" seed="4" result="tx"/>
    <feColorMatrix in="tx" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  .09 0 0 0 0" result="txa"/>
    <feComposite in="h0" in2="txa" operator="arithmetic" k2="1" k3="1" result="h"/>
    <feGaussianBlur in="h" stdDeviation="1.7" result="hb"/>
    <feDiffuseLighting in="hb" surfaceScale="7" diffuseConstant="1.08" lighting-color="#ffffff" result="dif">
      <feDistantLight azimuth="225" elevation="48"/>
    </feDiffuseLighting>
    <feSpecularLighting in="hb" surfaceScale="7" specularConstant=".9" specularExponent="24" lighting-color="#fff6e0" result="spe">
      <feDistantLight azimuth="225" elevation="38"/>
    </feSpecularLighting>
    <feFlood class="lacre-color" flood-color="${c.lacre}" result="col"/>
    <feComposite in="col" in2="dif" operator="arithmetic" k1="1.22" result="sh"/>
    <feComposite in="spe" in2="sh" operator="arithmetic" k2=".6" k3="1" result="lit"/>
    <feComponentTransfer in="SourceAlpha" result="mask"><feFuncA type="discrete" tableValues="0 1 1 1 1 1 1 1 1 1"/></feComponentTransfer>
    <feComposite in="lit" in2="mask" operator="in"/>
  </filter>

  <!-- Grano de papel (se aplica sobre la forma) -->
  <filter id="f-grano" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="11" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 .36  0 0 0 0 .29  0 0 0 0 .2  -.75 0 0 0 .42" result="g"/>
    <feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="2" seed="3" result="m"/>
    <feColorMatrix in="m" type="matrix" values="0 0 0 0 .45  0 0 0 0 .36  0 0 0 0 .22  -.32 0 0 0 .19" result="m2"/>
    <feMerge result="t"><feMergeNode in="m2"/><feMergeNode in="g"/></feMerge>
    <feComposite in="t" in2="SourceAlpha" operator="in"/>
  </filter>

  <!-- Borde de papel artesanal (deckle) -->
  <filter id="f-deckle" x="-3%" y="-3%" width="106%" height="106%">
    <feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="3" seed="2" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
 </defs>
</svg>`;
    DEFS_TXT = txt.slice(txt.indexOf("<defs>"), txt.indexOf("</defs>") + 7);
    return txt;
  }

  /* ---------------- registro de piezas reutilizables ----------------
     Cada ornamento se dibuja UNA sola vez dentro de <defs> y se reutiliza con <use>.
     El resultado visual es idéntico, pero el HTML pesa una fracción y el navegador
     procesa mucho menos. */
  const REGISTRO = {};
  let DEFS_TXT = "", COLORES = {};
  /* Ornamentos con relieve (marcos y filigranas) como IMAGEN: el navegador dibuja el filtro de luz
     una sola vez por tamaño y luego lo trata como un bitmap. Antes eran SVG "vivos" que se volvían a
     calcular (en el hilo principal en Safari) cada vez que algo cercano se repintaba o se animaba. */
  const IMAGENES = {};
  function comoImagen(id, vb, contenido) {
    if (!IMAGENES[id]) {
      const [x, y, w, h] = vb;
      let cuerpo = contenido().replace(/var\(--oro-profundo\)/g, COLORES.oroProfundo || "#5C4A28");
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${f(x)} ${f(y)} ${f(w)} ${f(h)}" width="${f(w)}" height="${f(h)}">${DEFS_TXT}${cuerpo}</svg>`;
      try { IMAGENES[id] = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" })); }
      catch (e) { IMAGENES[id] = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg); }
    }
    return IMAGENES[id];
  }
  function reutilizar(id, contenido) {
    if (!REGISTRO[id]) {
      REGISTRO[id] = `<g id="${id}">${contenido()}</g>`;
      const defsEl = typeof document !== "undefined" && document.querySelector(".svg-defs defs");
      if (defsEl) defsEl.insertAdjacentHTML("beforeend", REGISTRO[id]);
    }
    return `<use href="#${id}"/>`;
  }

  /* ---------------- piezas públicas ---------------- */

  // Marco ovalado dorado con cresta, perlas y rosetas
  function frameOval(src, o) {
    o = Object.assign({ alt: "", sencillo: false, pos: "50% 35%" }, o || {});
    const W = 400, H = 560, cx = 200, cy = 300, rx = 148, ry = 200;
    const e = (dr, extra) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx + dr}" ry="${ry + dr}" ${extra}/>`;
    const crestTop = o.sencillo ? 0.62 : 1.05;
    const dibujo = () => `
  ${e(0, 'fill="url(#g-vineta)"')}
  <g filter="url(#f-dorado)" fill="none">
    ${e(21.5, `stroke="url(#g-oro)" stroke-width="1.4"`)}
    ${e(15, 'style="stroke:var(--oro-profundo)" stroke-width="9"')}
    ${e(15, 'stroke="url(#g-oro)" stroke-width="9" stroke-dasharray="1.7 2.1"')}
    ${e(8, 'stroke="url(#g-oro)" stroke-width="5.5"')}
    ${e(2.6, 'stroke="url(#g-oro-v)" stroke-width="4.2" stroke-linecap="round" stroke-dasharray="0 7.4"')}
    ${e(-0.5, 'style="stroke:var(--oro-profundo)" stroke-width="1.6"')}
  </g>
  <g filter="url(#f-dorado)" fill="url(#g-oro)">
    <g transform="translate(${cx} ${cy - ry - 21}) scale(${crestTop})">${crestPaths({ shell: true })}</g>
    <g transform="translate(${cx} ${cy + ry + 21}) scale(${o.sencillo ? 0.5 : 0.72} -${o.sencillo ? 0.5 : 0.72})">${crestPaths({ shell: !o.sencillo })}</g>
    ${o.sencillo ? "" : `<g transform="translate(${cx - rx - 21} ${cy})">${rosette(15)}</g><g transform="translate(${cx + rx + 21} ${cy})">${rosette(15)}</g>`}
  </g>`;
    const vb = [-10, -6, W + 20, H + 32];
    const url = comoImagen(o.sencillo ? "orn-oval-s" : "orn-oval", vb, dibujo);
    const svg = `<img class="marco-oval__svg" src="${url}" alt="" aria-hidden="true" decoding="async" style="inset:auto;left:${f(100 * vb[0] / W)}%;top:${f(100 * vb[1] / H)}%;width:${f(100 * vb[2] / W)}%;height:${f(100 * vb[3] / H)}%">`;
    return `<div class="marco-oval${o.sencillo ? " marco-oval--sencillo" : ""}">
      <div class="marco-oval__ventana"><img class="marco-oval__foto" src="${src}" alt="${o.alt}" loading="${o.prioridad ? "eager" : "lazy"}"${o.prioridad ? ' fetchpriority="high"' : ""} decoding="async" style="object-position:${o.pos}"></div>
      ${svg}
    </div>`;
  }

  // Ondulado tallado sobre la cara del marco (una "cinta" serpenteante a lo largo de un lado)
  function serpentina(x0, y0, x1, y1, amp, onda, w) {
    const L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.round(L / onda));
    const ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy, ny = ux, pts = [];
    for (let i = 0; i <= 80; i++) {
      const t = i / 80, o = amp * Math.sin(t * n * Math.PI * 2);
      pts.push({ x: x0 + ux * L * t + nx * o, y: y0 + uy * L * t + ny * o });
    }
    return taper(pts, (t) => w * (0.35 + 0.65 * Math.sin(Math.PI * t)));
  }

  /* Marco rectangular barroco (inspirado en marcos tallados de oro antiguo).
     W×H = medida exterior del marco · M = ancho de la moldura · k = escala de los ornamentos.
     Devuelve el SVG (reutilizado con <use>) y la posición de la ventana para la foto/video. */
  function rectGeometria(W, H, M, k) {
    const P = { t: 70 * k, l: 30 * k, r: 30 * k, b: 52 * k };
    return { W, H, M, k, P, vbW: W + P.l + P.r, vbH: H + P.t + P.b };
  }
  // Ornamentos tallados "pesados" (rosas, acantos y volutas gruesas), como en los marcos de referencia
  function rosaBarroca(r) {
    let d = "", d2 = "";
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4 + Math.PI / 8;
      d += leaf({ x: Math.cos(a) * r * 0.3, y: Math.sin(a) * r * 0.3 }, { x: Math.cos(a) * r, y: Math.sin(a) * r }, r * 0.25, r * 0.06);
      const b = a + Math.PI / 8;
      d2 += leaf({ x: Math.cos(b) * r * 0.2, y: Math.sin(b) * r * 0.2 }, { x: Math.cos(b) * r * 0.62, y: Math.sin(b) * r * 0.62 }, r * 0.17, 0);
    }
    return `<path d="${d}"/><path d="${d2}"/><path d="${circ(0, 0, r * 0.24)}"/>`;
  }
  const swap = (d) => `<path d="${d}" transform="matrix(0 1 1 0 0 0)"/>`;
  // Guirnalda de laurel tallada a lo largo de una línea
  function laurel(x0, y0, x1, y1, paso, largo, ancho) {
    const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy, ny = ux;
    const n = Math.max(2, Math.floor(L / paso));
    let d = "";
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, bx = x0 + ux * L * t, by = y0 + uy * L * t, lado = i % 2 ? 1 : -1;
      const tip = { x: bx + ux * largo * 0.8 + nx * largo * 0.55 * lado, y: by + uy * largo * 0.8 + ny * largo * 0.55 * lado };
      d += leaf({ x: bx, y: by }, tip, ancho, lado * ancho * 0.6);
    }
    return d + taper([{ x: x0, y: y0 }, { x: x1, y: y1 }], () => ancho * 0.28);
  }
  function esquinaPesada() {
    let e = "";
    e += scrollArm({ x: 14, y: 4 }, { x: 46, y: -6 }, { x: 82, y: 0 }, { x: 100, y: 16 }, { r: 9, w: 5.2, s: 1, ball: 2.6 });
    e += leaf({ x: 24, y: 2 }, { x: 74, y: -12 }, 7.5, -8);
    e += leaf({ x: 48, y: 6 }, { x: 96, y: 4 }, 5, 6);
    e += circ(110, 10, 2.5) + circ(117, 9, 1.7);
    const fuera = leaf({ x: 0, y: 0 }, { x: -24, y: -24 }, 9, 0) + leaf({ x: 0, y: 0 }, { x: -30, y: -6 }, 6.5, -4) + leaf({ x: 0, y: 0 }, { x: -6, y: -30 }, 6.5, 4);
    return `<path d="${fuera}"/><path d="${e}"/>${swap(e)}
      <path d="${leaf({ x: 16, y: 16 }, { x: 46, y: 46 }, 7, 0)}"/>
      <g transform="translate(6 6)">${rosaBarroca(24)}</g>`;
  }
  function cartelaSuperior() {
    let h = "";
    h += scrollArm({ x: -10, y: 2 }, { x: -32, y: -16 }, { x: -60, y: -24 }, { x: -76, y: -8 }, { r: 8, w: 5, s: -1, sweep: Math.PI * 1.6, ball: 2.4 });
    h += leaf({ x: -20, y: 8 }, { x: -104, y: 14 }, 7.5, 8);
    h += leaf({ x: -36, y: -16 }, { x: -58, y: -36 }, 4.6, -4);
    h += circ(-112, 15, 2.4) + circ(-119, 16, 1.6);
    return both(h) + `<path d="${shell(38, 11, 150)}"/>
      <path d="${leaf({ x: 0, y: -40 }, { x: 0, y: -64 }, 6, 0)}${circ(0, -69, 3)}"/>
      <g transform="translate(0 2)">${rosaBarroca(16)}</g>`;
  }
  function cartelaLateral() {
    const l = leaf({ x: 0, y: -8 }, { x: 5, y: -60 }, 7, 7) + leaf({ x: 0, y: -22 }, { x: -18, y: -48 }, 4.5, -3);
    return `<path d="${l}"/><path d="${l}" transform="scale(1 -1)"/><path d="${shell(22, 7, 120)}" transform="rotate(-90)"/>${rosaBarroca(15)}`;
  }
  function rectDibujo(g) {
    const { W, H, M, k } = g, m = M / 54;
    const ring = (inset, width, attrs) => `<rect x="${f(inset + width / 2)}" y="${f(inset + width / 2)}" width="${f(W - 2 * inset - width)}" height="${f(H - 2 * inset - width)}" stroke-width="${f(width)}" fill="none" ${attrs}/>`;
    const c = 31 * m;                       // línea central de la cara principal
    const ec = 120 * k, cs = 108 * k, cl = 64 * k;   // espacio que ocupan esquinas, cartela superior y laterales
    const sp = (x0, y0, x1, y1) => laurel(x0, y0, x1, y1, 15 * m, 11 * m, 3.6 * m);
    let ser = sp(ec, c, W / 2 - cs, c) + sp(W / 2 + cs, c, W - ec, c) + sp(ec, H - c, W / 2 - cs * 0.75, H - c) + sp(W / 2 + cs * 0.75, H - c, W - ec, H - c);
    ser += sp(c, ec, c, H / 2 - cl) + sp(c, H / 2 + cl, c, H - ec) + sp(W - c, ec, W - c, H / 2 - cl) + sp(W - c, H / 2 + cl, W - c, H - ec);
    const ci = 14 * m, esq = `<g>${esquinaPesada()}</g>`;
    const pos = (x, y, sx, sy, sc) => `transform="translate(${f(x)} ${f(y)}) scale(${f(sx * sc)} ${f(sy * sc)})"`;
    return `
      <rect x="${f(M)}" y="${f(M)}" width="${f(W - 2 * M)}" height="${f(H - 2 * M)}" fill="url(#g-vineta-r)"/>
      <g filter="url(#f-dorado)">
        ${ring(0, 7 * m, 'stroke="url(#g-oro)"')}
        ${ring(7 * m, 11 * m, 'style="stroke:var(--oro-profundo)"')}
        ${ring(7 * m, 11 * m, 'stroke="url(#g-oro)" stroke-dasharray="2 2.4"')}
        ${ring(18 * m, 25 * m, 'stroke="url(#g-oro)"')}
        ${ring(43 * m, 3 * m, 'style="stroke:var(--oro-profundo)"')}
        ${ring(46 * m, 4.4 * m, 'stroke="url(#g-oro-v)" stroke-linecap="round" stroke-dasharray="0 7"')}
        ${ring(50.6 * m, 3.4 * m, 'style="stroke:var(--oro-profundo)"')}
      </g>
      <g filter="url(#f-dorado)" fill="url(#g-oro)">
        <path d="${ser}"/>
        <g ${pos(ci, ci, 1, 1, k)}>${esq}</g><g ${pos(W - ci, ci, -1, 1, k)}>${esq}</g>
        <g ${pos(ci, H - ci, 1, -1, k)}>${esq}</g><g ${pos(W - ci, H - ci, -1, -1, k)}>${esq}</g>
        <g ${pos(W / 2, 9 * m, 1, 1, 1.05 * k)}>${cartelaSuperior()}</g>
        <g ${pos(W / 2, H - 9 * m, 1, -1, 0.72 * k)}>${cartelaSuperior()}</g>
        <g ${pos(c, H / 2, 1, 1, 0.95 * k)}>${cartelaLateral()}</g>
        <g ${pos(W - c, H / 2, -1, 1, 0.95 * k)}>${cartelaLateral()}</g>
      </g>`;
  }
  // Variantes listas: retrato (portada), foto (capítulos) y video (16:9)
  const VARIANTES = {
    retrato: () => rectGeometria(400, 520, 54, 1),
    foto: () => rectGeometria(300, 392, 40, 0.72),
    video: () => rectGeometria(640, 395, 40, 0.74)
  };
  function frameRect(contenido, o) {
    o = Object.assign({ variante: "retrato", clase: "" }, o || {});
    const g = (VARIANTES[o.variante] || VARIANTES.retrato)();
    const { W, H, M, P, vbW, vbH } = g;
    const pct = (v, t) => (100 * v / t).toFixed(3) + "%";
    const ventana = `left:${pct(P.l + M, vbW)};top:${pct(P.t + M, vbH)};width:${pct(W - 2 * M, vbW)};height:${pct(H - 2 * M, vbH)}`;
    const svg = `<img class="marco-rect__svg" src="${comoImagen("orn-rect-" + o.variante, [-P.l, -P.t, vbW, vbH], () => rectDibujo(g))}" alt="" aria-hidden="true" decoding="async">`;
    return `<div class="marco-rect marco-rect--${o.variante} ${o.clase}" style="aspect-ratio:${f(vbW)}/${f(vbH)}">
      <div class="marco-rect__ventana" style="${ventana}">${contenido}</div>
      ${svg}
    </div>`;
  }
  const imgMarco = (src, o) => `<img class="marco-rect__foto" src="${src}" alt="${o.alt || ""}" loading="${o.prioridad ? "eager" : "lazy"}"${o.prioridad ? ' fetchpriority="high"' : ""} decoding="async" style="object-position:${o.pos || "50% 40%"}">`;
  function framePhoto(src, o) {
    o = o || {};
    return frameRect(imgMarco(src, o), { variante: o.variante || "retrato", clase: o.clase || "" });
  }

  // Filigrana divisoria horizontal (dorada o en relieve)
  function divider(cls) {
    const dibujo = () => {
    let half = "";
    half += scrollArm({ x: -10, y: 0 }, { x: -40, y: -2 }, { x: -70, y: -14 }, { x: -96, y: -6 }, { r: 7, w: 2.2, s: -1, ball: 1.2 });
    half += scrollArm({ x: -12, y: 2 }, { x: -34, y: 10 }, { x: -56, y: 14 }, { x: -70, y: 6 }, { r: 4.6, w: 1.6, s: 1, ball: 1 });
    half += leaf({ x: -60, y: -9 }, { x: -78, y: -24 }, 2.2, 3);
    half += leaf({ x: -100, y: -4 }, { x: -132, y: 0 }, 1.6, -2);
    half += circ(-138, 0, 1.3);
    let d = both(half);
    d += `<path d="${leaf({ x: 0, y: -2 }, { x: 0, y: -18 }, 3.2, 0)}${leaf({ x: 0, y: 2 }, { x: 0, y: 14 }, 2.6, 0)}${leaf({ x: -2, y: 0 }, { x: -12, y: 0 }, 2.2, 0)}${leaf({ x: 2, y: 0 }, { x: 12, y: 0 }, 2.2, 0)}${circ(0, 0, 2.6)}"/>`;
    return `<g fill="url(#g-oro)" filter="url(#f-dorado)">${d}</g>`;
    };
    return `<img class="filigrana ${cls || ""}" src="${comoImagen("orn-div", [-145, -30, 290, 50], dibujo)}" alt="" aria-hidden="true" decoding="async" width="290" height="50">`;
  }

  // Esquinero en relieve (tono sobre tono)
  function corner() {
    const dibujo = () => {
    let a = "";
    a += scrollArm({ x: 8, y: 8 }, { x: 60, y: 6 }, { x: 110, y: 12 }, { x: 150, y: 30 }, { r: 11, w: 3.4, s: 1, ball: 2 });
    a += scrollArm({ x: 14, y: 16 }, { x: 46, y: 30 }, { x: 70, y: 40 }, { x: 92, y: 36 }, { r: 7, w: 2.2, s: -1, ball: 1.4 });
    a += leaf({ x: 64, y: 10 }, { x: 96, y: 28 }, 3.4, -5);
    a += leaf({ x: 120, y: 18 }, { x: 170, y: 10 }, 2.6, 4);
    a += circ(182, 8, 2) + circ(192, 6, 1.4);
    const sym = `<path d="${a}"/><path d="${a}" transform="matrix(0 1 1 0 0 0)"/>`;
    let fan = "";
    for (let i = 0; i < 7; i++) {
      const ang = (20 + i * 8.3) * Math.PI / 180, L = 48 - Math.abs(i - 3) * 5;
      fan += leaf({ x: 10, y: 10 }, { x: 10 + Math.cos(ang) * L, y: 10 + Math.sin(ang) * L }, 4, (i - 3) * 0.8);
    }
    return `<g fill="currentColor">${sym}<path d="${fan}"/><path d="${circ(12, 12, 6)}"/></g>`;
    };
    return `<svg class="esquinero" viewBox="0 0 200 200" aria-hidden="true">${reutilizar("orn-esq", dibujo)}</svg>`;
  }

  // Lacre con monograma (mapa de alturas)
  function sealBlob(seed) {
    let s = seed || 7;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    const ph = [rnd() * 6.28, rnd() * 6.28, rnd() * 6.28, rnd() * 6.28];
    const N = 72, pts = [];
    for (let i = 0; i < N; i++) {
      const a = i / N * Math.PI * 2;
      const r = 90 + 3.2 * Math.sin(3 * a + ph[0]) + 2.2 * Math.sin(5 * a + ph[1]) + 1.4 * Math.sin(9 * a + ph[2]) + 4 * Math.pow(Math.max(0, Math.sin(2 * a + ph[3])), 6);
      pts.push({ x: 100 + r * Math.cos(a), y: 100 + r * Math.sin(a) });
    }
    let d = `M${f(pts[0].x)} ${f(pts[0].y)}`;
    for (let i = 0; i < N; i++) {
      const p0 = pts[(i - 1 + N) % N], p1 = pts[i], p2 = pts[(i + 1) % N], p3 = pts[(i + 2) % N];
      d += `C${f(p1.x + (p2.x - p0.x) / 6)} ${f(p1.y + (p2.y - p0.y) / 6)} ${f(p2.x - (p3.x - p1.x) / 6)} ${f(p2.y - (p3.y - p1.y) / 6)} ${f(p2.x)} ${f(p2.y)}`;
    }
    return d + "Z";
  }

  function seal(iniciales, fuente, cls) {
    const dibujo = () => {
    const [a, b] = iniciales;
    let beads = "";
    for (let i = 0; i < 36; i++) {
      const t = i / 36 * Math.PI * 2;
      beads += `<circle cx="${f(100 + 57 * Math.cos(t))}" cy="${f(100 + 57 * Math.sin(t))}" r="1.7"/>`;
    }
    let laurel = "";
    for (let i = 0; i < 9; i++) {
      const t = (200 + i * 15) * Math.PI / 180, t2 = (340 - i * 15) * Math.PI / 180;
      const lp = (tt, side) => leaf({ x: 100 + 46 * Math.cos(tt), y: 100 + 46 * Math.sin(tt) }, { x: 100 + 46 * Math.cos(tt + side * 0.2) + 5 * Math.cos(tt), y: 100 + 46 * Math.sin(tt + side * 0.2) + 5 * Math.sin(tt) }, 2.3, 0);
      laurel += lp(t + Math.PI, -1) + lp(t2 + Math.PI, 1);
    }
    return `
      <g filter="url(#f-lacre)">
        <path d="${sealBlob(13)}" fill="#8e8e8e"/>
        <circle cx="100" cy="100" r="71" fill="none" stroke="#b9b9b9" stroke-width="8"/>
        <circle cx="100" cy="100" r="66.5" fill="#6c6c6c"/>
        <g fill="#a6a6a6">${beads}</g>
        <path d="${laurel}" fill="#9a9a9a"/>
        <text x="100" y="${b ? 113 : 120}" text-anchor="middle" font-family="'${fuente}', serif" font-size="${b ? 40 : 58}" letter-spacing="1" fill="#d8d8d8">${a}${b ? `<tspan font-size="24" dy="-4" dx="2" font-style="italic" font-family="'Cormorant Garamond', serif">&amp;</tspan><tspan dy="4" dx="2">${b}</tspan>` : ""}</text>
      </g>
    `;
    };
    return `<svg class="lacre ${cls || ""}" viewBox="0 0 200 200" aria-hidden="true">${reutilizar("orn-lacre", dibujo)}</svg>`;
  }

  /* ---------------- iconos de línea ---------------- */
  const ICONOS = {
    iglesia: '<path d="M12 2.5v4M10 4.5h4M5 21.5V11l7-5 7 5v10.5M3 21.5h18M10 21.5v-4.5a2 2 0 0 1 4 0v4.5"/><circle cx="12" cy="12" r="1.6"/>',
    copas: '<path d="M6.5 3h4.5l-.6 6.2a1.6 1.6 0 0 1-3.3 0zM8.75 11v8.5M6.5 19.5h4.5M13 4.5h4.5l-.6 6.2a1.6 1.6 0 0 1-3.3 0zM15.25 12.5V20.5M13 20.5h4.5M8.6 6.5h.01M15.6 8h.01"/>',
    anillos: '<circle cx="9" cy="14.5" r="5.2"/><circle cx="15" cy="14.5" r="5.2"/><path d="M13.6 6.8 15 4.6l1.4 2.2-1.4 1.6z"/>',
    cena: '<circle cx="12" cy="13" r="6.2"/><circle cx="12" cy="13" r="3.6"/><path d="M3 4v16M1.8 4v3.5a1.2 1.2 0 0 0 2.4 0V4M21.5 4c-1.4 1-2 4-2 7h2v9"/>',
    musica: '<path d="M9 18V6.5l10-2.3V16"/><circle cx="6.8" cy="18" r="2.2"/><circle cx="16.8" cy="16" r="2.2"/><path d="M9 9.5 19 7.2"/>',
    pastel: '<path d="M3.5 21h17M5 21v-5h14v5M7 16v-4h10v4M9.2 12V9h5.6v3M12 9V6.4"/><path d="M12 3.2c.9 1 .9 2.2 0 2.6-.9-.4-.9-1.6 0-2.6z"/>',
    luna: '<path d="M19.5 14.6A8 8 0 1 1 9.4 4.5a6.4 6.4 0 0 0 10.1 10.1z"/><path d="M17 3.5v3M15.5 5h3M20.5 8.5v2M19.5 9.5h2"/>',
    camara: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8.5 7 10 4.5h4L15.5 7"/><circle cx="12" cy="13.5" r="3.8"/>',
    reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
    regalo: '<rect x="4" y="10" width="16" height="11"/><path d="M3 7h18v3H3zM12 7v14M12 7c-1.8-3.6-6-3.8-6-1.4C6 7 10 7 12 7zm0 0c1.8-3.6 6-3.8 6-1.4C18 7 14 7 12 7z"/>',
    sobre: '<rect x="3" y="6" width="18" height="13" rx="1.5"/><path d="M3.6 7.2 12 13.4l8.4-6.2"/>',
    hotel: '<path d="M3 21V5h12v16M15 10h6v11M2 21h20M6 8h2M10 8h2M6 12h2M10 12h2M6 16h2M10 16h2M18 14h.01M18 17h.01"/>',
    pin: '<path d="M12 21.2s-6.6-6.2-6.6-11.3a6.6 6.6 0 0 1 13.2 0c0 5.1-6.6 11.3-6.6 11.3z"/><circle cx="12" cy="9.9" r="2.4"/>',
    calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M12 13.4c.6-.9 2.2-.8 2.2.5 0 1.2-2.2 2.6-2.2 2.6s-2.2-1.4-2.2-2.6c0-1.3 1.6-1.4 2.2-.5z"/>',
    corazon: '<path d="M12 20s-7.5-4.6-7.5-10.1A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.3C19.5 15.4 12 20 12 20z"/>',
    copiar: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    whatsapp: '<path d="M4 20.5 5.3 16A8.5 8.5 0 1 1 8.3 19z"/><path d="M9 8.6c.3-.7 1.3-.8 1.5 0l.4 1.4c.1.4-.2.8-.5 1 .6 1.2 1.5 2.1 2.7 2.7.2-.3.6-.6 1-.5l1.4.4c.8.2.7 1.2 0 1.5-2.6 1.2-7.6-3.8-6.5-6.5z"/>',
    tienda: '<path d="M4 9h16l-1.2-4.5H5.2zM5 9v11h14V9M9.5 20v-5h5v5"/>',
    estrella: '<path d="m12 3.5 2.5 5.3 5.7.7-4.2 3.9 1.1 5.7L12 16.3l-5.1 2.8L8 13.4 3.8 9.5l5.7-.7z"/>',
    flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    mapa: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14"/>',
    play: '<path d="M8.5 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/>'
  };
  function icon(name, cls) {
    return `<svg class="icono ${cls || ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS[name] || ICONOS.estrella}</svg>`;
  }

  // Ilustraciones de vestimenta (línea dorada que se dibuja)
  const vestido = `<svg class="ilustra" viewBox="0 0 70 130" fill="none" stroke="currentColor" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path pathLength="1" d="M27 9 30 3M43 9 40 3M27 9q8 7 16 0M27 9q-3 12 1.5 22M43 9q3 12-1.5 22M28.5 31q6.5 2.5 13 0M28.5 31Q16 76 7 124q28 7 56 0-9-48-21.5-93"/>
    <path pathLength="1" d="M33 34q-3 40-7 90M37.5 34q4 42 9 90M30.5 33q-8 40-15 88M40 33q9 40 17 88" opacity=".55"/>
    <path pathLength="1" d="M29 31.5q6 4 12.5 0" stroke-width="1.6"/>
  </svg>`;
  const smoking = `<svg class="ilustra" viewBox="0 0 70 130" fill="none" stroke="currentColor" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path pathLength="1" d="M28 8q7-3 14 0M17 15q8-5 13-6l5 12 5-12q5 1 13 6l3 64H14z"/>
    <path pathLength="1" d="M30 9l-5 30 10 22M40 9l5 30-10 22M35 21v40M17 15 8 72l7 2M53 15l9 57-7 2"/>
    <path pathLength="1" d="M30 18l5 2.4L40 18v5l-5-2.6L30 23z" stroke-width="1.1"/>
    <path pathLength="1" d="M44 44l6-1.2M35 47h.01M35 54h.01M24 79l-1 45M46 79l1 45M28 79l-.5 45M42 79l.5 45" />
  </svg>`;

  window.ORN = { defs, frameOval, frameRect, framePhoto, divider, corner, seal, icon, vestido, smoking, crestPaths };
})();
