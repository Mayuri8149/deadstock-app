import { EventEmitter, Injectable, Output } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddCommentComponent } from '../dialogs/add-comment/add-comment.component';
import { ConfimationDialogComponent } from '../dialogs/confimation-dialog/confimation-dialog.component';
import { SendMailComponent } from '../dialogs/send-mail/send-mail.component';
import { ViewDialogComponent } from '../dialogs/view-dialog/view-dialog.component';


@Injectable({
    providedIn: 'root'
})
export class ConfirmDialogService {
	@Output() change: EventEmitter<object> = new EventEmitter();
	constructor(public dialog: MatDialog,
		private confirmDialogRef: MatDialogRef<ConfimationDialogComponent>, 
		private addCommentDialogRef: MatDialogRef<AddCommentComponent>) {
	 }

    openDialog(obj): Observable<ConfimationDialogComponent> {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.width = '300px';
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.data = {
			url: obj.url,
			message: obj.message,
			status: obj.status,
			data: ''
		};

		if(obj.batchId) {
			dialogConfig.data.batchId = obj.batchId;
		}
		if(obj.transactionId) {
			dialogConfig.data.transactionId = obj.transactionId;
		}
		const dialogRef = this.dialog.open(ConfimationDialogComponent, dialogConfig);
		dialogRef.afterClosed()
			.pipe(
				map(result => !result ? 'Default data' : result)
			).subscribe(result => {
				dialogConfig.data.data = result;
			});

		return dialogConfig.data;

	};

	open(obj) {
		if(obj.status == 'reviewed') {
			obj.message = "Confirm Review?";
			this.confirm(obj);
		} else if(obj.status == 'certified') {
			obj.message = "Confirm Certify?";
			this.confirm(obj);
		} else if(obj.status == 'rejected') {
			obj.message = "Confirm Reject?";
			this.showCommentPopup(obj);
		} else if(obj.status == 'Active') {
			obj.message = "Confirm Active?";
			this.confirm(obj);
		} else if(obj.status == 'Inactive') {
			obj.message = "Confirm Inactive?";
			this.confirm(obj);
		} else if(obj.status == 'Link') {
			obj.message = "Do you want to link the module?";
			this.confirm(obj);
		} else if(obj.status == 'Unlink') {
			obj.message = "Do you want to unlink the module?";
			this.confirm(obj);
		}
		else if(obj.status == 'Approved') {
			obj.message = "Confirm Approved?";
			this.blockchainService(obj);
		}
		else if(obj.status == 'Disapprove') {
			obj.message = "Confirm Disapprove?";
			this.confirm(obj);
		}
		else if(obj.status == 'provideAccess') {
			if (obj.item.update == false) {
				obj.message = "Do you really want to give access?";
			} else {
				obj.message = "Do you really want to update given access?";
			}
			this.confirm(obj);
		}else if(obj.status == 'deleteCert') {
			obj.message = "Do you really want to delete this transaction?";
			this.confirm(obj);
		}else if(obj.status == 'download') {
			obj.message = obj.item;
			this.blockchainService(obj);
		}
		else if(obj.status == 'Invited') {
			obj.message = "Do you really want to resend invitation?";
			this.confirm(obj);
		}else if(obj.status == 'orgActive') {
			obj.message = "Confirm Active?";
			this.blockchainService(obj);
		}
	} 
	openDelete(obj) {
		if(obj) {
			obj.message = "Are you sure you want to delete the transaction Type?";
			this.confirm(obj);
		}
	}
	confirm(obj) {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.width = '300px';
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.data = {
			message: obj.message,
			status: obj.status,
		};
		const confirmDialogRef = this.dialog.open(ConfimationDialogComponent, dialogConfig);
		confirmDialogRef.afterClosed()
			.pipe(
				map(result => !result ? false : true)
			).subscribe(result => {
				obj.doAction = result;
				this.change.emit(obj);
			});
	}

	blockchainService(obj) {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.width = '350px';
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		if(obj.organizationId){
			dialogConfig.data = {
				message: obj.message,
				status: obj.status,
				organizationId: obj.organizationId
			};
		}else if(obj.corporateId){
			dialogConfig.data = {
				message: obj.message,
				status: obj.status,
				corporateId: obj.corporateId
			};
		}
		const confirmDialogRef = this.dialog.open(ViewDialogComponent, dialogConfig);
		confirmDialogRef.afterClosed()
			.pipe(
				map(result => !result ? false : true)
			).subscribe(result => {
				obj.doAction = result;
				this.change.emit(obj);
			});
	}

	showCommentPopup(obj) {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.width = '415px';
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.data = obj;
		const addCommentDialogRef = this.dialog.open(AddCommentComponent, dialogConfig);
		addCommentDialogRef.afterClosed()
			.pipe(
				map(comment => !comment ? false : comment)
			).subscribe(comment => {

				if(comment) {
					obj.comment = comment;
					if(obj.action == 'cert'){
					  this.confirm(obj);
					}else{
					obj.doAction = true;
				    this.change.emit(obj);
					}
				}
			});
	}

	openSendMailPopup(obj) {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.width = '400px';
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.data = obj;
		const sendMailDialogRef = this.dialog.open(SendMailComponent, dialogConfig);
		sendMailDialogRef.afterClosed()
			.pipe(
				map(emailId => !emailId ? false : emailId)
			).subscribe(emailId => {

				if(emailId) {
					obj.emailId = emailId;
					this.change.emit(obj);
				}
				
			});
	}

	close() {
		this.confirmDialogRef.afterClosed().subscribe((result) => {
		})
	}
}