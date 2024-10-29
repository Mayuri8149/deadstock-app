import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
	isSidebar: boolean = false;
	isUserLoggedIn: boolean = false;
	stateRoute: string;

	ngOnInit() {
	}
	
}