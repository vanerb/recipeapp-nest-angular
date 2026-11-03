import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, from, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { safeStorage } from '../services/safe-storage';

export const DEMO_DB_KEY = 'recetas_demo_db_v2';

interface Row {
  id: string;
  [key: string]: any;
}

interface DemoDb {
  users: Row[];
  categories: Row[];
  recipes: Row[];
  comments: Row[];
  ratings: Row[];
  posts: Row[];
}

const newId = () => Math.random().toString(36).slice(2, 12);
const hoursAgo = (hours: number) =>
  new Date(Date.now() - hours * 3_600_000).toISOString();
const fail = (status: number, message: string): never => {
  throw new HttpErrorResponse({ status, error: { message } });
};

// Reproduce la API de NestJS dentro del navegador, para publicar la demo sin servidor.
// Los datos parten de assets/demo/seed.json y los cambios se guardan en localStorage.
@Injectable()
export class DemoApiInterceptor implements HttpInterceptor {
  private db?: DemoDb;

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (!req.url.startsWith(environment.apiUrl)) {
      return next.handle(req);
    }
    return from(this.handle(req)).pipe(
      delay(120),
      map((body) => new HttpResponse({ status: 200, body })),
    );
  }

  private async handle(req: HttpRequest<unknown>): Promise<unknown> {
    const db = await this.load();
    const path = req.url.slice(environment.apiUrl.length);
    const me = this.currentUser(req, db);
    const route = `${req.method} ${path}`;
    let m: RegExpMatchArray | null;

    if (route === 'POST /users/create') return this.register(db, req.body);
    if (route === 'POST /users/login') return this.login(db, req.body);
    if (route === 'GET /users/me') return this.required(me);
    if (route === 'PATCH /users/me') return this.updateMe(db, this.required(me), req.body as FormData);
    if (route === 'DELETE /users/me') return this.deleteOwnAccount(db, this.required(me));
    if (route.includes(' /admin/')) return this.handleAdmin(db, route, this.required(me), req.body);
    if ((m = route.match(/^GET \/users\/(.+)$/))) return this.profile(db, m[1]);

    if (route === 'GET /recipes') return this.listRecipes(db, req);
    if ((m = route.match(/^GET \/recipes\/user\/(.+)$/))) {
      const recipes = db.recipes.filter((recipe) => recipe['userId'] === m![1]);
      return this.sortByDate(recipes).map((recipe) => this.toRecipe(db, recipe));
    }
    if ((m = route.match(/^GET \/recipes\/([^/]+)\/comments$/))) {
      const comments = db.comments.filter((comment) => comment['recipeId'] === m![1]);
      return this.sortByDate(comments).map((comment) => this.withUser(db, comment));
    }
    if ((m = route.match(/^POST \/recipes\/([^/]+)\/comments$/))) {
      return this.addComment(db, m[1], this.required(me), req.body);
    }
    if ((m = route.match(/^GET \/recipes\/([^/]+)\/rating$/))) {
      return this.ratingSummary(db, m[1], this.required(me).id);
    }
    if ((m = route.match(/^PUT \/recipes\/([^/]+)\/rating$/))) {
      return this.rate(db, m[1], this.required(me), req.body);
    }
    if ((m = route.match(/^GET \/recipes\/([^/]+)$/))) {
      return this.toRecipe(db, this.findRecipe(db, m[1]));
    }
    if (route === 'POST /recipes') {
      return this.saveRecipe(db, null, this.required(me), req.body as FormData);
    }
    if ((m = route.match(/^PATCH \/recipes\/([^/]+)$/))) {
      return this.saveRecipe(db, m[1], this.required(me), req.body as FormData);
    }
    if ((m = route.match(/^DELETE \/recipes\/([^/]+)$/))) {
      return this.deleteRecipe(db, m[1], this.required(me));
    }
    if ((m = route.match(/^DELETE \/comments\/([^/]+)$/))) {
      return this.deleteComment(db, m[1], this.required(me));
    }

    if (route === 'GET /categories') {
      return this.sortCategories(db.categories);
    }
    if ((m = route.match(/^GET \/categories\/byUserId\/(.+)$/))) {
      return this.sortCategories(db.categories.filter((category) => category['userId'] === m![1]));
    }
    if (route === 'POST /categories') {
      return this.createCategory(db, this.required(me), req.body);
    }
    if ((m = route.match(/^PATCH \/categories\/([^/]+)$/))) {
      return this.updateCategory(db, m[1], this.required(me), req.body);
    }
    if ((m = route.match(/^DELETE \/categories\/([^/]+)$/))) {
      return this.deleteCategory(db, m[1], this.required(me));
    }

    if (route === 'GET /posts') {
      return this.sortByDate(db.posts).map((post) => this.toPost(db, post));
    }
    if ((m = route.match(/^GET \/posts\/user\/(.+)$/))) {
      const posts = db.posts.filter((post) => post['userId'] === m![1]);
      return this.sortByDate(posts).map((post) => this.toPost(db, post));
    }
    if (route === 'POST /posts') {
      return this.createPost(db, this.required(me), req.body as FormData);
    }
    if ((m = route.match(/^DELETE \/posts\/([^/]+)$/))) {
      return this.deletePost(db, m[1], this.required(me));
    }

    return fail(404, 'Ruta no encontrada');
  }

  // --- Datos

  private async load(): Promise<DemoDb> {
    if (this.db) {
      return this.db;
    }
    const saved = safeStorage.get(DEMO_DB_KEY);
    if (saved) {
      try {
        this.db = JSON.parse(saved) as DemoDb;
        return this.db;
      } catch {
        safeStorage.remove(DEMO_DB_KEY);
      }
    }
    const response = await fetch(new URL('assets/demo/seed.json', document.baseURI));
    this.db = this.fromSeed(await response.json());
    return this.db;
  }

  private save(db: DemoDb) {
    safeStorage.set(DEMO_DB_KEY, JSON.stringify(db));
  }

  private fromSeed(seed: any): DemoDb {
    const userId = (key: string) => `u-${key}`;
    const recipeId = (key: string) => `r-${key}`;
    const categoryId = (key: string) => `c-${key}`;
    const list = (items: string[], field: string) =>
      items.map((value) => ({ id: newId(), [field]: value }));

    return {
      users: seed.users.map((user: any, index: number) => ({
        id: userId(user.key),
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: null,
        role: user.role ?? 'user',
        isBlocked: false,
        createdAt: hoursAgo(2000 - index * 100),
      })),
      categories: seed.categories.map((category: any) => ({
        id: categoryId(category.key),
        name: category.name,
        userId: userId(category.owner),
      })),
      recipes: seed.recipes.map((recipe: any) => ({
        id: recipeId(recipe.key),
        title: recipe.title,
        description: recipe.description,
        userId: userId(recipe.user),
        categoryId: categoryId(recipe.category),
        images: list(recipe.images, 'url'),
        ingredients: list(recipe.ingredients, 'ingredient'),
        preparations: list(recipe.steps, 'preparation'),
        hashtags: list(recipe.hashtags, 'hashtag'),
        createdAt: hoursAgo(recipe.hoursAgo),
      })),
      comments: seed.comments.map((comment: any) => ({
        id: newId(),
        text: comment.text,
        recipeId: recipeId(comment.recipe),
        userId: userId(comment.user),
        createdAt: hoursAgo(comment.hoursAgo),
      })),
      ratings: seed.ratings.map((rating: any) => ({
        id: newId(),
        value: rating.value,
        recipeId: recipeId(rating.recipe),
        userId: userId(rating.user),
      })),
      posts: seed.posts.map((post: any) => ({
        id: newId(),
        caption: post.caption,
        image: post.image,
        userId: userId(post.user),
        recipeId: recipeId(post.recipe),
        createdAt: hoursAgo(post.hoursAgo),
      })),
    };
  }

  private currentUser(req: HttpRequest<unknown>, db: DemoDb): Row | null {
    const token = req.headers.get('Authorization')?.replace('Bearer demo:', '');
    return db.users.find((user) => user.id === token) ?? null;
  }

  private required(user: Row | null): Row {
    const current = user ?? fail(401, 'Debes iniciar sesión');
    if (current['isBlocked']) {
      fail(403, 'Tu cuenta está bloqueada');
    }
    return current;
  }

  private sortByDate(rows: Row[]): Row[] {
    return [...rows].sort((a, b) => b['createdAt'].localeCompare(a['createdAt']));
  }

  private sortCategories(categories: Row[]) {
    return [...categories]
      .sort((a, b) => a['name'].localeCompare(b['name'], 'es'))
      .map(({ id, name }) => ({ id, name }));
  }

  private toPublicUser(db: DemoDb, id: string) {
    const { email, role, isBlocked, ...user } = db.users.find((row) => row.id === id)!;
    return user;
  }

  private withUser(db: DemoDb, row: Row) {
    return { ...row, user: this.toPublicUser(db, row['userId']) };
  }

  private findRecipe(db: DemoDb, id: string): Row {
    return db.recipes.find((recipe) => recipe.id === id) ?? fail(404, 'Receta no encontrada');
  }

  private toRecipe(db: DemoDb, recipe: Row) {
    const category = db.categories.find((row) => row.id === recipe['categoryId']);
    return {
      ...recipe,
      ...this.ratingSummary(db, recipe.id, ''),
      commentsCount: db.comments.filter((comment) => comment['recipeId'] === recipe.id).length,
      category: category ? { id: category.id, name: category['name'] } : null,
      user: this.toPublicUser(db, recipe['userId']),
    };
  }

  private toPost(db: DemoDb, post: Row) {
    const recipe = db.recipes.find((row) => row.id === post['recipeId'])!;
    return { ...this.withUser(db, post), recipe: { id: recipe.id, title: recipe['title'] } };
  }

  // --- Usuarios

  private register(db: DemoDb, body: any) {
    const email = body.email.toLowerCase();
    if (db.users.some((user) => user['email'] === email)) {
      fail(409, 'Ya existe una cuenta con ese correo');
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/.test(body.password)) {
      fail(400, 'La contraseña necesita 8 caracteres con mayúscula, minúscula, número y símbolo');
    }
    // La contraseña no se guarda: el login de la demo solo comprueba el correo
    const user = { id: newId(), name: body.name, email, bio: null, avatar: null, role: 'user', isBlocked: false, createdAt: new Date().toISOString() };
    db.users.push(user);
    this.save(db);
    return user;
  }

  private login(db: DemoDb, body: any) {
    const user = db.users.find((row) => row['email'] === body.email.toLowerCase());
    if (!user) {
      fail(401, 'Credenciales incorrectas');
    }
    if (user!['isBlocked']) {
      fail(403, 'Tu cuenta está bloqueada');
    }
    return { access_token: `demo:${user!.id}` };
  }

  private async updateMe(db: DemoDb, me: Row, form: FormData) {
    for (const field of ['name', 'email', 'bio']) {
      const value = form.get(field);
      if (typeof value === 'string') {
        me[field] = value;
      }
    }
    const avatar = form.get('avatar');
    if (avatar instanceof File) {
      me['avatar'] = await this.toDataUrl(avatar, 300);
    }
    this.save(db);
    return me;
  }

  private deleteOwnAccount(db: DemoDb, me: Row) {
    if (this.isAdmin(me) && db.users.filter((user) => this.isAdmin(user)).length === 1) {
      fail(400, 'Eres la única cuenta de administración: nombra a otra persona antes de irte');
    }
    return this.deleteMe(db, me);
  }

  private deleteMe(db: DemoDb, me: Row) {
    const recipes = db.recipes.filter((recipe) => recipe['userId'] === me.id).map((recipe) => recipe.id);
    const gone = (row: Row) => row['userId'] === me.id || recipes.includes(row['recipeId']);
    db.recipes = db.recipes.filter((recipe) => recipe['userId'] !== me.id);
    db.comments = db.comments.filter((row) => !gone(row));
    db.ratings = db.ratings.filter((row) => !gone(row));
    db.posts = db.posts.filter((row) => !gone(row));
    db.users = db.users.filter((user) => user.id !== me.id);
    this.save(db);
    return null;
  }

  private profile(db: DemoDb, id: string) {
    if (!db.users.some((user) => user.id === id)) {
      fail(404, 'Usuario no encontrado');
    }
    const recipes = db.recipes.filter((recipe) => recipe['userId'] === id).map((recipe) => recipe.id);
    const values = db.ratings.filter((rating) => recipes.includes(rating['recipeId'])).map((rating) => rating['value']);
    return {
      ...this.toPublicUser(db, id),
      recipesCount: recipes.length,
      postsCount: db.posts.filter((post) => post['userId'] === id).length,
      averageRating: this.average(values),
    };
  }

  // --- Administración

  private isAdmin(user: Row): boolean {
    return user['role'] === 'admin';
  }

  private handleAdmin(db: DemoDb, route: string, me: Row, body: any) {
    if (!this.isAdmin(me)) {
      fail(403, 'Solo para administración');
    }
    if (route === 'GET /admin/stats') {
      return {
        users: db.users.length,
        blockedUsers: db.users.filter((user) => user['isBlocked']).length,
        recipes: db.recipes.length,
        posts: db.posts.length,
        comments: db.comments.length,
        ratings: db.ratings.length,
        categories: db.categories.length,
      };
    }
    if (route === 'GET /admin/users') {
      return this.sortByDate(db.users).map((user) => ({
        ...user,
        recipesCount: db.recipes.filter((recipe) => recipe['userId'] === user.id).length,
        postsCount: db.posts.filter((post) => post['userId'] === user.id).length,
      }));
    }
    if (route === 'GET /admin/comments') {
      return this.sortByDate(db.comments).map((comment) => {
        const recipe = db.recipes.find((row) => row.id === comment['recipeId'])!;
        return { ...this.withUser(db, comment), recipe: { id: recipe.id, title: recipe['title'] } };
      });
    }

    const m = route.match(/^(PATCH|DELETE) \/admin\/users\/(.+)$/);
    if (!m) {
      return fail(404, 'Ruta no encontrada');
    }
    if (m[2] === me.id) {
      fail(400, 'No puedes cambiar tu propia cuenta desde aquí');
    }
    const user = db.users.find((row) => row.id === m[2]) ?? fail(404, 'Usuario no encontrado');
    if (m[1] === 'DELETE') {
      return this.deleteMe(db, user);
    }
    Object.assign(user, body);
    this.save(db);
    return user;
  }

  // --- Recetas

  private average(values: number[]): number {
    if (values.length === 0) {
      return 0;
    }
    return +(values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1);
  }

  private listRecipes(db: DemoDb, req: HttpRequest<unknown>) {
    const search = req.params.get('search')?.trim().toLowerCase();
    const categoryId = req.params.get('categoryId');
    const hashtag = req.params.get('hashtag')?.toLowerCase();

    const recipes = this.sortByDate(db.recipes)
      .filter((recipe) => !categoryId || recipe['categoryId'] === categoryId)
      .filter((recipe) => !hashtag || recipe['hashtags'].some((tag: any) => tag.hashtag === hashtag))
      .filter((recipe) => !search || `${recipe['title']} ${recipe['description']}`.toLowerCase().includes(search))
      .map((recipe) => this.toRecipe(db, recipe));

    if (req.params.get('sort') === 'top') {
      recipes.sort((a, b) => b.averageRating - a.averageRating || b.ratingsCount - a.ratingsCount);
    }
    return recipes;
  }

  private async toDataUrl(file: File, maxSize: number): Promise<string> {
    // Reducida para que quepa en localStorage
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.78);
  }

  private async saveRecipe(db: DemoDb, id: string | null, me: Row, form: FormData) {
    const existing = id ? this.findRecipe(db, id) : null;
    if (existing && existing['userId'] !== me.id && !this.isAdmin(me)) {
      fail(403, 'Esta receta no es tuya');
    }

    const parse = (field: string): string[] => JSON.parse((form.get(field) as string) ?? '[]');
    const list = (items: string[], field: string) => items.map((value) => ({ id: newId(), [field]: value }));

    const keep: string[] | null = form.has('keepImageIds') ? parse('keepImageIds') : null;
    const kept = (existing?.['images'] ?? []).filter((image: Row) => !keep || keep.includes(image.id));
    const files = form.getAll('images').filter((file): file is File => file instanceof File);
    const added = await Promise.all(
      files.map(async (file) => ({ id: newId(), url: await this.toDataUrl(file, 1000) })),
    );

    const tags = parse('hashtags').map((tag) => tag.replace(/^#+/, '').toLowerCase()).filter(Boolean);
    const recipe: Row = existing ?? {
      id: newId(),
      userId: me.id,
      createdAt: new Date().toISOString(),
    };
    Object.assign(recipe, {
      title: form.get('title'),
      description: form.get('description'),
      categoryId: form.get('categoryId'),
      images: [...kept, ...added],
      ingredients: list(parse('ingredients'), 'ingredient'),
      preparations: list(parse('preparations'), 'preparation'),
      hashtags: list([...new Set(tags)], 'hashtag'),
    });
    if (!existing) {
      db.recipes.push(recipe);
    }
    this.save(db);
    return this.toRecipe(db, recipe);
  }

  private deleteRecipe(db: DemoDb, id: string, me: Row) {
    if (this.findRecipe(db, id)['userId'] !== me.id && !this.isAdmin(me)) {
      fail(403, 'Esta receta no es tuya');
    }
    db.recipes = db.recipes.filter((recipe) => recipe.id !== id);
    db.comments = db.comments.filter((row) => row['recipeId'] !== id);
    db.ratings = db.ratings.filter((row) => row['recipeId'] !== id);
    db.posts = db.posts.filter((row) => row['recipeId'] !== id);
    this.save(db);
    return null;
  }

  // --- Comentarios y valoraciones

  private addComment(db: DemoDb, recipeId: string, me: Row, body: any) {
    this.findRecipe(db, recipeId);
    const comment = {
      id: newId(),
      text: body.text.trim(),
      recipeId,
      userId: me.id,
      createdAt: new Date().toISOString(),
    };
    db.comments.push(comment);
    this.save(db);
    return this.withUser(db, comment);
  }

  private deleteComment(db: DemoDb, id: string, me: Row) {
    const comment = db.comments.find((row) => row.id === id) ?? fail(404, 'Comentario no encontrado');
    const recipe = this.findRecipe(db, comment['recipeId']);
    if (comment['userId'] !== me.id && recipe['userId'] !== me.id && !this.isAdmin(me)) {
      fail(403, 'No puedes borrar este comentario');
    }
    db.comments = db.comments.filter((row) => row.id !== id);
    this.save(db);
    return null;
  }

  private ratingSummary(db: DemoDb, recipeId: string, userId: string) {
    const ratings = db.ratings.filter((rating) => rating['recipeId'] === recipeId);
    return {
      averageRating: this.average(ratings.map((rating) => rating['value'])),
      ratingsCount: ratings.length,
      myRating: ratings.find((rating) => rating['userId'] === userId)?.['value'] ?? null,
    };
  }

  private rate(db: DemoDb, recipeId: string, me: Row, body: any) {
    if (this.findRecipe(db, recipeId)['userId'] === me.id) {
      fail(403, 'No puedes valorar tu propia receta');
    }
    const existing = db.ratings.find((rating) => rating['recipeId'] === recipeId && rating['userId'] === me.id);
    if (existing) {
      existing['value'] = body.value;
    } else {
      db.ratings.push({ id: newId(), value: body.value, recipeId, userId: me.id });
    }
    this.save(db);
    return this.ratingSummary(db, recipeId, me.id);
  }

  // --- Categorías

  private assertNameIsFree(db: DemoDb, name: string, ignoreId?: string) {
    const taken = db.categories.some(
      (category) => category.id !== ignoreId && category['name'].toLowerCase() === name.trim().toLowerCase(),
    );
    if (taken) {
      fail(409, 'Ya existe una categoría con ese nombre');
    }
  }

  private findOwnedCategory(db: DemoDb, id: string, me: Row): Row {
    const category = db.categories.find((row) => row.id === id) ?? fail(404, 'Categoría no encontrada');
    if (category['userId'] !== me.id && !this.isAdmin(me)) {
      fail(403, 'Esta categoría no es tuya');
    }
    return category;
  }

  private createCategory(db: DemoDb, me: Row, body: any) {
    this.assertNameIsFree(db, body.name);
    const category = { id: newId(), name: body.name.trim(), userId: me.id };
    db.categories.push(category);
    this.save(db);
    return { id: category.id, name: category.name };
  }

  private updateCategory(db: DemoDb, id: string, me: Row, body: any) {
    const category = this.findOwnedCategory(db, id, me);
    this.assertNameIsFree(db, body.name, id);
    category['name'] = body.name.trim();
    this.save(db);
    return { id, name: category['name'] };
  }

  private deleteCategory(db: DemoDb, id: string, me: Row) {
    this.findOwnedCategory(db, id, me);
    db.categories = db.categories.filter((category) => category.id !== id);
    db.recipes
      .filter((recipe) => recipe['categoryId'] === id)
      .forEach((recipe) => (recipe['categoryId'] = null));
    this.save(db);
    return null;
  }

  // --- Publicaciones

  private async createPost(db: DemoDb, me: Row, form: FormData) {
    const image = form.get('image');
    if (!(image instanceof File)) {
      fail(400, 'La publicación necesita una foto');
    }
    const recipeId = form.get('recipeId') as string;
    this.findRecipe(db, recipeId);
    const post = {
      id: newId(),
      caption: form.get('caption') as string,
      image: await this.toDataUrl(image as File, 1000),
      userId: me.id,
      recipeId,
      createdAt: new Date().toISOString(),
    };
    db.posts.push(post);
    this.save(db);
    return this.toPost(db, post);
  }

  private deletePost(db: DemoDb, id: string, me: Row) {
    const post = db.posts.find((row) => row.id === id) ?? fail(404, 'Publicación no encontrada');
    if (post['userId'] !== me.id && !this.isAdmin(me)) {
      fail(403, 'Esta publicación no es tuya');
    }
    db.posts = db.posts.filter((row) => row.id !== id);
    this.save(db);
    return null;
  }
}
