import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root'
})
export class DataService {
	baseURL: string = environment.baseUrl + '/api/v1';
	affiliateId: String;
	getData;

	constructor(public http: HttpClient , private authService: AuthService) { }

	setAffiliate(affiliateId) {
		localStorage.setItem("affiliateId", JSON.stringify(affiliateId));
	}

	setBatch(batchId) {
		localStorage.setItem("batchId", JSON.stringify(batchId));
	}

	setTransType(transtypeId) {
		localStorage.setItem("transtypeId", JSON.stringify(transtypeId));
	}

	getAffiliate() {
		return JSON.parse(localStorage.getItem('affiliateId'));
	};

	getBatch() {
		return JSON.parse(localStorage.getItem('batchId'));
	};

	getLoginHistory(){
		var user = JSON.parse(sessionStorage.getItem('user'));
		if( user && user._id){
			var user_id = user._id;
			return user_id;
		}
		return false;
	}
	get(url, params) {
		 let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'x-api-token': this.authService.getAccessToken()
		});
		this.getData = this.http.get(this.baseURL + url, { headers: headers, params: params});
		return this.getData;
	}

	public removeIds() {
		localStorage.removeItem('ids');
	}
}