import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Recipe } from '../../../../../interfaces/recipes';
import { errorMessage } from '../../../../../services/error-message';
import { PostsService } from '../../../../../services/posts.service';
import { RecipesService } from '../../../../../services/recipes.service';

@Component({
  selector: 'app-post-form-modal',
  templateUrl: './post-form-modal.component.html',
})
export class PostFormModalComponent implements OnInit, OnDestroy {
  // Al publicar desde una receta, el enlace ya viene decidido
  @Input() fixedRecipe: { id: string; title: string } | null = null;
  confirm!: (result?: unknown) => void;
  close!: () => void;

  form: FormGroup;
  recipes: Recipe[] = [];
  file: File | null = null;
  preview: string | null = null;
  error = '';
  fileError = '';
  sending = false;
  submitted = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly postsService: PostsService,
    private readonly recipesService: RecipesService,
  ) {
    this.form = this.fb.group({
      caption: ['', [Validators.required, Validators.maxLength(500)]],
      recipeId: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.fixedRecipe) {
      this.form.patchValue({ recipeId: this.fixedRecipe.id });
      return;
    }
    this.recipesService.getAll().subscribe((recipes) => {
      this.recipes = [...recipes].sort((a, b) => a.title.localeCompare(b.title, 'es'));
    });
  }

  ngOnDestroy() {
    if (this.preview) {
      URL.revokeObjectURL(this.preview);
    }
  }

  onFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }
    this.fileError = '';
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      this.fileError = 'Solo se admiten imágenes JPG, PNG, WebP o GIF.';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.fileError = 'La imagen no puede superar los 5 MB.';
      return;
    }
    if (this.preview) {
      URL.revokeObjectURL(this.preview);
    }
    this.file = file;
    this.preview = URL.createObjectURL(file);
  }

  submit() {
    this.submitted = true;
    this.form.markAllAsTouched();
    if (this.form.invalid || !this.file || !this.form.value.caption.trim()) {
      return;
    }

    const data = new FormData();
    data.append('caption', this.form.value.caption.trim());
    data.append('recipeId', this.form.value.recipeId);
    data.append('image', this.file);

    this.sending = true;
    this.error = '';
    this.postsService.create(data).subscribe({
      next: (post) => this.confirm(post),
      error: (error) => {
        this.error = errorMessage(error);
        this.sending = false;
      },
    });
  }
}
