import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as config from '../../utils/config';

@Injectable({
  providedIn: 'root'
})
export class GetAreasDateTimeService {

  constructor(private http: HttpClient) { }

  getDeliveryAreasDateTime(){
    let httpHeaders = { headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Accept": "application/json"
      })
    }
    return this.http.get(config.firebaseApiBaseUrl + '/v1/city/get_cities', httpHeaders)
                    .pipe(map(response => response),
                    catchError(err => {
                      return throwError(err);
                  }));
  }
}
