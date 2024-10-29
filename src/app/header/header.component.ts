import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DataShareServices } from 'src/app/services/data-share.services';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { DataSharingServices } from 'src/app/services/data-sharing.services';
import { environment } from 'src/environments/environment';
import { PartnerRegistraionDataService } from '../partner-registration/partner-registraion-data.service';
import { Globals } from '../globals';
import { UserModel } from '../modals/user';
import { OrganizationDataService } from '../organizations/organization-data.service';
import { AuthGuard } from '../services/auth-guard';
import { AuthService } from '../services/auth.service';
import { UploadService } from '../services/upload.service';
import { SidebarService } from '../sidebar/sidebar/sidebar.service';
import { UserDataService } from '../users/user-data.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	url;
	user;
	moduleId;
	isUserLogin: UserModel;
	role;
	firstName;
	lastName;
	organizationId;
	affiliateId;
	corporateId;
	userId;
	companyName;
	imgUrl: any;
	imgProfileUrl: any;
	imgCorpUrl: any;
	imgAgencyUrl:any;
	organization = {
		name: '',
		logo: ''
	};
	affiliate = {
		name: '',
		logo: ''
	};
	corporate = {
		name: ''
	};

	corpData = {
		companyName: '',
		logo: ''
	};
	userData = {
		profileImg: ''
	};
	uploadedImage: Subscription;
	imagePreview = null;
	corpLogoPreviews = null;
	logoPreviews = null;
	agencypLogoPreviews = null;	
	@Input() stateRoute: string;
	@ViewChild('sidenav') public sidenav: MatSidenav;
	constructor(private uploadService: UploadService,
				public globals: Globals,
				public router: Router,
				private authService: AuthService,
				private authGuard: AuthGuard,
				private route: ActivatedRoute,
				private sidebarService: SidebarService,
				public organizationDataService: OrganizationDataService,
				public sanitizer: DomSanitizer,
				public corporateDataService: PartnerRegistraionDataService,private apiService: ApiService,
				private dataSharingService: DataSharingService,
				private dataSharingServices: DataSharingServices,
				private dataShareServices: DataShareServices,
				private userDataService: UserDataService
				) {
					this.subscriptions.push(this.authService.currentUser
						.subscribe((user) => {
							this.isUserLogin = user;
					}));
					this.subscriptions.push(this.dataSharingService.imagePreview.subscribe((val) => {
							this.imagePreview = val;
						}));
					this.subscriptions.push(this.dataShareServices.logoPreviews.subscribe((val) => {
						this.logoPreviews = val;
					}));	

					this.subscriptions.push(this.dataSharingServices.corpLogoPreviews.subscribe((val) => {
						this.corpLogoPreviews = val;
					}));

					this.subscriptions.push(this.dataSharingServices.agencypLogoPreviews.subscribe((val) => {
						this.agencypLogoPreviews = val;
					}));
				}

	ngOnInit() {	
		   this.user = JSON.parse(sessionStorage.getItem('user'));
		if(typeof this.user.reference.roleName === 'undefined'){
			this.user.reference.roleName = ''
		}
		this.roleName(this.user.reference.role,this.user.reference.roleName);
		this.organizationId = this.user.reference.organizationId;
		this.affiliateId = this.user.reference.affiliateId;
		this.userId = this.user.reference.userId;
		if(this.user.reference.entity == 'organization' && this.user.reference.role !== 'partner' && this.user.reference.role !== 'Corporate Admin' && this.user.reference.role !== 'Agency Admin' && this.user.reference.role !== 'corporate verifier' && this.user.reference.role !== 'Agency Verifier') {
			this.getOrganizationData(this.organizationId);
		} else if(this.user.reference.role == 'Corporate Admin' || this.user.reference.role == 'corporate verifier' || this.user.reference.role == 'manager' && this.user.reference.entity == 'corporate') {
			this.corporateId = this.user.corpData._id;
			this.getCorporate(this.corporateId);
		}else if(this.user.reference.role == 'Agency Admin' || this.user.reference.role == 'Agency Verifier') {
			this.corporateId = this.user.corpData._id;
			this.getCorporate(this.corporateId);
		}
		this.getProfileImage(this.userId);
	} 

	gotoLogin() {
		this.router.navigate(['/login']);
	}

	gotoSnapcert() : void {
		window.location.href="https://snapcert.io/";
	  }

	logout() {
		this.authService.logout();
		var lgFlag = localStorage.getItem('logoutFlag');
		if(lgFlag == "true"){
			localStorage.removeItem('logoutFlag');
			localStorage.removeItem('forgotFlag');
			this.gotoSnapcert();
		}else{
			this.router.navigate(['/']);
		}		
	}

	roleName(role,name) {
		if(role == 'admin') {
			if (name == '') {
				this.role = this.user.organizationName + " " + 'Admin';
			} else {
				this.role = name;
			}
		} else if(role == 'manager') {
			if (name == '') {
				this.role = 'Transaction User';
			} else {
				this.role = name;
			}
		} else if(role == 'reviewer') {
			this.role = 'Reviewer';
		} else if(role == 'certifier') {
			this.role = 'Certifier';
		} else if(role == 'partner') {
			this.role = this.user.firstName;
		} else if(role == 'verifier') {
			this.role = this.user.firstName +" "+ this.user.lastName;
		}else if(role == 'corporate verifier') {
			this.role = 'corporate verifier';
		}else if(role == 'Corporate Admin') {
			if (name == '') {
				if(this.user.companyName){
					this.role = this.user.companyName + " " + "Partner"  + " " + 'Admin';
				}else{
					this.role = "Partner"  + " " + 'Admin';
				}
			} else {
				this.role = name;
			}
		}else if(role == 'Agency Admin') {
			this.role = 'Agency Admin';
		}else if(role == 'Agency Verifier') {
			this.role = 'Agency Verifier';
		}
		else if (role == "sysadmin") {
			this.role = 'System Admin'
		} else if (role == 'subadmin') {
			this.role = 'Sub Admin'
		}	
	}

	openSidebar() {
		this.sidebarService.toggle();
	}

	async getOrganizationData(organizationId) {
		this.subscriptions.push(this.organizationDataService.getOrganizationById(organizationId)
			.subscribe(async (response: any) => {
				if(response.success == true){
					this.organization = response.data;
					if(response.data.logo == undefined || response.data.logo == null || response.data.logo == '') {
						this.imgUrl = environment.awsImgPath+"/Logo/organization_logo.png";
					} else { 
						const bucketName= environment.Bucket;
						const fileName= "Logo/"+response.data.logo;
						const returnRes= await this.uploadService.fileExist(bucketName,fileName)
						if(returnRes==true || returnRes!='NotFound'){
							this.imgUrl = environment.awsImgPath +"/Logo/"+response.data.logo;
						 }else{
							this.imgUrl = environment.awsImgPath+"/Logo/organization_logo.png";
						 }						
					}
				}
			}));
	}
	
	async getProfileImage(UserId) {
		this.subscriptions.push(this.userDataService.getUserById(UserId)
			.subscribe(async(response: any) => {
			if(response.success == true){
				this.userData = response.data
				if(response.data.profileImg == undefined || response.data.profileImg == null || response.data.profileImg == ""  || response.data.profileImg == "false"  || response.data.profileImg == false) {
					this.imgProfileUrl = environment.awsImgPath + "/Profile_Images/avatar.png";
				}else{
					const bucketName= environment.Bucket;
					const fileName= "Profile_Images/"+response.data.profileImg;
					const returnRes= await this.uploadService.fileExist(bucketName,fileName)
					if(returnRes==true){
						this.imgProfileUrl = environment.awsImgPath +"/Profile_Images/"+response.data.profileImg;
					 }else{
						this.imgProfileUrl = environment.awsImgPath+"/Profile_Images/avatar.png";
					 }
				}
			}
		}))
	}

	async getCorporate(corporateId) {
		this.subscriptions.push(this.corporateDataService.getCorporateById(corporateId)
			.subscribe(async (response: any) => {
				if(response.success == true){
					this.corpData = response.data;
				if(response.data.logo == undefined || response.data.logo == null || response.data.logo == '') {
						this.imgCorpUrl = environment.awsImgPath+"/Logo/corporate_logo.jpg";
					} else { 
						const bucketName= environment.Bucket;
						const fileName= "Logo/"+response.data.logo;
						const returnRes= await this.uploadService.fileExist(bucketName,fileName)
						if(returnRes==true || returnRes!='NotFound'){
							this.imgCorpUrl = environment.awsImgPath +"/Logo/"+response.data.logo;
						 }else{
							this.imgCorpUrl = environment.awsImgPath+"/Logo/corporate_logo.jpg";
						 }
					}						
				}
			}))
	}	
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}
