/* ============================================================
   PUMA CINE — pantallas: Lista de Reseñas, Formulario, Mi Lista,
   Mejor Calificadas, Login, Perfil
   ============================================================ */

const { useState: useStateUR, useMemo: useMemoUR } = React;

/* ------------------------------------------------------------
   LISTA DE RESEÑAS (todas)
   ------------------------------------------------------------ */
function ListaResenas({ onPick, onRoute, currentUser, query }) {
  const data = window.PC_DATA;
  const H = window.PC_HELPERS;
  const [filtro, setFiltro] = useStateUR("todas"); // todas | mias | populares
  const [ordenar, setOrdenar] = useStateUR("recientes");

  const resenas = useMemoUR(() => {
    let r = [...data.resenas];
    if (filtro === "mias" && currentUser) r = r.filter(x => x.id_usuario === currentUser.id_usuario);
    if (filtro === "populares") r = r.filter(x => (x._ui?.likes ?? 0) >= 100);
    if (query) {
      const q = query.toLowerCase();
      r = r.filter(x => {
        const p = H.peliculaById(x.id_pelicula);
        return (x.headline || "").toLowerCase().includes(q)
            || x.descripcion.toLowerCase().includes(q)
            || (p && p.titulo.toLowerCase().includes(q));
      });
    }
    if (ordenar === "recientes") r.sort((a, b) => (b._ui?.fecha || "").localeCompare(a._ui?.fecha || ""));
    if (ordenar === "populares") r.sort((a, b) => (b._ui?.likes ?? 0) - (a._ui?.likes ?? 0));
    if (ordenar === "rating")    r.sort((a, b) => b.calificacion - a.calificacion);
    return r;
  }, [filtro, ordenar, query, currentUser]);

  return (
    <div className="pc-page pc-screen-fade">
      <div className="pc-page-header">
        <h1 className="pc-page-title">Todas las <em>reseñas</em></h1>
        <p className="pc-page-sub">{resenas.length} reseñas de la comunidad Puma Cine</p>
      </div>

      <div className="pc-filters">
        <div className="pc-filter-group">
          <span className="pc-filter-label">Mostrar</span>
          <div className="pc-chip-row">
            <button className={"pc-chip " + (filtro === "todas" ? "active" : "")} onClick={() => setFiltro("todas")}>Todas</button>
            {currentUser && (
              <button className={"pc-chip " + (filtro === "mias" ? "active" : "")} onClick={() => setFiltro("mias")}>Mis reseñas</button>
            )}
            <button className={"pc-chip " + (filtro === "populares" ? "active" : "")} onClick={() => setFiltro("populares")}>Populares</button>
          </div>
        </div>
        <div className="pc-filter-group" style={{ marginLeft: "auto" }}>
          <span className="pc-filter-label">Ordenar</span>
          <div className="pc-chip-row">
            <button className={"pc-chip " + (ordenar === "recientes" ? "active" : "")} onClick={() => setOrdenar("recientes")}>Más recientes</button>
            <button className={"pc-chip " + (ordenar === "populares" ? "active" : "")} onClick={() => setOrdenar("populares")}>Más útiles</button>
            <button className={"pc-chip " + (ordenar === "rating" ? "active" : "")} onClick={() => setOrdenar("rating")}>Mejor calificación</button>
          </div>
        </div>
      </div>

      {resenas.length === 0 ? (
        <EmptyState
          icon={<PCIcon.Pen size={48} />}
          title={filtro === "mias" ? "Aún no escribes ninguna reseña" : "Sin resultados"}
          sub={filtro === "mias" ? "Escribe tu primera reseña desde cualquier película." : "Cambia los filtros para ver más."}
        />
      ) : (
        resenas.map(r => <ResenaCard key={r.id_resena} resena={r} mostrarPelicula={true} onPick={onPick} />)
      )}
    </div>
  );
}

/* ------------------------------------------------------------
   FORMULARIO NUEVA RESEÑA
   Campos REALES de tu BD:
     HEADLINE     VARCHAR2(50)    NOT NULL
     DESCRIPCION  VARCHAR2(1000)  NOT NULL
     CALIFICACION NUMBER(2,0)     NOT NULL  (1-5)
   ------------------------------------------------------------ */
