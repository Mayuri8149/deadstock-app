import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Boolean } from 'aws-sdk/clients/apigateway';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-view-dialog',
    templateUrl: './view-dialog.component.html',
    styleUrls: ['./view-dialog.component.css']
})
export class ViewDialogComponent implements OnInit {
    private subscriptions: Subscription[] = [];
    user;
    blockchainService: FormGroup;
	url;
    checkedblockchainService:Boolean = false;
    isActive:Boolean = false;
    constructor(@Inject(MAT_DIALOG_DATA) public message,
    @Inject(MAT_DIALOG_DATA) public data: ViewDialogModel,
                public dialogRef: MatDialogRef<ViewDialogComponent>,
                private authService: AuthService,
                private formBuilder: FormBuilder,
                public apiService: ApiService,
		public snackbarService: SnackbarService,
                public router: Router) {
                    this.subscriptions.push(this.authService.currentUser
						.subscribe((user) => {
							this.user = user;
						}));
                }

    ngOnInit() {
        this.blockchainService = this.formBuilder.group({
			isBlockchainService: ([''])
		});
		
    }
    blockchainServiceFun(form: NgForm) {
		var data = {
			isBlockchainService: form.value.isBlockchainService
		}
     
        this.dialogRef.afterClosed().subscribe((result) => {
            var dialogData = this.dialogRef._containerInstance._config.data;
        if(dialogData.organizationId){
            if(dialogData.status=="orgActive" && form.value.isBlockchainService==true){
                dialogData.isBlockchainService = true;
                this.router.navigate(['organizations/OrganizationsList/organizationUpdates/' + dialogData.organizationId + "/" + dialogData.isBlockchainService]);
            }else if(dialogData.status=="orgActive" && dialogData.isBlockchainService == false){
                dialogData.isBlockchainService = this.checkedblockchainService;
                var data = {
                    isActive: true,
                    isBlockchainService: this.checkedblockchainService
                };
                this.url = '/organization/'+ dialogData.organizationId +'/changeStatus';
                this.apiService.put(this.url, data).subscribe((response) => {
                    if(response.success == true) {
                        this.snackbarService.openSuccessBar('Organizations status change successfully.', "User");
                        this.router.navigate(['organizations/OrganizationsList']);
                    }
                });
            }
            }else if(dialogData.corporateId){
                if(dialogData.status=="Approved" && form.value.isBlockchainService==true){
                    dialogData.isBlockchainService = true;
                    this.router.navigate(['partners/invitepartners/partnerUpdates/' + dialogData.corporateId + "/" + dialogData.isBlockchainService]);
                }else if(dialogData.status!="Approved" && dialogData.isBlockchainService == false){
                    dialogData.isBlockchainService = this.checkedblockchainService;
                    var data1 = {
                        isBlockchainService: this.checkedblockchainService
                    };
                    this.url = '/invitepartner/'+ dialogData.corporateId +'/changeStatus';
                    this.apiService.put(this.url, data1).subscribe((response) => {
                        if(response.success == true) {
                            this.snackbarService.openSuccessBar('Corporate status change successfully.', "User");
                            this.router.navigate(['partners/invitepartners']);
                        }
                    });
                }
            }
        })
	}

    close() {
        this.dialogRef.close();
    }
    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    };
}
export class ViewDialogModel { 
    constructor(public title: string, public message: string) {
 }
}
