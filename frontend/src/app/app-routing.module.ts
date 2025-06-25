import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './components/structure/pages/welcome/welcome.component';
import { AuthGuard } from './guards/auth-guard.guard';
import { LoginComponent } from './components/structure/pages/login/login.component';
import { RegisterComponent } from './components/structure/pages/register/register.component';
import { ContactComponent } from './components/structure/pages/contact/contact.component';
import { MainComponent } from './components/structure/pages/main/main.component';
import { ProfileComponent } from './components/structure/pages/profile/profile.component';
import { MainDetailComponent } from './components/structure/pages/main-detail/main-detail.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent, canActivate: [AuthGuard], },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'recipes', component: MainComponent, canActivate: [AuthGuard], },
  { path: 'recipe/:id', component: MainDetailComponent, canActivate: [AuthGuard], },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard], },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
