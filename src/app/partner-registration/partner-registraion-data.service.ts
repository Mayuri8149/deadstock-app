import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';

@Injectable({
  	providedIn: 'root'
})
export class PartnerRegistraionDataService {

	url;
	constructor(public apiService: ApiService) { }

	getCorporateById(id) {
		this.url = "/corporate/" + id;
		var params = new HttpParams();
		return this.apiService.get(this.url, params);
	}
}
