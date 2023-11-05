import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as config from '../../utils/config';

@Injectable({
  providedIn: 'root'
})
export class GetBannerService {

  httpHeaders = { headers: new HttpHeaders({
                  "Content-Type": "application/json"
                  })
                }

  constructor(private http: HttpClient) { }

  getBanners(){
    return this.http.get(config.firebaseApiBaseUrl + '/v1/banners/', this.httpHeaders)
                    .pipe(map(response => response),
                    catchError(err => {
                      return throwError(err);
                  }));
  }
}
