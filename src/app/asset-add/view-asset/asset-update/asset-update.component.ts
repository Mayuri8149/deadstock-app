import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ErrorDialogService } from 'src/app/services/error-dialog.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-asset-update',
  templateUrl: './asset-update.component.html',
  styleUrls: ['./asset-update.component.css']
})
export class AssetUpdateComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
  url: String;
  urls: String;
  loggedInUser;
  AssetCategoryForm: FormGroup;
  noWhitespaceValidator: any;
  id;
  assetListId;
  assetCat;
  AssetCatData:any;
  AssetCategoryData: {
		id: '',
		assetName: '';
		assetDescription: '';
	};
  assetList=[]
  organizationId;
  curPage:any=1;
  orgPerPage:any=5;
  constructor(private _formBuilder: FormBuilder, private apiService: ApiService, private route: ActivatedRoute, public router: Router, private location: Location, public snackbarService: SnackbarService,public errorDialogService: ErrorDialogService) { }

  ngOnInit(): void {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
    this.AssetCategoryForm = this._formBuilder.group({
      assetName: ['', [Validators.required]],
      assetDescription: ['', [Validators.required]]
    });
    this.organizationId = this.loggedInUser.reference.organizationId;
    this.id = this.route.snapshot.params['id'];
    this.assetListId = this.route.snapshot.params['assetListId'];
    this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['recordPerPage'];
    this.getAssetCategory(this.id);
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.AssetCategoryForm.controls[controlName].hasError(errorName);
  }

  updateAssetCategory(details) {
    if(details.invalid) {
      return;
    }
  
    this.url = '/assetcategory/edit';
    this.AssetCatData = details.value;
    var data = {
      id : this.id,
      assetListId : this.assetListId,
      organizationId: this.organizationId,
      assetName : this.AssetCatData.assetName,
      assetDescription : this.AssetCatData.assetDescription,
      assetFlag: "assetFlag"
    }

    this.subscriptions.push(this.apiService.post_transactions(this.url, data)
    .subscribe((response: any) => {
      if(response.success == true){
            this.snackbarService.openSuccessBar('Asset category updated successfully.', "Asset Category");
            this.goBack()
          }
      },error => {
        var data = {
          reason: "Asset Name already exist!",
          status: ''
        };
        this.errorDialogService.openDialog(data);
      }));
}

  getAssetCategory(id){
    this.url = "/assetCategory/" + id;
		var params = new HttpParams();
    params = params.append('assetListId', this.assetListId);
		this.subscriptions.push(this.apiService.getAsset(this.url, params)
			.subscribe((response) => {
				if(response.success == true ) {	
					this.assetCat = response.data;
					this.AssetCategoryForm.patchValue(this.assetCat.assetList[0]);
				} 
			}));
  }

  goBack() {
    this.router.navigate(['/assetname/viewAsset'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
  }
  ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}
