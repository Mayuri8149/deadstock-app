import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NativeDateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { UserModel } from '../modals/user';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../services/snackbar.service';
import { Subscription } from 'rxjs';

export class AppDateAdapter extends NativeDateAdapter {

	format(date: Date, displayFormat: Object): string {
		if (displayFormat == "input") {
			let day = date.getDate();
			let month = date.getMonth() + 1;
			let year = date.getFullYear();
			return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
		} else {
			return date.toDateString();
		}
	}

	private _to2digit(n: number) {
		return ('00' + n).slice(-2);
	}
}

export const APP_DATE_FORMATS = {
	parse: {
		dateInput: {month: 'short', year: 'numeric', day: 'numeric'}
	},
	display: {
		dateInput: 'input',
		monthYearLabel: {year: 'numeric', month: 'short'},
		dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
		monthYearA11yLabel: {year: 'numeric', month: 'long'},
	}
}

@Component({
	selector: 'app-organization-registration',
	templateUrl: './organization-registration.component.html',
	styleUrls: ['./organization-registration.component.css']
})
export class OrganizationRegistrationComponent implements OnInit {
	private subscriptions: Subscription[] = [];
	isUserLogin: UserModel;
	url;
	adminFormGroup: FormGroup;
	constructor(
		private http: HttpClient,
		private _formBuilder: FormBuilder,
		private router: Router,
		public snackbarService: SnackbarService,
		private authService: AuthService) { 
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
		if(this.isUserLogin) {
			this.router.navigate(['/dashboard']);
		}
		this.adminFormGroup = this._formBuilder.group({
			firstName: ['', [Validators.required, Validators.pattern('^(?! )(?!.* $)[a-zA-Z ()-]+$')]],
			lastName: ['', [Validators.required, Validators.pattern('^(?! )(?!.* $)[a-zA-Z ()-]+$')]],
			organizationName: ['', [Validators.required, Validators.pattern('^(?! )(?!.* $)[a-zA-Z0-9 ()-]+$')]],
			email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
			phone: [undefined, [Validators.required]],
		});
	}

	public hasError = (controlName: string, errorName: string) =>{
		return  this.adminFormGroup.controls[controlName].hasError(errorName);
	}
	onCountryChange(event){
	}

	telInputObject(event){
	}

	resolved(captchaResponse: string, res) {
		this.sendTokenToBackend(captchaResponse); 
	  }

	  sendTokenToBackend(tok){
		this.subscriptions.push(this.authService.sendToken(tok).subscribe(
			data => {
			},
			err => {
			},
			() => {}
		));
	}
	
	registerOrganization(admin: NgForm) {
		if (admin.invalid) {
			this.adminFormGroup.get('firstName').markAsTouched();
			return false;
		}
		var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
		var code = "I" + Math.floor(1000 + Math.random() * 9000);
		var data = {
			organizationAdmin: {
				firstName: admin.value.firstName,
				lastName: admin.value.lastName,
				name: admin.value.organizationName,
				code: code,
				email: admin.value.email,
				phoneNumber: admin.value.phone,
				timeZone:timeZone,
				createdBy : {
					firstName:admin.value.firstName,
					lastName:admin.value.lastName,
					email:admin.value.email
				},
				updatedBy : {
					firstName:admin.value.firstName,
					lastName:admin.value.lastName,
					email:admin.value.email
				}
			}
		}
		this.url = environment.baseUrl + '/api/v1/organization/register';
		
		this.subscriptions.push(this.http.post(this.url, data)
			.subscribe((response: any) => {	
				if(response.success == true && response.data.message== "User not verified") {    
                    this.router.navigate(['/email-verification/'+response.data.userId]);
                }else{
                    this.router.navigate(['']);
                }  
			}));
	}

	goBack() {  
		this.router.navigate(['/']);
	}

	goOrganizationPage() {
		this.router.navigate(['/registration']);
	}

	goCorporatePage() {
		this.router.navigate(['/partnerRegistration']);
	}	 
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}