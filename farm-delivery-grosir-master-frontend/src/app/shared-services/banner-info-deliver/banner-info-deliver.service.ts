import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class BannerInfoDeliverService {

  bannerData: any = null;
  private messageSource = new BehaviorSubject(this.bannerData);
  getExtras = this.messageSource.asObservable();

  constructor() { }

  public setExtras(bannerData){
    this.messageSource.next(bannerData);
  }
}
