# 🎬 Puma Cine ↔ Oracle APEX — Guía de conexión

Esta guía te lleva paso a paso desde tu APEX actual (con datos en las
tablas) hasta tener el prototipo Puma Cine **mostrando los datos reales**
de tu base de datos.

Lleva aproximadamente **20-30 minutos** la primera vez.

---

## 📋 Resumen del proceso

1. **En APEX:** activar AutoREST en tus tablas (15 min)
2. **En este proyecto:** poner tu URL en `config.js` y prender el switch (1 min)
3. **Subir el prototipo a APEX** como Static Application File (10 min)
4. **Enlazarlo desde APEX** para que tu profesor entre por una sola URL (5 min)

---

## PASO 1 — Activar AutoREST en tus tablas

AutoREST es la magia: APEX expone una tabla como REST sin que escribas
una sola línea de PL/SQL. Lo hace por ti.

### 1.1 Habilitar el schema para REST

1. En APEX, menú izquierdo → **SQL Workshop** → **RESTful Services**
2. La primera vez te pedirá habilitar el schema. Haz click en
   **Register Schema with ORDS**
3. Confirma:
   - **Schema Alias:** `wksp_cinelista` (o el que te sugiera APEX, anótalo)
   - **Authorization Required:** **NO** (sólo para esta entrega; en producción real sí se activaría)
4. Click **Save Schema Attributes**

### 1.2 Habilitar cada tabla individualmente

Para cada una de estas tablas, vas a repetir el proceso:

```
PELICULA
USUARIO
GENERO
ETIQUETA
RESENA
PELICULA_GENERO
PELICULA_ETIQUETA
USUARIO_PELICULA
```

**Cómo activar una tabla:**

1. Menú izquierdo → **SQL Workshop** → **Object Browser**
2. Selecciona la tabla (ej. `PELICULA`)
3. En la barra superior de la tabla, click **More ▾** → **REST**  
   *(en algunas versiones aparece como un botón directo "REST")*
4. En la ventana modal:
   - **Enable Object:** activa el switch ✅
   - **Object Alias:** `pelicula` (en minúsculas)
   - **Authorization Required:** desactivar ❌
5. Click **Apply**

✅ Verás un mensaje "Object enabled successfully".

**Repite los pasos 1.2 para las 8 tablas.**

### 1.3 Anotar tu URL base

Cuando hayas terminado, vas a tu primera tabla habilitada y haces click
en **Endpoints**. Verás algo así:

```
https://apex.oracle.com/pls/apex/wksp_cinelista/pelicula/
```

La parte que necesitas es todo HASTA tu schema, con barra final:

```
https://apex.oracle.com/pls/apex/wksp_cinelista/
```

📋 **Cópiala**, la pones en el siguiente paso.

### 1.4 Probar que funciona

Abre en tu navegador (o en una pestaña nueva):

```
https://apex.oracle.com/pls/apex/wksp_cinelista/pelicula/
```

Deberías ver un JSON con tus películas. Si lo ves: 🎉 estás listo.  
Si te marca error 401/403, regresa a 1.1 y desactiva "Authorization Required".

---

## PASO 2 — Apuntar el prototipo a tu APEX

1. Abre el archivo `config.js` de este proyecto
2. Cambia dos cosas:

```js
window.PC_CONFIG = {
  USE_REAL_API: true,   // ← cambia de false a true
  API_BASE: "https://apex.oracle.com/pls/apex/wksp_cinelista/",
  //                                          ↑
  //                          ← pon aquí tu URL del paso 1.3
  ...
};
```

3. Guarda. Ya está. Refresca `Puma Cine.html` y debería cargar tus
   películas reales.

> 💡 Si ves el banner rojo "No se pudo conectar a APEX", es CORS o el URL.
> Revisa la consola del navegador (F12).

---

## PASO 3 — Subir el prototipo a APEX (Static Application Files)

Para que tu profesor pueda entrar a UNA sola URL y ver Puma Cine.

### 3.1 Subir los archivos

1. En APEX, **Application Builder** → tu app **CineLista**
2. **Shared Components** → **Static Application Files**
3. Click **Upload File** y sube **uno por uno** estos archivos del proyecto:
   - `Puma Cine.html` (renómbralo a `index.html` antes de subirlo)
   - `styles.css`
   - `config.js`
   - `data.js`
   - `apex-api.js`
   - `components.jsx`
   - `screens-catalog.jsx`
   - `screens-resenas.jsx`
   - `app.jsx`
   - `assets/puma-cine-logo.png` (en "Directory" pon `assets`)

