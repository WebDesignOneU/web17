# Web17 - Portal Web Ballet UCB (Frontend React)

Frontend del portal web del **Ballet de la Universidad Católica Boliviana "San Pablo"** desarrollado con **React + Vite**, basado en los diseños y la identidad visual de la carpeta `../web09`, e integrado con la API REST documentada en Swagger: `http://localhost:3000/api-docs`.

## 1. Objetivo del proyecto

Construir una SPA (Single Page Application) en React que traslade el diseño del sitio estático `web09` a un frontend moderno, consumiendo los endpoints reales de la API Ballet UCB para mostrar y gestionar información de:

- **Obras y funciones** (repertorio, cartelera, detalle de obra y sus funciones).
- **Noticias** (listado y detalle por slug).
- **Elenco** (integrantes filtrables por rol).
- **Convocatorias y postulaciones** (listado público y envío de postulación).
- **Reservas** (creación de reserva de entradas y consulta pública por código).
- **Suscripción** al boletín de noticias.
- **Autenticación** (registro, login y perfil del usuario autenticado con JWT).

## 2. Stack tecnológico

- **React 18** (componentes funcionales + Hooks: `useState`, `useEffect`, `useMemo`, `useContext`, `useRef`).
- **Vite 5** como bundler y servidor de desarrollo (`@vitejs/plugin-react`).
- **React Router 6** para el enrutamiento SPA (`BrowserRouter`, rutas anidadas declarativas, `NavLink`, navegación protegida).
- **Axios** como cliente HTTP con interceptores para inyectar el token JWT y limpiar sesión ante respuestas 401.
- **Context API** (`AuthContext`) para el estado global de autenticación (token/usuario) y acciones de login, registro, perfil y logout.
- **CSS del diseño web09** reutilizado directamente (`variables.css`, `base.css`, `layout.css`, `components.css`, `animations.css`, `landing.css`) para mantener la estética teatral (paleta borgoña/oro, tipografías Cinzel + Plus Jakarta Sans, componentes glassmorphism, hero, carrusel, tablas, formularios).
- **Carrusel JS vanilla** heredado de `web09/js/carousel.js` (`window.BalletCarousel`), cargado desde `public/` e inicializado desde la página Home mediante `useEffect`.

## 3. Estructura del proyecto

```text
web17/
├─ index.html                  # Entry HTML, fuentes e inclusión del carrusel
├─ vite.config.js              # Config Vite + proxy /api -> http://localhost:3000
├─ package.json
├─ .env.example
├─ public/
│  ├─ assets/                  # Imágenes, audio, video y datos copiados de web09
│  └─ carousel.js              # Script del carrusel (BalletCarousel) de web09
└─ src/
   ├─ main.jsx                 # Bootstrap React, Router, AuthProvider e importación de estilos
   ├─ App.jsx                  # Layout raíz y definición de rutas
   ├─ assets/css/              # Hojas de estilo del diseño web09
   ├─ components/
   │  ├─ Header.jsx            # Cabecera, navegación responsive y toggle de tema
   │  ├─ Footer.jsx            # Pie de página
   │  └─ ProtectedRoute.jsx    # Guardia de ruta para vistas autenticadas
   ├─ context/
   │  └─ AuthContext.jsx       # Estado/reactividad de sesión (token/user) y acciones auth
   ├─ services/
   │  └─ api.js                # Instancia Axios, interceptores JWT/401 y helpers
   └─ pages/
      ├─ Home.jsx              # Landing: hero, stats, about, carrusel, obras, noticias, suscripción
      ├─ Noticias.jsx          # Listado de noticias (GET /api/noticias)
      ├─ NoticiaDetalle.jsx    # Detalle por slug (GET /api/noticias/:slug)
      ├─ Funciones.jsx         # Funciones con filtro por estado y obras (GET /api/funciones, /api/obras)
      ├─ ObraDetalle.jsx       # Detalle de obra y sus funciones (GET /api/obras/:id)
      ├─ Elenco.jsx            # Elenco filtrable por rol (GET /api/elenco)
      ├─ Convocatorias.jsx     # Convocatorias y formulario de postulación (GET/POST)
      ├─ Reservas.jsx          # Crear reserva y consultar por código (POST/GET)
      ├─ Login.jsx             # Inicio de sesión (POST /api/auth/login)
      ├─ Register.jsx          # Registro de usuario (POST /api/auth/register)
      └─ Perfil.jsx            # Perfil autenticado (GET /api/auth/perfil, ruta protegida)
```

## 4. Integración con la API (Swagger)

La API base es `http://localhost:3000` (según `servers` del OpenAPI). Endpoints consumidos:

| Módulo | Método y ruta | Uso en el frontend |
|---|---|---|
| Auth | `POST /api/auth/register` | Registro (espectador/postulante) |
| Auth | `POST /api/auth/login` | Login y obtención de JWT |
| Auth | `GET /api/auth/perfil` | Perfil del usuario autenticado |
| Noticias | `GET /api/noticias` | Listado y últimas en Home |
| Noticias | `GET /api/noticias/:slug` | Detalle de noticia |
| Obras | `GET /api/obras` | Repertorio en Home y Funciones |
| Obras | `GET /api/obras/:id` | Detalle de obra y sus funciones |
| Funciones | `GET /api/funciones` | Cartelera/tabla con filtro por estado |
| Elenco | `GET /api/elenco` | Listado con filtro por rol |
| Convocatorias | `GET /api/convocatorias` | Listado de convocatorias |
| Convocatorias | `POST /api/convocatorias/:id/postulaciones` | Envío de postulación pública |
| Reservas | `POST /api/reservas` | Registro de reserva (genera código BUCB-XXXX) |
| Reservas | `GET /api/reservas/codigo/:codigo` | Consulta pública por código |
| Suscriptores | `POST /api/suscriptores` | Suscripción al boletín |

