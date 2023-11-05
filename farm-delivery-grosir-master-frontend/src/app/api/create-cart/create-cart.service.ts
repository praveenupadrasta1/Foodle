import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as config from '../../utils/config';
import * as keys from '../../utils/json-keys';

@Injectable({
  providedIn: 'root'
})
export class CreateCartService {

  constructor(private http: HttpClient) { }

  createCart(accessToken, lineItems, deliveryData){
    let options = {
      headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + accessToken
      })
    }
    let body = {
      [keys.line_items]: lineItems,
      [keys.delivery_data]: deliveryData
    }
    return this.http.post(config.firebaseApiBaseUrl + '/v1/create-cart', body, options)
                  .pipe(map(response => response),
                  catchError(err => {
                    return throwError(err);
                }));
  }
}
