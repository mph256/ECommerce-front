import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Category } from '../../../shared/models/category.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {

  @Input()
  category!: Category;

  @Output()
  viewCategoryEvent = new EventEmitter<Category>();

  onViewCategory(): void {
    this.viewCategoryEvent.emit(this.category);
  }

}
