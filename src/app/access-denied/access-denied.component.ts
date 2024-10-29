import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {
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