import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, NgModule, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatTableDataSource } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-branch-add',
  templateUrl: './branch-add.component.html',
  styleUrls: ['./branch-add.component.css']
})

// @NgModule({
// 	imports: [
// 	   BrowserModule, 
// 	   Ng2SearchPipeModule
// 	],
//   })

export class BranchAddComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	insDeptForm: FormGroup;
	loggedInUser;
	inst_id;
	dept = {
		organizationId: '',
		code: '',
		name: '',
		branch_address: '',
		branch_location: '',
		locationCoordinates: {},
		createdBy:{},
		updatedBy:{}
	};
	url: string;	
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
	availableCode: boolean = false;
	availableName: boolean = false;

	constructor(private _formBuilder: FormBuilder,
				private apiService: ApiService,
				public router: Router,
				private location: Location,
				public snackbarService: SnackbarService) { }

	public noWhitespaceValidator(control: FormControl) {
		const isWhitespace = (control.value || '').trim().length === 0;
		const isValid = !isWhitespace;
		return isValid ? null : { 'whitespace': true };
	}

	ngOnInit() {
		this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
		this.inst_id = this.loggedInUser.reference.organizationId;
		this.insDeptForm = this._formBuilder.group({
			organizationId: [{value: this.inst_id, disabled: true}, Validators.required],
			code: ['', [Validators.required, Validators.pattern('^(?! )(?!.* $)[A-Za-z0-9_@./#&+-][A-Za-z0-9 _@./#&+-]*$'), this.noWhitespaceValidator]],
			name: ['', [Validators.required, Validators.pattern('^(?! )(?!.* $)[a-zA-Z0-9 ()-]+$'), this.noWhitespaceValidator]],
			branch_location: ['',[Validators.required]],
			branch_address: ['',[Validators.required]]
		});
	}

	public hasError = (controlName: string, errorName: string) =>{		
		return  this.insDeptForm.controls[controlName].hasError(errorName);		
	}

	viewDepartments() {
		this.router.navigate(['/branches/listofBranches']);
	}

	getDepartmentByOrganization(value,type) {
		if(value!=undefined){
			this.url = "/branch"
			let params = new HttpParams();
			// params = params.append('code', this.insDeptForm?.controls['code']?.value);
			// params = params.append('name', this.insDeptForm?.controls['name']?.value);
			if(type=='code'){
				this.availableCode= false
				params = params.append('code', value);
			}
			if(type=='name'){
				this.availableName= false
				params = params.append('name',value);
			}
			params = params.append('organizationId', this.inst_id);
			params = params.append('startIndex', "0");
			params = params.append('limit', "1000");
			params = params.append('allFields', "true");
		
			this.subscriptions.push(this.apiService.getAsset(this.url, params)
			.subscribe((response) => {
				if (response.success == true) {
					console.log("response.data.result",response.data.result)
					if(type=='code'){
						this.availableCode= false
						if(response.data.result.length>0){
							this.availableCode= true
						}else{
							this.availableCode= false
						}
					}else if(type=='name'){
						this.availableName= false
						if(response.data.result.length>0){
							this.availableName= true
						}else{
							this.availableName= false
						}
					}
					
				}
			}))
		}
		
	  }
	

	addDept(deptData: NgForm) {
		if(deptData.invalid) {
			return;
		}
		if(this.availableName || this.availableCode){
			return;
		}
		this.url = '/department/create';
		this.dept.organizationId = this.inst_id;
		this.dept.code = deptData.value.code;
		this.dept.name = deptData.value.name;
		this.dept.branch_location = deptData.value.branch_location;
		this.dept.branch_address = deptData.value.branch_address;
		this.dept.locationCoordinates = {
			longitude: this.location_long,
			latitude: this.location_lat
		}
		this.dept.createdBy = {
			firstName:this.loggedInUser.firstName,
			lastName:this.loggedInUser.lastName,
			email:this.loggedInUser.email
		},
		this.dept.updatedBy = {
			firstName:this.loggedInUser.firstName,
			lastName:this.loggedInUser.lastName,
			email:this.loggedInUser.email
		}
		
		this.subscriptions.push(this.apiService.post(this.url, this.dept)
			.subscribe((response: any) => {
				if(response.success == true) {
					this.snackbarService.openSuccessBar('Your branch added successfully.', "Branch");
					this.viewDepartments();
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
			this.insDeptForm.patchValue({branch_address:locationArr[0]});
			this.url = environment.bingMapBaseURL + "REST/v1/Locations";
			var params = new HttpParams();			
            params = params.append('q', this.branch);
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
	  ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
	@ViewChild("autoAddress") autocompleteAddress: MatAutocomplete;
  @ViewChild("Id_container") divs: ElementRef;
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
}