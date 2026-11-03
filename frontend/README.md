# Recetas Creativas: web

Web con Angular 17 y Tailwind CSS. Para la visión general del proyecto, consulta el [README principal](../README.md).

## Puesta en marcha

```bash
npm install
npm start
```

La web queda en `http://localhost:4200` y espera la API en `http://localhost:3002`. Esa dirección se cambia en [environment.ts](src/environments/environment.ts).

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm start` | Servidor de desarrollo, conectado a la API |
| `npm run build` | Versión de producción, conectada a la API |
| `npm run start:demo` | Servidor de desarrollo de la demo, sin API |
| `npm run build:demo` | Versión estática de la demo |

Las builds se generan en `dist/frontend/browser`.

## Estructura

```text
src/app/
  components/structure/
    menu/        Cabecera y pie
    pages/       Una carpeta por página
    utilities/   Tarjetas, estrellas, avatar, modales y avisos
  demo/          API simulada de la demo
  guards/        Protección de rutas con sesión y de administración
  interfaces/    Tipos de los datos de la API
  services/      Llamadas a la API, sesión, modales y avisos
src/assets/demo/ Datos e ilustraciones de ejemplo
```

## Páginas

| Ruta | Página | Acceso |
| --- | --- | --- |
| `/` | Inicio | Público |
| `/recipes` | Búsqueda de recetas | Público |
| `/recipe/:id` | Detalle, valoración y comentarios | Público |
| `/community` | Publicaciones | Público |
| `/profile/:id` | Perfil de un usuario | Público |
| `/login`, `/register` | Acceso y registro | Público |
| `/recipes/new`, `/recipe/:id/edit` | Crear y editar recetas | Con sesión |
| `/my-panel` | Mis recetas y categorías | Con sesión |
| `/settings` | Perfil, contraseña y baja | Con sesión |
| `/admin` | Panel de administración | Administración |

## La demo

La build de demo sustituye `environment.ts` por [environment.demo.ts](src/environments/environment.demo.ts). Con esa configuración, [DemoApiInterceptor](src/app/demo/demo-api.interceptor.ts) responde a las llamadas a la API dentro del navegador:

- Parte de [seed.json](src/assets/demo/seed.json), el mismo archivo que usa el seed del backend.
- Guarda los cambios solo en el `localStorage` de cada visitante.
- No guarda ni comprueba contraseñas.
- Usa rutas con `#`, porque un hosting estático no reescribe las URL.

El flujo [demo.yml](../.github/workflows/demo.yml) la publica en GitHub Pages con cada push a `master`. Antes hay que activar *Settings > Pages > Source: GitHub Actions* en el repositorio.
