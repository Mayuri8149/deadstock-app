import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatTableDataSource } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';
import { DataShareServices } from 'src/app/services/data-share.services';
import { ErrorDialogService } from 'src/app/services/error-dialog.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UploadService } from 'src/app/services/upload.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-organization-update',
  templateUrl: './organization-update.component.html',
  styleUrls: ['./organization-update.component.css']
})

// @NgModule({
// 	imports: [
// 	   BrowserModule, 
// 	   Ng2SearchPipeModule
// 	],
//   })


export class OrganizationUpdateComponent implements OnInit {
	private subscriptions: Subscription[] = [];
	faEye = faEye;
	id;
	instId;
	loginUser;
	loggedInUser;
	role;
	entity;
	logoPreviews;
	organizations;
	  kycForm: any = {};
	  disabled: boolean = false;
	organizationId = '';
	url: string;
	urlProduct: string;
	urlProductUpdate : string;
	instData:any;
	apiUrl;
	urls: String
	fileData: File = null;
	filename: any;
	userData;
	organizationData: {
		code: '';
		name: '',
		address: '',
		location: '',
		website: '',
		logo: '',
		email: '',
		phoneNumber: '',
		entityType,
		locationCoordinates:{
			longitude:'',
			latitude:''
		}
	};

	organizationDetailForm: FormGroup;
	locationlist: any[];
	addressLine: any;
	adminDistrict: any;
	countryRegion: any;
	locality: any;
	postalCode: any;
	location_lat: any;
	location_long: any;
	branch: any;
	dataSource = new MatTableDataSource<any>();
	locObj = {
		longitude:'',
		latitude:''
	};
	selectedstaticFiles: any;
	showImgStatic: boolean;
	imageErrorStatic: string;
	fileUploadedStatic: any;
	resultSrcStatic: any;
	fileStaticName: any;
	fileValueStatic: any;
	
