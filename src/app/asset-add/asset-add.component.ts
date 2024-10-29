import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ErrorDialogService } from '../services/error-dialog.service';

@Component({
  selector: 'app-asset-add',
  templateUrl: './asset-add.component.html',
  styleUrls: ['./asset-add.component.css']
})
export class AssetAddComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
  assetCategoryForm: FormGroup;
	loggedInUser;
  url: string;
  assetCategoryDetails=[];
  organizationId;
  assetCategoryId;
  assetcatList
  assetList=[]  
  abc=[]
  typed:any
  constructor(private _formBuilder: FormBuilder,
    private apiService: ApiService,
    public router: Router,
    private location: Location,
    public errorDialogService: ErrorDialogService,
    public snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
    this.organizationId = this.loggedInUser.reference.organizationId;
		this.assetCategoryForm = this._formBuilder.group({
      assetCategory: ['',[Validators.required]],
			assetName: ['',[Validators.required]],
			assetDescription: ['',[Validators.required]]
		});
    this.getAssetCategory()
  }

  public hasError = (controlName: string, errorName: string) =>{		
		return  this.assetCategoryForm.controls[controlName].hasError(errorName);		
	}
  btnTypes(type) {
    this.assetCategoryId = type._id
    this.typed = type
     
  }
  addAssetCategory(assetCatData) {
		if(assetCatData.invalid) {
			return;
		}
		this.url = '/assetCategory/edit';
    this.assetList = [{
      assetName: assetCatData.value.assetName,
      assetDescription: assetCatData.value.assetDescription
    }]
   
    this.assetcatList = this.typed.assetList
    this.abc = this.assetcatList.concat(this.assetList)
    
    var data ={
      id: this.assetCategoryId,
      organizationId: this.organizationId,
      assetList: this.abc,
      assetName: assetCatData.value.assetName
    }
  
    this.subscriptions.push(this.apiService.post_transactions(this.url, data)
			.subscribe((response: any) => {
				if(response.success == true) {
					this.snackbarService.openSuccessBar('Your asset added successfully.', "Asset");
          this.router.navigate(['/assetname/viewAsset']);
        }
			},error => {
        var data = {
          reason: "Asset Name already exist!",
          status: ''
        };
        this.errorDialogService.openDialog(data);
      }));
	}

  getAssetCategory(){
		this.url = "/assetCategory/";
		var params = new HttpParams();
    params = params.append('startIndex', "0");
    params = params.append('limit', "200");
		params = params.append('organizationId', this.organizationId);	
    this.subscriptions.push(this.apiService.getAsset(this.url, params)
				.subscribe((response) => {
          if (response.success == true) {
						this.assetCategoryDetails = response.data.result;
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
