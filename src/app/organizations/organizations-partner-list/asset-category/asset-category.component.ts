import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-asset-category',
  templateUrl: './asset-category.component.html',
  styleUrls: ['./asset-category.component.css']
})
export class AssetCategoryComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  url: String;
  loggedInUser;
  entities = ['Corporate', 'Individual']
  AssetCategoryForm: FormGroup;
  noWhitespaceValidator: any;
  referenceId: any
  urls: String;
  flag = true;
  id;
  assetCat;
  organizationId;
  moduleId;
  transactionTypeCode;
  moduleCode;
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
    this.id = this.route.snapshot.queryParams['id'];
		this.organizationId = this.route.snapshot.queryParams['organizationId'];
    this.moduleId = this.route.snapshot.queryParams['moduleId'];
    this.moduleCode = this.route.snapshot.queryParams['moduleCode'];
    this.transactionTypeCode = this.route.snapshot.queryParams['transactionTypeCode'];
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.AssetCategoryForm.controls[controlName].hasError(errorName);
  }


  createAssetCategory(details) {
    if (details.invalid) {
      return true;
    }
    this.url = "/assetcategory/create";
    var data = {
      organizationId: this.organizationId,
      moduleId: this.moduleId,
      moduleCode: this.moduleCode,
      transTypeId: this.id,
      transactionTypeCode: this.transactionTypeCode,
      assetCategoryName: details.value.assetCategoryName,
      assetCategoryDescription: details.value.assetCategoryDescription,
      createdBy: this.loggedInUser._id,
      updatedBy: this.loggedInUser._id,
    };
    this.subscriptions.push(this.apiService.post(this.url, data)
        .subscribe((response:any) => {
          if (response.success == true) {
            this.snackbarService.openSuccessBar('Asset category added successfully.', "Asset category");
            this.router.navigate(['/organizations/partnerList']);
          }
        }));  
  };
  goBack() {
    this.router.navigate(['/organizations/partnerList']);
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  };  
}