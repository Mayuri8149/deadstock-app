import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-send-mail',
	templateUrl: './send-mail.component.html',
	styleUrls: ['./send-mail.component.css']
})
export class SendMailComponent implements OnInit {
	private subscriptions: Subscription[] = [];
	sendMail: FormGroup;
	url;
	constructor(private formBuilder: FormBuilder,
		public dialogRef: MatDialogRef<SendMailComponent>,
		public apiService: ApiService,
		public snackbarService: SnackbarService) { }

	ngOnInit() {
		this.sendMail = this.formBuilder.group({
			emailId: (['', Validators.required])
		});
	}

	public hasError = (controlName: string, errorName: string) =>{		
		return  this.sendMail.controls[controlName].hasError(errorName);		
	}

	send(form: NgForm) {
		var dialogData = this.dialogRef._containerInstance._config.data;
		if(form.invalid) {
			return false;
		}
		
		var data = {
			transactionId: dialogData.transactionId,
			recipientEmail: form.value.emailId,
			partnerName: dialogData.partnerName
		}
		
		this.subscriptions.push(this.apiService.post(dialogData.url, data)
			.subscribe((response: any) => {
				if(response.success == true) {
					this.snackbarService.openSuccessBar('Your Transaction Shared Successfully.', "Transaction");
					this.close();
				}
			}));
	}

	close() {
        this.dialogRef.close();
    }
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}