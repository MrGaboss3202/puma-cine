/* ============================================================
   PUMA CINE — componentes reutilizables
   Exporta a window para que otros scripts Babel los usen.
   ============================================================ */

const { useState, useEffect, useRef, useMemo } = React;

/* Helpers de íconos (SVG inline, ligeros) */
const Icon = {
  Search: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" /><line x1="20" y1="20" x2="16.5" y2="16.5" />
    </svg>
  ),
  Star: ({ size = 18, filled = false, className = "" }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Play: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4" /></svg>
  ),
  Plus: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
  ),
  Check: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
  ),
  Heart: ({ size = 14, filled = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Pen: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  ArrowLeft: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
  ),
  Film: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" /><line x1="17" y1="7" x2="22" y2="7" />
    </svg>
  ),
  User: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  ),
};

/* Logo */
function PCLogo({ onClick }) {
  return (
    <div className="pc-logo" onClick={onClick}>
      <div className="pc-logo-mark">
        <img src="assets/puma-cine-logo.png" alt="Puma Cine" />
      </div>
      <div className="pc-logo-text">Puma <em>Cine</em></div>
    </div>
  );
}

/* Stars (display) */
function Stars({ score = 0, max = 5, size = 14 }) {
  return (
    <div className="pc-stars">
      {Array.from({ length: max }).map((_, i) => {
        const on = i < Math.round(score);
        return (
          <Icon.Star key={i} size={size} filled={on} className={on ? "on" : ""} />
        );
      })}
    </div>
  );
}

/* Stars picker (1-5) */
function StarsPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const cur = hover || value;
  return (
    <div className="pc-star-picker" onMouseLeave={() => setHover(0)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          className={i < cur ? "on" : ""}
          onMouseEnter={() => setHover(i + 1)}
          onClick={() => onChange(i + 1)}
          type="button"
        >
          <Icon.Star size={32} filled={i < cur} />
        </button>
      ))}
      {value > 0 && <span className="pc-star-score">{value}.0</span>}
    </div>
  );
}

/* Rating chip (top-rated badge) */
function RatingChip({ score }) {
  return (
    <span className="pc-rating">
      <Icon.Star size={11} filled />
      {score.toFixed(1)}
    </span>
  );
}

/* Poster card (catálogo) */
function Poster({ pelicula, rank = null, onClick, showInfo = true }) {
  const promedio = window.PC_HELPERS.promedioPelicula(pelicula.id_pelicula);
  const posterBg = pelicula.poster_url
    ? `url("${pelicula.poster_url}") center / cover no-repeat`
    : (pelicula._ui?.gradient || "linear-gradient(135deg, #14296B, #0a1530)");
  return (
    <div className="pc-poster" onClick={() => onClick && onClick(pelicula)}>
      <div className="pc-poster-img" style={{ background: posterBg }}>
        {rank != null && <span className="pc-poster-rank">{rank}</span>}
        {promedio > 0 && <RatingChipOnPoster score={promedio} />}
        <span className="pc-poster-title-on-img">{pelicula.titulo}</span>
      </div>
      {showInfo && (
        <div className="pc-poster-info">
          <h4 className="pc-poster-name">{pelicula.titulo}</h4>
          <p className="pc-poster-sub">
            <span>{pelicula.ano_estreno}</span>
            <span>·</span>
            <span>{pelicula.director.split(" ").slice(-1)[0]}</span>
          </p>
        </div>
      )}
    </div>
  );
}

function RatingChipOnPoster({ score }) {
  return (
    <span className="pc-poster-badge">
      <Icon.Star size={9} filled />
      {score.toFixed(1)}
    </span>
  );
}

