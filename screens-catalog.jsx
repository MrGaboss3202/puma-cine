/* ============================================================
   PUMA CINE — pantallas: Home, Películas, Detalle
   ============================================================ */

const { useState: useStateHD, useMemo: useMemoHD } = React;

function Home({ onPick, onRoute }) {
  const data = window.PC_DATA;
  const H = window.PC_HELPERS;
  const mejorCalificadas = [...data.peliculas]
    .map(p => ({ ...p, _promedio: H.promedioPelicula(p.id_pelicula) }))
    .sort((a, b) => b._promedio - a._promedio)
    .slice(0, 10);

  // Películas que rotan en el hero: top 7 (incluye la marcada destacada al frente)
  const destacadaFija = data.peliculas.find(p => p._ui?.destacada);
  const heroBase = mejorCalificadas.slice(0, 7);
  const heroPeliculas = destacadaFija
    ? [destacadaFija, ...heroBase.filter(p => p.id_pelicula !== destacadaFija.id_pelicula)].slice(0, 7)
    : heroBase;
  const recientes = [...data.peliculas].sort((a, b) => b.ano_estreno - a.ano_estreno).slice(0, 8);

  // "Cine mexicano" incluye películas marcadas como mexicanas por país
  // (_ui.pais) o cuyo género se llame "Mexicano" / "México" en la BD
  // (caso APEX, donde _ui.pais no se pobla).
  const esCineMexicano = (p) => {
    if (p._ui?.pais === "México") return true;
    const gens = H.generosDePelicula(p.id_pelicula) || [];
    return gens.some(g => /mexican|m[eé]xico/i.test(g?.nombre || ""));
  };
  const mexicano = data.peliculas.filter(esCineMexicano);

  return (
    <div className="pc-screen-fade">
      <HeroCarousel peliculas={heroPeliculas} onPick={onPick} onRoute={onRoute} />
      <Carousel
        title={<span>Top 10 <em>de la semana</em></span>}
        link={{ label: "Ver todas", onClick: () => onRoute({ name: "mejor-calificadas" }) }}
        peliculas={mejorCalificadas}
        onPick={onPick}
        rank
      />
      <Carousel
        title={<span>Cine <em>mexicano</em></span>}
        link={{ label: "Explorar", onClick: () => onRoute({ name: "peliculas", filtroPais: "México" }) }}
        peliculas={mexicano}
        onPick={onPick}
      />
      <Carousel
        title={<span>Estrenos <em>recientes</em></span>}
        peliculas={recientes}
        onPick={onPick}
      />
    </div>
  );
}

