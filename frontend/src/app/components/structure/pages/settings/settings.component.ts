import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../services/auth.service';
import { errorMessage } from '../../../../services/error-message';
import { ModalService } from '../../../../services/modal.service';
import { ToastService } from '../../../../services/toast.service';
import { DeleteModalComponent } from '../../utilities/delete-modal/delete-modal.component';

const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit, OnDestroy {
  readonly isDemo = environment.demo;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  avatarFile: File | null = null;
  avatarPreview: string | null = null;
  savingProfile = false;
  savingPassword = false;

  constructor(
    private readonly fb: FormBuilder,
    readonly authService: AuthService,
    private readonly modalService: ModalService,
    private readonly toast: ToastService,
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(80)]],
      email: ['', [Validators.required, Validators.email]],
      bio: ['', Validators.maxLength(300)],
    });
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(STRONG_PASSWORD)]],
    });
  }

  ngOnInit() {
    const user = this.authService.user!;
    this.profileForm.patchValue({
      name: user.name,
      email: user.email,
      bio: user.bio ?? '',
    });
  }

  ngOnDestroy() {
    if (this.avatarPreview) {
      URL.revokeObjectURL(this.avatarPreview);
    }
  }

  onAvatar(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.toast.error('La imagen no puede superar los 5 MB.');
      return;
    }
    if (this.avatarPreview) {
      URL.revokeObjectURL(this.avatarPreview);
    }
    this.avatarFile = file;
    this.avatarPreview = URL.createObjectURL(file);
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const data = new FormData();
    const { name, email, bio } = this.profileForm.value;
    data.append('name', name.trim());
    data.append('email', email);
    data.append('bio', bio ?? '');
    if (this.avatarFile) {
      data.append('avatar', this.avatarFile);
    }

    this.savingProfile = true;
    this.authService.updateProfile(data).subscribe({
      next: () => {
        this.avatarFile = null;
        this.toast.show('Perfil actualizado');
        this.savingProfile = false;
      },
      error: (error) => {
        this.toast.error(errorMessage(error));
        this.savingProfile = false;
      },
    });
  }

  savePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    const data = new FormData();
    data.append('currentPassword', this.passwordForm.value.currentPassword);
    data.append('password', this.passwordForm.value.password);

    this.savingPassword = true;
    this.authService.updateProfile(data).subscribe({
      next: () => {
        this.passwordForm.reset();
        this.toast.show('Contraseña cambiada');
        this.savingPassword = false;
      },
      error: (error) => {
        this.toast.error(errorMessage(error));
        this.savingPassword = false;
      },
    });
  }

  async deleteAccount() {
    const confirmed = await this.modalService.open(DeleteModalComponent, {
      title: '¿Eliminar tu cuenta?',
      message: 'Se borrarán tu perfil, tus recetas, comentarios, valoraciones y publicaciones. No se puede deshacer.',
      action: 'Eliminar mi cuenta',
    });
    if (!confirmed) {
      return;
    }
    try {
      await this.authService.deleteAccount();
      this.toast.show('Tu cuenta se ha eliminado');
    } catch (error) {
      this.toast.error(errorMessage(error));
    }
  }
}
