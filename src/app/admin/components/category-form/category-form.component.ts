import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

import { Observable } from 'rxjs';

import { CategoryService } from '../../../shared/services/category/category.service';

import { Category } from '../../../shared/models/category.model';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent {

  @Input()
  formType!: 'add' | 'update' | 'delete';

  categoryForm!: FormGroup;

  nameCtrl!: FormControl;

  categories$!: Observable<Category[]>;

  loading = false;

  message!: string;

  constructor(private formBuilder: FormBuilder, private categoryService: CategoryService) { }

  ngOnInit(): void {

    this.initForm();

    if('update' === this.formType || 'delete' === this.formType)
      this.categories$ = this.categoryService.categories$;

  }

  initForm(): void {

    if('add' === this.formType || 'update' === this.formType)
      this.nameCtrl = this.formBuilder.control(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);

    switch(this.formType) {

      case 'add': {
        this.categoryForm = this.formBuilder.group({
          name: this.nameCtrl,
          image: [null, Validators.required]
        });
        break;
      }

      case 'update': {
        this.categoryForm = this.formBuilder.group({
          category: [null, Validators.required],
          name: this.nameCtrl,
          image: [null, Validators.required]
        });
        break;
      }

      case 'delete': {
        this.categoryForm = this.formBuilder.group({
          category: [null, Validators.required]
        });
        break;
      }

    }

  }

  getFormControlErrorText(ctrl: AbstractControl): string {

    if(ctrl.hasError('required'))
      return 'This field is required';
    else if(ctrl.hasError('minlength') || ctrl.hasError('maxlength'))
      return 'Your name must be between 3 and 50 characters long';
    else
      return 'This field contains an error';

  }

  onCategoryChange(category: Category): void {

    this.categoryForm.patchValue({
      name: category.name,
      image: category.image
    });

  }

  onFileChange(event: Event): void {

    if(event.target) {

      const target = event.target as HTMLInputElement;

      if(target.files) {

        const file = target.files[0];

        this.categoryForm.patchValue({
          image: file
        });

      }

    }

  }

  onSubmit(): void {

    this.loading = true;

    if('add' === this.formType)
      this.categoryService.addCategory(this.categoryForm.value.name, this.categoryForm.value.image);
    else if('update' === this.formType)
      this.categoryService.updateCategory(this.categoryForm.value.category, this.categoryForm.value.name, this.categoryForm.value.image);
    else
      this.categoryService.deleteCategory(this.categoryForm.value.category);

    this.categoryForm.reset();

    this.message = 'Operation completed';

    setTimeout(() => { 
      this.message = '';
    }, 5000);

    this.loading = false;

  }

}
