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

  /* ---------- Orden de las secciones (puedes moverlas o quitarlas) ---------- */
  orden: [
    "hero",
    "manifiesto",
    "historia",
    "interludio:0",
    "padres",
    "fecha",
    "eventos",
    "itinerario",
    "interludio:1",
    "vestimenta",
    "galeria",
    "regalos",
    "hospedaje",
    "notas",
    "rsvp",
    "cierre"
  ],

  /* ---------- Identidad visual ---------- */
  tema: {
    colores: {
      papel:        "#F7F2E9",   // fondo marfil
      papelOscuro:  "#ECE3D2",   // marfil sombreado
      tinta:        "#3A3026",   // texto principal
      tintaSuave:   "#76695A",   // texto secundario
      oroProfundo:  "#8C6A2F",
      oro:          "#B8924A",
      oroClaro:     "#E2C88A",
      oroBrillo:    "#F7E9BF",
      nocturno:     "#1E1813"    // secciones oscuras (cuenta regresiva y cierre)
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
    src: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Canon_in_D_Major_(ISRC_USUAN1100301).mp3",
    titulo: "Canon en Re · Pachelbel",
    volumen: 0.55,
    inicioSegundos: 0,
    // Si usas música con licencia Creative Commons, deja aquí el crédito:
    credito: "Música: “Canon in D Major” — Kevin MacLeod (incompetech.com), licencia CC BY 3.0"
  },

  /* ---------- Portada (sobre) ---------- */
  portada: {
    fondo: "https://images.unsplash.com/photo-1628791305407-d61751d554d0?auto=format&fit=crop&w=2000&q=80",
    textoSuperior: "Una invitación para",
    instruccion: "Toca el sello para abrir",
    colorSobre: "#F3ECE0",
    colorForro: "#E7DABF",
    colorListon: "#EEE6D6",
    colorLacre: "#C39A4F"
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
    foto: "assets/img/novios_12.jpeg",
    sobreTitulo: "Junto a nuestras familias",
    titulo: "Nos casamos",
    frase: "y queremos compartir este día contigo"
  },

  /* ---------- Texto que se ilumina palabra por palabra al hacer scroll ---------- */
  manifiesto: {
    etiqueta: "Con la bendición de Dios",
    // Las palabras entre *asteriscos* se iluminan en dorado
    texto: "Hay *encuentros* que cambian el rumbo de una vida. El nuestro comenzó con una mirada y se convirtió en un *hogar.* Hoy, con el corazón lleno, tenemos el honor de invitarte a ser testigo del día en que nos prometeremos *para siempre.*",
    cita: "«El amor es paciente, es bondadoso… todo lo cree, todo lo espera, todo lo soporta.»",
    autorCita: "1 Corintios 13"
  },

  /* ---------- Nuestra historia (línea del tiempo) ---------- */
  historia: {
    etiqueta: "Capítulo a capítulo",
    titulo: "Nuestra historia",
    capitulos: [
      {
        fecha: "2018",
        titulo: "El primer encuentro",
        texto: "Una tarde de lluvia en Guadalajara, un café compartido por error y una conversación que duró hasta que cerraron el lugar.",
        foto: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80"
      },
      {
        fecha: "2021",
        titulo: "Un hogar, dos sueños",
        texto: "Aprendimos que el amor también se construye en lo cotidiano: en las mañanas tranquilas y en los viajes que nos cambiaron.",
        foto: "assets/img/novios_08.jpeg"
      },
      {
        fecha: "2026",
        titulo: "La pregunta",
        texto: "Frente al mar, al atardecer, con el corazón latiendo fuerte. La respuesta fue la palabra más bonita: sí.",
        foto: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=900&q=80"
      }
    ]
  },

  /* ---------- Fotografías a pantalla completa entre secciones ---------- */
  // posicion (opcional): qué parte de la foto se prioriza al recortar, p. ej. "50% 30%" o "center bottom"
  interludios: [
    {
      foto: "assets/img/novios_02.jpeg",
      posicion: "50% 60%",
      frase: "Dos almas, un solo destino"
    },
    {
      foto: "assets/img/novios_13.jpeg",
      posicion: "center top",
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
        foto: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1000&q=80"
      },
      {
        icono: "copas",
        tipo: "Recepción",
        hora: "19:30 h",
        lugar: "Hacienda Santa Victoria",
        direccion: "Carretera a Chapala km 12, Tlajomulco de Zúñiga, Jal.",
        mapa: "https://www.google.com/maps/search/?api=1&query=Tlajomulco+de+Zuniga+Jalisco",
        waze: "",
        foto: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=80"
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
      "assets/img/novios_03.jpeg",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1494955870715-979ca4f13bf0?auto=format&fit=crop&w=1400&q=80",
      "assets/img/novios_07.jpeg"
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
      titular: "Valentina Ruiz Cortés",
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
    hashtag: "#ValentinaYAlejandro"
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
    foto: "assets/img/novios_10.jpeg",
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
    abrir: "Abrir la invitación"
  },

  /* ---------- Pie de página ---------- */
  creditos: {
    mostrar: true,
    texto: "Invitación digital diseñada por Tu Estudio",
    url: ""
  }
};