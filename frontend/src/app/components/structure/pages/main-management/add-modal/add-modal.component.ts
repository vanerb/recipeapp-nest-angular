import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild,} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AddIngredients} from '../../../../../interfaces/ingredients';
import {AddPreparations} from '../../../../../interfaces/preparations';
import {AddHashtags} from '../../../../../interfaces/hashtags';
import {RecipesService} from '../../../../../services/recipes.service';
import {ModalService} from '../../../../../services/modal.service';
import {UsersService} from '../../../../../services/users.service';
import {AuthService} from '../../../../../services/auth.service';
import {Category} from '../../../../../interfaces/categories';
import {CategoriesService} from '../../../../../services/categories.service';
import {firstValueFrom} from "rxjs";
import {UtilitiesService} from "../../../../../services/utilities.service";
import {WarningModalComponent} from "../../../utilities/warning-modal/warning-modal.component";
import {User} from "../../../../../interfaces/users";

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrl: './add-modal.component.css',
})
export class AddModalComponent implements OnInit, OnDestroy {
  @Input() user: User | any
  form: FormGroup;
  ingredients: AddIngredients[] = [];
  preparations: AddPreparations[] = [];
  hashtags: AddHashtags[] = [];
  selectedRecipeImages: File[] = [];
  categories: Category[] = [];
  @ViewChild('hashtagInput') hashtagInput!: ElementRef<HTMLInputElement>;
  @ViewChild('preparationInput')
  preparationInput!: ElementRef<HTMLInputElement>;
  @ViewChild('ingredientsInput')
  ingredientsnInput!: ElementRef<HTMLInputElement>;
  confirm!: (result?: any) => void;
  close!: () => void;

  constructor(
    private fb: FormBuilder,
    private readonly recipesService: RecipesService,
    private readonly modalService: ModalService,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly categoryService: CategoriesService,
    private readonly utilitiesService: UtilitiesService
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      userId: ['', [Validators.required]],
      category: ['', [Validators.required]],
      hashtags: this.fb.control([], [this.utilitiesService.emptyArray]),
      ingredients: this.fb.control([], [this.utilitiesService.emptyArray]),
      preparations: this.fb.control([], [this.utilitiesService.emptyArray]),
      images: this.fb.control([], [this.utilitiesService.emptyArray]),
    });
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    console.log("USERRR", this.user)
    this.categoryService.getByUserId(this.user.id).subscribe((el) => {
      this.categories = el;
    });

    this.form.get('userId')?.setValue(this.user.id)
  }

  add(type: string) {
    if (type === 'ingredients') {
      const input = this.ingredientsnInput.nativeElement;
      const valor = input.value.trim();

      console.log(input)
      if (valor) {
        this.ingredients.push({ingredient: valor});
        this.form.get('ingredients')?.setValue(this.ingredients);
      }
      input.value = '';
    } else if (type === 'preparations') {
      const input = this.preparationInput.nativeElement;
      const valor = input.value.trim();
      if (valor) {
        this.preparations.push({preparation: valor});
        this.form.get('preparations')?.setValue(this.preparations);
      }
      input.value = '';
    } else if (type === 'hashtags') {
      const input = this.hashtagInput.nativeElement;
      const valor = input.value.trim();
      if (valor) {
        this.hashtags.push({hashtag: valor});
        this.form.get('hashtags')?.setValue(this.hashtags);
      }
      input.value = '';
    }
  }

  delete(pos: number, type: string) {
    if (type === 'ingredients') {
      this.ingredients.splice(pos, 1);
      this.form.get('ingredients')?.setValue(this.ingredients);

    } else if (type === 'preparations') {
      this.preparations.splice(pos, 1);
      this.form.get('preparations')?.setValue(this.preparations);

    } else if (type === 'hashtags') {
      this.hashtags.splice(pos, 1);
      this.form.get('hashtags')?.setValue(this.hashtags);
    } else if (type === 'images') {
      this.selectedRecipeImages.splice(pos, 1)
      this.form.get('images')?.setValue(this.selectedRecipeImages);
    }
  }


  async create() {
    if (!this.form.valid) {
      this.modalService.open(WarningModalComponent, {
          width: '450px',
        },
        {
          title: "Aviso",
          message: "Hay errores en el formulario, reviselo."
        }).then(async () => {

      })

      console.log(this.form)
      return
    }


    const formData = new FormData();
    const value = this.form.value;

    formData.append('title', value.title);
    formData.append('description', value.description);
    formData.append('userId', value.userId);
    formData.append('category', value.category);

    formData.append('hashtags', JSON.stringify(value.hashtags));
    formData.append('ingredients', JSON.stringify(value.ingredients));
    formData.append('preparations', JSON.stringify(value.preparations));

    for (const file of value.images) {
      formData.append('images', file);
    }

    this.recipesService.create(formData).subscribe({
      next: (recipe) => {
        this.confirm('add')
      },
      error: (err) => {
        console.error(err)
      }
    });
    ;

  }

  onFileRecipeSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const newFiles = Array.from(target.files);

      // Filtra duplicados (evita archivos con el mismo nombre que ya estén en el array)
      const uniqueNewFiles = newFiles.filter(
        (file) => !this.selectedRecipeImages.some((f) => f.name === file.name)
      );

      // Inserta las nuevas imágenes DESPUÉS de la portada (si existe)
      if (this.selectedRecipeImages.length > 0) {
        const [first, ...rest] = this.selectedRecipeImages;
        this.selectedRecipeImages = [first, ...rest, ...uniqueNewFiles];
      } else {
        this.selectedRecipeImages = [...uniqueNewFiles];
      }
    }

    this.form.get('images')?.setValue(this.selectedRecipeImages)
  }
}
