/* ============================================================
   PUMA CINE — datos mock con la estructura REAL de tu BD
   ------------------------------------------------------------
   Esquema espejo de CineLista (APEX). Cuando conectes APEX:
   - Las columnas en MAYÚSCULAS en tu BD se mapean a minúsculas aquí
     (titulo = TITULO, id_pelicula = ID_PELICULA, etc.)
   - Los campos dentro de _ui son SOLO para la presentación visual,
     no existen en tu BD (gradiente de respaldo, país, tagline, etc.)
   - Las tablas puente (PELICULA_GENERO, PELICULA_ETIQUETA,
     USUARIO_PELICULA) están modeladas como arrays separados.
   ============================================================ */

window.PC_DATA = {

  /* == GENERO ==
     CREATE TABLE GENERO ( ID_GENERO NUMBER PK, NOMBRE VARCHAR2 ) */
  generos: [
    { id_genero: 1,  nombre: "Drama" },
    { id_genero: 2,  nombre: "Ciencia Ficción" },
    { id_genero: 3,  nombre: "Suspenso" },
    { id_genero: 4,  nombre: "Comedia" },
    { id_genero: 5,  nombre: "Animación" },
    { id_genero: 6,  nombre: "Documental" },
    { id_genero: 7,  nombre: "Romance" },
    { id_genero: 8,  nombre: "Acción" },
    { id_genero: 9,  nombre: "Terror" },
    { id_genero: 10, nombre: "Histórico" }
  ],

  /* == ETIQUETA ==
     CREATE TABLE ETIQUETA ( ID_ETIQUETA NUMBER PK, NOMBRE VARCHAR2 ) */
  etiquetas: [
    { id_etiqueta: 1,  nombre: "Cine de autor" },
    { id_etiqueta: 2,  nombre: "Final inesperado" },
    { id_etiqueta: 3,  nombre: "Banda sonora épica" },
    { id_etiqueta: 4,  nombre: "Premiada" },
    { id_etiqueta: 5,  nombre: "Para pensar" },
    { id_etiqueta: 6,  nombre: "Visualmente impactante" },
    { id_etiqueta: 7,  nombre: "Lenta pero vale" },
    { id_etiqueta: 8,  nombre: "Cine latinoamericano" },
    { id_etiqueta: 9,  nombre: "Clásico instantáneo" },
    { id_etiqueta: 10, nombre: "Releer crítica" }
  ],

  /* == USUARIO ==
     ID_USUARIO, NOMBRE_USUARIO, NOMBRE_COMPLETO, EMAIL,
     CONTRASENA, ACTIVO, FECHA_REGISTRO */
  usuarios: [
    {
      id_usuario: 1,
      nombre_usuario: "demianbello",
      nombre_completo: "Demian Bello",
      email: "demian@unam.mx",
      activo: 1,
      fecha_registro: "2025-09-12",
      _ui: { inicial: "D", color: "#2D52A8" }
    },
    {
      id_usuario: 2,
      nombre_usuario: "aleluna",
      nombre_completo: "Alejandra Luna",
      email: "aleluna0407@icloud.com",
      activo: 1,
      fecha_registro: "2025-10-03",
      _ui: { inicial: "A", color: "#1E3A7A" }
    },
    {
      id_usuario: 3,
      nombre_usuario: "mcordero",
      nombre_completo: "Mario Cordero",
      email: "mcordero@unam.mx",
      activo: 1,
      fecha_registro: "2025-11-21",
      _ui: { inicial: "M", color: "#3B5BBF" }
    },
    {
      id_usuario: 4,
      nombre_usuario: "sofiar",
      nombre_completo: "Sofía Ramírez",
      email: "sofia.r@unam.mx",
      activo: 1,
      fecha_registro: "2026-01-14",
      _ui: { inicial: "S", color: "#14296B" }
    },
    {
      id_usuario: 5,
      nombre_usuario: "iv4n",
      nombre_completo: "Iván Téllez",
      email: "ivan.t@unam.mx",
      activo: 1,
      fecha_registro: "2026-02-28",
      _ui: { inicial: "I", color: "#2949A6" }
    }
  ],

  /* == PELICULA ==
     ID_PELICULA, TITULO, SINOPSIS, DIRECTOR, POSTER_URL,
     ANO_ESTRENO, DURACION_MINUTOS */
  peliculas: [
    {
      id_pelicula: 1,
      titulo: "El silencio de las hojas",
      sinopsis: "En un pueblo aislado del bajío, una bibliotecaria descubre cartas escritas por una mujer que vivió ahí hace medio siglo. Una meditación lenta sobre el paso del tiempo, la memoria y la palabra escrita.",
      director: "Lucrecia Martel",
      poster_url: null, // ← aquí irá la URL real desde tu BD
      ano_estreno: 2023,
      duracion_minutos: 132,
      _ui: {
        pais: "México",
        idioma: "Español",
        tagline: "Lo que se calla, también florece.",
        gradient: "linear-gradient(135deg, #1a4d8a 0%, #0a1530 70%)",
        destacada: false
      }
    },
    {
      id_pelicula: 2,
      titulo: "Coyoacán 1968",
      sinopsis: "Tres estudiantes universitarios cruzan los meses previos al 2 de octubre. Retrato íntimo de una ciudad en ebullición.",
      director: "Alfonso Cuarón",
      poster_url: null,
      ano_estreno: 2024,
      duracion_minutos: 118,
      _ui: {
        pais: "México",
        idioma: "Español",
        tagline: "Una generación encendida por el fuego de la libertad.",
        gradient: "linear-gradient(135deg, #A8802C 0%, #5e4318 50%, #0a1530 100%)",
        destacada: true
      }
    },
    {
      id_pelicula: 3,
      titulo: "Órbita",
      sinopsis: "La única tripulante de una misión a Europa, luna de Júpiter, descubre que sus mensajes a la Tierra están llegando con un retraso imposible de explicar.",
      director: "Denis Villeneuve",
      poster_url: null,
      ano_estreno: 2022,
      duracion_minutos: 145,
      _ui: {
        pais: "Canadá",
        idioma: "Inglés",
        tagline: "Un solo astronauta. Tres décadas. Una respuesta.",
        gradient: "linear-gradient(135deg, #0a1530 0%, #1E3A7A 50%, #14296B 100%)"
      }
    },
    {
      id_pelicula: 4,
      titulo: "Cumbre",
      sinopsis: "Documental que sigue a un grupo de mujeres rarámuris que escalan una de las montañas más altas del país con apenas huaraches y agua.",
      director: "Tatiana Huezo",
      poster_url: null,
      ano_estreno: 2023,
      duracion_minutos: 96,
      _ui: {
        pais: "México",
        idioma: "Español",
        tagline: "Donde el aire se enrarece, también la verdad.",
        gradient: "linear-gradient(135deg, #B89045 0%, #6E5318 40%, #0a1530 100%)"
      }
    },
    {
      id_pelicula: 5,
      titulo: "Septiembre eterno",
      sinopsis: "Dos hermanas vuelven a la casa de su madre tras su muerte. Lo que iba a ser un fin de semana se convierte en un mes interminable.",
      director: "Pedro Almodóvar",
      poster_url: null,
      ano_estreno: 2021,
      duracion_minutos: 112,
      _ui: {
        pais: "España",
        idioma: "Español",
        tagline: "Dos hermanas, una casa, treinta veranos.",
        gradient: "linear-gradient(135deg, #c44d4d 0%, #6e1a1a 50%, #0a1530 100%)"
      }
    },
    {
      id_pelicula: 6,
      titulo: "Volcán",
      sinopsis: "Un sismólogo es ridiculizado por insistir que el monte que abraza la capital va a despertar. Una semana antes del desastre, su hija desaparece.",
      director: "Bong Joon-ho",
      poster_url: null,
      ano_estreno: 2024,
      duracion_minutos: 128,
      _ui: {
        pais: "Corea del Sur",
        idioma: "Coreano",
        tagline: "Algo se mueve bajo la ciudad.",
        gradient: "linear-gradient(135deg, #802929 0%, #14296B 60%, #050912 100%)"
      }
    },
    {
      id_pelicula: 7,
      titulo: "Plata o plomo",
      sinopsis: "Un fotoperiodista en Sinaloa decide publicar un retrato que podría costarle la vida.",
      director: "Amat Escalante",
      poster_url: null,
      ano_estreno: 2020,
      duracion_minutos: 109,
      _ui: {
        pais: "México",
        idioma: "Español",
        tagline: null,
        gradient: "linear-gradient(135deg, #2D52A8 0%, #0a1530 100%)"
      }
    },
    {
      id_pelicula: 8,
      titulo: "Sueña, Coatlicue",
      sinopsis: "Animación stop-motion sobre los mitos prehispánicos contados como si fueran ciencia ficción.",
      director: "Issa López",
      poster_url: null,
      ano_estreno: 2023,
      duracion_minutos: 95,
      _ui: {
        pais: "México",
        idioma: "Español",
        tagline: "Cuando los dioses sueñan, las ciudades nacen.",
        gradient: "linear-gradient(135deg, #A8802C 0%, #802929 50%, #14296B 100%)"
      }
    },
    {
      id_pelicula: 9,
      titulo: "Pueblo fantasma",
      sinopsis: "Una pareja se muda a un pueblo abandonado en Nuevo México. Cada noche, alguien más vuelve a casa.",
      director: "Robert Eggers",
      poster_url: null,
      ano_estreno: 2022,
      duracion_minutos: 88,
      _ui: {
        pais: "Estados Unidos",
        idioma: "Inglés",
        tagline: "Hay lugares que recuerdan mejor que tú.",
        gradient: "linear-gradient(135deg, #14296B 0%, #050912 50%, #802929 100%)"
      }
    },
    {
      id_pelicula: 10,
      titulo: "El último corrido",
      sinopsis: "Un compositor de corridos viaja por el norte buscando la voz de un cantante que ya nadie recuerda.",
      director: "Carlos Reygadas",
      poster_url: null,
      ano_estreno: 2024,
      duracion_minutos: 124,
      _ui: {
        pais: "México",
        idioma: "Español",
        tagline: "Una canción para enterrar a un país.",
        gradient: "linear-gradient(135deg, #6E5318 0%, #A8802C 30%, #0a1530 100%)"
      }
    },
    {
      id_pelicula: 11,
      titulo: "Polaris",
      sinopsis: "En 2078, una cartógrafa marítima es contratada para encontrar la última isla no registrada en los océanos.",
      director: "Greta Gerwig",
      poster_url: null,
      ano_estreno: 2024,
      duracion_minutos: 138,
      _ui: {
        pais: "Estados Unidos",
        idioma: "Inglés",
        tagline: null,
        gradient: "linear-gradient(135deg, #2949A6 0%, #14296B 50%, #050912 100%)"
      }
    },
    {
      id_pelicula: 12,
      titulo: "Domingo en Tepoztlán",
      sinopsis: "Una boda en Tepoztlán reúne a una familia que llevaba veinte años sin sentarse a la misma mesa.",
      director: "Lila Avilés",
      poster_url: null,
      ano_estreno: 2023,
      duracion_minutos: 102,
      _ui: {
        pais: "México",
        idioma: "Español",
        tagline: "Una boda. Dos familias. Demasiado mezcal.",
        gradient: "linear-gradient(135deg, #5BAA6B 0%, #14296B 70%, #050912 100%)"
      }
    }
  ],

  /* == RESENA ==
     ID_RESENA, ID_USUARIO, ID_PELICULA,
     HEADLINE   VARCHAR2(50),
     DESCRIPCION VARCHAR2(1000),
     CALIFICACION NUMBER(2,0)   ← 1-5 estrellas */
  resenas: [
    {
      id_resena: 1, id_usuario: 1, id_pelicula: 2, calificacion: 5,
      headline: "Una carta de amor al 68",
      descripcion: "Cuarón vuelve a México con una mirada que no es nostálgica, es <em>punzante</em>. La secuencia del mitin en Tlatelolco —rodada sin un solo corte— me dejó sin aire. Pero lo que realmente sostiene la película es el silencio de los pasillos vacíos de la facultad, después.",
      _ui: { fecha: "2026-05-18", likes: 124 }
    },
    {
      id_resena: 2, id_usuario: 2, id_pelicula: 2, calificacion: 5,
      headline: "El cine mexicano que necesitábamos",
      descripcion: "Esperaba una clase de historia y me encontré con una elegía. La actuación de la protagonista, sin diálogo durante quince minutos seguidos, debería estudiarse en escuelas de cine.",
      _ui: { fecha: "2026-05-15", likes: 89 }
    },
    {
      id_resena: 3, id_usuario: 3, id_pelicula: 1, calificacion: 4,
      headline: "Lenta, sí. Hipnótica, también.",
      descripcion: "Martel siempre exige paciencia, y aquí más. Si te quedas, lo que pasa en los últimos veinte minutos justifica las dos horas anteriores. Si no, vas a salir del cine renegando.",
      _ui: { fecha: "2026-05-10", likes: 56 }
    },
    {
      id_resena: 4, id_usuario: 4, id_pelicula: 6, calificacion: 5,
      headline: "Bong Joon-ho en estado de gracia",
      descripcion: "Es difícil hacer una película de catástrofe que <em>también</em> sea una película familiar sobre la pérdida. Bong lo logra y encima te deja con un final que te obliga a quedarte en los créditos.",
      _ui: { fecha: "2026-05-08", likes: 201 }
    },
    {
      id_resena: 5, id_usuario: 5, id_pelicula: 3, calificacion: 5,
      headline: "Villeneuve domina el silencio",
      descripcion: "La fotografía de Greig Fraser merece un Oscar. Una sola persona en escena durante casi toda la película y nunca aburre. La conversación final con la Tierra es uno de los momentos más bellos del cine reciente.",
      _ui: { fecha: "2026-05-03", likes: 287 }
    },
    {
      id_resena: 6, id_usuario: 2, id_pelicula: 4, calificacion: 4,
      headline: "Documental necesario",
      descripcion: "Tatiana Huezo no necesita artificios. La cámara las acompaña y te encuentras conteniendo la respiración como si tú mismo estuvieras subiendo.",
      _ui: { fecha: "2026-04-28", likes: 73 }
    },
    {
      id_resena: 7, id_usuario: 1, id_pelicula: 10, calificacion: 5,
      headline: "Reygadas nos saca del cine cambiados",
      descripcion: "Hay una toma de un caballo cruzando el desierto que dura cuatro minutos y es lo más cercano a una oración que he visto en pantalla.",
      _ui: { fecha: "2026-04-22", likes: 142 }
    },
    {
      id_resena: 8, id_usuario: 3, id_pelicula: 8, calificacion: 5,
      headline: "Stop-motion mexicano de clase mundial",
      descripcion: "Issa López construyó un universo visual que se siente a la vez antiguo y completamente nuevo. Llévense a sus sobrinos pero también a sus papás.",
      _ui: { fecha: "2026-04-15", likes: 96 }
    }
  ],

  /* == PELICULA_GENERO (tabla puente) == */
  pelicula_genero: [
    { id_pelicula: 1, id_genero: 1 }, { id_pelicula: 1, id_genero: 8 },
    { id_pelicula: 2, id_genero: 1 }, { id_pelicula: 2, id_genero: 10 },
    { id_pelicula: 3, id_genero: 2 }, { id_pelicula: 3, id_genero: 1 },
    { id_pelicula: 4, id_genero: 6 }, { id_pelicula: 4, id_genero: 1 },
    { id_pelicula: 5, id_genero: 1 }, { id_pelicula: 5, id_genero: 7 },
    { id_pelicula: 6, id_genero: 3 }, { id_pelicula: 6, id_genero: 8 },
    { id_pelicula: 7, id_genero: 3 }, { id_pelicula: 7, id_genero: 1 },
    { id_pelicula: 8, id_genero: 5 }, { id_pelicula: 8, id_genero: 2 },
    { id_pelicula: 9, id_genero: 9 }, { id_pelicula: 9, id_genero: 3 },
    { id_pelicula: 10, id_genero: 1 }, { id_pelicula: 10, id_genero: 10 },
    { id_pelicula: 11, id_genero: 2 }, { id_pelicula: 11, id_genero: 7 },
    { id_pelicula: 12, id_genero: 4 }, { id_pelicula: 12, id_genero: 1 }
  ],

  /* == PELICULA_ETIQUETA (tabla puente) == */
  pelicula_etiqueta: [
    { id_pelicula: 1, id_etiqueta: 1 }, { id_pelicula: 1, id_etiqueta: 4 }, { id_pelicula: 1, id_etiqueta: 6 },
    { id_pelicula: 2, id_etiqueta: 4 }, { id_pelicula: 2, id_etiqueta: 5 }, { id_pelicula: 2, id_etiqueta: 8 },
    { id_pelicula: 3, id_etiqueta: 3 }, { id_pelicula: 3, id_etiqueta: 6 }, { id_pelicula: 3, id_etiqueta: 4 },
    { id_pelicula: 4, id_etiqueta: 1 }, { id_pelicula: 4, id_etiqueta: 6 }, { id_pelicula: 4, id_etiqueta: 8 }, { id_pelicula: 4, id_etiqueta: 7 },
    { id_pelicula: 5, id_etiqueta: 1 }, { id_pelicula: 5, id_etiqueta: 9 },
    { id_pelicula: 6, id_etiqueta: 2 }, { id_pelicula: 6, id_etiqueta: 6 }, { id_pelicula: 6, id_etiqueta: 3 },
    { id_pelicula: 7, id_etiqueta: 1 }, { id_pelicula: 7, id_etiqueta: 8 }, { id_pelicula: 7, id_etiqueta: 5 },
    { id_pelicula: 8, id_etiqueta: 6 }, { id_pelicula: 8, id_etiqueta: 8 }, { id_pelicula: 8, id_etiqueta: 3 },
    { id_pelicula: 9, id_etiqueta: 2 }, { id_pelicula: 9, id_etiqueta: 6 },
    { id_pelicula: 10, id_etiqueta: 1 }, { id_pelicula: 10, id_etiqueta: 4 }, { id_pelicula: 10, id_etiqueta: 8 }, { id_pelicula: 10, id_etiqueta: 7 },
    { id_pelicula: 11, id_etiqueta: 3 }, { id_pelicula: 11, id_etiqueta: 6 },
    { id_pelicula: 12, id_etiqueta: 1 }, { id_pelicula: 12, id_etiqueta: 8 }
  ],

  /* == USUARIO_PELICULA (Mi Lista) ==
     Películas que un usuario quiere ver. */
  usuario_pelicula: [
    { id_usuario: 2, id_pelicula: 3, fecha_agregado: "2026-04-12" },
    { id_usuario: 2, id_pelicula: 6, fecha_agregado: "2026-05-01" }
  ],

  /* == RESENA_ETIQUETA (opcional — si tienen relación reseña↔etiqueta) == */
  resena_etiqueta: [
    { id_resena: 1, id_etiqueta: 4 }, { id_resena: 1, id_etiqueta: 5 }, { id_resena: 1, id_etiqueta: 8 },
    { id_resena: 2, id_etiqueta: 4 }, { id_resena: 2, id_etiqueta: 1 }, { id_resena: 2, id_etiqueta: 8 },
    { id_resena: 3, id_etiqueta: 7 }, { id_resena: 3, id_etiqueta: 1 },
    { id_resena: 4, id_etiqueta: 2 }, { id_resena: 4, id_etiqueta: 3 },
    { id_resena: 5, id_etiqueta: 3 }, { id_resena: 5, id_etiqueta: 6 }, { id_resena: 5, id_etiqueta: 4 },
    { id_resena: 6, id_etiqueta: 8 }, { id_resena: 6, id_etiqueta: 6 },
    { id_resena: 7, id_etiqueta: 1 }, { id_resena: 7, id_etiqueta: 8 },
    { id_resena: 8, id_etiqueta: 6 }, { id_resena: 8, id_etiqueta: 8 }
  ]
};

