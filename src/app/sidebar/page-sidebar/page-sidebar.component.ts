import { Location } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Config } from 'src/app/helper/config';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from '../../services/data.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Subscription } from 'rxjs';
@Component({
	selector: 'app-page-sidebar',
	templateUrl: './page-sidebar.component.html',
	styleUrls: ['./page-sidebar.component.css']
})
export class PageSidebarComponent implements OnInit {
	private subscriptions: Subscription[] = [];
	public sidebar: any;
	loggedInUser;
	role: string;
	entity: string;
	affiliateId;
	partnerId;
	verifiertype: string;
	urlAuth: string;
	user: any;
	users: any = {
		username: '',
		password: '',
		issueJWT: ''
	};
	userData: any;
	url = ''
	isDisabled = false
	transcationTypeList = []
	moduleList = []
	isNotKYC = true
	transactionDetails: any;
	transtype: any;
	constructor(private route: ActivatedRoute,
		private router: Router,
		public dataservice: DataService,
		private apiService: ApiService,
		private http: HttpClient,
		private location: Location,
		private authService: AuthService,
		public SidebarComponent: SidebarComponent
	) {
		this.subscriptions.push(this.authService.currentUser
		.subscribe((user) => {
			this.userData = user;
		}));
	}

	ngOnInit() {
		this.router.routeReuseStrategy.shouldReuseRoute = () => {
			return false;
		}
		this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
		if (typeof this.loggedInUser.refresh_token === 'undefined' || this.loggedInUser.refresh_token == null || this.loggedInUser.refresh_token == '') {
			this.getUser()
		} else {
			this.isDisabled = true
		}
		this.role = this.loggedInUser.reference.role;
		this.entity = this.loggedInUser.reference.entity;

		if (this.loggedInUser.reference.affiliateId) {
			this.affiliateId = this.loggedInUser.reference.affiliateId;
		}

		if (this.role == 'partner') {
			this.partnerId = this.loggedInUser._id;
		}

		this.getSelectedUserAccess()
		if (this.role == 'admin' && this.entity == 'organization') {
			this.getOrganization()
		}
	}

	Wallet() {
		this.urlAuth = '/corporate/authenticateData';
		this.users.username = this.userData.firstName + this.userData.lastName;
		this.users.password = this.userData.password;
		this.users.issueJWT = true
		this.subscriptions.push(this.apiService.post(this.urlAuth, this.users)
			.subscribe((response: any) => {
				var token = response.data.jwt.token;
				window.location.href = "https://snapcert.io/my-account/woo-wallet/?aam-jwt=" + token;
			}));
	}

	sidebarToggle(e) {
	}

	toggled = false;
	classApplied = true;
	toggleClass() {
		this.classApplied = !this.classApplied;
	}
	selected = '';
	select(item: any) {
		this.selected = item;
		this.toggled = false;
		var screen_width = window.innerWidth;
		if (screen_width < 960) {
			this.SidebarComponent.drawer.toggle();
		}
		$(".collapse").removeClass("show");
	}
	isActive(item: any) {
		return this.selected === item;
	}

	gotoDigi() {
		var uri_enc = encodeURI("https://api.digitallocker.gov.in/public/oauth2/1/authorize?response_type=code&client_id=" + Config.digilockerDetails.client_id + "&state=ok&redirect_uri=" + Config.digilockerDetails.redirect_uri);
		window.open(uri_enc, "_self");
	}

	getUser() {
		this.url = '/user/' + this.loggedInUser._id;
		var params = new HttpParams();
		params = params.append('id', this.loggedInUser._id);
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response: any) => {
				if (response.success == true) {
					if (typeof response.data.refresh_token === 'undefined' || response.data.refresh_token == null || response.refresh_token == '') {
						this.isDisabled = false
					} else {
						this.loggedInUser.refresh_token = response.data.refresh_token
						this.loggedInUser.access_token = response.data.access_token
						sessionStorage.setItem('user', JSON.stringify(this.loggedInUser));
						this.isDisabled = true
					}
					this.userData = response.data
				}
			}));
	}

	getSelectedUserAccess() {
		this.url = "/useraccess/getPartnersByUserId";
		var params = new HttpParams();
		params = params.append('partnerId', this.loggedInUser._id);
		params = params.append('pagesize', '0');
		params = params.append('page', '50');
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response) => {
				if (response.success == true) {
					this.transcationTypeList = response.data.partners.partners
					for (let i = 0; i < this.transcationTypeList.length; i++) {
						let index = this.moduleList.findIndex(x => x.module._id == this.transcationTypeList[i].module._id)
						if (index == -1) {
							this.moduleList.push({ module: this.transcationTypeList[i].module, isWrite: this.transcationTypeList[i].isWrite });
						}
					}
					for (let j = 0; j < this.moduleList.length; j++) {
						for (let k = 0; k < this.transcationTypeList.length; k++) {
							if (this.moduleList[j].module._id == this.transcationTypeList[k].module._id) {
								if (typeof this.moduleList[j].transcationType === 'undefined') {
									this.moduleList[j].transcationType = []
								}
								this.moduleList[j].transcationType.push({ transcationType: this.transcationTypeList[k].transactionType, transcationTypeId: this.transcationTypeList[k]._id, isWrite: this.transcationTypeList[k].isWrite })
							}
						}
					}
				}
			}));
	}

	viewTransactionList(transcationType) {
		var screen_width = window.innerWidth;
		if (screen_width < 960) {
			this.SidebarComponent.drawer.toggle();
		}
		let index = this.transcationTypeList.findIndex(x => x._id == transcationType.transcationTypeId)
		if (index > -1) {
			transcationType = this.transcationTypeList[index]
			sessionStorage.setItem('transcationType', JSON.stringify(transcationType))
			this.router.navigate(['/transactions/transactions?dashboard=1']);
		}
	}

	openCreateTransaction(transcationType) {
		var screen_width = window.innerWidth;
		if (screen_width < 960) {
			this.SidebarComponent.drawer.toggle();
		}
		let index = this.transcationTypeList.findIndex(x => x._id == transcationType.transcationTypeId)
		if (index > -1) {
			transcationType = this.transcationTypeList[index]
			sessionStorage.setItem('transcationType', JSON.stringify(transcationType));
			this.transactionDetails = JSON.parse(sessionStorage.getItem('transcationType'));
			this.router.navigate(['/transTypeList?dashboard=1/' + this.transactionDetails.transactionId + '/' + this.transactionDetails.batchId + '/' + '/addTransIntegrated']);
		}
	}

	goToPage(event) {
		if (event == 'Packages') {
			this.router.navigate(['/package/packageList']);
		}
		else if (event == 'RC') {
			this.router.navigate(['/ratecard/ratecardList']);
		}
		else if (event == 'CI') {
			this.router.navigate(['/package/packageinvoicedetails']);
		}
		else if (event == 'CR') {
			this.router.navigate(['/package/packagereceiptdetails']);
		}
		else if (event == 'Orders') {
			this.router.navigate(['/package/packagecustomerdetails']);
		}
		else if (event == 'BuyPackages') {
			this.router.navigate(['/package/customerpackagelist']);
		}
		else if (event == 'Wallet') {
			this.router.navigate(['/package/wallet']);
		}
	}

	getOrganization() {
		this.url = "/organization/" + this.loggedInUser.reference.organizationId;
		var params = '';
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response: any) => {
				if (response.success == true) {
					var organizationData = response.data;
					this.isNotKYC = organizationData.isActive
				}
			}));
	};
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}