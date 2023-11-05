import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as config from '../../utils/config';

@Injectable({
  providedIn: 'root'
})
export class UpdateShippingAddressService {

  constructor(private http: HttpClient) { }

  updateShippingAddress(accessToken, payload){
    let httpHeaders = { headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Bearer " + accessToken
      })
    }
    return this.http.put(config.firebaseApiBaseUrl + '/v1/shipping-addresses', payload, httpHeaders)
                    .pipe(map(response => response),
                    catchError(err => {
                      return throwError(err);
                  }));
  }
}
