/* ============================================================
   PUMA CINE — App principal + routing + bridge a APEX REST
   ============================================================ */

const { useState: useStateApp, useEffect: useEffectApp } = React;

function App() {
  /* === Estado === */
  const [route, setRoute] = useStateApp({ name: "home" });
  const [query, setQuery] = useStateApp("");
  const [currentUser, setCurrentUser] = useStateApp(null);
  const [miLista, setMiLista] = useStateApp([]);          // ids de películas
  const [miListaIds, setMiListaIds] = useStateApp({});    // map id_pelicula → id_usuario_pelicula (para DELETE en APEX)
  const [resenasUser, setResenasUser] = useStateApp([]);
  const [toast, setToast] = useStateApp(null);

  const [dataReady, setDataReady] = useStateApp(false);
  const [loadError, setLoadError] = useStateApp(null);

  /* === Carga inicial: APEX REST o datos mock === */
  useEffectApp(() => {
    const cfg = window.PC_CONFIG;

    if (!cfg?.USE_REAL_API) {
      // Modo mock: data.js ya pobló PC_DATA, seed inicial de Mi Lista
      setMiLista([3, 6]);
      setDataReady(true);
      return;
    }

    // Modo APEX: carga todas las tablas vía REST
    console.log("[Puma Cine] Cargando desde APEX:", cfg.API_BASE);
    window.PC_API.cargarTodo()
      .then(data => {
        window.PC_DATA.peliculas         = data.peliculas;
        window.PC_DATA.usuarios          = data.usuarios;
        window.PC_DATA.generos           = data.generos;
        window.PC_DATA.etiquetas         = data.etiquetas;
        window.PC_DATA.resenas           = data.resenas;
        window.PC_DATA.pelicula_genero   = data.pelicula_genero;
        window.PC_DATA.pelicula_etiqueta = data.pelicula_etiqueta;
        window.PC_DATA.usuario_pelicula  = data.usuario_pelicula;
        console.log("[Puma Cine] Datos cargados:", {
          peliculas: data.peliculas.length,
          usuarios:  data.usuarios.length,
          resenas:   data.resenas.length
        });
        setDataReady(true);
      })
      .catch(err => {
        console.error("[Puma Cine] Error cargando APEX:", err);
        setLoadError(err.message);
        // Fallback al mock para no romper la demo
        setMiLista([3, 6]);
        setDataReady(true);
      });
  }, []);

  /* Cuando cargue el usuario actual, recargar SU Mi Lista */
  useEffectApp(() => {
    if (!currentUser || !dataReady) return;
    const cfg = window.PC_CONFIG;
    if (cfg?.USE_REAL_API) {
      const lista = window.PC_DATA.usuario_pelicula
        .filter(up => up.id_usuario === currentUser.id_usuario);
      setMiLista(lista.map(up => up.id_pelicula));
      setMiListaIds(Object.fromEntries(
        lista.map(up => [up.id_pelicula, up.id_usuario_pelicula || up.id])
      ));
    }
  }, [currentUser, dataReady]);

  /* Inyectar reseñas creadas en sesión al store local */
  useEffectApp(() => {
    if (resenasUser.length === 0) return;
    const ids = new Set(resenasUser.map(r => r.id_resena));
    window.PC_DATA.resenas = [
      ...resenasUser,
      ...window.PC_DATA.resenas.filter(r => !ids.has(r.id_resena))
    ];
    const otrasET = window.PC_DATA.resena_etiqueta.filter(re => !ids.has(re.id_resena));
    for (const ru of resenasUser) {
      for (const et of (ru.etiquetas || [])) {
        otrasET.push({ id_resena: ru.id_resena, id_etiqueta: et });
      }
    }
    window.PC_DATA.resena_etiqueta = otrasET;
  }, [resenasUser]);

  /* Toast auto-dismiss */
  useEffectApp(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  /* === Handlers === */

  const onPick = (p) => setRoute({ name: "detalle", id_pelicula: p.id_pelicula });

  const onRoute = (r) => {
    if (r.name !== "peliculas" && query) setQuery("");
    setRoute(r);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const toggleMiLista = async (id_pelicula) => {
    const cfg = window.PC_CONFIG;
    const yaEsta = miLista.includes(id_pelicula);

    // Optimistic update
    if (yaEsta) {
      setMiLista(prev => prev.filter(x => x !== id_pelicula));
      setToast("Eliminada de Mi Lista");
    } else {
      setMiLista(prev => [...prev, id_pelicula]);
      setToast("Agregada a Mi Lista");
    }

    // POST/DELETE a APEX
    if (cfg?.USE_REAL_API && currentUser) {
      try {
        if (yaEsta) {
          const upId = miListaIds[id_pelicula];
          if (upId) await window.PC_API.quitarMiLista(upId);
        } else {
          await window.PC_API.agregarMiLista(currentUser.id_usuario, id_pelicula);
        }
      } catch (err) {
        console.error("Error sincronizando Mi Lista:", err);
        setToast("Error al guardar en BD");
      }
    }
  };

  const onLogin = (user) => {
    setCurrentUser(user);
    setToast(`Hola, ${user.nombre_completo.split(" ")[0]} 👋`);
    onRoute({ name: "home" });
  };

  const onLogout = () => {
    setCurrentUser(null);
    setMiLista([]);
    setToast("Cerraste sesión");
    onRoute({ name: "home" });
  };

  const onAvatarClick = () => {
    if (currentUser) onRoute({ name: "perfil" });
    else onRoute({ name: "login" });
  };

  const onSubmitResena = async (data) => {
    const cfg = window.PC_CONFIG;
    const tempId = 10000 + resenasUser.length + 1;
    const nueva = { id_resena: tempId, ...data };

    // Optimistic local
    setResenasUser(prev => [nueva, ...prev]);
    setToast("Reseña publicada");
    onRoute({ name: "detalle", id_pelicula: data.id_pelicula });

    // POST a APEX
    if (cfg?.USE_REAL_API) {
      try {
        await window.PC_API.crearResena({
          id_usuario: data.id_usuario,
          id_pelicula: data.id_pelicula,
          headline: data.headline,
          descripcion: data.descripcion,
          calificacion: data.calificacion
        });

        // El trigger trg_resena_marca_vista insertó/actualizó la fila en
        // USUARIO_PELICULA del lado del servidor. Recargamos esa tabla
        // desde APEX para que "Mi Lista" se actualice sin recargar la
        // página (cubre tanto el caso de INSERT como el de UPDATE del
        // trigger MERGE).
        try {
          const filas = await window.PC_API.recargarUsuarioPelicula();
          window.PC_DATA.usuario_pelicula = filas;
          if (currentUser) {
            const propias = filas.filter(up => up.id_usuario === currentUser.id_usuario);
            setMiLista(propias.map(up => up.id_pelicula));
            setMiListaIds(Object.fromEntries(
              propias.map(up => [up.id_pelicula, up.id_usuario_pelicula || up.id || null])
            ));
          }
        } catch (reloadErr) {
          // Si la recarga falla, al menos hacemos un optimistic update
          console.warn("No se pudo recargar usuario_pelicula:", reloadErr);
          setMiLista(prev =>
            prev.includes(data.id_pelicula) ? prev : [...prev, data.id_pelicula]
          );
        }
      } catch (err) {
        console.error("Error guardando reseña:", err);
        setToast("Error al guardar: " + (err.message || "desconocido"));
      }
    } else {
      // En modo mock también añadimos localmente para simular el trigger
      setMiLista(prev =>
        prev.includes(data.id_pelicula) ? prev : [...prev, data.id_pelicula]
      );
    }
  };

  /* === Renders === */

  if (!dataReady) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 24, background: "var(--azul-noche)"
      }}>
        <img
          src="assets/puma-cine-logo.png"
          alt="Puma Cine"
          style={{
            width: 96, height: 96, objectFit: "contain",
            filter: "drop-shadow(0 0 24px rgba(168, 128, 44, 0.5))",
            animation: "pcPulse 1.8s ease-in-out infinite"
          }}
        />
        <p style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          fontSize: 18, color: "var(--oro)"
        }}>
          Cargando catálogo…
        </p>
        <style>{`@keyframes pcPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(0.96); } }`}</style>
      </div>
    );
  }

  // Login fullscreen (sin header)
  if (route.name === "login") {
    return (
      <>
        <Login onLogin={onLogin} onRoute={onRoute} />
        <Toast msg={toast} />
      </>
    );
  }

  return (
    <>
      <Header
        route={route}
        onRoute={onRoute}
        query={query}
        setQuery={setQuery}
        currentUser={currentUser}
        onAvatarClick={onAvatarClick}
      />

      {loadError && (
        <div style={{
          padding: "12px 20px", margin: "0 64px",
          background: "rgba(196, 50, 43, 0.15)", color: "var(--rojo)",
          borderRadius: "var(--r-md)", border: "1px solid rgba(196, 50, 43, 0.3)",
          fontSize: 13, fontFamily: "var(--font-mono)"
        }}>
          ⚠ No se pudo conectar a APEX: {loadError} · usando datos mock
        </div>
      )}

      {route.name === "home" && <Home onPick={onPick} onRoute={onRoute} />}
      {route.name === "peliculas" && <Peliculas onPick={onPick} query={query} filtroPais={route.filtroPais} />}
      {route.name === "detalle" && (
        <Detalle
          id_pelicula={route.id_pelicula}
          onPick={onPick} onRoute={onRoute}
          currentUser={currentUser}
          miLista={miLista} toggleMiLista={toggleMiLista}
        />
      )}
      {route.name === "resenas" && <ListaResenas onPick={onPick} onRoute={onRoute} currentUser={currentUser} query={query} />}
      {route.name === "mi-lista" && <MiLista miLista={miLista} onPick={onPick} onRoute={onRoute} />}
      {route.name === "mejor-calificadas" && <MejorCalificadas onPick={onPick} />}
      {route.name === "formulario" && (
        <FormularioResena
          id_pelicula={route.id_pelicula}
          onRoute={onRoute} currentUser={currentUser}
          onSubmit={onSubmitResena}
        />
      )}
      {route.name === "perfil" && (
        <Perfil
          currentUser={currentUser} onRoute={onRoute}
          onPick={onPick} miLista={miLista} onLogout={onLogout}
        />
      )}

      <footer style={{
        padding: "60px 64px 30px",
        borderTop: "1px solid var(--gris-borde)",
        marginTop: 60,
        color: "var(--crema-sutil)",
        fontSize: 12,
        fontFamily: "var(--font-mono)",
        textTransform: "uppercase",
        letterSpacing: "0.2em",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16
      }}>
        <span>Puma Cine · Proyecto Bases de Datos · UNAM 2026</span>
        <span>
          {window.PC_CONFIG?.USE_REAL_API
            ? "🟢 Conectado a Oracle APEX"
            : "🔵 Modo demo (datos mock)"}
        </span>
      </footer>

      <NavSiguientePestana route={route} onRoute={onRoute} />

      <Toast msg={toast} />
    </>
  );
}

