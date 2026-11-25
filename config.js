/* ==========================================================================
   CONFIGURACIÓN DE LA INVITACIÓN
   --------------------------------------------------------------------------
   Este es el ÚNICO archivo que necesitas editar para cada cliente.
   Todo el contenido (textos, fotos, fechas, lugares, colores, música)
   vive aquí. No hay nada fijo en el HTML ni en el JavaScript.

   • Fotos: puedes usar URLs (https://...) o rutas locales (assets/img/foto.jpg).
     Recomendado: fotos JPG de 1600-2000 px por el lado largo, < 400 KB c/u.
   • Para ocultar una sección: pon  mostrar: false  o quítala de "orden".
   • Invitados personalizados por enlace:
       index.html?c=FH01                -> busca el código en invitados.lista
       index.html?invitado=Familia%20Ruiz&pases=3   -> nombre y pases directos
   ========================================================================== */

window.INVITACION = {

  /* ---------- Orden de las secciones (puedes moverlas o quitarlas) ----------
     Ordenadas por relevancia: primero lo que todo invitado necesita para hacer planes
     (fecha, lugar, horario, vestimenta y confirmación); después los detalles prácticos y,
     al final, la parte emotiva (historia, fotos y padres) para quien quiera disfrutarla. */
  orden: [
    "hero",          // nombres, fecha y accesos rápidos
    "fecha",         // calendario, cuenta regresiva y "agregar a mi calendario"
    "eventos",       // ceremonia y recepción con mapas
    "itinerario",
    "vestimenta",
    "rsvp",          // confirmación de asistencia
    "notas",
    "hospedaje",
    "regalos",
    "interludio:0",
    "manifiesto",
    "historia",
    "padres",
    "interludio:1",
    "galeria",
    "cierre"
  ],

  /* ---------- Identidad visual ---------- */
  tema: {
    colores: {
      papel:        "#F7F2E9",   // fondo marfil
      papelOscuro:  "#ECE3D2",   // marfil sombreado
      tinta:        "#3A3026",   // texto principal
      tintaSuave:   "#76695A",   // texto secundario
      // Oro antiguo (antique gold): marcos, ornamentos, textos dorados y botones
      oroProfundo:  "#5C4A28",   // sombras y huecos del tallado
      oro:          "#A58C5A",   // tono medio
      oroClaro:     "#C9B07C",
      oroBrillo:    "#E8D9B0",   // brillos
      nocturno:     "#1E1813"    // secciones oscuras (cuenta regresiva y cierre)
    },
    // Relieve de marcos y ornamentos (1 = valor de diseño; sube o baja con cuidado, p. ej. 0.7 – 1.4)
    relieve: {
      profundidad: 1,          // qué tan marcado es el tallado
      brillo: 1,               // intensidad de los brillos metálicos
      patina: 1,               // oscurecimiento en los bordes del grabado (0 = sin pátina)
      colorPatina: "#3A2A12"
    },
    // Tamaños (1 = diseño original; 1.2 = 20 % más grande, 0.9 = 10 % más chico).
    // Las fotos y marcos tienen tope: aunque los agrandes, la cuadrícula (2 fotos por fila, etc.) se respeta.
    tamanos: {
      texto: 1,        // párrafos y textos generales
      titulos: 1,      // títulos caligráficos de cada sección
      nombres: 1,      // nombres de los novios (portada y cierre)
      etiquetas: 1,    // textos pequeños en mayúsculas y botones
      numeros: 1,      // fecha, años de la historia, horas y cuenta regresiva
      marcos: {
        hero: 1,       // foto principal con su marco
        capitulos: 1,  // fotos de la historia
        videos: 1,     // videos de la historia
        cierre: 1,     // foto del cierre
        galeria: 1,    // fotos del carrusel
        eventos: 1     // fotos de ceremonia y recepción
      }
    },
    fuentes: {
      // Cualquier fuente de Google Fonts (escribe el nombre exacto)
      caligrafica: "Pinyon Script",       // nombres y títulos
      grabada:     "Cinzel",              // etiquetas en mayúsculas
      texto:       "Cormorant Garamond"   // párrafos
    }
  },

  /* ---------- Los novios ---------- */
  novios: {
    ella: "Emmanuel",
    el: "Estacy",
    conector: "&",
    iniciales: ["E", "E"],          // monograma del lacre y del sobre
    apellidos: "Dueñas Torres  ·  Carrillo Calderón"
  },

  /* ---------- Fecha principal (formato ISO con zona horaria) ---------- */
  fecha: {
    iso: "2027-09-18T17:00:00-06:00",
    ciudad: "Guadalajara, Jalisco"
  },

  /* ---------- Música ---------- */
  musica: {
    activa: true,
    // Archivo propio recomendado: "assets/musica/cancion.mp3"
    src: "assets/musica/music.mp3",
    titulo: "Canon en Re · Pachelbel",
    volumen: 0.55,
    inicioSegundos: 0,
    // Si usas música con licencia Creative Commons, deja aquí el crédito:
    credito: "Música: “Canon in D Major” — Kevin MacLeod (incompetech.com), licencia CC BY 3.0"
  },

  /* ---------- Portada (sobre) ---------- */
  portada: {
    fondo: "assets/img/portada.avif",
    textoSuperior: "Una invitación para",
    instruccion: "Toca el sello para abrir",
    // Si el invitado ya abrió la invitación en este dispositivo, durante estas horas entra directo
    // (sin la animación del sobre). Al vencer, el sobre vuelve a aparecer. 0 = mostrar siempre.
    recordarHoras: 24,
    colorSobre: "#F3ECE0",
    colorForro: "#E7DABF",
    colorListon: "#EEE6D6",
    colorLacre: "#A88B56"
  },

  /* ---------- Invitados (personalización por enlace) ---------- */
  invitados: {
    porDefecto: { nombre: "Nuestros queridos invitados", pases: 0 },
    mostrarPases: true,
    lista: {
      "FH01": { nombre: "Familia Hernández Lozano", pases: 4 },
      "MR02": { nombre: "Mariana Ríos & Acompañante", pases: 2 },
      "JC03": { nombre: "Sr. José Carlos Medina", pases: 1 }
    }
  },

  /* ---------- Primera vista ---------- */
  hero: {
    foto: "assets/img/novios_15.jpeg",
    marco: "rectangular",      // "rectangular" (marco barroco imponente) u "oval"
    posicionFoto: "50% 30%",   // qué parte de la foto se prioriza al recortar
    sobreTitulo: "Junto a nuestras familias",
    titulo: "Nos casamos",
    frase: "y queremos compartir este día contigo",
    // Accesos rápidos bajo la fecha, para quien solo busca lo esencial (false = ocultarlos)
    atajos: true
  },

  /* ---------- Texto que se ilumina palabra por palabra al hacer scroll ---------- */
  manifiesto: {
    etiqueta: "Con la bendición de Dios",
    // Las palabras entre *asteriscos* se iluminan en dorado
    texto: "Hay *encuentros* que cambian el rumbo de una vida. El nuestro comenzó con una mirada y se convirtió en un *hogar.* Hoy, con el corazón lleno, tenemos el honor de invitarte a ser testigo del día en que nos prometeremos *para siempre.*",
    cita: "«El amor es paciente, es bondadoso… todo lo cree, todo lo espera, todo lo soporta.»",
    autorCita: "1 Corintios 13"
  },

  /* ---------- Nuestra historia (línea del tiempo) ----------
     Cada capítulo admite "medios": una lista de fotos y/o videos. El ORDEN del arreglo es el orden
     en pantalla (fotos de 2 en 2 por fila; cada video ocupa su propia fila con marco horizontal).
       • Foto:   "assets/img/foto.jpg"   o   { foto: "assets/img/foto.jpg", posicion: "50% 30%" }
       • Video:  { video: "assets/video/clip.mp4", poster: "assets/img/portada-video.jpg" }
           - poster (opcional): una IMAGEN; si no hay, se muestra el primer cuadro del video
           - sonido: false → sin reproductor ni audio; se reproduce solo, en bucle, mientras se ve
             (la música de fondo sigue sonando)
           - reproduccion: "auto" → silenciado y en bucle, pero el invitado puede activar el sonido
       • YouTube:{ youtube: "ID_DEL_VIDEO" }   (el reproductor solo se carga al tocar)
     "fondo" (opcional): color del capítulo; entre capítulos se difumina suavemente. */
  historia: {
    etiqueta: "Capítulo a capítulo",
    titulo: "Nuestra historia",
    marcoFotos: "oval",          // "oval" o "rectangular"
    difuminado: 380,             // px de transición suave entre colores de capítulos
    reproduccionVideos: "manual",// "manual" (botón dorado) o "auto" (silenciado al verse)
    pausarMusicaConVideo: true,  // la música de fondo se pausa mientras suena un video
    sonidoVideos: true,          // false = TODOS los videos sin sonido ni reproductor, en automático
    capitulos: [
      {
        fecha: "2018",
        titulo: "El primer encuentro",
        texto: "Una tarde de lluvia en Guadalajara, un café compartido por error y una conversación que duró hasta que cerraron el lugar.",
        medios: ["assets/img/novios_14.jpeg"]
      },
      {
        fecha: "2021",
        titulo: "Un hogar, dos sueños",
        texto: "Aprendimos que el amor también se construye en lo cotidiano: en las mañanas tranquilas y en los viajes que nos cambiaron.",
        medios: ["assets/img/novios_15.jpeg"]
        // Ejemplo: dos fotos arriba y debajo un video sin sonido que se reproduce solo:
        // medios: ["assets/img/novios_14.jpeg", "assets/img/novios_14.jpeg",
        //          { video: "assets/video/novios_01.mp4", sonido: false }]
      },
      {
        fecha: "2026",
        titulo: "La pregunta",
        texto: "Frente al mar, al atardecer, con el corazón latiendo fuerte. La respuesta fue la palabra más bonita: sí.",
        fondo: "#EADFCB",          // beige tostado claro: resalta este capítulo
        medios: ["assets/img/novios_14.jpeg", "assets/img/novios_14.jpeg", { video: "assets/video/novios_01.mp4", sonido: false }]
      }
    ]
  },

  /* ---------- Fotografías a pantalla completa entre secciones ---------- */
  // posicion (opcional): qué parte de la foto se prioriza al recortar, p. ej. "50% 30%" o "center bottom"
  interludios: [
    {
      foto: "assets/img/novios_14.jpeg",
      posicion: "50% 60%",
      frase: "Dos almas, un solo destino"
    },
    {
      foto: "assets/img/novios_15.jpeg",
      posicion: "center",
      frase: "Lo mejor de nuestra historia apenas comienza"
    }
  ],

  /* ---------- Padres y padrinos ---------- */
  padres: {
    etiqueta: "Con la bendición de",
    titulo: "Nuestros padres",
    grupos: [
      { titulo: "Padres de la novia", nombres: ["Sr. Esaú Carrillo", "Sra. Alma Calderón"] },
      { titulo: "Padres del novio", nombres: ["Sra. Otilia Torres Herrera"] }
    ],
    padrinosTitulo: "Nuestros padrinos",
    padrinos: [
      { titulo: "Velación", nombres: ["Sr. Arturo Villaseñor", "Sra. Lucía Prado"] },
      { titulo: "Anillos", nombres: ["Sr. Daniel Ochoa", "Sra. Regina Aguilar"] },
      { titulo: "Lazo", nombres: ["Sr. Emilio Castro", "Sra. Andrea Fuentes"] },
      { titulo: "Arras", nombres: ["Sr. Tomás Ibarra", "Sra. Sofía Ledesma"] }
    ]
  },

  /* ---------- Fecha: calendario + cuenta regresiva ---------- */
  cuentaRegresiva: {
    etiqueta: "Reserva la fecha",
    titulo: "El gran día",
    textoFinal: "¡Hoy es el gran día!",
    botonCalendario: "Agregar a mi calendario"
  },

  /* ---------- Ceremonia y recepción ---------- */
  eventos: {
    etiqueta: "Dónde y cuándo",
    titulo: "La celebración",
    lista: [
      {
        icono: "iglesia",
        tipo: "Ceremonia religiosa",
        hora: "17:00 h",
        lugar: "Templo Expiatorio",
        direccion: "Calle Manuel López Cotilla 935, Col. Americana, Guadalajara, Jal.",
        mapa: "https://www.google.com/maps/search/?api=1&query=Templo+Expiatorio+Guadalajara",
        waze: "https://waze.com/ul?q=Templo%20Expiatorio%20Guadalajara",
        foto: "assets/img/kiosko.avif"
      },
      {
        icono: "copas",
        tipo: "Recepción",
        hora: "19:30 h",
        lugar: "Hacienda Santa Victoria",
        direccion: "Carretera a Chapala km 12, Tlajomulco de Zúñiga, Jal.",
        mapa: "https://www.google.com/maps/search/?api=1&query=Tlajomulco+de+Zuniga+Jalisco",
        waze: "",
        foto: "assets/img/table.avif"
      }
    ]
  },

  /* ---------- Itinerario ---------- */
  itinerario: {
    etiqueta: "El programa",
    titulo: "Itinerario",
    items: [
      { hora: "17:00", titulo: "Ceremonia religiosa", icono: "anillos" },
      { hora: "19:30", titulo: "Cóctel de bienvenida", icono: "copas" },
      { hora: "20:30", titulo: "Cena de gala", icono: "cena" },
      { hora: "22:00", titulo: "Primer baile", icono: "musica" },
      { hora: "22:30", titulo: "Corte de pastel y brindis", icono: "pastel" },
      { hora: "03:00", titulo: "Despedida", icono: "luna" }
    ]
  },

  /* ---------- Código de vestimenta ---------- */
  vestimenta: {
    etiqueta: "Código de vestimenta",
    titulo: "Etiqueta rigurosa",
    ellas: "Vestido largo de noche",
    ellos: "Smoking o traje oscuro con corbata de moño",
    paletaTitulo: "Paleta sugerida",
    paleta: [
      { color: "#1F2A44", nombre: "Medianoche" },
      { color: "#5B6B4E", nombre: "Olivo" },
      { color: "#7A2E3A", nombre: "Borgoña" },
      { color: "#C8A27A", nombre: "Champaña" },
      { color: "#2B2B2B", nombre: "Ónix" }
    ],
    nota: "Con cariño, reservamos el blanco y el marfil para la novia."
  },

  /* ---------- Galería ---------- */
  galeria: {
    etiqueta: "Momentos",
    titulo: "Nuestra galería",
    fotos: [
      "assets/img/novios_14.jpeg",
      "assets/img/novios_15.jpeg",
      "assets/img/novios_14.jpeg",
      "assets/img/novios_15.jpeg",
      "assets/img/novios_14.jpeg",
      "assets/img/novios_15.jpeg"
    ]
  },

  /* ---------- Regalos ---------- */
  regalos: {
    etiqueta: "Mesa de regalos",
    titulo: "Un detalle",
    texto: "Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con nosotros, te compartimos algunas opciones.",
    mesas: [
      { nombre: "Liverpool", detalle: "Evento 51234567", url: "https://mesaderegalos.liverpool.com.mx/" },
      { nombre: "El Palacio de Hierro", detalle: "Evento 400123", url: "https://www.elpalaciodehierro.com/mesa-de-regalos" }
    ],
    transferencia: {
      titulo: "Transferencia",
      banco: "BBVA México",
      titular: "Emmanuel Dueñas",
      clabe: "012 320 00000000000 0",
      concepto: "Boda V&A"
    },
    sobres: "También habrá lluvia de sobres el día del evento."
  },

  /* ---------- Hospedaje ---------- */
  hospedaje: {
    etiqueta: "Para nuestros invitados",
    titulo: "Hospedaje",
    hoteles: [
      { nombre: "Hotel Casa Grande", detalle: "A 10 min de la recepción · Tarifa preferencial con el código BODAVA", url: "https://www.google.com/maps/search/?api=1&query=hoteles+Guadalajara" },
      { nombre: "Hotel Real del Centro", detalle: "Centro histórico · A 5 min del templo", url: "https://www.google.com/maps/search/?api=1&query=hoteles+centro+Guadalajara" }
    ]
  },

  /* ---------- Notas importantes ---------- */
  notas: {
    etiqueta: "Detalles",
    titulo: "Para tomar en cuenta",
    items: [
      { icono: "copas",  titulo: "Solo adultos", texto: "Amamos a sus pequeños, pero esta celebración será únicamente para adultos." },
      { icono: "camara", titulo: "Comparte con nosotros", texto: "Usa nuestro hashtag para que podamos revivir cada momento." },
      { icono: "reloj",  titulo: "Puntualidad", texto: "Te pedimos llegar 20 minutos antes de la ceremonia." }
    ],
    hashtag: "#EmmanuelYEstacy"
  },

  /* ---------- Confirmación de asistencia (RSVP por WhatsApp) ---------- */
  rsvp: {
    etiqueta: "Confirma tu asistencia",
    titulo: "R.S.V.P.",
    texto: "Será un honor contar con tu presencia. Por favor confirma antes de la fecha límite.",
    fechaLimite: "2027-08-15",
    whatsapp: "523312345678",       // código de país + número, sin espacios ni “+”
    preguntarMenu: true,
    opcionesMenu: ["Sin restricción", "Vegetariano", "Vegano", "Sin gluten"],
    // Plantilla del mensaje. Variables: {nombre} {asistencia} {personas} {menu} {mensaje}
    plantilla: "Hola, soy {nombre}.\n{asistencia}\nPersonas: {personas}\nMenú: {menu}\nMensaje para los novios: {mensaje}",
    textoBoton: "Enviar confirmación",
    textoCerrado: "La fecha para confirmar ha concluido. Si tienes dudas, contáctanos directamente."
  },

  /* ---------- Cierre ---------- */
  cierre: {
    foto: "assets/img/novios_14.jpeg",
    frase: "Gracias por ser parte de nuestra historia",
    texto: "Te esperamos para celebrar el amor, la familia y el comienzo de nuestra vida juntos.",
    firma: "Con amor,"
  },

  /* ---------- Textos de la interfaz (botones, etiquetas) ---------- */
  textos: {
    desliza: "Desliza",
    comoLlegar: "Cómo llegar",
    waze: "Waze",
    dias: "Días", horas: "Horas", minutos: "Min", segundos: "Seg",
    ellas: "Ellas", ellos: "Ellos",
    verMesa: "Ver mesa",
    copiar: "Copiar CLABE",
    copiado: "Copiado al portapapeles",
    verUbicacion: "Ver ubicación",
    nombre: "Nombre", nombrePh: "Tu nombre completo",
    asistencia: "Asistencia", si: "Con gusto asistiré", no: "No podré asistir",
    personas: "Número de personas", menu: "Menú",
    mensaje: "Mensaje para los novios", mensajePh: "Opcional",
    confirmaAntes: "Confirma antes del",
    faltaNombre: "Escribe tu nombre, por favor",
    asistenciaSi: "Confirmo con mucho gusto mi asistencia.",
    asistenciaNo: "Lamentablemente no podré asistir.",
    lugarUno: "Un lugar reservado en su honor",
    lugaresVarios: "{n} lugares reservados en su honor",
    pase: "pase", pases: "pases",
    sinInvitado: "Nos casamos",
    googleCal: "Google Calendar", appleCal: "Apple · Outlook",
    musicaOn: "Pausar música", musicaOff: "Activar música",
    abrir: "Abrir la invitación",
    atajoFecha: "Fecha", atajoLugar: "Lugar", atajoRsvp: "Confirmar"
  },

  /* ---------- Pie de página ---------- */
  creditos: {
    mostrar: true,
    texto: "Invitación digital diseñada por Emmanuel y Estacy",
    url: ""
  }
};