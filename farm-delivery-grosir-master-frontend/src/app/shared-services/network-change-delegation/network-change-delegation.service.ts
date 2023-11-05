import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class NetworkChangeDelegationService {

  isOnline = true;
  private messageSource = new BehaviorSubject(this.isOnline);
  currentData = this.messageSource.asObservable();

  constructor() { }

  updateNetworkStatus(isOnline: boolean){
    this.messageSource.next(isOnline);
  }
}
