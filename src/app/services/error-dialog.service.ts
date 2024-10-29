import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { Subscription } from 'rxjs';
@Injectable({
	providedIn: 'root'
})
export class ErrorDialogService {
	private subscriptions: Subscription[] = [];

	constructor(public dialog: MatDialog,
				public router: Router) { 
	}

	openDialog(data): void {
		const dialogRef = this.dialog.open(ErrorDialogComponent, {
			width: '335px',
			data: data
		});

		if(data.reason == 'OTP send on your Email for set password!') {
			this.router.navigate(['/resetPassword']);
		}

		this.subscriptions.push(dialogRef.afterClosed().subscribe((result) => {
			this.dialog.closeAll();
		}));
	}

	openAlertPopup(obj) {
		const alertDialogRef = this.dialog.open(AlertDialogComponent, {
			width: '250px',
			data: obj
		});

		this.subscriptions.push(alertDialogRef.afterClosed().subscribe((result) => {
			if(obj.reason == 'Corporate Registered Successfully, Check Email for OTP!' || obj.reason == 'OTP send on your Email for set password!' || obj.reason == 'Individual Verifier Registered Successfully, Check Email for OTP!' || obj.reason == 'Organization Registered Successfully, Check Email for OTP!') {
				this.router.navigate(['/resetPassword']);
			}
			this.dialog.closeAll();
		}));
	}
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}