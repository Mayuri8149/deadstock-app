import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../services/api.service';
import { ErrorDialogService } from '../services/error-dialog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	user;
	role;
	entity;
	currentUrl;
	previousUrl;
	url:any
	isNotKYC = true
	id
	constructor(private location: Location,
		       public apiService:ApiService,
			   public errorDialogService:ErrorDialogService,
			   public router: Router) {
	}

	ngOnInit() {
		this.user = JSON.parse(sessionStorage.getItem('user'));		
		this.role = this.user.reference.role;
		this.entity = this.user.reference.entity;
		this.id = this.user.reference.organizationId;
		if(this.role == 'admin' && this.entity == 'organization'){
		this.getOrganization()
		}
	}

	OrgSelect(){
		this.router.navigate(['/organizations/treeChart/' + this.id]);
	}

	getOrganization() {
		this.url = "/organization/" + this.user.reference.organizationId;
		var params = '';
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response: any) => {
				if (response.success == true) {
					var organizationData = response.data;
					this.isNotKYC = organizationData.isActive
					if (organizationData.isActive == false && this.user.reference.role == 'admin') {
						var data = {
							reason: "Your organization is yet not Active. It is pending for KYC.  ",
							status: ''
						};
						this.errorDialogService.openDialog(data);
					} 
				}
			}));
	};

	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}