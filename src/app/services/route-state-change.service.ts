import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class RouteStateChangeService {
	private previousUrl: string;
    private currentUrl: string;
	constructor(public router: Router) {
		this.currentUrl = this.router.url;
		router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {  
				this.previousUrl = this.currentUrl;
				this.currentUrl = event.url;      
			};
		});
	}
	getPreviousUrl() {
		return this.previousUrl;
	}
}