/* ============================================================
   HELPERS — equivalentes a JOINs en SQL
   ============================================================ */
window.PC_HELPERS = {
  peliculaById: (id) => window.PC_DATA.peliculas.find(p => p.id_pelicula === id),
  usuarioById:  (id) => window.PC_DATA.usuarios.find(u => u.id_usuario === id),
  generoById:   (id) => window.PC_DATA.generos.find(g => g.id_genero === id),
  etiquetaById: (id) => window.PC_DATA.etiquetas.find(e => e.id_etiqueta === id),
  resenaById:   (id) => window.PC_DATA.resenas.find(r => r.id_resena === id),

  resenasByPelicula: (id) => window.PC_DATA.resenas.filter(r => r.id_pelicula === id),
  resenasByUsuario:  (id) => window.PC_DATA.resenas.filter(r => r.id_usuario === id),

  generosDePelicula: (id) =>
    window.PC_DATA.pelicula_genero
      .filter(pg => pg.id_pelicula === id)
      .map(pg => window.PC_HELPERS.generoById(pg.id_genero))
      .filter(Boolean),

  etiquetasDePelicula: (id) =>
    window.PC_DATA.pelicula_etiqueta
      .filter(pe => pe.id_pelicula === id)
      .map(pe => window.PC_HELPERS.etiquetaById(pe.id_etiqueta))
      .filter(Boolean),

  etiquetasDeResena: (id) =>
    window.PC_DATA.resena_etiqueta
      .filter(re => re.id_resena === id)
      .map(re => window.PC_HELPERS.etiquetaById(re.id_etiqueta))
      .filter(Boolean),

  miListaDe: (id_usuario) =>
    window.PC_DATA.usuario_pelicula
      .filter(up => up.id_usuario === id_usuario)
      .map(up => window.PC_HELPERS.peliculaById(up.id_pelicula))
      .filter(Boolean),

  /* Promedio de calificación de una película (equivalente a:
     SELECT AVG(CALIFICACION) FROM RESENA WHERE ID_PELICULA = :id) */
  promedioPelicula: (id) => {
    const rs = window.PC_HELPERS.resenasByPelicula(id);
    if (rs.length === 0) return 0;
    return rs.reduce((a, b) => a + b.calificacion, 0) / rs.length;
  },

  totalResenasPelicula: (id) =>
    window.PC_HELPERS.resenasByPelicula(id).length,

  fmtFecha: (s) => {
    const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
    const d = new Date(s + "T00:00");
    return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
  }
};
