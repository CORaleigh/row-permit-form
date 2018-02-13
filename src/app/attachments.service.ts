import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AttachmentsService {

  constructor(public http: HttpClient) { }

  attachFile(url, file) {
    debugger;
    return new Promise(resolve => {
   // let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded' );
    let formData: FormData = new FormData();
    formData.append('f', 'json');
    formData.append('attachment', file);
    // let params = new HttpParams()
    //   .set('f', 'json')
    //   .set('attachment', file);
      this.http.post<any>(url, formData)
        .subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

}
