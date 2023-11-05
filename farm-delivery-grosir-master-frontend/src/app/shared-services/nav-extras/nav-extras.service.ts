import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class NavExtrasService {

  extras: any = null;
  private messageSource = new BehaviorSubject(this.extras);
  getExtras = this.messageSource.asObservable();

  constructor() { }

  public setExtras(data){
    this.messageSource.next(data);
  }
}
