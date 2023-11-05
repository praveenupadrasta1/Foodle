import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class UpdateProductQuantityService {

  updatedQtyData: any = {};
  private messageSource = new BehaviorSubject(this.updatedQtyData);
  currentData = this.messageSource.asObservable();

  constructor() { }

  updateQuantity(updatedQtyData){
    this.messageSource.next(updatedQtyData);
  }
}
