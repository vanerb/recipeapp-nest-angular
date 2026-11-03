import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/structure/menu/header/header.component';
import { FooterComponent } from './components/structure/menu/footer/footer.component';
import { LoginComponent } from './components/structure/pages/login/login.component';
import { RegisterComponent } from './components/structure/pages/register/register.component';
import { WelcomeComponent } from './components/structure/pages/welcome/welcome.component';
import { MainComponent } from './components/structure/pages/main/main.component';
import { MainDetailComponent } from './components/structure/pages/main-detail/main-detail.component';
import { RecipeFormComponent } from './components/structure/pages/recipe-form/recipe-form.component';
import { FeedComponent } from './components/structure/pages/feed/feed.component';
import { PostFormModalComponent } from './components/structure/pages/feed/post-form-modal/post-form-modal.component';
import { ProfileComponent } from './components/structure/pages/profile/profile.component';
import { SettingsComponent } from './components/structure/pages/settings/settings.component';
import { ManagementComponent } from './components/structure/pages/management/management.component';
import { AdminComponent } from './components/structure/pages/admin/admin.component';
import { NotFoundComponent } from './components/structure/pages/not-found/not-found.component';
import { ModalComponent } from './components/structure/utilities/modal/modal.component';
import { CardComponent } from './components/structure/utilities/card/card.component';
import { PostCardComponent } from './components/structure/utilities/post-card/post-card.component';
import { DeleteModalComponent } from './components/structure/utilities/delete-modal/delete-modal.component';
import { LoaderComponent } from './components/structure/utilities/loader/loader.component';
import { StarsComponent } from './components/structure/utilities/stars/stars.component';
import { AvatarComponent } from './components/structure/utilities/avatar/avatar.component';
import { ToastComponent } from './components/structure/utilities/toast/toast.component';
import { EmptyStateComponent } from './components/structure/utilities/empty-state/empty-state.component';
import { MediaPipe } from './components/structure/utilities/media.pipe';
import { TimeAgoPipe } from './components/structure/utilities/time-ago.pipe';
import { ImgFallbackDirective } from './components/structure/utilities/img-fallback.directive';
import { DemoApiInterceptor } from './demo/demo-api.interceptor';
import { AuthInterceptor } from './services/auth.interceptor';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    WelcomeComponent,
    MainComponent,
    MainDetailComponent,
    RecipeFormComponent,
    FeedComponent,
    PostFormModalComponent,
    ProfileComponent,
    SettingsComponent,
    ManagementComponent,
    AdminComponent,
    NotFoundComponent,
    ModalComponent,
    CardComponent,
    PostCardComponent,
    DeleteModalComponent,
    LoaderComponent,
    StarsComponent,
    AvatarComponent,
    ToastComponent,
    EmptyStateComponent,
    MediaPipe,
    TimeAgoPipe,
    ImgFallbackDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ...(environment.demo
      ? [{ provide: HTTP_INTERCEPTORS, useClass: DemoApiInterceptor, multi: true }]
      : []),
    {
      provide: APP_INITIALIZER,
      useFactory: (auth: AuthService) => () => auth.restoreSession(),
      deps: [AuthService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
