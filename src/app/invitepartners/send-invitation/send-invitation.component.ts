import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-send-invitation',
  templateUrl: './send-invitation.component.html',
  styleUrls: ['./send-invitation.component.css']
})
export class SendInvitationComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
  url: String;
  loggedInUser;
  entities = ['Corporate', 'Individual']
  relationShip:any={}
  InvitationForm: FormGroup;
	noWhitespaceValidator: any;
	constructor(private _formBuilder: FormBuilder, private apiService: ApiService, public router: Router, private location: Location, public snackbarService: SnackbarService) { }

	ngOnInit() {
		this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
		this.InvitationForm = this._formBuilder.group({
			email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')]],
			entityName: ['', [Validators.required, Validators.pattern('^(?! )(?!.* $)[A-Za-z0-9_@./#&+-][A-Za-z0-9 _@./#&+-]*$')]]
		});

		if (this.loggedInUser.reference.role != 'admin') {
         this.getRelationShip()
		}
	}

	public hasError = (controlName: string, errorName: string) => {
		return this.InvitationForm.controls[controlName].hasError(errorName);
	}

	radioChange(event) {
		event
	}

	getRelationShip(){
		var params = new HttpParams();
		params = params.append('pagesize', '10');
		params = params.append('page', '1');
		params = params.append('childEntity', this.loggedInUser.corpData._id);
		this.url = "/invitepartner/getPartnersByOrgId";
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response) => {
				if (response.success == true) {
					if (response.data.partners.partners) {
						this.relationShip = response.data.partners.partners[0];
					}
				}
			}))
	}

	sendInvitation(invitationData) {
		if (invitationData.invalid) {
			return false;
		}
		var data = {}
		if (this.loggedInUser.reference.role == 'admin') {
			data = {
				email: invitationData.value.email,
				entityName:invitationData.value.entityName,
				entity: 'corporate',
				status: 'invited',
				organizationId: this.loggedInUser.reference.organizationId,
				partnerEntity: this.loggedInUser.reference.organizationId,
				createdBy: this.loggedInUser._id,
				updatedBy: this.loggedInUser._id,
			}
		} else {
			data = {
				email: invitationData.value.email,
				entityName:invitationData.value.entityName,
				entity: 'corporate',
				status: 'invited',
				partnerEntity: this.loggedInUser.corpData._id,
				organizationId: this.relationShip.organizationId,
				createdBy: this.loggedInUser._id,
				updatedBy: this.loggedInUser._id,
			}
		}
		this.url = "/invitepartner/create";
		this.subscriptions.push(this.apiService.post(this.url, data)
			.subscribe((response: any) => {
				if (response.success == true) {
					this.snackbarService.openSuccessBar("Invitation send successfully", "Successfully");
					this.router.navigate(['/partners/invitepartners']);
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