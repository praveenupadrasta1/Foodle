import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as config from '../../utils/config';

@Injectable({
  providedIn: 'root'
})
export class GetShippingAddressesService {

  constructor(private http: HttpClient) { }
  
  getShippingAddresses(accessToken){
    let httpHeaders = { headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Bearer " + accessToken
      })
    }
    return this.http.get(config.firebaseApiBaseUrl + '/v1/shipping-addresses', httpHeaders)
                    .pipe(map(response => response),
                    catchError(err => {
                      return throwError(err);
                  }));
  }
}
