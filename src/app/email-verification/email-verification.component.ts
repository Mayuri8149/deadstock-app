import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { SnackbarService } from '../services/snackbar.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  url
	userId;
  constructor(
		private formBuilder: FormBuilder,
        public snackbarService: SnackbarService,
				public router: Router,
				private http: HttpClient,
				private route: ActivatedRoute,
				public dialog: MatDialog,) { }

  ngOnInit() {
    this.userId = this.route.snapshot.params['id'];
  }

  resendOtpSubmit() {
    this.url = environment.baseUrl + '/api/v1/user/resendOtpCall';
    var data:any = {
      userId: this.userId
    }
    this.subscriptions.push(this.http.post(this.url, data)
      .subscribe((response: any) => {				
        if(response.success == true) {
          this.snackbarService.openSuccessBar('Your Confirmation email resend successfully.', "User");
          this.router.navigate(['/resetPassword/'+this.userId]);
        }
    }));		
  }
  goBack() { 
    this.router.navigate(['/resetPassword/'+this.userId]);		
	}
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  };
}
