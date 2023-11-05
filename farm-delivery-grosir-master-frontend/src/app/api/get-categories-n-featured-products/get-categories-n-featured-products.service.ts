import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as config from '../../utils/config';

@Injectable({
  providedIn: 'root'
})
export class GetCategoriesNFeaturedProductsService {

  options = {
    headers: new HttpHeaders({
    "Content-Type": "application/json",
    "Accept": "application/json",
    })
  }

  constructor(private http: HttpClient) { }

  getCategoriesNFeaturedProducts(){
    return this.http.get(config.firebaseApiBaseUrl + '/v1/categories-n-fp', this.options)
                    .pipe(map(response => response),
                    catchError(err => {
                      return throwError(err);
                  }));
  }
}