> ⚠️ APEX no permite subir múltiples archivos a la vez en algunas
> versiones. Tendrás que hacerlo uno por uno. Es tedioso pero solo es
> una vez.

### 3.2 Obtener la URL pública

Después de subir `index.html`, APEX te muestra una URL como:

```
#APP_FILES#index.html
```

La URL pública real será algo así:

```
https://apex.oracle.com/pls/apex/r/wksp_cinelista/cinelista/files/static/v1/index.html
```

Esa es la URL que le compartes a tu profesor.

### 3.3 (Opcional) Crear un botón "Ver app" en APEX

Para que desde la Home de APEX haya un botón que te lleve al prototipo:

1. **Application Builder** → tu app → **Home** (página 1)
2. Crea un **Button** llamado "Ver Puma Cine"
3. **Action:** Redirect to URL → pega la URL del paso 3.2
4. Listo.

---

## PASO 4 — Cómo tu profesor verá todo

```
┌────────────────────────────────────────────────────────────┐
│  Tu profesor entra al URL de tu app APEX                    │
│  → Ve el HOME de APEX con un botón "Ver Puma Cine"          │
│  → Click → se abre el prototipo bonito                      │
│  → Navega, escribe reseñas, las datos van/vienen de tu BD   │
│  → Cuando quiera, vuelve a APEX para ver el "admin"         │
└────────────────────────────────────────────────────────────┘
```

Mientras tanto, en el "lado admin" (que es donde luces el trabajo
de Bases de Datos):
- Las tablas, sus relaciones, los FK, los triggers
- Los Interactive Reports de APEX (que no necesitas tocar)
- El modelo entidad-relación

Eso es lo que se evalúa de la materia. El prototipo Puma Cine es la
"capa de UX" que demuestra cómo se vería el producto final si esto
fuera un proyecto real.

---

## 🧪 Probar en local antes de subir

Mientras desarrollas, puedes probar contra APEX desde tu compu:

1. `USE_REAL_API: true` en `config.js`
2. `API_BASE` con tu URL de APEX
3. Abre `Puma Cine.html`

⚠️ **CORS:** algunos navegadores bloquean el fetch entre tu archivo
local (`file://`) y `apex.oracle.com`. Si te pasa:
- **Opción A:** sube el HTML a APEX (paso 3) y prueba desde ahí, ya
  estás "del mismo lado"
- **Opción B:** corre un servidor local con `python -m http.server 8000`
  y abre `http://localhost:8000/Puma Cine.html`

---

## 🔍 Troubleshooting

### "No se pudo conectar a APEX"
- Revisa la consola del navegador (F12 → Console)
- Si dice "CORS" → sube el HTML a APEX (paso 3) o usa servidor local
- Si dice "404" → el URL en `config.js` está mal escrito
- Si dice "401" → no desactivaste "Authorization Required" en una tabla

### "Carga pero las películas se ven raras"
- AutoREST puede devolver las columnas en MAYÚSCULAS. El código ya
  las normaliza a minúsculas, pero si ves problemas, revisa la consola.

### "Quiero volver al modo mock"
- En `config.js` pon `USE_REAL_API: false`
- Vuelves a tus datos de prueba sin tocar nada más

---

## 📊 Diagrama final

```
                    ┌─────────────────────────────┐
                    │   PUMA CINE (prototipo)     │
                    │   subido a APEX como        │
                    │   Static Application Files  │
                    └──────────────┬──────────────┘
                                   │
                                   │  fetch() vía REST
                                   ▼
                    ┌─────────────────────────────┐
                    │   Oracle APEX RESTful       │
                    │   Services (AutoREST)       │
                    └──────────────┬──────────────┘
                                   │
                                   │  SELECT / INSERT / DELETE
                                   ▼
                    ┌─────────────────────────────┐
                    │   Tus tablas WKSP_CINELISTA │
                    │   PELICULA, RESENA, etc.    │
                    └─────────────────────────────┘
```

---

🤝 Si te quedas atorado en cualquier paso, dime exactamente qué dice
el error (consola del navegador F12 → Console) y te ayudo a resolverlo.
