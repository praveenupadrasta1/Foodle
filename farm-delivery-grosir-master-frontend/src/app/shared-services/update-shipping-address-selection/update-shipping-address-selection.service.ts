import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class UpdateShippingAddressSelectionService {

  updatedShippingAddress: any = {};
  private messageSource = new BehaviorSubject(this.updatedShippingAddress);
  currentData = this.messageSource.asObservable();

  constructor() { }

  updateShippingAddress(updatedShippingAddress){
    this.messageSource.next(updatedShippingAddress);
  }
}
