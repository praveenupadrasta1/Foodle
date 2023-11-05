import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as config from '../../utils/config';

@Injectable({
  providedIn: 'root'
})
export class CreateInvoiceService {

  constructor(private http: HttpClient) { }

  createInvoice(accessToken, payload){
    let options = {
      headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + accessToken
      })
    }
    return this.http.post(config.firebaseApiBaseUrl + '/v1/create-invoice', payload, options)
                  .pipe(map(response => response),
                  catchError(err => {
                    return throwError(err);
                }));
  }
}
