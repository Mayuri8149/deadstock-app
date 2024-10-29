import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root'
})
export class CategoryService {
	baseURL: string = environment.baseUrl + '/api/v1';
	constructor(private http: HttpClient, private authService: AuthService) { }

	addCategories(url, data) {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'x-api-token': this.authService.getAccessToken()
		});
		return this.http.post(this.baseURL + url, { categories: data }, { headers: headers });
	};


	getCategories(size, page, searchString) {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'x-api-token': this.authService.getAccessToken()
		});
		return this.http.get(this.baseURL + '/' + 'categories' + '/' + 'list' + '/' + page + '/' + size + '?' + 'search=' + searchString,{ headers: headers })
			.pipe(
				map((result: any) => {
					return result;
				})
			)
	}

	deleteCategories(catId) {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'x-api-token': this.authService.getAccessToken()
		});
		return this.http.delete(this.baseURL + '/' + 'categories' + '/' + 'delete' + '/' + catId,{ headers: headers })
			.pipe(
				map((result: any) => {
					return result;
				})
			)
	}

	addSubCategories(url, data) {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'x-api-token': this.authService.getAccessToken()
		});
		return this.http.post(this.baseURL + url, data, { headers: headers });
	};

	getSubCategories(category, size, page, searchString) {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'x-api-token': this.authService.getAccessToken()
		});
		return this.http.get(this.baseURL + '/' + 'subcategories' + '/' + 'list' + '/' + category + '/' + page + '/' + size + '?' + 'search=' + searchString,{ headers: headers })
			.pipe(
				map((result: any) => {
					return result;
				})
			)
	}

	deleteSubCategories(subCatId) {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'x-api-token': this.authService.getAccessToken()
		});
		return this.http.delete(this.baseURL + '/' + 'subcategories' + '/' + 'delete' + '/' + subCatId,{ headers: headers })
			.pipe(
				map((result: any) => {
					return result;
				})
			)
	}

	addSubSubCategories(url, data) {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'x-api-token': this.authService.getAccessToken()
		});
		return this.http.post(this.baseURL + url, data, { headers: headers });
	};

	getSubSubCategories(sub_category, size, page, searchString) {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'x-api-token': this.authService.getAccessToken()
		});
		return this.http.get(this.baseURL + '/' + 'subsubcategories' + '/' + 'list' + '/' + sub_category + '/' + page + '/' + size + '?' + 'search=' + searchString,{ headers: headers })
			.pipe(
				map((result: any) => {
					return result;
				})
			)
	}

	deleteSuSubCategories(subSubCatId) {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'x-api-token': this.authService.getAccessToken()
		});
		return this.http.delete(this.baseURL + '/' + 'subsubcategories' + '/' + 'delete' + '/' + subSubCatId,{ headers: headers })
			.pipe(
				map((result: any) => {
					return result;
				})
			)
	}

	searchCategories(data,size,page) {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'x-api-token': this.authService.getAccessToken()
		});
		return this.http.post(this.baseURL + '/' + 'categories' + '/' + 'search_categories' + '/' + page + '/' + size, data, { headers: headers });
	};
}