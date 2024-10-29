import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
	selector: 'app-user-edit',
	templateUrl: './user-edit.component.html',
	styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	url;
	id;
	inst_id;
	affInst_Id
	loginUser;
	user;
	users;
	role;
	departments:[]=[];
	UserData = {
		id:'',
		role: '',
	department_ID:'',
	firstName: '',
	email: '',
	phoneNumber: '',
	updatedBy:{}
	};
	curPage:any=1;
	orgPerPage:any=5;
	editUserForm: FormGroup;
	constructor(private formBuilder: FormBuilder,
				private apiService: ApiService,
				private route: ActivatedRoute,
				public router: Router,
				private location: Location,
				public snackbarService: SnackbarService) { 
				}

	ngOnInit() {
		this.id = this.route.snapshot.params['userId'];
		this.loginUser = JSON.parse(sessionStorage.getItem('user'));
		this.role = this.loginUser.UserType;
		this.inst_id = this.loginUser.organizationID;
		this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['recordPerPage'];
		this.editUserForm = this.formBuilder.group({
			role: [{value: '', disabled: true}, Validators.required],
			department_ID: [{value: '', disabled: true},],
			firstName: [{value: '', disabled: true}, Validators.required],
			email: [{value: '', disabled: true}, Validators.required],
			phoneNumber: [undefined, [Validators.required]],
		});
		this.getUser(this.id);
	}

	getUser(id) {
		this.url = "/user/"+ id;
		var params = new HttpParams();
		params = params.append('organizationId', this.loginUser.reference.organizationId);
		params = params.append('departmentId', this.loginUser.reference.departmentId);
		params = params.append('affiliateId', this.loginUser.reference.affiliateId);
	
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response) => {
				if(response.success == true ) {
						this.users = response.data;
						for(var i=0;i<this.users.length;i++) {
							if(this.users[i].isActive == true) {
								this.users[i].status = "Active";
							} else {
								this.users[i].status = "Inactive";
							}
						}
						this.editUserForm.patchValue(this.users);				
				} 
			}));
	};

	editUser(data) {
		if(data.invalid) {
			return false;
		}
		this.url = "/user/" + this.id;
		this.UserData.id = this.id;
		this.UserData.role = data.value.role;
		this.UserData.department_ID = data.value.department_ID;
		this.UserData.firstName = data.value.firstName;
		this.UserData.email = data.value.email;
		this.UserData.phoneNumber = data.value.phoneNumber;
		this.UserData.updatedBy = {
			firstName:this.loginUser.firstName,
			lastName:this.loginUser.lastName,
			email:this.loginUser.email
		};
		this.apiService.put(this.url, this.UserData)
			.subscribe((response) => {
				if (response.success == true) {
					this.snackbarService.openSuccessBar("Phone number updated successfully", "User")
					this.router.navigate(['/users/userList']);
				} else {
					alert("Update phone number is failed!!!");
				}
			});
	}

	goBack() {
		this.router.navigate(['/users/userList'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
	}

	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}