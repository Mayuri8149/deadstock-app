import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-page-not-found',
	templateUrl: './page-not-found.component.html',
	styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
	loggedInUser: any;

	constructor(public router: Router) { }

	ngOnInit() {
	}
	urlToHit(){
		this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
			  if (typeof this.loggedInUser === 'undefined'||  this.loggedInUser == null ||  this.loggedInUser == '') {
				  this.router.navigate(['']);
			  }else{
		  this.router.navigate(['home']);
			  }
	}
}