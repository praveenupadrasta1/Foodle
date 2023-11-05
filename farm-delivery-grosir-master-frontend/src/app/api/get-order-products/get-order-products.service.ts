import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as config from '../../utils/config';

@Injectable({
  providedIn: 'root'
})
export class GetOrderProductsService {

  constructor(private http: HttpClient) { }

  getOrderProducts(accessToken, orderID){
    let options = {
      headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + accessToken
      })
    }
    let payload = {
      'order_id': orderID
    }
    return this.http.post(config.firebaseApiBaseUrl + '/v1/get-order-products', payload, options)
                    .pipe(map(response => response),
                    catchError(err => {
                      return throwError(err);
                  }));
  }
}
