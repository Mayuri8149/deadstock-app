import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faHandPointLeft } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { OrganizationDataService } from '../organization-data.service';

@Component({
	selector: 'app-organization-details',
	templateUrl: './organization-details.component.html',
	styleUrls: ['./organization-details.component.css']
})
export class OrganizationDetailsComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	faHandPointLeft = faHandPointLeft;
	organizationData = {
		_id: '',
		isActive: '',
		status: '',
		code: '',
		name: '',
		doe: '',
		queueName: '',
		state: '',
		city:'',
		location: '',
		website: '',
		academicName: '',
		academicPhone: '',
		verificationCost: '',
		affiliateOrganization : {
			approvedBy : '',
			requlatoryBody: '',
			name: '',
			type: '',
		},
		requester : {
		  name: '',
		  email: '',
		  phoneNumber: ''
		},
		administrator : {
		  name: '',
		  landlineNumber: '',
		  email: '',
		  phoneNumber: ''
		},
		head : {
			name: '',
			email: '',
		},
		address:'',
		user : {
			email: '',
			phoneNumber: ''
		},
		fabricOrgId : '',
		fabricChannelId : '',
		entityType: '',
	}
	organizationId;
	user;
	role;
	entity;
	fabricOrgId;
	fabricChannelId
	fromAdmin = false
	dashboard: boolean = false;
	curPage:any=1;
	orgPerPage:any=5;
	isNotKYC :any = true
	constructor(public organizationDataService: OrganizationDataService, private location: Location,
		public router: Router,
		public route: ActivatedRoute) { }

	ngOnInit() {
		this.user = JSON.parse(sessionStorage.getItem('user'));		
		this.role = this.user.reference.role;
		this.entity = this.user.reference.entity;
		this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['instPerPage'];
		this.subscriptions.push(this.route.queryParams.subscribe((params) => {
			let that = this;
			var queryData = params['dashboard'];
			this.organizationId = this.user.reference.organizationId;
			if(queryData == 1) {
				that.dashboard = true;
			}else{
				this.organizationId =  this.route.snapshot.queryParams['id'];
				this.fromAdmin =  this.route.snapshot.queryParams['fromAdmin'];
				if(typeof this.fromAdmin === 'undefined'){
					this.fromAdmin  = false
				}
				if(typeof this.organizationId === 'undefined'){
				if(typeof this.user.reference.organizationId === 'undefined'){
					this.organizationId = this.user.reference.organizationId;
				 }
				}
			}
		}));
		this.getOrganizationData();
	}

	getOrganizationData() {
		this.subscriptions.push(this.organizationDataService.getOrganizationById(this.organizationId)
			.subscribe((response: any) => {
				this.organizationData = response.data;
				this.isNotKYC = this.organizationData.isActive
			}));
  }

  goBack() {
	if(this.curPage && this.orgPerPage){
		this.router.navigate(['organizations/OrganizationsList'],{ queryParams: { currentPage: this.curPage, instPerPage: this.orgPerPage}});
	}else{
		this.location.back()
	}	
	};

	goToInstUpdate(instId) {
		this.router.navigate(['organizationUpdate/' + instId]);
	}
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}