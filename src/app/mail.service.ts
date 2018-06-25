import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(public http: HttpClient) { }
  sendMail(oid, attributes) {
    debugger;
    return new Promise(resolve => {
   // let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded' );
    let company = attributes.COMPANY_NAME;
    if (company === 'Other') {
      company = attributes.COMPANY_OTHER;
    }

    let worktype = attributes.WORK_TYPE;
    if (worktype === 'Other') {
      worktype = attributes.WORK_TYPE_OTHER;
    }
    let address = attributes.ADDRESS;
    let message = "A right-of-way permit has been submitted by " + company + " requesting to perform " + worktype + " at " + address + ".  Permit can be viewed and approved here: https://ral.maps.arcgis.com/apps/webappviewer/index.html?id=2afdc9aa67934314842da1223263dfe0&query=Right_of_Way_Permit_Approval_8756%2COBJECTID%2C" + oid 
    let formData: FormData = new FormData();
    formData.append('fromEmail', 'RightofWayServices@raleighnc.gov');
    formData.append('toEmail', 'gis@raleighnc.gov,RightofWayServices@raleighnc.gov');
    formData.append('message', message);
    formData.append('subject', 'Right-of-Way Permit Request Submitted');

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
