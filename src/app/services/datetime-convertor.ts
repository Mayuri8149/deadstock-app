import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';
import { AuthService } from './auth.service';
@Injectable({
	providedIn: 'root'
})

export class DatetimeConvertor {
    sessionTimeZoneValue: any;
    convertedDateTime: string;

	constructor(private http: HttpClient,
		private authService: AuthService) {
	}
	convertDateTimeZone(currentDate, type) {
        if(currentDate == undefined || currentDate =='' || currentDate == null){
            this.convertedDateTime="";
        }else{
            const convertedCreatedDate=moment(currentDate);								
            this.sessionTimeZoneValue =  JSON.parse(sessionStorage.getItem('user'));
            this.sessionTimeZoneValue = this.sessionTimeZoneValue.timeZone;		
            if(type =="datetime"){
                this.convertedDateTime = convertedCreatedDate.tz(this.sessionTimeZoneValue).format('DD/MM/YYYY hh:mm:ss A');
            }else{
                this.convertedDateTime = convertedCreatedDate.tz(this.sessionTimeZoneValue).format('DD/MM/YYYY');
            }						
        }        
        return this.convertedDateTime;
	}
}