import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ApiService } from 'src/app/services/api.service';
import { DataShareServices } from 'src/app/services/data-share.services';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { DataSharingServices } from 'src/app/services/data-sharing.services';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { UserModel } from '../modals/user';
import { AuthService } from '../services/auth.service';
import { UserRolesService } from '../services/user-roles.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	private subscriptions: Subscription[] = [];
	userLogin: FormGroup;
	loginData: any = {};
	url: string;
	user: any;
	role: string;
	entity: string;
	isRememberMe: Boolean = true;
	secret: any = "gadiaagebadhrahihaina";
	encryptedPassword: any;
	isUserLogin: UserModel;
	filter: any = {}
	modalRef: BsModalRef;
	@ViewChild('template', { static: false }) private template;
	constructor(
		public apiService: ApiService,
		public dialogRef: MatDialogRef<LoginComponent>,
		private formBuilder: FormBuilder,
		private authService: AuthService,
		public router: Router,
		private location: Location,
		private dialog: MatDialog,
		private modalService: BsModalService,
		private roleService: UserRolesService,
		private dataSharingService: DataSharingService,
		private dataSharingServices: DataSharingServices,
		private dataShareServices: DataShareServices
		) {
			this.subscriptions.push(this.authService.currentUser
			.subscribe((user) => {
				this.isUserLogin = user;
			}));
	}

	public noWhitespaceValidator(control: FormControl) {
		const isWhitespace = (control.value || '').trim().length === 0;
		const isValid = !isWhitespace;
		return isValid ? null : { 'whitespace': true };
	}

	ngOnInit() {
		var storageRememberMe = JSON.parse(localStorage.getItem("rememberMe"));

		this.userLogin = this.formBuilder.group({
			emailId: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
			password: (['', [Validators.required, this.noWhitespaceValidator]]),
			isRememberMe: (['']),
		});

		if (storageRememberMe) {
			this.userLogin.controls['emailId'].setValue(storageRememberMe.email);
		}
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
	
	goToHomepage(){
		this.router.navigate(['/registration']);
	}

	public hasError = (controlName: string, errorName: string) => {
		return this.userLogin.controls[controlName].hasError(errorName);
	}

	resolved(captchaResponse: string, res) {
		this.sendTokenToBackend(captchaResponse); 
	  }

	sendTokenToBackend(tok) {
		this.subscriptions.push(this.authService.sendToken(tok).subscribe(
			data => {
			},
			err => {
			},
			() => { }
		));
	}

	login(form: NgForm) {
		if (form.invalid) {
			return false;
		}
		this.loginData.email = form.value.emailId;
		this.loginData.password = form.value.password;
		this.loginData.isRememberMe = form.value.isRememberMe;
	 
		this.subscriptions.push(this.authService.login(this.loginData)
			.subscribe((response: any) => {
				if (response) {
					this.user = response;
					this.role = this.user.reference.role;
					this.entity = this.user.reference.entity;
					
					if (this.user.referenceList.length == 0 || this.user.referenceList.length == 1) {
						this.dataSharingService.setImagePreviewData('');
						this.dataShareServices.setInstLogoPreviewData('');
						this.dataSharingServices.setLogoPreviewData('');
						this.dataSharingServices.setagencyLogoPreviewData('');
						this.roleService.renderScreen(this.user, this.role, this.entity);
						if (this.loginData.isRememberMe) {
							var rememberMeData: Object = {
								email: this.loginData.email,
							};
							localStorage.setItem("rememberMe", JSON.stringify(rememberMeData));
						}
					} else {
						this.openModal()
					}
				}
			}))
	};

	close() {
		this.dialogRef.close();
	}

	goToForgotPassword() {
		const dialogRef = this.dialog.open( ForgotPasswordComponent, {
			width: '360px',
			height: '240px',
			disableClose: true
		});
		this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
		}));
	}

	goBack() {
		this.location.back();
	}

	openModal() {
		for (let i = 0; i < this.user.referenceList.length; i++) {
			if (!(typeof this.user.referenceList[i].roleName === 'undefined')) {
				this.user.referenceList[i].roleTxt = this.user.referenceList[i].roleName
			}else{
				this.user.referenceList[i].roleTxt = this.user.referenceList[i].role
			}
		}
		this.modalRef = this.modalService.show(this.template, { class: 'modal-dialog-centered' });
	}

	confirm() {
		this.modalRef.hide();
		if (typeof this.filter.role === 'undefined') {
			this.filter.role = this.user.referenceList[0].role
		}
		for (let i = 0; i < this.user.referenceList.length; i++) {
			if (this.user.referenceList[i].role == this.filter.role) {
				var selectedObj = this.user.referenceList[i]
			}
		}
		this.user.reference.branch = this.user.departmentLocation;
		let name = selectedObj.userName.split(" ")
		this.user.reference.role = this.filter.role
		this.user.firstName = name[0]
		this.user.lastName = name[1]
		this.user.reference.userName = selectedObj.userName
		this.user.reference.departmentId = selectedObj.departmentId
		this.user.reference._id = selectedObj._id
		this.user.reference.role = selectedObj.role
		this.user.reference.entity = selectedObj.entity
		this.user.reference.roleName = selectedObj.roleName
		sessionStorage.setItem('user', JSON.stringify(this.user));
		if (this.user.reference.role == 'admin') {
			this.user.reference.organizationId = selectedObj.organizationId
			sessionStorage.setItem('user', JSON.stringify(this.user));
		}
		if ((this.user.reference.entity == "corporate" || this.user.reference.entity == "agency" || this.user.reference.entity == "individual") && (this.user.reference.role != 'Corporate Admin' || this.user.reference.role != 'corporate verifier' || this.user.reference.role != 'verifier' || this.user.reference.role !='Agency Admin' || this.user.reference.role !='certifier'|| this.user.reference.role !='Agency Verifier')) {
			this.user.reference.departmentId = selectedObj.departmentId
			this.user.reference.organizationId = selectedObj.organizationId
			sessionStorage.setItem('user', JSON.stringify(this.user));
		}
		if (this.user.reference.role == 'Corporate Admin' || this.user.reference.role == 'corporate verifier' || this.user.reference.role == 'verifier' || this.user.reference.role =='Agency Admin' || this.user.reference.role =='certifier'|| this.user.reference.role =='Agency Verifier') {
			this.url = '/corporate/' + selectedObj.corporateId;
			var params = new HttpParams();
			params = params.append('id', selectedObj.corporateId);
			this.subscriptions.push(this.apiService.get(this.url, params)
				.subscribe((response: any) => {
					this.user.corpData = response.data
					this.user.reference.corporateId = selectedObj.corporateId
					sessionStorage.setItem('user', JSON.stringify(this.user));
					this.authService.currentUserSubject.next(this.user);
					this.roleService.renderScreen(this.user, this.filter.role, this.entity);
					if (this.loginData.isRememberMe) {
						var rememberMeData: Object = {
							email: this.loginData.email,
						};
						sessionStorage.setItem("rememberMe", JSON.stringify(rememberMeData));
					}
				}));
		} else {
			sessionStorage.setItem('user', JSON.stringify(this.user));
			this.authService.currentUserSubject.next(this.user);
			this.roleService.renderScreen(this.user, this.filter.role, this.entity);
			if (this.loginData.isRememberMe) {
				var rememberMeData: Object = {
					email: this.loginData.email,
				};
				sessionStorage.setItem("rememberMe", JSON.stringify(rememberMeData));
			}
		}
	}

	//close confirmation modal
	closedModal(): void {
		this.authService.logout();
		var lgFlag = localStorage.getItem('logoutFlag');
		if(lgFlag == "true"){
			localStorage.removeItem('logoutFlag');
			localStorage.removeItem('forgotFlag');
			this.gotoSnapcert();
		} else {
			this.router.navigate(['/']);
		}
		this.modalRef.hide();
	}

	gotoSnapcert(): void {
		window.location.href = "https://snapcert.io/";
	}
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}