function Hero({ pelicula, onPick, onRoute }) {
  const promedio = window.PC_HELPERS.promedioPelicula(pelicula.id_pelicula);
  const bg = pelicula.poster_url
    ? `url("${pelicula.poster_url}") center / cover no-repeat`
    : pelicula._ui?.gradient;
  return (
    <section className="pc-hero">
      <div className="pc-hero-bg">
        <div className="pc-hero-poster" style={{ background: bg }} />
      </div>
      <div className="pc-hero-content">
        <div className="pc-hero-eyebrow">Película destacada · {pelicula.ano_estreno}</div>
        <h1 className="pc-hero-title">{pelicula.titulo}</h1>
        <div className="pc-hero-meta">
          {promedio > 0 && <RatingChip score={promedio} />}
          <span className="pc-hero-meta-item">{pelicula.director}</span>
          <span className="pc-hero-meta-item">{pelicula.duracion_minutos} min</span>
          {pelicula._ui?.pais && <span className="pc-hero-meta-item">{pelicula._ui.pais}</span>}
        </div>
        <p className="pc-hero-synopsis">{pelicula.sinopsis}</p>
        <div className="pc-hero-cta">
          <button className="pc-btn pc-btn-primary" onClick={() => onPick(pelicula)}>
            <PCIcon.Play /> Ver detalle
          </button>
          <button
            className="pc-btn pc-btn-secondary"
            onClick={() => onRoute({ name: "formulario", id_pelicula: pelicula.id_pelicula })}
          >
            <PCIcon.Pen /> Escribir reseña
          </button>
          <button className="pc-btn pc-btn-icon" title="Agregar a Mi Lista">
            <PCIcon.Plus />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   HERO CAROUSEL — rotación automática de películas destacadas
   ============================================================ */
const { useEffect: useEffectHC, useState: useStateHC, useRef: useRefHC } = React;

function HeroCarousel({ peliculas, onPick, onRoute }) {
  const [idx, setIdx] = useStateHC(0);
  const [pausado, setPausado] = useStateHC(false);
  const timerRef = useRefHC(null);
  const total = peliculas.length;

  // Auto-avance cada 6s, pausa al hacer hover sobre el hero o al estar fuera de pantalla
  useEffectHC(() => {
    if (total <= 1 || pausado) return;
    timerRef.current = setInterval(() => {
      setIdx(i => (i + 1) % total);
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, [total, pausado]);

  // Si la lista cambia de tamaño, resetea
  useEffectHC(() => {
    if (idx >= total) setIdx(0);
  }, [total, idx]);

  if (total === 0) return null;
  if (total === 1) return <Hero pelicula={peliculas[0]} onPick={onPick} onRoute={onRoute} />;

  const go = (n) => setIdx(((n % total) + total) % total);
  const prev = () => go(idx - 1);
  const next = () => go(idx + 1);

  return (
    <div
      className="pc-hero-carousel"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      {peliculas.map((p, i) => (
        <div
          key={p.id_pelicula}
          className={"pc-hero-slide " + (i === idx ? "active" : "")}
          aria-hidden={i !== idx}
        >
          <Hero pelicula={p} onPick={onPick} onRoute={onRoute} />
        </div>
      ))}

      <button
        className="pc-hero-arrow pc-hero-arrow-prev"
        onClick={prev}
        aria-label="Película anterior"
      >
        <span>‹</span>
      </button>
      <button
        className="pc-hero-arrow pc-hero-arrow-next"
        onClick={next}
        aria-label="Película siguiente"
      >
        <span>›</span>
      </button>

      <div className="pc-hero-dots" role="tablist" aria-label="Películas destacadas">
        {peliculas.map((p, i) => (
          <button
            key={p.id_pelicula}
            className={"pc-hero-dot " + (i === idx ? "active" : "")}
            onClick={() => go(i)}
            aria-label={`Ir a ${p.titulo}`}
            title={p.titulo}
          >
            <span
              className="pc-hero-dot-fill"
              style={{ animationDuration: i === idx && !pausado ? "6000ms" : "0ms" }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   PELÍCULAS — grid + filtros
   ============================================================ */
function Peliculas({ onPick, query, filtroPais }) {
  const data = window.PC_DATA;
  const H = window.PC_HELPERS;
  const [genero, setGenero] = useStateHD(null);
  const [orden, setOrden] = useStateHD("rating");

  const filtradas = useMemoHD(() => {
    let r = data.peliculas;
    if (query) {
      const q = query.toLowerCase();
      r = r.filter(p => p.titulo.toLowerCase().includes(q) || p.director.toLowerCase().includes(q));
    }
    if (genero) {
      r = r.filter(p => H.generosDePelicula(p.id_pelicula).some(g => g.id_genero === genero));
    }
    if (filtroPais) {
      r = r.filter(p => {
        if (p._ui?.pais === filtroPais) return true;
        // Cuando filtramos "México", también aceptamos películas que tengan
        // un género llamado "Mexicano" / "México" en la BD APEX.
        if (/^m[eé]xico$/i.test(filtroPais)) {
          const gens = H.generosDePelicula(p.id_pelicula) || [];
          return gens.some(g => /mexican|m[eé]xico/i.test(g?.nombre || ""));
        }
        return false;
      });
    }
    if (orden === "rating") {
      r = [...r].sort((a, b) => H.promedioPelicula(b.id_pelicula) - H.promedioPelicula(a.id_pelicula));
    }
    if (orden === "anio") r = [...r].sort((a, b) => b.ano_estreno - a.ano_estreno);
    if (orden === "alfa") r = [...r].sort((a, b) => a.titulo.localeCompare(b.titulo));
    return r;
  }, [query, genero, orden, filtroPais]);

  return (
    <div className="pc-page pc-screen-fade">
      <div className="pc-page-header">
        <h1 className="pc-page-title">
          {query ? <>Resultados para <em>“{query}”</em></> : filtroPais ? <>Cine <em>{filtroPais.toLowerCase()}</em></> : <>El <em>catálogo</em></>}
        </h1>
        <p className="pc-page-sub">{filtradas.length} películas · ordenadas por {orden === "rating" ? "calificación" : orden === "anio" ? "año" : "título"}</p>
      </div>

      <div className="pc-filters">
        <div className="pc-filter-group">
          <span className="pc-filter-label">Género</span>
          <div className="pc-chip-row">
            <button
              className={"pc-chip " + (genero === null ? "active" : "")}
              onClick={() => setGenero(null)}
            >Todos</button>
            {data.generos.map(g => (
              <button
                key={g.id_genero}
                className={"pc-chip " + (genero === g.id_genero ? "active" : "")}
                onClick={() => setGenero(g.id_genero)}
              >{g.nombre}</button>
            ))}
          </div>
        </div>
        <div className="pc-filter-group" style={{ marginLeft: "auto" }}>
          <span className="pc-filter-label">Ordenar</span>
          <div className="pc-chip-row">
            <button className={"pc-chip " + (orden === "rating" ? "active" : "")} onClick={() => setOrden("rating")}>Mejor calificadas</button>
            <button className={"pc-chip " + (orden === "anio" ? "active" : "")} onClick={() => setOrden("anio")}>Más recientes</button>
            <button className={"pc-chip " + (orden === "alfa" ? "active" : "")} onClick={() => setOrden("alfa")}>A — Z</button>
          </div>
        </div>
      </div>

      {filtradas.length === 0 ? (
        <EmptyState
          icon={<PCIcon.Film size={48} />}
          title="Sin resultados"
          sub="Prueba con otro título o cambia los filtros."
        />
      ) : (
        <div className="pc-grid">
          {filtradas.map(p => <Poster key={p.id_pelicula} pelicula={p} onClick={onPick} />)}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   DETALLE DE PELÍCULA
   ============================================================ */
function Detalle({ id_pelicula, onPick, onRoute, currentUser, miLista, toggleMiLista }) {
  const H = window.PC_HELPERS;
  const p = H.peliculaById(id_pelicula);
  if (!p) return <EmptyState icon={<PCIcon.Film size={48} />} title="Película no encontrada" />;

  const resenas   = H.resenasByPelicula(p.id_pelicula);
  const generos   = H.generosDePelicula(p.id_pelicula);
  const etiquetas = H.etiquetasDePelicula(p.id_pelicula);
  const promedio  = H.promedioPelicula(p.id_pelicula);
  const totalRes  = H.totalResenasPelicula(p.id_pelicula);
  const enLista   = miLista.includes(p.id_pelicula);

  const posterBg = p.poster_url
    ? `url("${p.poster_url}") center / cover no-repeat`
    : p._ui?.gradient;

  return (
    <div className="pc-screen-fade">
      <section className="pc-detail-hero">
        <div className="pc-detail-bg" style={{ background: posterBg }} />
        <button
          className="pc-btn pc-btn-ghost"
          style={{ position: "relative", zIndex: 1 }}
          onClick={() => onRoute({ name: "peliculas" })}
        >
          <PCIcon.ArrowLeft /> Volver al catálogo
        </button>
        <div className="pc-detail-grid">
          <div className="pc-detail-poster" style={{ background: posterBg }}>
            {!p.poster_url && <span className="pc-poster-title-on-img">{p.titulo}</span>}
          </div>
          <div className="pc-detail-info">
            <div className="pc-hero-eyebrow">{p.director} · {p.ano_estreno}{p._ui?.pais ? " · " + p._ui.pais : ""}</div>
            <h1 className="pc-detail-title">{p.titulo}</h1>
            {p._ui?.tagline && <p className="pc-detail-tagline">“{p._ui.tagline}”</p>}

            <div className="pc-tags">
              {promedio > 0 && (
                <span className="pc-tag pc-tag-oro">
                  <PCIcon.Star size={11} filled className="on" /> &nbsp;{promedio.toFixed(1)} / 5
                </span>
              )}
              {generos.map(g => <span key={g.id_genero} className="pc-tag">{g.nombre}</span>)}
              <span className="pc-tag">{p.duracion_minutos} min</span>
            </div>

            <div className="pc-hero-cta">
              <button
                className="pc-btn pc-btn-primary"
                onClick={() => onRoute({ name: "formulario", id_pelicula: p.id_pelicula })}
              >
                <PCIcon.Pen /> Escribir reseña
              </button>
              <button
                className="pc-btn pc-btn-secondary"
                onClick={() => toggleMiLista(p.id_pelicula)}
              >
                {enLista ? <><PCIcon.Check /> En Mi Lista</> : <><PCIcon.Plus /> Agregar a Mi Lista</>}
              </button>
            </div>
          </div>

          {/* Sello "Garantía Puma" — solo para películas con 4+ estrellas
              (equivalente a: SELECT ... WHERE AVG(CALIFICACION) >= 4) */}
          {promedio >= 4 && (
            <div className="pc-puma-garantia" aria-label="Garantía Puma">
              <img
                src="assets/puma-mascota.png"
                alt="Mascota Puma UNAM"
                className="pc-puma-garantia-img"
              />
              <div className="pc-puma-garantia-label">
                <span className="pc-puma-garantia-title">Garantía Puma</span>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="pc-detail-body">
        <div>
          <h4 style={{
            fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase",
            letterSpacing: "0.25em", color: "var(--crema-sutil)", margin: "0 0 12px"
          }}>Sinopsis</h4>
          <p className="pc-detail-synopsis">{p.sinopsis}</p>

          {etiquetas.length > 0 && (
            <>
              <h4 style={{
                fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase",
                letterSpacing: "0.25em", color: "var(--crema-sutil)", margin: "32px 0 12px"
              }}>Etiquetas</h4>
              <div className="pc-tags">
                {etiquetas.map(e => <span key={e.id_etiqueta} className="pc-tag">#{e.nombre}</span>)}
              </div>
            </>
          )}
        </div>
        <aside className="pc-detail-side">
          <div className="row">
            <h4>Director</h4>
            <p>{p.director}</p>
          </div>
          {p._ui?.idioma && (
            <div className="row">
              <h4>Idioma original</h4>
              <p>{p._ui.idioma}</p>
            </div>
          )}
          {p._ui?.pais && (
            <div className="row">
              <h4>País</h4>
              <p>{p._ui.pais}</p>
            </div>
          )}
          <div className="row">
            <h4>Duración</h4>
            <p>{p.duracion_minutos} minutos</p>
          </div>
          <div className="row" style={{ borderBottom: "none" }}>
            <h4>Total de reseñas</h4>
            <p>{totalRes.toLocaleString("es-MX")}</p>
          </div>
        </aside>
      </section>

      <section className="pc-resenas-section">
        <div className="pc-resenas-header">
          <h2 className="pc-resenas-title">Lo que dice <em>la audiencia</em></h2>
          <button
            className="pc-btn pc-btn-outline"
            onClick={() => onRoute({ name: "formulario", id_pelicula: p.id_pelicula })}
          >
            <PCIcon.Pen /> Escribe la tuya
          </button>
        </div>
        {resenas.length === 0 ? (
          <EmptyState
            icon={<PCIcon.Pen size={36} />}
            title="Aún sin reseñas"
            sub="Sé el primero en compartir lo que opinas."
          />
        ) : (
          resenas.map(r => <ResenaCard key={r.id_resena} resena={r} mostrarPelicula={false} onPick={onPick} />)
        )}
      </section>
    </div>
  );
}

/* ============================================================
   RESEÑA CARD — usada en varias pantallas
   ============================================================ */
function ResenaCard({ resena, mostrarPelicula = true, onPick }) {
  const H = window.PC_HELPERS;
  const u = H.usuarioById(resena.id_usuario);
  const p = H.peliculaById(resena.id_pelicula);
  const ets = H.etiquetasDeResena(resena.id_resena);
  const [liked, setLiked] = useStateHD(false);

  const avatarBg = u?._ui?.color
    ? `linear-gradient(135deg, ${u._ui.color}, var(--azul-unam))`
    : "linear-gradient(135deg, var(--azul-claro), var(--azul-unam))";

  const likes = resena._ui?.likes ?? 0;
  const fecha = resena._ui?.fecha;

  return (
    <article className="pc-resena-card">
      <div className="pc-resena-head">
        <div className="pc-resena-avatar" style={{ background: avatarBg }}>
          {u?._ui?.inicial || "?"}
        </div>
        <div className="pc-resena-user">
          <h5>{u?.nombre_completo || "Anónimo"}</h5>
          <span>
            @{u?.nombre_usuario}
            {fecha && <> · {H.fmtFecha(fecha)}</>}
            {mostrarPelicula && p ? ` · sobre "${p.titulo}"` : ""}
          </span>
        </div>
        <div className="pc-resena-rating">
          <Stars score={resena.calificacion} />
          <span className="pc-resena-score">{resena.calificacion}.0</span>
        </div>
      </div>
      {resena.headline && (
        <h3 style={{
          fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 500,
          margin: "0 0 12px", letterSpacing: "-0.01em", lineHeight: 1.1
        }}>
          {resena.headline}
        </h3>
      )}
      <p className="pc-resena-text" dangerouslySetInnerHTML={{ __html: resena.descripcion }} />

      <div className="pc-resena-foot">
        {ets.map(e => <span key={e.id_etiqueta} className="pc-tag">#{e.nombre}</span>)}
        <div className="pc-resena-actions">
          <button className={"pc-like " + (liked ? "active" : "")} onClick={() => setLiked(!liked)}>
            <PCIcon.Heart filled={liked} /> {likes + (liked ? 1 : 0)} útil
          </button>
          {mostrarPelicula && p && (
            <button className="pc-like" onClick={() => onPick && onPick(p)}>
              <PCIcon.Film size={13} /> Ver película
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

Object.assign(window, { Home, Hero, Peliculas, Detalle, ResenaCard });
