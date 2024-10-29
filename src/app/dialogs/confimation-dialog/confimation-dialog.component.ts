import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PartnerDataService } from 'src/app/partners/partner-data.service';
import { AuthService } from 'src/app/services/auth.service';
import { TransactionDataService } from 'src/app/transactions/transaction-data.service';
import { AddCommentService } from '../add-comment/add-comment.service';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-confimation-dialog',
    templateUrl: './confimation-dialog.component.html',
    styleUrls: ['./confimation-dialog.component.css']
})
export class ConfimationDialogComponent implements OnInit {
    private subscriptions: Subscription[] = [];
    user;
    constructor(@Inject(MAT_DIALOG_DATA) public message,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel,
                public dialogRef: MatDialogRef<ConfimationDialogComponent>,
                private authService: AuthService,
                public partnerDataService: PartnerDataService,
                public addCommentService: AddCommentService,
                public transactionDataService: TransactionDataService,
                public router: Router) {
                    this.subscriptions.push(this.authService.currentUser
						.subscribe((user) => {
							this.user = user;
						}));
                }

    ngOnInit() {
    }

    afterClose() {
        this.dialogRef.afterClosed().subscribe((result) => {
            if(result == true) {
                var dialogData = this.dialogRef._containerInstance._config.data;
                var obj = {
                    status: dialogData.status
                };

                if(dialogData.batchId) {
                    this.partnerDataService.changeStatus(dialogData, obj);

                } else if(dialogData.transactionId) {
                    this.transactionDataService.changeStatus(dialogData);
                }
            }
        })
    };

    close() {
        this.dialogRef.close();
    }
    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    };

}
export class ConfirmDialogModel { 
    constructor(public title: string, public message: string) {
 }
}