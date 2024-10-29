import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-add-agency-user',
  templateUrl: './add-agency-user.component.html',
  styleUrls: ['./add-agency-user.component.css']
})
export class AddAgencyUserComponent implements OnInit { 
	private subscriptions: Subscription[] = [];
	url: String;
	user: any = {		
		firstName: '',
		lastName: '',
		role: '',
		entity: '',
		email: '',
		phoneNumber: ''
	};
	loggedInUser;
	role;
	subrole1 : any;
	entity;
	verifierId;
	corporate: boolean = false;
	authUserForm: FormGroup;
  	noWhitespaceValidator: any;
	constructor(private _formBuilder: FormBuilder,
				private apiService: ApiService,
				public router: Router,
				private location: Location,
				public snackbarService: SnackbarService) { }

	ngOnInit() {
		this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
		this.role = this.loggedInUser.reference.role;
		this.entity = this.loggedInUser.reference.entity;
		this.authUserForm = this._formBuilder.group({
			role: ['', Validators.required],
			entity: [''],
			subrole: [''],
		    email: ['', [Validators.required, Validators.email]],
			firstName: ['', [Validators.required, Validators.pattern('^(?! )(?!.* $)[a-zA-Z ()-]+$')]],
			lastName: ['', [Validators.required, Validators.pattern('^(?! )(?!.* $)[a-zA-Z ()-]+$')]],
			phoneNumber: [undefined, [Validators.required]],
		});
	}

	public hasError = (controlName: string, errorName: string) =>{
		return  this.authUserForm.controls[controlName].hasError(errorName);
	}
	onCountryChange(event){
	}
	telInputObject(event){
	}
	
	addUser(userData) {
		if(userData.invalid) {
			return false;
		}
		var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
		this.url = '/user/create';
		this.user.firstName = userData.value.firstName;
		this.user.lastName = userData.value.lastName;
		this.user.role =  userData.value.role;
		this.user.email =  userData.value.email;
		this.user.phoneNumber =  userData.value.phoneNumber;
		this.user.corporateId =  this.loggedInUser.corpData._id;
		this.user.organizationId =  this.loggedInUser.reference.organizationId;
		this.user.departmentId =  this.loggedInUser.reference.departmentId;
		this.user.entity = this.entity;
		this.user.timeZone = timeZone
		this.user.createdBy = {
			firstName:this.loggedInUser.firstName,
			lastName:this.loggedInUser.lastName,
			email:this.loggedInUser.email
		};
		this.user.updatedBy = {
			firstName:this.loggedInUser.firstName,
			lastName:this.loggedInUser.lastName,
			email:this.loggedInUser.email
		};
		this.subscriptions.push(this.apiService.post(this.url, this.user)
			.subscribe((response: any) => {
				if(response.success == true) {
					this.snackbarService.openSuccessBar("User added successfully", "User");
					this.router.navigate(['/users/userList']);
				}		
		}));
	}

	goBack() {
		this.location.back();
	}
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}