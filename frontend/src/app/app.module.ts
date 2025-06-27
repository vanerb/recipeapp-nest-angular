import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/structure/pages/login/login.component';
import { ModalComponent } from './components/structure/utilities/modal/modal.component';
import { CardComponent } from './components/structure/utilities/card/card.component';
import { RegisterComponent } from './components/structure/pages/register/register.component';
import { AdminComponent } from './components/structure/pages/admin/admin.component';
import { WelcomeComponent } from './components/structure/pages/welcome/welcome.component';
import { MainComponent } from './components/structure/pages/main/main.component';
import { ContactComponent } from './components/structure/pages/contact/contact.component';
import { HeaderComponent } from './components/structure/menu/header/header.component';
import { FooterComponent } from './components/structure/menu/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './components/structure/pages/profile/profile.component';
import { MainDetailComponent } from './components/structure/pages/main-detail/main-detail.component';
import { MainManagementComponent } from './components/structure/pages/main-management/main-management.component';
import { AddModalComponent } from './components/structure/pages/main-management/add-modal/add-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    ModalComponent,
    CardComponent,
    RegisterComponent,
    AdminComponent,
    WelcomeComponent,
    MainComponent,
    ContactComponent,
    ProfileComponent,
    MainDetailComponent,
    MainManagementComponent,
    AddModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
