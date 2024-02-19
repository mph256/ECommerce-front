import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

import { Observable } from 'rxjs';

import { AuthService } from '../../../shared/services/auth/auth.service';
import { ProductService } from '../../services/product/product.service';
import { CategoryService } from '../../../shared/services/category/category.service';

import { Product } from '../../../shared/models/product.model';
import { Category } from '../../../shared/models/category.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  @Input()
  formType!: 'add' | 'update' | 'delete';

  productForm!: FormGroup;

  nameCtrl!: FormControl;
  descriptionCtrl!: FormControl;
  dimensionsCtrl!: FormControl;
  weightCtrl!: FormControl;
  countryOfOriginCtrl!: FormControl;
  manufacturerCtrl!: FormControl;
  quantityAvailableCtrl!: FormControl;
  priceCtrl!: FormControl;
  
  products$!: Observable<Product[]>;
  categories$!: Observable<Category[]>;

  loading = false;

  message!: string;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private productService: ProductService, private categoryService: CategoryService) { }

  ngOnInit(): void {

    this.initForm();

    if('update' === this.formType || 'delete' === this.formType) {

      this.productService.getProductsBySellerUsername(this.authService.getUserUsername());
      this.products$ = this.productService.products$;

    }

    if('add' === this.formType || 'update' === this.formType)
      this.categories$ = this.categoryService.categories$;

  }

  initForm(): void {

    if('add' === this.formType || 'update' === this.formType)  {

      this.nameCtrl = this.formBuilder.control(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
      this.descriptionCtrl = this.formBuilder.control(null, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]);
      this.dimensionsCtrl = this.formBuilder.control(null, [Validators.minLength(3), Validators.maxLength(100)]);
      this.weightCtrl = this.formBuilder.control(null, [Validators.pattern('^[0-9]*$'), Validators.min(1)]);
      this.countryOfOriginCtrl = this.formBuilder.control(null, [Validators.required, Validators.minLength(3), Validators.maxLength(52)]);
      this.manufacturerCtrl = this.formBuilder.control(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
      this.quantityAvailableCtrl = this.formBuilder.control(null, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1)]);
      this.priceCtrl = this.formBuilder.control(null, [Validators.required, Validators.pattern('^[0-9]*(\.[0-9]{0,2})?$'), Validators.min(1)]);

    }

    switch(this.formType) {

      case 'add': {
        this.productForm = this.formBuilder.group({
          name: this.nameCtrl,
          description: this.descriptionCtrl,
          dimensions: this.dimensionsCtrl,
          weight: this.weightCtrl,
          countryOfOrigin: this.countryOfOriginCtrl,
          manufacturer: this.manufacturerCtrl,
          quantityAvailable: this.quantityAvailableCtrl,
          price: this.priceCtrl,
          images: [[], Validators.required],
          categories: [[], Validators.required]
        });     
        break;
      }

      case 'update': {
        this.productForm = this.formBuilder.group({
          product: [null, Validators.required],
          name: this.nameCtrl,
          description: this.descriptionCtrl,
          dimensions: this.dimensionsCtrl,
          weight: this.weightCtrl,
          countryOfOrigin: this.countryOfOriginCtrl,
          manufacturer: this.manufacturerCtrl,
          quantityAvailable: this.quantityAvailableCtrl,
          price: this.priceCtrl,
          images: [[], Validators.required],
          categories: [[], Validators.required]
        });
        break;
      }

      case 'delete': {
        this.productForm = this.formBuilder.group({
          product: [null, Validators.required],
        });
        break;
      }

    }

  }

  getFormControlName(control: AbstractControl): string | null {
    return Object.entries(control.parent?.controls ?? []).find(([_, value]) => value === control)?.[0] ?? null;
  }

  getFormControlErrorText(ctrl: AbstractControl): string {

    if(ctrl.hasError('required'))
      return 'This field is required';
    else if(ctrl.hasError('pattern')) {

      if('weight' === this.getFormControlName(ctrl))
        return 'Your weight is invalid';
      else if('quantity' === this.getFormControlName(ctrl))
        return 'Your quantity is invalid';
      else
        return 'Your price is invalid';

    } else if(ctrl.hasError('minlength') || ctrl.hasError('maxlength')) {

      if('name' === this.getFormControlName(ctrl))
        return 'Your name must be between 3 and 50 characters long';
      else if('description' === this.getFormControlName(ctrl))
        return 'Your description must be between 3 and 255 characters long';
      else if('dimensions' === this.getFormControlName(ctrl))
        return 'Your dimensions must be between 3 and 100 characters long';
      else if('countryOfOrigin' === this.getFormControlName(ctrl))
        return 'Your country must be between 3 and 52 characters long';
      else
        return 'Your manufacturer must be between 3 and 50 characters long';

    } else if(ctrl.hasError('min')) {

      if('weight' === this.getFormControlName(ctrl))
        return 'Your weight must be greater than 0';
      else if('quantity' === this.getFormControlName(ctrl))
        return 'Your quantity must be greater than 0';
      else
        return 'Your price must be greater than 0';

    } else
      return 'This field contains an error';

  }

  public blobToFile = (blob: Blob, fileName: string): File => {

    return new File(
      [blob as any],
      fileName + '.jpeg',
      {
        lastModified: new Date().getTime(),
        type: 'image/jpeg'
      }
    );

  }

  resetFiles(): void {
    this.productForm.patchValue({
      images: []
    });
  }

  onProductChange(product: Product): void {

    const images: File[] = [];
    const categories: number[] = [];

    product.images.forEach(image => images.push(this.blobToFile(image.file, image.id as unknown as string)));
    product.categories.forEach(category => categories.push(category.id));

    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      dimensions: product.dimensions,
      weight: product.weight?product.weight:null,
      countryOfOrigin: product.countryOfOrigin,
      manufacturer: product.manufacturer,
      quantityAvailable: product.quantityAvailable,
      price: product.price,
      images: images,
      categories: categories
    });

  }

  onFileChange(event: Event): void {

    if(event.target) {

      const target = event.target as HTMLInputElement;

      if(target.files) {

        const file = target.files[0];
        const images: File[] = this.productForm.value.images;

        images.push(file);

        this.productForm.patchValue({
          images: images
        });

      }

    }

  }

  onResetFiles(): void {
    this.resetFiles();
  }

  onSubmit(): void {

    this.loading = true;

    if('add' === this.formType)
      this.productService.addProduct(this.productForm.value.name, this.productForm.value.description,
        this.productForm.value.dimensions, this.productForm.value.weight, 
        this.productForm.value.countryOfOrigin, this.productForm.value.manufacturer,
        this.productForm.value.quantityAvailable, this.productForm.value.price, 
        this.authService.getUserUsername(), this.productForm.value.images, this.productForm.value.categories
      );
    else if('update' === this.formType)
      this.productService.updateProduct(this.productForm.value.product, this.productForm.value.name, this.productForm.value.description,
        this.productForm.value.dimensions, this.productForm.value.weight, 
        this.productForm.value.countryOfOrigin, this.productForm.value.manufacturer,
        this.productForm.value.quantityAvailable, this.productForm.value.price, 
        this.authService.getUserUsername(), this.productForm.value.images, this.productForm.value.categories
      );
    else
      this.productService.deleteProduct(this.productForm.value.product);

    this.productForm.reset();
    this.resetFiles();

    this.message = 'Operation completed';

    setTimeout(() => { 
      this.message = '';
    }, 5000);

    this.loading = false;

  }

}