/* Sidebar vertical izquierdo con navegación por iconos */
function Header({ route, onRoute, query, setQuery, currentUser, onAvatarClick }) {
  const tabs = [
    { id: "home",              label: "Inicio",            icon: "assets/icon-casa.png" },
    { id: "peliculas",         label: "Películas",         icon: "assets/icon-pelicula.png" },
    { id: "mejor-calificadas", label: "Mejor Calificadas", icon: "assets/icon-estrella.png" },
    { id: "resenas",           label: "Reseñas",           icon: "assets/icon-comentario.png" },
    { id: "mi-lista",          label: "Mi Lista",          icon: "assets/icon-guardado.png" },
    { id: "cine-mexicano",     label: "Cine Mexicano",     icon: "assets/icon-mexico.png" }
  ];

  const [buscando, setBuscando] = React.useState(false);
  const inputRef = React.useRef(null);

  const openSearch = () => {
    setBuscando(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };
  const closeSearch = () => {
    setBuscando(false);
    if (query) setQuery("");
  };

  const handleNav = (t) => {
    if (t.id === "cine-mexicano") {
      onRoute({ name: "peliculas", filtroPais: "México" });
    } else {
      onRoute({ name: t.id });
    }
  };

  const isActive = (t) => {
    if (t.id === "cine-mexicano") return route.name === "peliculas" && route.filtroPais === "México";
    if (t.id === "peliculas")     return route.name === "peliculas" && !route.filtroPais;
    return route.name === t.id;
  };

  return (
    <>
      {/* Barra superior con logos a la derecha */}
      <div className="pc-topbar">
        <div className="pc-topbar-logos" onClick={() => onRoute({ name: "home" })}>
          <img src="assets/logo-puma-head.png" alt="Puma" className="pc-topbar-logo-mark" />
          <img src="assets/logo-puma-cine-text.png" alt="Puma Cine" className="pc-topbar-logo-text" />
        </div>
      </div>

      <aside className="pc-sidebar">
        <div className="pc-sidebar-profile" onClick={onAvatarClick}>
          <div className="pc-sidebar-avatar" title={currentUser ? currentUser.nombre_completo : "Iniciar sesión"}>
            {currentUser ? currentUser._ui.inicial : "?"}
          </div>
          <div className="pc-sidebar-profile-info">
            {currentUser ? (
              <>
                <span className="pc-sidebar-profile-name">{currentUser.nombre_completo}</span>
                <span className="pc-sidebar-profile-handle">@{currentUser.nombre_usuario}</span>
              </>
            ) : (
              <>
                <span className="pc-sidebar-profile-name">Invitado</span>
                <span className="pc-sidebar-profile-handle">Inicia sesión →</span>
              </>
            )}
          </div>
        </div>

        <nav className="pc-sidebar-nav">
          {/* Búsqueda primero */}
          <button
            className={"pc-sidebar-btn " + (buscando ? "active" : "")}
            onClick={() => (buscando ? closeSearch() : openSearch())}
          >
            <img src="assets/icon-lupa.png" alt="" className="pc-sidebar-icon" />
            <span className="pc-sidebar-label">Buscar</span>
          </button>

          <div className="pc-sidebar-sep" />

          {tabs.map(t => (
            <button
              key={t.id}
              className={"pc-sidebar-btn " + (isActive(t) ? "active" : "")}
              onClick={() => handleNav(t)}
            >
              <img src={t.icon} alt="" className="pc-sidebar-icon" />
              <span className="pc-sidebar-label">{t.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Overlay de búsqueda que se despliega desde la izquierda */}
      <div className={"pc-search-overlay " + (buscando ? "open" : "")} onClick={closeSearch}>
        <div className="pc-search-overlay-box" onClick={(e) => e.stopPropagation()}>
          <img src="assets/icon-lupa.png" alt="" className="pc-search-overlay-icon" />
          <input
            ref={inputRef}
            className="pc-search-overlay-input"
            placeholder="Buscar películas, directores, reseñas…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value && route.name !== "peliculas") onRoute({ name: "peliculas" });
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") closeSearch();
              if (e.key === "Enter") {
                e.preventDefault();
                setBuscando(false); // cerramos overlay pero mantenemos query para ver resultados
              }
            }}
          />
          <button className="pc-search-overlay-close" onClick={closeSearch} aria-label="Cerrar">×</button>
        </div>
      </div>
    </>
  );
}

/* Toast helper */
function Toast({ msg }) {
  if (!msg) return null;
  return <div className="pc-toast">{msg}</div>;
}

/* Empty state */
function EmptyState({ icon, title, sub }) {
  return (
    <div className="pc-empty">
      {icon}
      <h4>{title}</h4>
      {sub && <p>{sub}</p>}
    </div>
  );
}

/* Carrusel de pósters */
function Carousel({ title, link, peliculas, onPick, rank = false }) {
  return (
    <section className="pc-section">
      <div className="pc-section-header">
        <h2 className="pc-section-title">{title}</h2>
        {link && <span className="pc-section-link" onClick={link.onClick}>{link.label} →</span>}
      </div>
      <div className="pc-carousel">
        {peliculas.map((p, i) => (
          <Poster key={p.id_pelicula} pelicula={p} onClick={onPick} rank={rank ? i + 1 : null} />
        ))}
      </div>
    </section>
  );
}

/* Export to window for Babel scope sharing */
Object.assign(window, {
  PCIcon: Icon,
  PCLogo, Stars, StarsPicker, RatingChip,
  Poster, Header, Toast, EmptyState, Carousel
});
