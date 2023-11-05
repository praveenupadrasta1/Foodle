import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as config from '../../utils/config';

@Injectable({
  providedIn: 'root'
})
export class GetCategoriesService {

  options = {
    headers: new HttpHeaders({
    "Content-Type": "application/json",
    "Accept": "application/json",
    })
  }

  constructor(private http: HttpClient) { }

  getCategories(){
    return this.http.get(config.firebaseApiBaseUrl + '/v1/categories', this.options)
                    .pipe(map(response => response),
                    catchError(err => {
                      return throwError(err);
                  }));
  }
}
