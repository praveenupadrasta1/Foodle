import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class BroadcastNewShippingAddressService {

  newAddedShippingAddress: any = null;
  private messageSource = new BehaviorSubject(this.newAddedShippingAddress);
  currentData = this.messageSource.asObservable();

  constructor() { }

  changeMessage(data){
    this.messageSource.next(data);
  }
}
