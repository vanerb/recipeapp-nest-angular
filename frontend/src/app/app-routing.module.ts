import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth-guard.guard';
import { WelcomeComponent } from './components/structure/pages/welcome/welcome.component';
import { LoginComponent } from './components/structure/pages/login/login.component';
import { RegisterComponent } from './components/structure/pages/register/register.component';
import { MainComponent } from './components/structure/pages/main/main.component';
import { MainDetailComponent } from './components/structure/pages/main-detail/main-detail.component';
import { RecipeFormComponent } from './components/structure/pages/recipe-form/recipe-form.component';
import { FeedComponent } from './components/structure/pages/feed/feed.component';
import { ProfileComponent } from './components/structure/pages/profile/profile.component';
import { SettingsComponent } from './components/structure/pages/settings/settings.component';
import { ManagementComponent } from './components/structure/pages/management/management.component';
import { AdminComponent } from './components/structure/pages/admin/admin.component';
import { NotFoundComponent } from './components/structure/pages/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent, title: 'Recetas Creativas' },
  { path: 'login', component: LoginComponent, title: 'Iniciar sesión · Recetas Creativas' },
  { path: 'register', component: RegisterComponent, title: 'Crear cuenta · Recetas Creativas' },
  { path: 'recipes', component: MainComponent, title: 'Recetas · Recetas Creativas' },
  { path: 'recipes/new', component: RecipeFormComponent, canActivate: [AuthGuard], title: 'Nueva receta · Recetas Creativas' },
  { path: 'recipe/:id', component: MainDetailComponent },
  { path: 'recipe/:id/edit', component: RecipeFormComponent, canActivate: [AuthGuard], title: 'Editar receta · Recetas Creativas' },
  { path: 'community', component: FeedComponent, title: 'Comunidad · Recetas Creativas' },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard], title: 'Ajustes · Recetas Creativas' },
  { path: 'my-panel', component: ManagementComponent, canActivate: [AuthGuard], title: 'Mi panel · Recetas Creativas' },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard], title: 'Administración · Recetas Creativas' },
  { path: '**', component: NotFoundComponent, title: 'Página no encontrada · Recetas Creativas' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // La demo se publica en hosting estático, sin reescritura de rutas
      useHash: environment.demo,
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
