import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as config from '../../utils/config';

@Injectable({
  providedIn: 'root'
})
export class DeleteShippingAddressService {

  constructor(private http: HttpClient) { }

  deleteCustomerShippingAddress(accessToken, payload){
    let options = {
      headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + accessToken
      }),
      body: payload
    }
    return this.http.delete(config.firebaseApiBaseUrl + '/v1/shipping-addresses', options)
                    .pipe(map(response => response),
                    catchError(err => {
                      return throwError(err);
                  }));
  }
}
