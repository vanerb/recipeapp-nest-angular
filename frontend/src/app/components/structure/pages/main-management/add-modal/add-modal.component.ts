import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddIngredients } from '../../../../../interfaces/ingredients';
import { AddPreparations } from '../../../../../interfaces/preparations';
import { AddHashtags } from '../../../../../interfaces/hashtags';
import { RecipesService } from '../../../../../services/recipes.service';
import { CreateRecipe } from '../../../../../interfaces/recipes';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrl: './add-modal.component.css'
})
export class AddModalComponent {
  form: FormGroup
  ingredients: AddIngredients[] = []
  preparations: AddPreparations[] = []
  hashtags: AddHashtags[] = []
  selectedRecipeImages: File[] = []
  @ViewChild('hashtagInput') hashtagInput!: ElementRef<HTMLInputElement>;
  @ViewChild('preparationInput') preparationInput!: ElementRef<HTMLInputElement>;
  @ViewChild('ingredientsInput') ingredientsnInput!: ElementRef<HTMLInputElement>;


  constructor(private fb: FormBuilder, private readonly recipesService: RecipesService) {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
    });
  }

  add(type: string) {
    if (type === 'ingredients') {
      const input = this.ingredientsnInput.nativeElement;
      const valor = input.value.trim();
      if (valor) {
        this.ingredients.push({ ingredient: valor });
      }
      input.value = '';
    } else if (type === 'preparations') {
      const input = this.preparationInput.nativeElement;
      const valor = input.value.trim();
      if (valor) {
        this.preparations.push({ preparation: valor });
      }
       input.value = '';
    } else if (type === 'hashtags') {
      const input = this.hashtagInput.nativeElement;
      const valor = input.value.trim();
      if (valor) {
        this.hashtags.push({ hashtag: valor });
      }
       input.value = '';
    }

  }



  create() {
    //const command: CreateRecipe = {
    //  title: string;
    //  description: string;
    //   hashtags: AddHashtags[];
    //   ingredients: AddIngredients[];
    //   preparations: AddPreparations[];
    //    userId: string;
    //   categoryId: string;
    //   images: File;
    //  }
    // this.recipesService.create(command)

  }

  onFileRecipeSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const newFiles = Array.from(target.files);

      // Filtra duplicados (evita archivos con el mismo nombre que ya estén en el array)
      const uniqueNewFiles = newFiles.filter(
        file => !this.selectedRecipeImages.some(f => f.name === file.name)
      );

      // Inserta las nuevas imágenes DESPUÉS de la portada (si existe)
      if (this.selectedRecipeImages.length > 0) {
        const [first, ...rest] = this.selectedRecipeImages;
        this.selectedRecipeImages = [first, ...rest, ...uniqueNewFiles];
      } else {
        this.selectedRecipeImages = [...uniqueNewFiles];
      }
    }
  }

  onFilePrincipalSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const principalFile = target.files[0];

      // Elimina si ya existía ese archivo
      this.selectedRecipeImages = this.selectedRecipeImages.filter(
        file => file.name !== principalFile.name
      );

      // Elimina cualquier otra imagen que esté en la posición 0 (si asumimos que la portada va ahí)
      this.selectedRecipeImages = this.selectedRecipeImages.filter(
        (file, index) => index !== 0
      );

      // Inserta la imagen principal en la primera posición
      this.selectedRecipeImages.unshift(principalFile);
    }
  }
}