	isImageStatic: boolean;
	isPdfStatic: boolean;
	urlSrcStatic: any;
	@ViewChild('myModel',{static: false}) myModel: ModalDirective;
	constructor(private _formBuilder: FormBuilder,
				private apiService: ApiService,
				private route: ActivatedRoute,
				public router: Router,
				private location: Location,
				public errorDialogService: ErrorDialogService,
				public snackbarService: SnackbarService,
				public DataShareServices: DataShareServices,
				private uploadService: UploadService
				) { 
					this.subscriptions.push(this.route.paramMap.subscribe(params => {
						this.organizationId = params.get('instId');
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
		this.id = this.route.snapshot.params['instId'];
		this.organizationDetailForm = this._formBuilder.group({
			code: ['', Validators.required],
			name: ['', [Validators.required, Validators.pattern('^(?! )(?!.* $)[a-zA-Z0-9 ()-]+$'),this.noWhitespaceValidator]],
			email: [''],		
			address: ['', Validators.required],		
			location: [ '', Validators.required],		
			website: ['',[Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],		
			phoneNumber: [undefined, [Validators.required]],
			logo : [''],
			entityType: ['',[Validators.required]]
		});
		this.getOrganization(this.id);
	}

	viewInstitudeDetails() {
		this.router.navigate(['/organizations/organizationDetails']);
	}

	getOrganization(id) {
		this.url = "/organization/OrgDetails/"+ id;
		var params = new HttpParams();
	
		this.subscriptions.push(this.apiService.get(this.url, id)
			.subscribe((response) => {
				if(response.success == true ) {						
						this.organizationData = response.data;
						this.organizationData.phoneNumber = response.data.user.phoneNumber;
						this.organizationData.email = response.data.user.email;
						this.organizationDetailForm.patchValue(this.organizationData);				
				} 
			}));
	};

	ChooseFile(event) {	
		this.selectedstaticFiles = event.target.files;
		const max_size =  2097152 //20971520;    
		const allowed_types = ['image/png', 'image/jpeg','image/jpg'];
		if (this.selectedstaticFiles[0].size > max_size) {
			this.showImgStatic =false;
			this.imageErrorStatic ='Maximum size allowed is 2MB';
			return false;
		}
	
		if (!_.includes(allowed_types, this.selectedstaticFiles[0].type)) {
			this.showImgStatic =false;
			this.imageErrorStatic = 'Only Files are allowed ( JPG | PNG | JPEG)';
			return false;
		}
		this.showImgStatic =true;
		this.fileUploadedStatic=event.target.files;
		var reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		reader.onload = (event: any) => {
		  this.resultSrcStatic = event.target.result;
		}
		
		this.logoPreviews = window.URL.createObjectURL(event.target.files[0]);
		this.fileStaticName =this.uploadService.findFileName(this.selectedstaticFiles[0].name);
		this.fileValueStatic =this.selectedstaticFiles.item(0);

	};

	updateOrganization(instData: NgForm) {
		if(this.fileStaticName){
			instData.value.logo = this.fileStaticName;
		}	
			if(!instData.form.valid) {
				var errordata = {
					reason: "Please fill all the mandatory Fields.!",
					status: ''
				};
				this.errorDialogService.openDialog(errordata);
				return;
			}
			this.url = '/organization/edit';
			this.instData = instData.value;
			this.instData.updatedBy = {
				firstName:this.loggedInUser.firstName,
				lastName:this.loggedInUser.lastName,
				email:this.loggedInUser.email
			}
		   
		   if(!this.location_long && !this.location_lat){
			this.location_long = this.organizationData.locationCoordinates.longitude;
			this.location_lat = this.organizationData.locationCoordinates.latitude;	
			}else{
				this.location_long = this.location_long;
				this.location_lat = this.location_lat;
			}
		   var data = {
				id : this.id,
				code : this.instData.code,
				name : this.instData.name,
				updatedBy : this.instData.updatedBy,
				address : this.instData.address,
				locationCoordinates : {
					longitude: this.location_long,
					latitude: this.location_lat
				},
				logo : this.instData.logo,
				location : this.instData.location,
				phoneNumber : this.instData.phoneNumber,
				website : this.instData.website,
				entityType : this.instData.entityType
			}					

			var datas = {
				id : this.organizationId,
				address : this.instData.address,
				location : this.instData.location
			}

							this.urls = '/department/edit';	
							this.subscriptions.push(this.apiService.post(this.url, data)
							.subscribe((response: any) => {
								if(response.success == true){									
									if(this.fileStaticName!=undefined){
										const fileN= "Logo/" +this.fileStaticName;
										this.uploadService.uploadFile(this.fileValueStatic,fileN);
										if(this.logoPreviews)
											this.DataShareServices.setInstLogoPreviewData(this.logoPreviews);
									}
									this.apiService.post(this.urls, datas)
									.subscribe((response: any) => {	
									})
									this.snackbarService.openSuccessBar('Organization Details updated successfully.', "Organization Details");
									this.goBack();
								}
								}));
	}
	
	goBack() {
		this.location.back();
	}

	getCitySuggestion(searchValue: string): void {
		this.url = environment.bingMapBaseURL + "REST/v1/Autosuggest";
		var params = new HttpParams();
		params = params.append('query', searchValue);
		params = params.append('key', environment.bingMapAPIKey);
		this.subscriptions.push(this.apiService.getExternalURL(this.url, params)
			.subscribe((response: any) => {
			  this.dataSource.data =  response.resourceSets[0].resources[0].value;
			  this.locationlist=response.resourceSets[0].resources[0].value;			  
			}));
	}

	onSellocation(locationData){
		let locationArr = (locationData!='') ? locationData.split("|") :[];
		if(locationArr.length) {
			this.addressLine = locationArr[1];
			this.adminDistrict = locationArr[2];
			this.countryRegion = locationArr[3];
			this.locality = locationArr[4];
			this.postalCode = locationArr[5];
			this.branch = locationArr[0];
			this.organizationDetailForm.patchValue({address:locationArr[0]});
			this.url = environment.bingMapBaseURL + "REST/v1/Locations";
			var params = new HttpParams();			
            params = params.append('q', this.branch);
			params = params.append('maxResults', '10');
			params = params.append('key', environment.bingMapAPIKey);	
	
			this.subscriptions.push(this.apiService.getExternalURL(this.url, params)
			  .subscribe((response: any) => {
				this.location_long = response.resourceSets[0].resources[0].geocodePoints[0].coordinates[0];
				this.location_lat = response.resourceSets[0].resources[0].geocodePoints[0].coordinates[1];
				this.locObj.longitude=this.location_long;
				this.locObj.latitude=this.location_lat;	
			  }));		   
		}else{    
		 }
	  }
	  previewFileStatic(files){
		this.myModel.show();
		  if (files && files[0]) {
			if(files[0].type == "application/pdf") {
				this.isImageStatic = false;
				this.isPdfStatic = true;      // required, going forward
			}else {
				this.isPdfStatic = false;
				this.isImageStatic = true;    // required, going forward
			}
			this.urlSrcStatic =this.resultSrcStatic;
		  }
	  }
	  
		hide(){
		  this.myModel.hide();
		}

		@ViewChild("autoAddress") autocompleteAddress: MatAutocomplete;
		@ViewChild("id_Container") divs: ElementRef;
		opened_AutoComplete = ()=> {
		  let inputWidth = this.divs.nativeElement.getBoundingClientRect().width
		  setTimeout(()=>{
			
			var screen_width = window.innerWidth;
			if(screen_width < 960){	
				let panel = this.autocompleteAddress.panel?.nativeElement;
				if (!panel ) return		
				panel.style.maxWidth = (inputWidth - 50) + "px";
			}
			
			})
		} 
		ngOnDestroy() {
			this.subscriptions.forEach(subscription => subscription.unsubscribe());
		};		
}