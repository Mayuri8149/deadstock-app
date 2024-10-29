import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
@Injectable({
	providedIn: 'root'
})

export class ApiService {
	baseURL: string = environment.baseUrl + '/api/v1';
	baseURL_transaction: string = environment.baseUrl + '/src/v1';
	user;
	getData;
	putData;
	data;
	digilocker;

	constructor(private http: HttpClient,
		private authService: AuthService) {
	}

	post(url, data) {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'x-api-token': this.authService.getAccessToken()
		});
		return this.http.post(this.baseURL + url, data, { headers: headers });
	};
	post1(url, data,headers) {
		
		return this.http.post(this.baseURL + url, data, { headers: headers });
	};
	put_transactions(url, data) {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'x-api-token': this.authService.getAccessToken()
		});
		this.putData = this.http.put(this.baseURL_transaction + url, data, { headers: headers });
		return this.putData;
	}

	post_transactions(url, data) {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'x-api-token': this.authService.getAccessToken()
		});
		return this.http.post(this.baseURL_transaction + url, data, { headers: headers });
	};

	getAsset(url, params) {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'x-api-token': this.authService.getAccessToken()
		});
		this.getData = this.http.get(this.baseURL_transaction + url, { headers: headers, params: params });
		return this.getData;
	}

	get(url, params) {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'x-api-token': this.authService.getAccessToken()
		});
		this.getData = this.http.get(this.baseURL + url, { headers: headers, params: params });
		return this.getData;
	}

	//to call external api
	getExternalURL(url, params) {
		this.getData = this.http.get(url, { params: params });
		return this.getData;
	}

	put(url, data) {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'x-api-token': this.authService.getAccessToken()
		});
		this.putData = this.http.put(this.baseURL + url, data, { headers: headers });
		return this.putData;
	}

	upload(url, data) {
		let header = new HttpHeaders({
			'x-api-token': this.authService.getAccessToken()
		});
		this.getData = this.http.post(this.baseURL + url, data, { headers: header });
		return this.getData;
	}

	postDigilocker(url, data) {
		let headers = new HttpHeaders({
			'Content-Type': "application/x-www-form-urlencoded",
			'x-api-token': this.authService.getAccessToken()
		});
		this.digilocker = this.http.post(this.baseURL + url, data, { headers: headers });
		return this.digilocker;
	}
	proceedTransactions(url, data) {
		let headers = new HttpHeaders({
			'x-api-token': this.authService.getAccessToken()
		});
		return this.http.post(this.baseURL + url, data, { headers: headers });
	};

	uploadToApiGateway1(url, data) {
		this.getData = this.http.post(url, data, {
		  	headers: { 
				'X-Api-Key':environment.agxapikey
			} 
		});
		return this.getData;
	}
}