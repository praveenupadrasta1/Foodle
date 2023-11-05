import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as config from '../../utils/config';

@Injectable({
  providedIn: 'root'
})
export class ProductsVariantsService {

  options = {
    headers: new HttpHeaders({
    "Content-Type": "application/json",
    "Accept": "application/json",
    })
  }

  constructor(private http: HttpClient) { }

  getProductsVariants(products_id){
   let body = {
      "products_id": products_id
    }
    return this.http.post(config.firebaseApiBaseUrl + '/v1/products/variants', body, this.options)
                    .pipe(map(response => response),
                    catchError(err => {
                      return throwError(err);
                  }));
  }
}
