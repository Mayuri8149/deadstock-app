import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { ErrorDialogService } from '../../../services/error-dialog.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-partner-update',
  templateUrl: './partner-update.component.html',
  styleUrls: ['./partner-update.component.css']
})

export class PartnerUpdateComponent implements OnInit {
	private subscriptions: Subscription[] = [];
	id;
	isBlockchainService;
	instId;
	loggedInUser;
	role;
	entity;
	organizations
	corporateId = '';
	url: string;
	urls: string
	instData:any;
	flag = true
	organizationData: {
		id: '',
		fabricChannelId: '';
		fabricOrgId: '';
	};

	organizationDetailForm: FormGroup;
	curPage:any=1;
	orgPerPage:any=5;
	listActivited;
	constructor(private _formBuilder: FormBuilder,
				private apiService: ApiService,
				private route: ActivatedRoute,
				public router: Router,
				private location: Location,
				public errorDialogService: ErrorDialogService,
				public snackbarService: SnackbarService
				) { 
					this.subscriptions.push(this.route.paramMap.subscribe(params => {
						this.corporateId = params.get('corporateId');
					}))
	}
	
	public noWhitespaceValidator(control: FormControl) {
		const isWhitespace = (control.value || '').trim().length === 0;
		const isValid = !isWhitespace;
		return isValid ? null : { 'whitespace': true };
	}

	public hasError = (controlName: string, errorName: string) =>{
		return  this.organizationDetailForm.controls[controlName].hasError(errorName);
	}

	ngOnInit() {
		this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
		
		this.role = this.loggedInUser.reference.role;
		this.entity = this.loggedInUser.reference.entity;
		this.id = this.route.snapshot.params['corporateId'];
		this.isBlockchainService = this.route.snapshot.params['isBlockchainService']
		this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['recordPerPage'];
		this.listActivited = this.route.snapshot.queryParams['listActivited'];
		this.organizationDetailForm = this._formBuilder.group({
			fabricChannelId: ['', Validators.required],
			fabricOrgId: ['', Validators.required]
		});
		this.getOrganization(this.id);
	}

	getOrganization(id) {
		this.url = "/corporate/"+ id;
		var params = new HttpParams();
	
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response) => {

				if(response.success == true ) {	
					this.organizations = response.data;
					this.organizationDetailForm.patchValue(this.organizations);
					if(this.organizations.fabricChannelId && this.organizations.fabricOrgId){
						this.flag = false
					}else{
						this.flag = true
					}
				} 
			}));
	};

	updateOrganization(instData) {

			if(instData.invalid) {
				return;
			}
		
			this.url = '/corporate/update';
			this.urls = '/corporate/'+ this.id +'/changeStatus';
			this.instData = instData.value;

			var data = {
				id : this.id,
				fabricChannelId : this.instData.fabricChannelId,
				fabricOrgId : this.instData.fabricOrgId
			}

			var datas = {
				id : this.id,
				isActive : true,
				isBlockchainService : this.isBlockchainService,
			}
				
			this.subscriptions.push(this.apiService.post(this.url, data)
			.subscribe((response: any) => {
				if(response.success == true){
					this.apiService.put(this.urls, datas)
					.subscribe((response) => {
						if(response.success == true) {
							if(this.flag == true){
								this.snackbarService.openSuccessBar('Fabric Configration added successfully.', "Fabric Configration");
							}else{
								this.snackbarService.openSuccessBar('Fabric Configration updated successfully.', "Fabric Configration");
							}
							this.goBack()
						}
					});
				}
			}));
	}
	
	goBack() {
		if(this.listActivited=='signedUp'){
			this.router.navigate(['partners/partnerList'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
		}else{
			this.router.navigate(['partners/invitepartners'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
		}
	  }
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}