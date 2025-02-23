import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './components/structure/pages/welcome/welcome.component';
import { AuthGuard } from './guards/auth-guard.guard';
import { LoginComponent } from './components/structure/pages/login/login.component';
import { RegisterComponent } from './components/structure/pages/register/register.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent,  canActivate: [AuthGuard], },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
