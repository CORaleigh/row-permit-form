import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(public http: HttpClient) { }
  sendMail(oid) {
    debugger;
    return new Promise(resolve => {
   // let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded' );
    let formData: FormData = new FormData();
    formData.append('fromEmail', 'gis@raleighnc.gov');
    formData.append('toEmail', 'gis@raleighnc.gov');
    formData.append('message', "<a href='https://ral.maps.arcgis.com/apps/webappviewer/index.html?id=2afdc9aa67934314842da1223263dfe0&query=Right_of_Way_Permit_Approval_8756%2COBJECTID%2C" + oid +"'>Review Permit Request</a>");
    formData.append('subject', 'Row permit request submitted');

    // let params = new HttpParams()
    //   .set('f', 'json')
    //   .set('attachment', file);
      this.http.post<any>('https://maps.raleighnc.gov/php/mail.php', formData)
        .subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }  
}
