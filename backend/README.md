# Recetas Creativas: API

API REST con NestJS 11, TypeORM y JWT. Para la visión general del proyecto, consulta el [README principal](../README.md).

## Puesta en marcha

```bash
npm install
npm run seed
npm run start:dev
```

La API queda en `http://localhost:3002`.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run start:dev` | Arranca la API y la reinicia al cambiar el código |
| `npm run build` y `npm run start:prod` | Compila y arranca la versión compilada |
| `npm run seed` | Carga los datos de ejemplo si la base no tiene usuarios |
| `npm run seed -- --reset` | Vacía la base de datos y vuelve a cargarlos |
| `npm run make-admin -- correo@ejemplo.com` | Da acceso de administración a una cuenta existente |
| `npm run test:e2e` | Ejecuta los tests de la API con SQLite en memoria |

## Variables de entorno

Copia [.env.example](.env.example) como `.env`. Todas son opcionales en desarrollo.

| Variable | Por defecto | Uso |
| --- | --- | --- |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` | | Conexión a MySQL. Sin `DB_HOST` se usa SQLite |
| `DB_TYPE` | Según `DB_HOST` | Fuerza el motor: `mysql` o `sqljs` |
| `DB_LOCATION` | `data/recipes.sqlite` | Fichero de SQLite; `:memory:` para no guardar nada |
| `DB_SYNC` | Activado | Con `false`, TypeORM no modifica las tablas al arrancar |
| `JWT_SECRET` | Valor de desarrollo | Obligatorio con `NODE_ENV=production` |
| `PORT` | `3002` | Puerto de la API |
| `CORS_ORIGIN` | `http://localhost:4200` | Origen autorizado de la web |

## Estructura

```text
src/
  admin/         Panel: resumen, cuentas y comentarios
  categories/    Categorías compartidas
  comments/      Comentarios de las recetas
  common/        Guards de sesión y administración, y subida de imágenes
  posts/         Publicaciones de la comunidad
  ratings/       Valoraciones con estrellas
  recipes/       Recetas, con búsqueda y filtros
  seed/          Datos de ejemplo y comando make-admin
  users/         Cuentas, sesión y perfiles públicos
  hashtags/, images/, ingredients/, preparations/    Entidades de cada receta
```

## Endpoints

La sesión se envía con la cabecera `Authorization: Bearer <token>`. El token se obtiene en `POST /users/login` y dura 7 días.

| Método | Ruta | Sesión | Descripción |
| --- | --- | --- | --- |
| POST | `/users/create` | | Registro |
| POST | `/users/login` | | Inicio de sesión |
| GET, PATCH, DELETE | `/users/me` | Sí | Cuenta propia |
| GET | `/users/:id` | | Perfil público |
| GET | `/recipes` | | Listado; admite `search`, `categoryId`, `hashtag` y `sort=top` |
| GET | `/recipes/:id`, `/recipes/user/:id` | | Detalle y recetas de un usuario |
| POST | `/recipes` | Sí | Crear receta (multipart) |
| PATCH, DELETE | `/recipes/:id` | Dueño | Editar (multipart) o borrar |
| GET | `/recipes/:id/comments` | | Comentarios de una receta |
| POST | `/recipes/:id/comments` | Sí | Comentar |
| DELETE | `/comments/:id` | Autor o dueño de la receta | Borrar comentario |
| GET, PUT | `/recipes/:id/rating` | Sí | Valoración propia y media |
| GET | `/posts`, `/posts/user/:id` | | Publicaciones |
| POST | `/posts` | Sí | Publicar (multipart) |
| DELETE | `/posts/:id` | Dueño | Borrar publicación |
| GET | `/categories`, `/categories/byUserId/:id` | | Categorías |
| POST | `/categories` | Sí | Crear categoría |
| PATCH, DELETE | `/categories/:id` | Dueño | Renombrar o borrar |
| GET | `/admin/stats`, `/admin/users`, `/admin/comments` | Admin | Resumen, cuentas y comentarios |
| PATCH, DELETE | `/admin/users/:id` | Admin | Rol, bloqueo y borrado de cuentas |

La administración también puede usar las rutas marcadas como «Dueño» o «Autor» sobre cualquier contenido.

Las imágenes subidas se sirven desde `/uploads`. Se admiten JPG, PNG, WebP y GIF de hasta 5 MB.
