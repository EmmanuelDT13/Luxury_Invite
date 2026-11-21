/* ==========================================================================
   ARRANQUE TEMPRANO
   Se ejecuta en el <head>, justo después de config.js, para que el navegador
   empiece a descargar fuentes y la foto del sobre desde el primer instante,
   en paralelo con el resto de la página. No cambia nada visual.
   ========================================================================== */
(function () {
  "use strict";
  var C = window.INVITACION || {};
  var F = (C.tema && C.tema.fuentes) || {};
  var caligrafica = F.caligrafica || "Pinyon Script";
  var grabada = F.grabada || "Cinzel";
  var texto = F.texto || "Cormorant Garamond";
  var fam = function (n) { return "family=" + String(n).trim().replace(/\s+/g, "+"); };
  var head = document.head;

  function enlace(rel, href, extra) {
    var l = document.createElement("link");
    l.rel = rel; l.href = href;
    if (extra) for (var k in extra) l.setAttribute(k, extra[k]);
    head.appendChild(l);
    return l;
  }

  // Una sola petición con solo los pesos que usa el diseño.
  // Si alguna fuente elegida no tiene esos pesos, se cae al modo simple (una petición por familia).
  var css = enlace("stylesheet",
    "https://fonts.googleapis.com/css2?" + fam(caligrafica) + "&" + fam(grabada) + ":wght@400;500&" +
    fam(texto) + ":ital,wght@0,300;0,400;0,600;1,400&display=swap", { "data-fuentes": "1" });
  css.onerror = function () {
    css.onerror = null;
    [caligrafica, grabada, texto].forEach(function (n) { enlace("stylesheet", "https://fonts.googleapis.com/css2?" + fam(n) + "&display=swap"); });
  };

  // La foto del sobre es lo primero que se ve: se pide con prioridad alta
  var fondo = C.portada && C.portada.fondo;
  if (fondo) enlace("preload", fondo, { as: "image", fetchpriority: "high" });

  // Si alguna foto vive en otro dominio, se abre la conexión por adelantado
  [fondo, C.hero && C.hero.foto].forEach(function (u) {
    try {
      var o = new URL(u, location.href).origin;
      if (o !== location.origin && o !== "null" && !head.querySelector('link[rel="preconnect"][href="' + o + '"]')) enlace("preconnect", o);
    } catch (e) {}
  });
})();
