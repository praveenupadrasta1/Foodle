import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class UpdateProductDataService {

  updatedProductData: any = [];
  private messageSource = new BehaviorSubject(this.updatedProductData);
  currentData = this.messageSource.asObservable();

  constructor() { }

  updateProductData(updatedProductData){
    this.messageSource.next(updatedProductData);
  }
}
