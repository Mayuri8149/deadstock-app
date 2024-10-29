import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-asset-category-update',
  templateUrl: './asset-category-update.component.html',
  styleUrls: ['./asset-category-update.component.css']
})
export class AssetCategoryUpdateComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  url: String;
  loggedInUser;
  entities = ['Corporate', 'Individual']
  AssetCategoryForm: FormGroup;
  noWhitespaceValidator: any;
  urls: String;
  flag = true;
  id;
  assetCat;
  organizationId;
  moduleId;
  AssetCatData:any;
  AssetCategoryData: {
		id: '',
		assetCategoryName: '';
		assetCategoryDescription: '';
	};
  constructor(private _formBuilder: FormBuilder, private apiService: ApiService, private route: ActivatedRoute, public router: Router, private location: Location, public snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
    this.AssetCategoryForm = this._formBuilder.group({
      assetCategoryName: ['', [Validators.required]],
      assetCategoryDescription: ['', [Validators.required]]
    });
    this.id = this.route.snapshot.params['id'];
    this.organizationId = this.route.snapshot.queryParams['organizationId'];
    this.moduleId = this.route.snapshot.queryParams['moduleId'];
    this.getAssetCategory(this.id);
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.AssetCategoryForm.controls[controlName].hasError(errorName);
  }

  updateAssetCategory(details: NgForm) {

    if(details.invalid) {
      return;
    }  
    this.url = '/assetcategory/edit';
    this.AssetCatData = details.value;

    var data = {
      id : this.id,
      assetCategoryName : this.AssetCatData.assetCategoryName,
      assetCategoryDescription : this.AssetCatData.assetCategoryDescription
    }

    this.subscriptions.push(this.apiService.post(this.url, data)
    .subscribe((response: any) => {
      if(response.success == true){
            this.snackbarService.openSuccessBar('Asset category updated successfully.', "Asset Category");
            this.goBack()
          }
      }));
}

  getAssetCategory(id){
    this.url = "/assetcategory/getAssetCategories";
		var params = new HttpParams();
    params = params.append('assetCategoryId', id);

		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response) => {
				if(response.success == true ) {	
					this.assetCat = response.data.assetCat.assetCat[0];
					this.AssetCategoryForm.patchValue(this.assetCat);
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