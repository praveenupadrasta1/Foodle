import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as config from '../../utils/config';

@Injectable({
  providedIn: 'root'
})
export class ProductsSubsetService {

  options = {
    headers: new HttpHeaders({
    "Content-Type": "application/json",
    "Accept": "application/json",
    })
  }

  constructor(private http: HttpClient) { }

  getProductsSubset(productsID){
   let body = {
      "products_id": productsID
    }
    return this.http.post(config.firebaseApiBaseUrl + '/v1/products-subset', body, this.options)
                    .pipe(map(response => response),
                    catchError(err => {
                      return throwError(err);
                  }));
  }
}