function FormularioResena({ id_pelicula, onRoute, currentUser, onSubmit }) {
  const data = window.PC_DATA;
  const H = window.PC_HELPERS;
  const [peliculaSel, setPeliculaSel] = useStateUR(id_pelicula || data.peliculas[0].id_pelicula);
  const p = H.peliculaById(peliculaSel);

  const [calif, setCalif] = useStateUR(0);
  const [headline, setHeadline] = useStateUR("");
  const [descripcion, setDescripcion] = useStateUR("");
  const [etiquetasSel, setEtiquetasSel] = useStateUR([]);
  const [error, setError] = useStateUR(null);

  const toggleEtiqueta = (id) => {
    setEtiquetasSel(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError("Necesitas iniciar sesión para publicar una reseña.");
      return;
    }
    if (calif === 0) return setError("Selecciona una calificación.");
    if (descripcion.trim().length < 20) return setError("Tu reseña debe tener al menos 20 caracteres.");
    // Oracle VARCHAR2(n) cuenta BYTES (acentos = 2). El cliente trunca
    // antes de mandar, pero avisamos aquí también para que el usuario
    // sepa que se va a recortar.
    const bytesDesc = new TextEncoder().encode(descripcion).length;
    const bytesHead = new TextEncoder().encode(headline).length;
    if (bytesDesc > 1000) return setError(`Tu reseña ocupa ${bytesDesc} bytes (los acentos cuentan doble). Acorta unos ${bytesDesc - 1000} caracteres.`);
    if (bytesHead > 50) return setError(`El título ocupa ${bytesHead} bytes. Acorta unos ${bytesHead - 50} caracteres.`);
    setError(null);
    onSubmit({
      id_pelicula: peliculaSel,
      id_usuario: currentUser.id_usuario,
      calificacion: calif,
      headline: headline.trim() || null,
      descripcion: descripcion.trim(),
      etiquetas: etiquetasSel,
      _ui: { fecha: new Date().toISOString().slice(0, 10), likes: 0 }
    });
  };

  const posterBg = p.poster_url
    ? `url("${p.poster_url}") center / cover no-repeat`
    : p._ui?.gradient;

  return (
    <div className="pc-form-shell pc-screen-fade">
      <button
        className="pc-btn pc-btn-ghost"
        onClick={() => onRoute({ name: "detalle", id_pelicula: peliculaSel })}
        style={{ marginBottom: 18 }}
      >
        <PCIcon.ArrowLeft /> Volver
      </button>

      <h1 style={{
        fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 500,
        margin: "0 0 6px", letterSpacing: "-0.02em", lineHeight: 1
      }}>
        Escribe tu <em style={{ color: "var(--oro)", fontStyle: "italic" }}>reseña</em>
      </h1>
      <p style={{ color: "var(--crema-tenue)", margin: "0 0 32px" }}>
        Tu opinión cuenta. Sé honesto, sé específico, sé tú.
      </p>

      <form className="pc-form-card" onSubmit={submit}>
        <div className="pc-form-movie">
          <div className="pc-form-movie-poster" style={{ background: posterBg }}>
            {!p.poster_url && p.titulo}
          </div>
          <div className="pc-form-movie-meta" style={{ flex: 1 }}>
            <h3>{p.titulo}</h3>
            <p>{p.director} · {p.ano_estreno} · {p.duracion_minutos} min</p>
            {!id_pelicula && (
              <select
                className="pc-select"
                style={{ marginTop: 14, maxWidth: 320 }}
                value={peliculaSel}
                onChange={(e) => setPeliculaSel(Number(e.target.value))}
              >
                {data.peliculas.map(x => (
                  <option key={x.id_pelicula} value={x.id_pelicula}>
                    {x.titulo} ({x.ano_estreno})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="pc-field">
          <label className="pc-label">Tu calificación</label>
          <StarsPicker value={calif} onChange={setCalif} />
        </div>

        <div className="pc-field">
          <label className="pc-label">
            Headline <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--crema-sutil)" }}>(titular, opcional · máx. 50)</span>
          </label>
          <input
            className="pc-input"
            placeholder="Un titular que resuma lo que sentiste"
            value={headline}
            maxLength={80}
            onChange={(e) => setHeadline(e.target.value)}
          />
          <div className="pc-helper">
            <span>VARCHAR2(50) · acentos cuentan doble</span>
            {(() => {
              const b = new TextEncoder().encode(headline).length;
              const color = b > 50 ? "var(--rojo)" : b > 42 ? "var(--oro-claro)" : "var(--crema-sutil)";
              return <span style={{ color }}>{b} / 50 bytes</span>;
            })()}
          </div>
        </div>

        <div className="pc-field">
          <label className="pc-label">Tu reseña <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--crema-sutil)" }}>(descripción · 20–1000 bytes)</span></label>
          <textarea
            className="pc-textarea"
            placeholder="¿Qué te hizo sentir? ¿Qué destacarías? ¿Le sobró o le faltó algo? Mínimo 20 caracteres."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            maxLength={1500}
          />
          <div className="pc-helper">
            <span>Usa &lt;em&gt;cursiva&lt;/em&gt; para enfatizar · acentos cuentan doble</span>
            {(() => {
              const b = new TextEncoder().encode(descripcion).length;
              const color = b > 1000 ? "var(--rojo)" : b > 900 ? "var(--oro-claro)" : "var(--crema-sutil)";
              return <span style={{ color }}>{b} / 1000 bytes</span>;
            })()}
          </div>
        </div>

        <div className="pc-field">
          <label className="pc-label">Etiquetas <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--crema-sutil)" }}>(hasta 4)</span></label>
          <div className="pc-tag-picker">
            {data.etiquetas.map(e => (
              <button
                type="button"
                key={e.id_etiqueta}
                className={"pc-tag-pick " + (etiquetasSel.includes(e.id_etiqueta) ? "on" : "")}
                onClick={() => {
                  if (etiquetasSel.includes(e.id_etiqueta)) toggleEtiqueta(e.id_etiqueta);
                  else if (etiquetasSel.length < 4) toggleEtiqueta(e.id_etiqueta);
                }}
                disabled={!etiquetasSel.includes(e.id_etiqueta) && etiquetasSel.length >= 4}
              >#{e.nombre}</button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{
            padding: "12px 16px", marginBottom: 18, borderRadius: "var(--r-md)",
            background: "rgba(196, 50, 43, 0.12)", color: "var(--rojo)",
            border: "1px solid rgba(196, 50, 43, 0.3)", fontSize: 14
          }}>
            {error}
          </div>
        )}

        <div className="pc-form-actions">
          <button type="button" className="pc-btn pc-btn-secondary" onClick={() => onRoute({ name: "detalle", id_pelicula: peliculaSel })}>
            Cancelar
          </button>
          <button type="submit" className="pc-btn pc-btn-primary">
            <PCIcon.Check /> Publicar reseña
          </button>
        </div>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------
   MI LISTA  (tabla USUARIO_PELICULA)
   ------------------------------------------------------------ */
function MiLista({ miLista, onPick, onRoute }) {
  const H = window.PC_HELPERS;
  const pelis = miLista.map(H.peliculaById).filter(Boolean);
  return (
    <div className="pc-page pc-screen-fade">
      <div className="pc-page-header">
        <h1 className="pc-page-title">Mi <em>Lista</em></h1>
        <p className="pc-page-sub">{pelis.length} película{pelis.length === 1 ? "" : "s"} que quieres ver</p>
      </div>
      {pelis.length === 0 ? (
        <EmptyState
          icon={<PCIcon.Plus size={48} />}
          title="Tu lista está vacía"
          sub="Agrega películas desde su detalle para guardarlas aquí."
        />
      ) : (
        <div className="pc-grid">
          {pelis.map(p => <Poster key={p.id_pelicula} pelicula={p} onClick={onPick} />)}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------
   MEJOR CALIFICADAS
   ------------------------------------------------------------ */
function MejorCalificadas({ onPick }) {
  const H = window.PC_HELPERS;
  const pelis = [...window.PC_DATA.peliculas]
    .filter(p => H.totalResenasPelicula(p.id_pelicula) > 0)
    .sort((a, b) => H.promedioPelicula(b.id_pelicula) - H.promedioPelicula(a.id_pelicula));
  return (
    <div className="pc-page pc-screen-fade">
      <div className="pc-page-header">
        <h1 className="pc-page-title">Mejor <em>calificadas</em></h1>
        <p className="pc-page-sub">El ranking según el promedio de reseñas de la comunidad</p>
      </div>
      <div className="pc-grid">
        {pelis.map((p, i) => (
          <Poster key={p.id_pelicula} pelicula={p} onClick={onPick} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   LOGIN
   ------------------------------------------------------------ */
function Login({ onLogin, onRoute }) {
  const [modo, setModo] = useStateUR("login"); // login | registro
  const [email, setEmail] = useStateUR("");
  const [pass, setPass]   = useStateUR("");
  const [nombre, setNombre] = useStateUR("");
  const [error, setError] = useStateUR("");
  const [cargando, setCargando] = useStateUR(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const cfg = window.PC_CONFIG;

    if (modo === "login") {
      /* === Validar credenciales contra la tabla USUARIO === */
      const user = (window.PC_DATA.usuarios || []).find(u =>
        (u.email || "").toLowerCase() === email.trim().toLowerCase()
      );
      if (!user) {
        setError("No existe una cuenta con ese correo.");
        return;
      }
      if (user.activo === 0) {
        setError("Esta cuenta está desactivada.");
        return;
      }
      // Si el usuario tiene contraseña en la BD, comparamos exactamente.
      // Si no la tiene (modo mock antiguo sin columna), aceptamos cualquier
      // contraseña no vacía para no romper la demo.
      if (user.contrasena != null && String(user.contrasena) !== pass) {
        setError("Contraseña incorrecta.");
        return;
      }
      if (user.contrasena == null && pass.length === 0) {
        setError("Escribe tu contraseña.");
        return;
      }
      onLogin(user);
      return;
    }

    /* === Registro: insertar en la tabla USUARIO === */
    const nombreCompleto = nombre.trim();
    const correo = email.trim();
    if (!nombreCompleto || !correo || !pass) {
      setError("Completa todos los campos.");
      return;
    }
    // ¿Ya existe?
    const yaExiste = (window.PC_DATA.usuarios || []).some(u =>
      (u.email || "").toLowerCase() === correo.toLowerCase()
    );
    if (yaExiste) {
      setError("Ya existe una cuenta con ese correo.");
      return;
    }
    const nombreUsuario = (nombreCompleto.split(" ")[0] || "user").toLowerCase()
      + "_" + Math.random().toString(36).slice(2, 5);

    setCargando(true);
    let nuevoId;
    let fechaReg = new Date().toISOString().slice(0, 10);

    if (cfg?.USE_REAL_API) {
      try {
        const resp = await window.PC_API.registrarUsuario({
          nombre_usuario: nombreUsuario,
          nombre_completo: nombreCompleto,
          email: correo,
          contrasena: pass
        });
        // APEX AutoREST suele devolver la fila insertada (o un array dentro de "items")
        const fila = resp?.items?.[0] || resp;
        const k = {};
        for (const key in (fila || {})) k[key.toLowerCase()] = fila[key];
        nuevoId = k.id_usuario;
      } catch (err) {
        console.error("Error registrando usuario:", err);
        // Mostramos el detalle real que devolvió APEX (constraint, columna,
        // etc.) para no tener que abrir la consola.
        setError("No se pudo guardar: " + (err.message || "error desconocido"));
        setCargando(false);
        return;
      }
    }
    setCargando(false);

    if (!nuevoId) {
      // Fallback (modo mock): genero un id local incremental
      const ids = (window.PC_DATA.usuarios || []).map(u => u.id_usuario || 0);
      nuevoId = (ids.length ? Math.max(...ids) : 0) + 1;
    }

    const nuevo = {
      id_usuario: nuevoId,
      nombre_usuario: nombreUsuario,
      nombre_completo: nombreCompleto,
      email: correo,
      contrasena: pass,
      activo: 1,
      fecha_registro: fechaReg,
      _ui: {
        inicial: (nombreCompleto[0] || "U").toUpperCase(),
        color: "#2D52A8"
      }
    };
    // Lo añadimos al store local para que aparezca de inmediato en la UI
    window.PC_DATA.usuarios = [...(window.PC_DATA.usuarios || []), nuevo];
    onLogin(nuevo);
  };

  return (
    <div className="pc-login pc-screen-fade">
      <div className="pc-login-art">
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 28 }}>
          <img
            src="assets/puma-cine-logo.png"
            alt="Puma Cine"
            style={{ width: 180, height: 180, objectFit: "contain", filter: "drop-shadow(0 6px 28px rgba(168, 128, 44, 0.45))" }}
          />
          <div className="pc-logo-text" style={{ fontSize: 30 }}>
            Puma <em style={{ color: "var(--oro)", fontStyle: "italic" }}>Cine</em>
          </div>
        </div>
        <h1 className="pc-login-art-text">
          El cine que <em>habita</em> en nosotros, ahora reseñado por una <em>comunidad</em>.
        </h1>
        <div className="pc-login-art-foot">
          <span>Proyecto · Bases de datos</span>
          <span>UNAM · 2026</span>
        </div>
      </div>

      <div className="pc-login-form">
        <div className="pc-login-form-inner">
          <h2>{modo === "login" ? <>Bienvenido de <em>vuelta</em></> : <>Crea tu <em>cuenta</em></>}</h2>
          <p>
            {modo === "login"
              ? "Entra para escribir reseñas y guardar películas."
              : "Únete a la comunidad y comparte qué viste."}
          </p>

          <form onSubmit={submit}>
            {modo === "registro" && (
              <div className="pc-field">
                <label className="pc-label">Nombre completo</label>
                <input className="pc-input" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" required />
              </div>
            )}
            <div className="pc-field">
              <label className="pc-label">Correo electrónico</label>
              <input
                className="pc-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </div>
            <div className="pc-field">
              <label className="pc-label">Contraseña</label>
              <input
                className="pc-input"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="pc-btn pc-btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={cargando}>
              {cargando
                ? "Guardando…"
                : modo === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </button>

            {error && (
              <p style={{
                marginTop: 14,
                padding: "10px 14px",
                background: "rgba(196, 50, 43, 0.12)",
                border: "1px solid rgba(196, 50, 43, 0.35)",
                borderRadius: "var(--r-md)",
                color: "var(--rojo)",
                fontSize: 13,
                fontFamily: "var(--font-body)",
                textAlign: "center"
              }}>
                {error}
              </p>
            )}
          </form>

          <p className="pc-link-row">
            {modo === "login" ? (
              <>¿Eres nuevo? <a onClick={() => { setError(""); setModo("registro"); }}>Crea una cuenta</a></>
            ) : (
              <>¿Ya tienes cuenta? <a onClick={() => { setError(""); setModo("login"); }}>Inicia sesión</a></>
            )}
          </p>
          <p className="pc-link-row" style={{ marginTop: 8 }}>
            <a onClick={() => onRoute({ name: "home" })}>Continuar sin cuenta →</a>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   PERFIL
   ------------------------------------------------------------ */
function Perfil({ currentUser, onRoute, onPick, miLista, onLogout }) {
  const H = window.PC_HELPERS;
  const [tab, setTab] = useStateUR("resenas");

  if (!currentUser) {
    return (
      <div className="pc-page pc-screen-fade">
        <EmptyState
          icon={<PCIcon.User size={48} />}
          title="No has iniciado sesión"
          sub="Inicia sesión para ver tu perfil."
        />
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button className="pc-btn pc-btn-primary" onClick={() => onRoute({ name: "login" })}>
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  const misResenas = H.resenasByUsuario(currentUser.id_usuario);
  const listaPelis = miLista.map(H.peliculaById).filter(Boolean);
  const promedioDado = misResenas.length
    ? (misResenas.reduce((a, b) => a + b.calificacion, 0) / misResenas.length)
    : 0;

  const avatarBg = currentUser._ui?.color
    ? `linear-gradient(135deg, ${currentUser._ui.color}, var(--azul-unam))`
    : "linear-gradient(135deg, var(--azul-claro), var(--azul-unam))";

  return (
    <div className="pc-screen-fade">
      <section className="pc-profile-header">
        <div className="pc-profile-avatar" style={{ background: avatarBg }}>
          {currentUser._ui?.inicial}
        </div>
        <div style={{ flex: 1 }}>
          <h1 className="pc-profile-name">{currentUser.nombre_completo}</h1>
          <p className="pc-profile-handle">@{currentUser.nombre_usuario} · {currentUser.email}</p>
          <div className="pc-stats">
            <div className="pc-stat">
              <strong>{misResenas.length}</strong>
              <span>Reseñas</span>
            </div>
            <div className="pc-stat">
              <strong>{listaPelis.length}</strong>
              <span>En Mi Lista</span>
            </div>
            <div className="pc-stat">
              <strong>{promedioDado ? promedioDado.toFixed(1) : "—"}</strong>
              <span>Promedio dado</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="pc-btn pc-btn-outline" onClick={() => onRoute({ name: "formulario" })}>
            <PCIcon.Pen /> Nueva reseña
          </button>
          <button className="pc-btn pc-btn-ghost" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </section>

      <div className="pc-tabs">
        <button className={"pc-tab " + (tab === "resenas" ? "active" : "")} onClick={() => setTab("resenas")}>
          Mis reseñas ({misResenas.length})
        </button>
        <button className={"pc-tab " + (tab === "lista" ? "active" : "")} onClick={() => setTab("lista")}>
          Mi Lista ({listaPelis.length})
        </button>
      </div>

      <div style={{ padding: "0 64px 80px" }}>
        {tab === "resenas" && (
          misResenas.length === 0
            ? <EmptyState icon={<PCIcon.Pen size={36} />} title="Aún sin reseñas" sub="Empieza por escribir tu primera." />
            : misResenas.map(r => <ResenaCard key={r.id_resena} resena={r} mostrarPelicula={true} onPick={onPick} />)
        )}
        {tab === "lista" && (
          listaPelis.length === 0
            ? <EmptyState icon={<PCIcon.Plus size={36} />} title="Tu lista está vacía" />
            : <div className="pc-grid">{listaPelis.map(p => <Poster key={p.id_pelicula} pelicula={p} onClick={onPick} />)}</div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ListaResenas, FormularioResena, MiLista, MejorCalificadas, Login, Perfil });
