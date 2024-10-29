import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
	private subscriptions: Subscription[] = [];
	forgotpassword: FormGroup;
	constructor(public dialogRef: MatDialogRef<ForgotPasswordComponent>,
		private formBuilder: FormBuilder,
				private authService: AuthService,
				public router: Router,
				public dialog: MatDialog) { }
	ngOnInit() {
		this.forgotpassword = this.formBuilder.group({
			emailId: (['',[Validators.required, Validators.email]]),
		});
	}

	public hasError = (controlName: string, errorName: string) =>{		
		return  this.forgotpassword.controls[controlName].hasError(errorName);		
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

	forgotPassword(form: NgForm) {
		if(form.invalid) {
			return false;
		}

		var data = {
			email: form.value.emailId
		}

		this.subscriptions.push(this.authService.forgotPassword(data)
			.subscribe((result: any) => {
				if(result.success == true) {
					var userId = result.data.result.otp.userId;
					var message = "Please check your mail for otp..";
					localStorage.setItem("emailId", data.email);
					this.dialogRef.close();
					this.router.navigate(['/resetPassword/'+userId]);
				}
			}))         
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(LoginComponent, {
			width: '350px',
			height: '385px',
			disableClose: true 
		});

		dialogRef.afterClosed().subscribe(result => {
		});
	}

	
	goBack() {
		this.dialogRef.close();
		var forgotFlag = localStorage.getItem("forgotFlag");
		if(forgotFlag == "true"){
			this.openDialog();
			this.router.navigate(['/SignIn']);
		}else{
			this.router.navigate(['/']);
		}
	}
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}