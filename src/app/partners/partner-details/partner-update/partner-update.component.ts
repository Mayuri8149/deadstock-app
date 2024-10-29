import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from '../../../services/api.service';
import { DataSharingServices } from '../../../services/data-sharing.services';
import { SnackbarService } from '../../../services/snackbar.service';
import { UploadService } from '../../../services/upload.service';
import { environment } from '../../../../environments/environment';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-partner-update',
  templateUrl: './partner-update.component.html',
  styleUrls: ['./partner-update.component.css']
})
export class PartnerUpdateComponent implements OnInit {
	private subscriptions: Subscription[] = [];
    faEye=faEye;
  id;
    loginUser;
    url: string;
    fileData: File = null;
    filename: any;
    userData;
    corporateData = {
        id: '',
        companyName: '',
        phoneNumber: '',
        logo: '',
        location: '',
        address: '',
        entityType: ''
  };
  corporateId;
  corporates;
  corpLogoPreviews;

  locationlist: any[];
  addressLine: any;
  adminDistrict: any;
  countryRegion: any;
  locality: any;
  postalCode: any;
  locationbranch: any;
  location_lat: any;
  location_long: any;
  dataSource = new MatTableDataSource<any>();
  
  locObj = {
    longitude:'',
    latitude:''
  };
    corporateDetailForm: FormGroup;
    selectedstaticFiles: any;
    showImgStatic: boolean;
    imageErrorStatic: string;
    fileUploadedStatic: any;
    resultSrcStatic: any;
    logoPreviews: string;
    fileStaticName: any;
    fileValueStatic: any;
    @ViewChild('myModel',{static: false}) myModel: ModalDirective;
    isImageStatic: boolean;
    isPdfStatic: boolean;
    urlSrcStatic: any;
    constructor(private _formBuilder: FormBuilder,
                private apiService: ApiService,
                private route: ActivatedRoute,
                public router: Router,
                private location: Location,
                public snackbarService: SnackbarService,
                private dataSharingServices: DataSharingServices,
                private uploadService: UploadService
                ) { 
                    this.subscriptions.push(this.route.paramMap.subscribe(params => {
                        this.corporateId = params.get('corpId');
                    }))
    }
    
    public noWhitespaceValidator(control: FormControl) {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { 'whitespace': true };
    }

    ngOnInit() {
        this.id = this.route.snapshot.params['corpId'];
        this.corporateDetailForm = this._formBuilder.group({
            companyName: ['', [Validators.required]],
            phoneNumber: ['', [Validators.required]],
            location : ['', [Validators.required]],
            address : ['',[Validators.required]],
            logo : [''],
            entityType: ['',[Validators.required]]
        });
        this.getCorporate(this.id);
    }
    public hasError = (controlName: string, errorName: string) =>{		
		return  this.corporateDetailForm.controls[controlName].hasError(errorName);		
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
            this.locationbranch = locationArr[0];
            this.corporateDetailForm.patchValue({address:locationArr[0]});
            this.url = environment.bingMapBaseURL + "REST/v1/Locations";
            var params = new HttpParams();            
            params = params.append('q', this.locationbranch);
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

    getCorporate(id) {
        this.url = "/corporate/"+ id;
        var params = new HttpParams();
    
        this.subscriptions.push(this.apiService.get(this.url, id)
            .subscribe((response) => {
                if(response.success == true ) {
                        this.corporates = response.data;
                        for(var i=0;i<this.corporates.length;i++) {
                            if(this.corporates[i].isActive == true) {
                                this.corporates[i].status = "Active";
                            } else {
                                this.corporates[i].status = "Inactive";
                            }
                        }
                        this.corporateDetailForm.patchValue(this.corporates);                
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
            this.corpLogoPreviews = window.URL.createObjectURL(event.target.files[0]);
            this.fileStaticName =this.uploadService.findFileName(this.selectedstaticFiles[0].name);
            this.fileValueStatic =this.selectedstaticFiles.item(0);    
        };    

    updateCorporate(corpData) {
        if(this.fileStaticName){
			corpData.value.logo = this.fileStaticName;
		}	  
            if(corpData.invalid) {
                return;
            }
            this.corporateData = corpData.value;

            if(!this.locObj.longitude && !this.locObj.latitude){
                this.locObj.longitude=this.corporates.locationCoordinates.longitude;
                this.locObj.latitude=this.corporates.locationCoordinates.latitude;
                }else{
                    this.locObj.longitude=this.locObj.longitude;
                    this.locObj.latitude=this.locObj.latitude;
                }

            var data = {
                id : this.id,
                companyName : this.corporateData.companyName,
                phoneNumber : this.corporateData.phoneNumber,
                code : this.corporateData.companyName,
                location : this.corporateData.location,
                locationCoordinates:this.locObj,
                address : this.corporateData.address,   
                logo : this.corporateData.logo, 
                entityType : this.corporateData.entityType
            }
            this.url = '/corporate/edit';
            this.subscriptions.push(this.apiService.post(this.url, data)
                .subscribe((response: any) => {
                    if(response.success == true) {
                        if(this.fileStaticName!=undefined){
                            const fileN= "Logo/" +this.fileStaticName;
                            this.uploadService.uploadFile(this.fileValueStatic,fileN);
                            if(this.corpLogoPreviews)
                                this.dataSharingServices.setLogoPreviewData(this.corpLogoPreviews);
                        }                    
                        this.snackbarService.openSuccessBar('Your Entity Details updated successfully.', "Entity Details");
                        this.router.navigate(['/partner/partnerDetails']);
                    }
                }));
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
    
    goBack() {
        this.location.back();
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