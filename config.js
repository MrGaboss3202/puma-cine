/* ============================================================
   PUMA CINE — CONFIGURACIÓN
   ------------------------------------------------------------
   Cambia USE_REAL_API a true cuando hayas activado los
   RESTful Services de tus tablas en Oracle APEX.

   Mientras esté en false, el prototipo usa los datos mock
   de data.js (perfecto para diseñar/demostrar el UI).
   ============================================================ */

window.PC_CONFIG = {

  /* ¿Conectar a tu APEX real? */
  USE_REAL_API: true,

  /* URL base de tus RESTful Services en APEX.
     Cómo obtenerla:
     1. En APEX, ve a SQL Workshop → RESTful Services
     2. Activa AutoREST en tu schema (WKSP_CINELISTA)
     3. El URL base aparece arriba: termina en /pls/apex/<schema>/
     ------------------------------------------------------------
     Ejemplo (CAMBIA POR EL TUYO):
     "https://apex.oracle.com/pls/apex/wksp_cinelista/" */
  API_BASE: "https://oracleapex.com/ords/cinelista/",

  /* Nombres de los endpoints (deberían coincidir con tus tablas
     en MINÚSCULAS, así expone AutoREST). Cambia si tu workspace
     los expone diferente. */
  ENDPOINTS: {
    pelicula:          "pelicula/",
    usuario:           "usuario/",
    genero:            "genero/",
    etiqueta:          "etiqueta/",
    resena:            "resena/",
    pelicula_genero:   "pelicula_genero/",
    pelicula_etiqueta: "pelicula_etiqueta/",
    usuario_pelicula:  "usuario_pelicula/"
  },

  /* Mostrar errores de red al usuario (útil para desarrollo) */
  DEBUG: true
};