/* ------------------------------------------------------------
   NAV SIGUIENTE PESTAÑA — botón flotante al final de la página
   que cicla entre las secciones principales del header.
   ------------------------------------------------------------ */
function NavSiguientePestana({ route, onRoute }) {
  const PESTANAS = [
    { name: "home",              label: "Inicio" },
    { name: "peliculas",         label: "Películas" },
    { name: "resenas",           label: "Reseñas" },
    { name: "mi-lista",          label: "Mi Lista" },
    { name: "mejor-calificadas", label: "Mejor Calificadas" }
  ];

  // Si estoy en una pestaña principal, avanzo a la siguiente; si estoy en
  // una vista secundaria (detalle, formulario, perfil) regreso a Inicio.
  const idxActual = PESTANAS.findIndex(p => p.name === route.name);
  const siguiente = idxActual === -1
    ? PESTANAS[0]
    : PESTANAS[(idxActual + 1) % PESTANAS.length];
  const anterior = idxActual === -1
    ? PESTANAS[PESTANAS.length - 1]
    : PESTANAS[(idxActual - 1 + PESTANAS.length) % PESTANAS.length];

  const go = (p) => {
    onRoute({ name: p.name });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="pc-tabnav">
        <button
          className="pc-tabnav-btn pc-tabnav-prev"
          onClick={() => go(anterior)}
          aria-label={`Ir a ${anterior.label}`}
          title={`← ${anterior.label}`}
        >
          <span className="pc-tabnav-arrow">←</span>
          <span className="pc-tabnav-meta">
            <span className="pc-tabnav-kicker">Anterior</span>
            <span className="pc-tabnav-label">{anterior.label}</span>
          </span>
        </button>

        <div className="pc-tabnav-dots" role="tablist" aria-label="Pestañas">
          {PESTANAS.map((p, i) => (
            <button
              key={p.name}
              className={"pc-tabnav-dot " + (i === idxActual ? "active" : "")}
              onClick={() => go(p)}
              aria-label={p.label}
              title={p.label}
            />
          ))}
        </div>

        <button
          className="pc-tabnav-btn pc-tabnav-next"
          onClick={() => go(siguiente)}
          aria-label={`Ir a ${siguiente.label}`}
          title={`${siguiente.label} →`}
        >
          <span className="pc-tabnav-meta pc-tabnav-meta-right">
            <span className="pc-tabnav-kicker">Siguiente</span>
            <span className="pc-tabnav-label">{siguiente.label}</span>
          </span>
          <span className="pc-tabnav-arrow">→</span>
        </button>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
