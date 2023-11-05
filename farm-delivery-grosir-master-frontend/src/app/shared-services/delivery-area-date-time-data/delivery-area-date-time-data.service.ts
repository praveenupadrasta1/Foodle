import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class DeliveryAreaDateTimeDataService {

  sharedData = {
    "city": null,
    "deliveryDate": null,
    "deliveryTime": null,
    "dataConstructed": null
  }
  private messageSource = new BehaviorSubject(this.sharedData);
  currentData = this.messageSource.asObservable();

  constructor() { }

  changeMessage(data){
    this.messageSource.next(data);
  }
}
