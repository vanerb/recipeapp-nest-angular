import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

process.env.DB_TYPE = 'sqljs';
process.env.DB_LOCATION = ':memory:';

import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/setup';
import { User } from '../src/users/users.entity';

// PNG de 1x1 para probar las subidas
const PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAEAQH/7yMK/gAAAABJRU5ErkJggg==',
  'base64',
);
const PASSWORD = 'Prueba123!';

describe('API de Recetas Creativas', () => {
  let app: INestApplication;
  let server: any;

  const signUp = async (name: string, email: string) => {
    await request(server)
      .post('/users/create')
      .send({ name, email, password: PASSWORD })
      .expect(201);
    const login = await request(server)
      .post('/users/login')
      .send({ email, password: PASSWORD })
      .expect(200);
    const token = login.body.access_token as string;
    const me = await request(server)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    return { token, id: me.body.id as string, me: me.body };
  };

  let ana: Awaited<ReturnType<typeof signUp>>;
  let beto: Awaited<ReturnType<typeof signUp>>;
  let categoryId: string;
  let recipe: any;

  const recipeForm = (req: request.Test, overrides: object = {}) => {
    const fields = {
      title: 'Tortilla',
      description: 'Jugosa',
      categoryId,
      ingredients: JSON.stringify(['huevos', 'patatas']),
      preparations: JSON.stringify(['Primero', 'Segundo', 'Tercero']),
      hashtags: JSON.stringify(['#Clasica', 'clasica']),
      ...overrides,
    };
    Object.entries(fields).forEach(([key, value]) => req.field(key, value));
    return req;
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
    server = app.getHttpServer();

    ana = await signUp('Ana', 'ana@example.test');
    beto = await signUp('Beto', 'beto@example.test');

    const category = await request(server)
      .post('/categories')
      .set('Authorization', `Bearer ${ana.token}`)
      .send({ name: 'Cenas' })
      .expect(201);
    categoryId = category.body.id;
  });

  afterAll(() => app.close());

  it('rechaza contraseñas débiles y correos repetidos', async () => {
    await request(server)
      .post('/users/create')
      .send({ name: 'X', email: 'x@example.test', password: 'debil' })
      .expect(400);
    await request(server)
      .post('/users/create')
      .send({ name: 'X', email: 'ANA@example.test', password: PASSWORD })
      .expect(409);
  });

  it('no permite crear recetas sin sesión', async () => {
    await recipeForm(request(server).post('/recipes')).expect(401);
  });

  it('crea una receta con imágenes, pasos en orden y hashtags limpios', async () => {
    const res = await recipeForm(
      request(server)
        .post('/recipes')
        .set('Authorization', `Bearer ${ana.token}`),
    )
      .attach('images', PIXEL, { filename: 'a.png', contentType: 'image/png' })
      .attach('images', PIXEL, { filename: 'b.png', contentType: 'image/png' })
      .expect(201);

    recipe = res.body;
    expect(recipe.images).toHaveLength(2);
    expect(recipe.preparations.map((p) => p.preparation)).toEqual([
      'Primero',
      'Segundo',
      'Tercero',
    ]);
    expect(recipe.hashtags.map((h) => h.hashtag)).toEqual(['clasica']);
    expect(recipe.user.name).toBe('Ana');
  });

  it('valida los datos de la receta y el tipo de archivo', async () => {
    await recipeForm(
      request(server)
        .post('/recipes')
        .set('Authorization', `Bearer ${ana.token}`),
      { ingredients: '[]' },
    ).expect(400);

    await recipeForm(
      request(server)
        .post('/recipes')
        .set('Authorization', `Bearer ${ana.token}`),
    )
      .attach('images', Buffer.from('<svg/>'), {
        filename: 'x.svg',
        contentType: 'image/svg+xml',
      })
      .expect(400);
  });

  it('no filtra correo ni contraseña en las respuestas públicas', async () => {
    const list = await request(server).get('/recipes').expect(200);
    const profile = await request(server).get(`/users/${ana.id}`).expect(200);
    expect(JSON.stringify(list.body)).not.toContain('ana@example.test');
    expect(profile.body.email).toBeUndefined();
    expect(profile.body.password).toBeUndefined();
    expect(ana.me.email).toBe('ana@example.test');
    expect(ana.me.password).toBeUndefined();
  });

  it('solo el dueño puede editar, y editar conserva las imágenes', async () => {
    const path = `/recipes/${recipe.id}`;
    await recipeForm(
      request(server).patch(path).set('Authorization', `Bearer ${beto.token}`),
    ).expect(403);

    const res = await recipeForm(
      request(server).patch(path).set('Authorization', `Bearer ${ana.token}`),
      { title: 'Tortilla de patatas', preparations: '["Único paso"]' },
    ).expect(200);
    expect(res.body.title).toBe('Tortilla de patatas');
    expect(res.body.images).toHaveLength(2);
    expect(res.body.preparations).toHaveLength(1);
  });

  it('permite quitar imágenes con keepImageIds', async () => {
    const res = await recipeForm(
      request(server)
        .patch(`/recipes/${recipe.id}`)
        .set('Authorization', `Bearer ${ana.token}`),
      { keepImageIds: JSON.stringify([recipe.images[1].id]) },
    ).expect(200);
    expect(res.body.images.map((i) => i.id)).toEqual([recipe.images[1].id]);
  });

  it('valora una vez por usuario y calcula la media', async () => {
    const path = `/recipes/${recipe.id}/rating`;
    await request(server)
      .put(path)
      .set('Authorization', `Bearer ${ana.token}`)
      .send({ value: 5 })
      .expect(403);
    await request(server)
      .put(path)
      .set('Authorization', `Bearer ${beto.token}`)
      .send({ value: 9 })
      .expect(400);
    await request(server)
      .put(path)
      .set('Authorization', `Bearer ${beto.token}`)
      .send({ value: 5 })
      .expect(200);
    const res = await request(server)
      .put(path)
      .set('Authorization', `Bearer ${beto.token}`)
      .send({ value: 3 })
      .expect(200);
    expect(res.body).toEqual({
      averageRating: 3,
      ratingsCount: 1,
      myRating: 3,
    });
  });

  it('gestiona comentarios y sus permisos de borrado', async () => {
    const path = `/recipes/${recipe.id}/comments`;
    await request(server).post(path).send({ text: 'Hola' }).expect(401);
    const created = await request(server)
      .post(path)
      .set('Authorization', `Bearer ${beto.token}`)
      .send({ text: '¡Riquísima!' })
      .expect(201);

    const list = await request(server).get(path).expect(200);
    expect(list.body[0].user.name).toBe('Beto');

    const carla = await signUp('Carla', 'carla@example.test');
    await request(server)
      .delete(`/comments/${created.body.id}`)
      .set('Authorization', `Bearer ${carla.token}`)
      .expect(403);
    // Ana es la dueña de la receta
    await request(server)
      .delete(`/comments/${created.body.id}`)
      .set('Authorization', `Bearer ${ana.token}`)
      .expect(200);
  });

  it('publica una foto enlazada a una receta', async () => {
    await request(server)
      .post('/posts')
      .set('Authorization', `Bearer ${beto.token}`)
      .field('caption', 'Sin foto')
      .field('recipeId', recipe.id)
      .expect(400);

    const res = await request(server)
      .post('/posts')
      .set('Authorization', `Bearer ${beto.token}`)
      .field('caption', 'La hice anoche')
      .field('recipeId', recipe.id)
      .attach('image', PIXEL, { filename: 'p.png', contentType: 'image/png' })
      .expect(201);
    expect(res.body.recipe.id).toBe(recipe.id);
    expect(res.body.user.name).toBe('Beto');

    const mine = await request(server)
      .get(`/posts/user/${beto.id}`)
      .expect(200);
    expect(mine.body).toHaveLength(1);

    await request(server)
      .delete(`/posts/${res.body.id}`)
      .set('Authorization', `Bearer ${ana.token}`)
      .expect(403);
    await request(server)
      .delete(`/posts/${res.body.id}`)
      .set('Authorization', `Bearer ${beto.token}`)
      .expect(200);
  });

  it('filtra recetas por texto, categoría, hashtag y nota', async () => {
    const search = await request(server)
      .get('/recipes')
      .query({ search: 'tortilla', categoryId })
      .expect(200);
    expect(search.body).toHaveLength(1);
    expect(search.body[0].hashtags).toHaveLength(1);

    const none = await request(server)
      .get('/recipes')
      .query({ hashtag: 'inexistente' })
      .expect(200);
    expect(none.body).toHaveLength(0);

    const top = await request(server)
      .get('/recipes')
      .query({ hashtag: 'clasica', sort: 'top' })
      .expect(200);
    expect(top.body[0].averageRating).toBe(3);
  });

  it('borrar una categoría deja la receta sin categoría', async () => {
    await request(server)
      .delete(`/categories/${categoryId}`)
      .set('Authorization', `Bearer ${beto.token}`)
      .expect(403);
    await request(server)
      .delete(`/categories/${categoryId}`)
      .set('Authorization', `Bearer ${ana.token}`)
      .expect(200);
    const res = await request(server).get(`/recipes/${recipe.id}`).expect(200);
    expect(res.body.category).toBeNull();
  });

  it('cambiar la contraseña exige la actual', async () => {
    await request(server)
      .patch('/users/me')
      .set('Authorization', `Bearer ${beto.token}`)
      .send({ currentPassword: 'mala', password: 'Nueva123!' })
      .expect(400);
    await request(server)
      .patch('/users/me')
      .set('Authorization', `Bearer ${beto.token}`)
      .send({ currentPassword: PASSWORD, password: 'Nueva123!', bio: 'Hola' })
      .expect(200);
    await request(server)
      .post('/users/login')
      .send({ email: 'beto@example.test', password: 'Nueva123!' })
      .expect(200);
  });

  describe('administración', () => {
    let admin: Awaited<ReturnType<typeof signUp>>;
    let dani: Awaited<ReturnType<typeof signUp>>;
    const as = (token: string) => ({ Authorization: `Bearer ${token}` });

    beforeAll(async () => {
      admin = await signUp('Admin', 'admin@example.test');
      dani = await signUp('Dani', 'dani@example.test');
      await app
        .get(DataSource)
        .getRepository(User)
        .update(admin.id, { role: 'admin' });
    });

    it('solo deja entrar a la administración', async () => {
      await request(server).get('/admin/stats').expect(401);
      await request(server).get('/admin/users').set(as(dani.token)).expect(403);
      const stats = await request(server)
        .get('/admin/stats')
        .set(as(admin.token))
        .expect(200);
      expect(stats.body.users).toBeGreaterThanOrEqual(4);
      const users = await request(server)
        .get('/admin/users')
        .set(as(admin.token))
        .expect(200);
      const row = users.body.find((user) => user.id === ana.id);
      expect(row.email).toBe('ana@example.test');
      expect(row.recipesCount).toBe(1);
      expect(row.password).toBeUndefined();
    });

    it('nadie puede darse el rol por su cuenta ni verlo en público', async () => {
      await request(server)
        .patch('/users/me')
        .set(as(dani.token))
        .send({ role: 'admin' })
        .expect(200);
      const me = await request(server)
        .get('/users/me')
        .set(as(dani.token))
        .expect(200);
      expect(me.body.role).toBe('user');
      const profile = await request(server)
        .get(`/users/${admin.id}`)
        .expect(200);
      expect(profile.body.role).toBeUndefined();
      expect(profile.body.isBlocked).toBeUndefined();
    });

    it('modera contenido ajeno', async () => {
      const category = await request(server)
        .post('/categories')
        .set(as(ana.token))
        .send({ name: 'Moderable' })
        .expect(201);
      const created = await recipeForm(
        request(server).post('/recipes').set(as(ana.token)),
        { categoryId: category.body.id },
      ).expect(201);
      const id = created.body.id;

      const edited = await recipeForm(
        request(server).patch(`/recipes/${id}`).set(as(admin.token)),
        { title: 'Editada por admin', categoryId: category.body.id },
      ).expect(200);
      expect(edited.body.user.id).toBe(ana.id);

      const comment = await request(server)
        .post(`/recipes/${id}/comments`)
        .set(as(dani.token))
        .send({ text: 'Spam' })
        .expect(201);
      const list = await request(server)
        .get('/admin/comments')
        .set(as(admin.token))
        .expect(200);
      expect(list.body.find((item) => item.id === comment.body.id).recipe.id).toBe(id);
      await request(server)
        .delete(`/comments/${comment.body.id}`)
        .set(as(admin.token))
        .expect(200);

      const post = await request(server)
        .post('/posts')
        .set(as(dani.token))
        .field('caption', 'Spam')
        .field('recipeId', id)
        .attach('image', PIXEL, { filename: 'p.png', contentType: 'image/png' })
        .expect(201);
      await request(server)
        .delete(`/posts/${post.body.id}`)
        .set(as(admin.token))
        .expect(200);

      await request(server)
        .patch(`/categories/${category.body.id}`)
        .set(as(admin.token))
        .send({ name: 'Renombrada' })
        .expect(200);
      await request(server)
        .delete(`/categories/${category.body.id}`)
        .set(as(admin.token))
        .expect(200);
      await request(server)
        .delete(`/recipes/${id}`)
        .set(as(admin.token))
        .expect(200);
    });

    it('bloquea y desbloquea cuentas', async () => {
      const path = `/admin/users/${dani.id}`;
      await request(server)
        .patch(path)
        .set(as(dani.token))
        .send({ isBlocked: true })
        .expect(403);
      await request(server)
        .patch(path)
        .set(as(admin.token))
        .send({ isBlocked: true })
        .expect(200);
      await request(server).get('/users/me').set(as(dani.token)).expect(403);
      await request(server)
        .post('/users/login')
        .send({ email: 'dani@example.test', password: PASSWORD })
        .expect(403);
      await request(server)
        .patch(path)
        .set(as(admin.token))
        .send({ isBlocked: false })
        .expect(200);
      await request(server).get('/users/me').set(as(dani.token)).expect(200);
    });

    it('no permite que se quede sin administración', async () => {
      const self = `/admin/users/${admin.id}`;
      await request(server)
        .patch(self)
        .set(as(admin.token))
        .send({ role: 'user' })
        .expect(400);
      await request(server)
        .patch(self)
        .set(as(admin.token))
        .send({ isBlocked: true })
        .expect(400);
      await request(server).delete(self).set(as(admin.token)).expect(400);
      await request(server)
        .delete('/users/me')
        .set(as(admin.token))
        .expect(400);
    });

    it('nombra administradores y elimina cuentas', async () => {
      const path = `/admin/users/${dani.id}`;
      await request(server)
        .patch(path)
        .set(as(admin.token))
        .send({ role: 'jefe' })
        .expect(400);
      const promoted = await request(server)
        .patch(path)
        .set(as(admin.token))
        .send({ role: 'admin' })
        .expect(200);
      expect(promoted.body.role).toBe('admin');
      await request(server)
        .delete('/users/me')
        .set(as(admin.token))
        .expect(200);

      const temporal = await signUp('Temporal', 'temporal@example.test');
      await request(server)
        .delete(`/admin/users/${temporal.id}`)
        .set(as(dani.token))
        .expect(200);
      await request(server)
        .get('/users/me')
        .set(as(temporal.token))
        .expect(401);
      await request(server)
        .delete(`/admin/users/${temporal.id}`)
        .set(as(dani.token))
        .expect(404);
    });
  });

  it('borrar la cuenta elimina también sus recetas', async () => {
    await request(server)
      .delete('/users/me')
      .set('Authorization', `Bearer ${ana.token}`)
      .expect(200);
    await request(server).get(`/recipes/${recipe.id}`).expect(404);
    await request(server)
      .get('/users/me')
      .set('Authorization', `Bearer ${ana.token}`)
      .expect(401);
  });
});
