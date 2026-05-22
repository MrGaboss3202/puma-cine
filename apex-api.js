/* ============================================================
   PUMA CINE — APEX REST API
   ------------------------------------------------------------
   Capa de comunicación entre el prototipo y tu BD Oracle APEX.
   Usa los AutoREST endpoints que APEX genera automáticamente
   cuando activas RESTful Services en una tabla.

   Cada endpoint AutoREST responde:
     GET    /tabla/        →  { items: [...], hasMore: false }
     GET    /tabla/:id     →  { ... } (un registro)
     POST   /tabla/        →  201 Created (envía JSON con columnas)
     PUT    /tabla/:id     →  200 OK
     DELETE /tabla/:id     →  204 No Content
   ============================================================ */

(function () {
  const CFG = window.PC_CONFIG;

  function endpoint(name) {
    return CFG.API_BASE.replace(/\/+$/, "") + "/" + CFG.ENDPOINTS[name];
  }

  async function getAll(name) {
    // APEX AutoREST pagina por defecto a 25 filas y devuelve hasMore: true
    // junto con un link rel="next". Recorremos todas las páginas para
    // entregar el catálogo completo, no solo los primeros 25.
    const base = endpoint(name);
    // Pedimos páginas grandes para minimizar round-trips
    const PAGE = 1000;
    let url = base + (base.includes("?") ? "&" : "?") + "limit=" + PAGE + "&offset=0";
    let all = [];
    let guard = 0;
    while (url && guard < 50) {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`GET ${name}: ${r.status}`);
      const json = await r.json();
      const items = json.items || json;
      if (Array.isArray(items)) all = all.concat(items);
      else return items; // respuesta no paginada
      // ¿más páginas? APEX devuelve hasMore + un links[] con rel:"next"
      const nextLink = (json.links || []).find(l => l.rel === "next");
      if (json.hasMore && nextLink && nextLink.href) {
        url = nextLink.href;
      } else {
        url = null;
      }
      guard++;
    }
    return all;
  }

  async function post(name, body) {
    const url = endpoint(name);
    console.log(`[Puma Cine] POST ${url}`, body);
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!r.ok) {
      // Intentamos extraer el detalle de APEX (suele venir un JSON con
      // "message" o "title" describiendo qué constraint o columna falló).
      let detalle = "";
      try {
        const txt = await r.text();
        console.log(`[Puma Cine] POST ${name} ← respuesta cruda:`, txt);
        try {
          const j = JSON.parse(txt);
          detalle = j.message || j.title || txt.slice(0, 200);
        } catch {
          detalle = txt.slice(0, 200);
        }
      } catch {}
      console.error(`[Puma Cine] POST ${name} → ${r.status}`, detalle);
      throw new Error(`POST ${name}: ${r.status}${detalle ? " · " + detalle : ""}`);
    }
    return r.json().catch(() => ({}));
  }

  async function del(name, id) {
    const url = endpoint(name) + id;
    const r = await fetch(url, { method: "DELETE" });
    if (!r.ok) throw new Error(`DELETE ${name}/${id}: ${r.status}`);
    return true;
  }

  /* ============================================================
     Normalizadores — convierten la respuesta de APEX al shape
     que espera el prototipo (agregan campos _ui de respaldo).
     ============================================================ */

  // Genera un gradiente reproducible a partir del id (para
  // películas sin POSTER_URL, así cada una tiene su color)
  function gradientPara(id) {
    const palettes = [
      "linear-gradient(135deg, #1a4d8a 0%, #0a1530 70%)",
      "linear-gradient(135deg, #A8802C 0%, #5e4318 50%, #0a1530 100%)",
      "linear-gradient(135deg, #0a1530 0%, #1E3A7A 50%, #14296B 100%)",
      "linear-gradient(135deg, #B89045 0%, #6E5318 40%, #0a1530 100%)",
      "linear-gradient(135deg, #c44d4d 0%, #6e1a1a 50%, #0a1530 100%)",
      "linear-gradient(135deg, #802929 0%, #14296B 60%, #050912 100%)",
      "linear-gradient(135deg, #2D52A8 0%, #0a1530 100%)",
      "linear-gradient(135deg, #A8802C 0%, #802929 50%, #14296B 100%)",
      "linear-gradient(135deg, #14296B 0%, #050912 50%, #802929 100%)",
      "linear-gradient(135deg, #6E5318 0%, #A8802C 30%, #0a1530 100%)"
    ];
    return palettes[id % palettes.length];
  }

  function inicial(s) {
    return (s || "?").trim().charAt(0).toUpperCase();
  }

  function avatarColor(id) {
    const colors = ["#2D52A8", "#1E3A7A", "#3B5BBF", "#14296B", "#2949A6"];
    return colors[id % colors.length];
  }

  function normalizePelicula(p) {
    // APEX puede devolver las columnas en mayúsculas o minúsculas
    // dependiendo de la versión — normalizamos a minúsculas
    const k = lowercaseKeys(p);
    return {
      id_pelicula: k.id_pelicula,
      titulo: k.titulo,
      sinopsis: k.sinopsis,
      director: k.director,
      poster_url: k.poster_url,
      ano_estreno: k.ano_estreno,
      duracion_minutos: k.duracion_minutos,
      _ui: {
        gradient: gradientPara(k.id_pelicula),
        pais: null,
        idioma: null,
        tagline: null,
        destacada: false
      }
    };
  }

  function normalizeUsuario(u) {
    const k = lowercaseKeys(u);
    // ACTIVO en APEX viene como 'S'/'N' (string) — normalizamos a 1/0
    let activo = k.activo;
    if (typeof activo === "string") {
      activo = /^[sy1t]/i.test(activo) ? 1 : 0;
    }
    return {
      id_usuario: k.id_usuario,
      nombre_usuario: k.nombre_usuario,
      nombre_completo: k.nombre_completo,
      email: k.email,
      // Conservamos contrasena (no se expone en UI, solo se usa para validar login)
      contrasena: k.contrasena,
      activo,
      fecha_registro: k.fecha_registro,
      _ui: {
        inicial: inicial(k.nombre_completo || k.nombre_usuario),
        color: avatarColor(k.id_usuario)
      }
    };
  }

  function normalizeResena(r) {
    const k = lowercaseKeys(r);
    return {
      id_resena: k.id_resena,
      id_usuario: k.id_usuario,
      id_pelicula: k.id_pelicula,
      headline: k.headline,
      descripcion: k.descripcion,
      calificacion: k.calificacion,
      _ui: {
        fecha: (k.created_on || new Date().toISOString()).slice(0, 10),
        likes: 0
      }
    };
  }

  function lowercaseKeys(obj) {
    const out = {};
    for (const key in obj) {
      out[key.toLowerCase()] = obj[key];
    }
    return out;
  }

  /* ============================================================
     API pública
     ============================================================ */

  window.PC_API = {

    /* Carga inicial completa — trae todas las tablas en paralelo */
    async cargarTodo() {
      const [
        peliculas,
        usuarios,
        generos,
        etiquetas,
        resenas,
        pelicula_genero,
        pelicula_etiqueta,
        usuario_pelicula
      ] = await Promise.all([
        getAll("pelicula"),
        getAll("usuario"),
        getAll("genero"),
        getAll("etiqueta"),
        getAll("resena"),
        getAll("pelicula_genero"),
        getAll("pelicula_etiqueta"),
        getAll("usuario_pelicula")
      ]);

      return {
        peliculas: peliculas.map(normalizePelicula),
        usuarios: usuarios.map(normalizeUsuario),
        generos: generos.map(lowercaseKeys),
        etiquetas: etiquetas.map(lowercaseKeys),
        resenas: resenas.map(normalizeResena),
        pelicula_genero: pelicula_genero.map(lowercaseKeys),
        pelicula_etiqueta: pelicula_etiqueta.map(lowercaseKeys),
        usuario_pelicula: usuario_pelicula.map(lowercaseKeys)
      };
    },

    /* INSERT INTO RESENA (...) VALUES (...) */
    async crearResena({ id_usuario, id_pelicula, headline, descripcion, calificacion }) {
      // HEADLINE está limitado a VARCHAR2(50); truncamos por si acaso
      // (Oracle cuenta bytes y los acentos ocupan 2).
      const safeHeadline = headline ? String(headline).slice(0, 45) : null;

      // Cuerpo del POST. No enviamos ID_RESENA: si tu tabla tiene una
      // secuencia + trigger BEFORE INSERT, Oracle lo asigna solo. Si no,
      // tendrás que mandar el id explícito (avisame).
      const body = {
        id_usuario,
        id_pelicula,
        headline: safeHeadline,
        descripcion,
        calificacion
      };

      // Log de diagnóstico para ver qué exactamente estamos mandando
      // (abrir DevTools → Console al publicar reseña).
      console.log("[Puma Cine] POST /resena/ body:", body);

      return post("resena", body);
    },

    /* INSERT INTO USUARIO_PELICULA (id_usuario, id_pelicula) VALUES (...) */
    async agregarMiLista(id_usuario, id_pelicula) {
      return post("usuario_pelicula", { id_usuario, id_pelicula });
    },

    /* DELETE FROM USUARIO_PELICULA WHERE ... */
    async quitarMiLista(id_usuario_pelicula) {
      return del("usuario_pelicula", id_usuario_pelicula);
    },

    /* GET /usuario_pelicula/ — recarga sólo esa tabla (útil tras un
       trigger que la modifica, p.ej. trg_resena_marca_vista). */
    async recargarUsuarioPelicula() {
      const filas = await getAll("usuario_pelicula");
      return filas.map(lowercaseKeys);
    },

    /* INSERT INTO USUARIO (...) — registro de nuevo usuario */
    async registrarUsuario({ nombre_usuario, nombre_completo, email, contrasena }) {
      // ACTIVO en tu tabla es 'S'/'N' (VARCHAR2(1) con CHECK constraint).
      // FECHA_REGISTRO es NOT NULL: APEX AutoREST espera la fecha como
      // ISO 8601 completo (con hora y zona Z), si no, falla el parseo.
      const ahora = new Date().toISOString().slice(0, 19) + "Z"; // 2026-05-22T12:34:56Z
      return post("usuario", {
        nombre_usuario,
        nombre_completo,
        email,
        contrasena,
        activo: "S",
        fecha_registro: ahora
      });
    }
  };

})();
