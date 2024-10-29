import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';

@Injectable({
  	providedIn: 'root'
})
export class OrganizationDataService {

	url;
	constructor(public apiService: ApiService) { }

	getOrganizationById(id) {
		this.url = "/organization/OrgDetails/" + id;
		var params = new HttpParams();
		return this.apiService.get(this.url, params);
	} 
}
