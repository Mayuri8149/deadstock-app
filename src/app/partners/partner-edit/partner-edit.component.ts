import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Subscription } from 'rxjs';
@Component({
	selector: 'app-partner-edit',
	templateUrl: './partner-edit.component.html',
	styleUrls: ['./partner-edit.component.css']
})
export class PartnerEditComponent implements OnInit {
	private subscriptions: Subscription[] = [];
	newEmails;
	url;
	id;
	inst_id;
	affInst_Id
	loginUser;
	userData;
  isActive;
	user;
	users;
	role;
	departments:[]=[];
	UserData = {
		id:'',		
		newEmail: ''
	};
	editPartnerForm: FormGroup;
	constructor(private formBuilder: FormBuilder,
				private apiService: ApiService,
				private route: ActivatedRoute,
				public router: Router,
				private location: Location,
				public snackbarService: SnackbarService) { 					
				}

	ngOnInit() {
		this.loginUser = JSON.parse(sessionStorage.getItem('user'));
		this.id = this.loginUser.reference.userId;
		this.role = this.loginUser.UserType;
		this.inst_id = this.loginUser.organizationID;		
		this.editPartnerForm = this.formBuilder.group({
			newEmail: ['', [Validators.required, Validators.email]],
		});
		this.getPartner(this.id);
	}

	public hasError = (controlName: string, errorName: string) =>{
		return  this.editPartnerForm.controls[controlName].hasError(errorName);
	}

	getPartner(id) {
		this.url = "/user/"+id;
		var params = new HttpParams();
		
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response) => {
				if(response.success == true ) {
						this.users = response.data;
						this.newEmails =this.users.newEmail;
						for(var i=0;i<this.users.length;i++) {
							if(this.users[i].isActive == true) {
								this.users[i].status = "Active";
							} else {
								this.users[i].status = "Inactive";
							}
						}
				} 
			}));
	};

	editPartner(data: NgForm) {
		this.url = "/partner/changeStudDetails";
		this.UserData.id = this.id;		
		this.UserData.newEmail = data.value.newEmail;
		if(data.invalid) {
			return;
		}
		if(this.UserData.newEmail){
			this.subscriptions.push(this.apiService.post(this.url, this.UserData)
				.subscribe((response: any) => {
					if (response.success == true) {
						this.snackbarService.openSuccessBar("New email ID of partner updated successfully", "User")
						this.router.navigate(['/partners/partnerEdit']);
					} else {
						alert("Update email is failed!!!");
					}
				}));
		}
	}

	goBack() {
		this.location.back();
	}
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}