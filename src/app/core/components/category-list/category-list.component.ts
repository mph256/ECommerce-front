import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PageEvent } from '@angular/material/paginator';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CategoryService } from '../../../shared/services/category/category.service';

import { Category } from '../../../shared/models/category.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  categories$!: Observable<Category[]>;

  categoriesToShow!: Category[];

  categoriesPerPage = 15;

  cols = 5;

  constructor(private router: Router, private categoryService: CategoryService) { }

  ngOnInit(): void {

    this.categories$ = this.categoryService.categories$.pipe(
      tap(categories => this.categoriesToShow = categories.slice(0, this.categoriesPerPage))
    );

    this.resize(window.innerWidth);

  }

  resize(innerWidth: number): void {

    if(innerWidth > 1774)
      this.cols = 5;
  
    if(innerWidth <= 1774)
      this.cols = 4;

    if(innerWidth <= 1435)
      this.cols = 3;

    if(innerWidth <= 1096)
      this.cols = 2;

    if(innerWidth <= 757)
      this.cols = 1;
  
  }

  onViewCategory(category: Category): void {
    this.router.navigateByUrl(`/categories/${category.name.toLowerCase()}/products`);
  }

  onResize(event: any) {
    this.resize(event.target.innerWidth);
  }

  onPage(event: PageEvent, categories: Category[]): void {
    this.categoriesToShow = categories.slice(event.pageIndex * event.pageSize, (event.pageIndex + 1) * event.pageSize);
  }

}
