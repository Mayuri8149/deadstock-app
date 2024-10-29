import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ResendOtpComponent } from '../resend-otp/resend-otp.component';
import { AuthService } from '../services/auth.service';
import { ErrorDialogService } from '../services/error-dialog.service';
import { SnackbarService } from '../services/snackbar.service';
import { PasswordMatch } from '../validators/password.validator';
import { Subscription } from 'rxjs';
@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
	private subscriptions: Subscription[] = [];
	resetPwd: FormGroup;
	errmsg: any;
	userId: any;
	isShown: boolean = false ; // hidden by default
	url;
	showSpinner: Boolean = false;
	trackflag: Boolean = false;
	href;
	constructor(public dialogRef: MatDialogRef<ResetPasswordComponent>,
				private dialog: MatDialog,
				private _formBuilder: FormBuilder,
				public authService: AuthService,
				private http: HttpClient,
				public router: Router,
				private route: ActivatedRoute,
				public snackbarService: SnackbarService,
				public errorDialogService: ErrorDialogService) { 					
				}
	
	ngOnInit() {		
		this.userId = this.route.snapshot.params['id'];	
		this.resetPwd = this._formBuilder.group({
			otp: ['', Validators.required],
			password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?#.^&])[A-Za-z\d$@$!%*?&].{7,}')]],
			confirmPassword: ['', Validators.required]
			}, {
				validator: PasswordMatch('password', 'confirmPassword')
			});
			
			this.getResendShowHide();		
			setInterval(() => {
				sessionStorage.setItem('flagset', 'true');
				this.showSpinner = false;
				this.getResendShowHide();
			}, 60000);				
	}
	public hasError = (controlName: string, errorName: string) =>{	
		return  this.resetPwd.controls[controlName].hasError(errorName);		
	}
	onKeyPress(event: any) {
		this.trackflag = true;
	};
	getResendShowHide() {
		this.href = this.router.url;
		var hrefSplit = this.href.split("/");
		if(this.userId!==undefined && hrefSplit[1]=="resetPassword"){
			var data = {
				userId: this.userId
			}
			this.subscriptions.push(this.authService.resendOtpShowHide(data)
				.subscribe((response: any) => {	
					if(response.success == true) {
						this.showSpinner = false;
						if(response.data.flag==true){
							this.isShown = true;
						}
					}
				}))
		}
	}
	
	resetPassword(form: NgForm) {
		if(form.invalid) {
			return false;
		}
		var email = localStorage.getItem('emailId');
		var data = {
			email: email,
			code: form.value.otp,
			password: form.value.password,
			confirmPassword: form.value.confirmPassword
		}
		this.subscriptions.push(this.authService.resetPassword(data)
			.subscribe((result) => {
				if(result.success == true) {
					if(form.value.password == form.value.confirmPassword){
					this.isShown = false;
					setTimeout (() => {
						this.isShown = true;
					 },120000);
					 this.resetPwd.reset();
					this.snackbarService.openSuccessBar('Your password updated successfully...', "Password");
					this.router.navigate(['']);
       			 }
        		else{	
					this.isShown = true;		
					var data = {
						reason: "Password and Confirm Password should be same",
						status: ''
			  		};
			  		this.errorDialogService.openDialog(data);
        		}
			}
		},(error )=>{
			this.isShown = true;
			this.errmsg = error.error.errors[0].msg;
			var data = {
				reason: this.errmsg,
				status: ''
      };
      	this.errorDialogService.openDialog(data);
	  }
))
}

goToResendOtp() {
	const dialogRef = this.dialog.open(ResendOtpComponent, {
	width: '335px',
	data: { userId: this.userId },
	});
	this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
		if(result==this.userId){
			this.isShown =false;
			this.resetPwd.reset()
		}else{
			this.router.navigate(['/resetPassword/'+this.userId]);
		}	
	  }));
}

goHomePage() {
	this.router.navigate(['/']);
}
ngOnDestroy() {
	this.subscriptions.forEach(subscription => subscription.unsubscribe());
};
}