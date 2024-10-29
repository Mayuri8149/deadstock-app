import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-asset-category-update',
  templateUrl: './asset-category-update.component.html',
  styleUrls: ['./asset-category-update.component.css']
})
export class AssetCategoryUpdateComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
  url: String;
  loggedInUser;
  AssetCategoryForm: FormGroup;
  noWhitespaceValidator: any;
  id;
  assetCat;
  AssetCatData:any;
  AssetCategoryData: {
		id: '',
		assetCategory: '';
		assetCategoryDescription: '';
	};
  curPage:any=1;
  orgPerPage:any=5;
  constructor(private _formBuilder: FormBuilder, private apiService: ApiService, private route: ActivatedRoute, public router: Router, private location: Location, public snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
    this.AssetCategoryForm = this._formBuilder.group({
      assetCategory: ['', [Validators.required]],
      assetCategoryDescription: ['', [Validators.required]]
    });
    this.id = this.route.snapshot.params['id'];
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
  
    this.url = '/assetcategory/editAssetCat';
    this.AssetCatData = details.value;

    var data = {
      id : this.id,
      assetCategory : this.AssetCatData.assetCategory,
      assetCategoryDescription : this.AssetCatData.assetCategoryDescription
    }

    this.subscriptions.push(this.apiService.post_transactions(this.url, data)
    .subscribe((response: any) => {
      if(response.success == true){
            this.snackbarService.openSuccessBar('Asset category updated successfully.', "Asset Category");
            this.goBack()
          }
      }));
}

  getAssetCategory(id){
    this.url = "/assetCategory/" + id;
		var params = new HttpParams();

		this.subscriptions.push(this.apiService.getAsset(this.url, params)
			.subscribe((response) => {
				if(response.success == true ) {	
					this.assetCat = response.data;
					this.AssetCategoryForm.patchValue(this.assetCat);
				} 
			}));
  }

  goBack() {
    this.router.navigate(['/assetcategory/viewAssetCategory'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
  }
  ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}