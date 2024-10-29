import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { SnackbarService } from '../services/snackbar.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-resend-otp',
  templateUrl: './resend-otp.component.html',
  styleUrls: ['./resend-otp.component.css']
})
export class ResendOtpComponent implements OnInit {
	private subscriptions: Subscription[] = [];
	url
	userId;
	constructor(public dialogRef: MatDialogRef<ResendOtpComponent>,
		private formBuilder: FormBuilder,
        public snackbarService: SnackbarService,
				public router: Router,
				private http: HttpClient,
				private route: ActivatedRoute,
				public dialog: MatDialog,
				@Optional() @Inject(MAT_DIALOG_DATA) public data: any
				) {
					this.userId = data.userId;
				}

	ngOnInit() {
	
	}

	resendOtpSubmit() {
    	this.url = environment.baseUrl + '/api/v1/user/resendOtpCall';
		var data:any = {
			userId: this.userId
		}
		this.subscriptions.push(this.http.post(this.url, data)
			.subscribe((response: any) => {				
				if(response.success == true) {
					this.snackbarService.openSuccessBar('Your OTP resend successfully.', "User");
					this.dialogRef.close(this.userId);
					this.router.navigate(['/resetPassword/'+this.userId]);
				}
			}));		
	}

	goBack() {
		this.dialogRef.close();	
	}
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}