### Notas de integración
- **Autenticación:** el token JWT se guarda en `localStorage` y se adjunta automáticamente como `Authorization: Bearer <token>` mediante un interceptor de Axios (`src/services/api.js`). Si la API responde 401, se limpia la sesión local.
- **Normalización de respuestas:** distintas respuestas pueden envolver los datos como `{ data: [...] }`, `{ obras: [...] }`, `{ items: [...] }`, etc. Se usa `normalizeList` y accesos defensivos (`id || id_funcion/id_obra`, `data.data || data.noticia || data`) para tolerar variantes.
- **Proxy de desarrollo:** `vite.config.js` proxyea `/api` a `http://localhost:3000`, evitando problemas de CORS en desarrollo. La instancia Axios usa `baseURL: '/api'` por defecto (configurable con `VITE_API_BASE_URL`).
- **Manejo de errores y carga:** las páginas gestionan estados de carga, vacío y error, mostrando mensajes amigables con `getErrorMessage` (prioriza `error.response.data.message`).

## 5. Relación con el diseño de `web09`

- Se copiaron los **assets** (imágenes, audio, video) y las **hojas CSS** de `web09` para preservar la misma identidad visual: hero con overlay, tipografía y paleta teatral, tarjetas, tablas responsivas, formularios, carrusel de producciones, stats banner y widgets.
- La **Home** replica las secciones principales del `index.html` de `web09` (hero, estadísticas, sobre nosotros, galería/carrusel, repertorio, noticias y suscripción), conectando repertorio/noticias a la API.
- El **toggle de tema claro/oscuro** y el **menú responsive** se implementaron con estado React manteniendo las clases/atributos esperados por el CSS original (`data-theme="light"`, `.is-open`, `.nav-toggle`, etc.).
- Se reutilizó el **carrusel** (`BalletCarousel`) como script global para conservar su comportamiento; la página Home lo inicializa en `useEffect` y lo destruye en el cleanup.

## 6. Rutas de la aplicación

- `/` — Inicio (landing).
- `/noticias` — Listado de noticias.
- `/noticias/:slug` — Detalle de noticia.
- `/funciones` — Funciones programadas y obras.
- `/obras/:id` — Detalle de obra.
- `/elenco` — Integrantes del elenco.
- `/convocatorias` — Convocatorias y postulación.
- `/reservas` — Crear y consultar reservas.
- `/login` — Inicio de sesión.
- `/registro` — Registro de cuenta.
- `/perfil` — Perfil (ruta protegida; requiere token, redirige a login y preserva destino).

## 7. Instalación y ejecución

### Requisitos previos
- Node.js 18+ y npm.
- API Ballet UCB en ejecución en `http://localhost:3000` (con Swagger en `/api-docs`).

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en desarrollo (http://localhost:5174, proxy /api -> :3000)
npm run dev

# 3. Build de producción
npm run build

# 4. Previsualizar build
npm run preview
```

> Si la API corre en otro host/puerto, define `VITE_API_BASE_URL` en un archivo `.env` (ver `.env.example`). El puerto de desarrollo se fijó en `5174` para no colisionar con otros frontends locales.

## 8. Comentarios de desarrollo y decisiones

- **Arquitectura por capas:** `pages/` para vistas/rutas, `components/` para layout y piezas reutilizables, `services/` para acceso HTTP, `context/` para estado transversal (auth). Esto facilita mantenimiento y extensión.
- **Autenticación con Context:** `AuthProvider` centraliza token/usuario y expone acciones (`login`, `register`, `fetchPerfil`, `logout`), sincroniza con `localStorage` y escucha eventos `storage` para coherencia entre pestañas.
- **Rutas protegidas:** `ProtectedRoute` verifica el token y redirige a `/login` conservando la ubicación de origen (`state.from`) para volver tras autenticarse.
- **Resiliencia ante payloads variables:** helpers y accesos defensivos evitan fallos cuando el backend varía nombres de campos o envoltorios de respuesta.
- **Formularios públicos:** postulaciones y reservas siguen los campos requeridos documentados en Swagger; la reserva muestra el `codigo_reserva` devuelto para su consulta posterior.
- **Reutilización del diseño:** se priorizó conservar el CSS y markup semántico de `web09` para cumplir la consigna visual, incorporando datos dinámicos desde la API donde corresponde.
- **Extensibilidad:** la estructura permite agregar fácilmente módulos administrativos (CRUD/gestión) sobre endpoints `[AUTH]` documentados (noticias, obras, funciones, elenco, convocatorias, reservas, suscriptores).

## 9. Posibles mejoras futuras

- Componentizar el carrusel como componente React nativo.
- Añadir paginación/filtrado avanzado y manejo de metadatos de paginación de la API.
- Incorporar un cliente de datos con caché (React Query/SWR) para mejorar UX y sincronización.
- Vistas administrativas para roles `admin`/`director` (gestión de contenido, evaluación de postulaciones, reporte de ocupación).
- Validaciones de formulario más robustas y feedback por campo.
- Pruebas unitarias/E2E y optimización de carga de assets/imágenes.
