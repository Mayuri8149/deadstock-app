import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';

@Injectable({
  	providedIn: 'root'
})
export class UserDataService {
	url;
	constructor(public apiService: ApiService) { }
	getUserById(id) {
		this.url = "/user/" + id;
		var params = new HttpParams();

		return this.apiService.get(this.url, params);
	} 
}