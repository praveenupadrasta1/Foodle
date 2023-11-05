import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class UpdateFeaturedProductsService {

  updatedCategoriesNProductsData: any = {
    'categories': [],
    'featured_products': []
  };
  private messageSource = new BehaviorSubject(this.updatedCategoriesNProductsData);
  currentData = this.messageSource.asObservable();

  constructor() { }

  updateCategoriesNProductsData(updatedCategoriesNProductsData){
    this.messageSource.next(updatedCategoriesNProductsData);
  }
}
