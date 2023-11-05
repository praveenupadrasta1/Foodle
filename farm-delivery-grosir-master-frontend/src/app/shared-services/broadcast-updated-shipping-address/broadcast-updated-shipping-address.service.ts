import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class BroadcastUpdatedShippingAddressService {

  updatedAddedShippingAddress: any = null;
  private messageSource = new BehaviorSubject(this.updatedAddedShippingAddress);
  currentData = this.messageSource.asObservable();

  constructor() { }

  changeMessage(data){
    this.messageSource.next(data);
  }
}
