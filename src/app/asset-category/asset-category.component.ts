import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ErrorDialogService } from '../services/error-dialog.service';

@Component({
  selector: 'app-asset-category',
  templateUrl: './asset-category.component.html',
  styleUrls: ['./asset-category.component.css']
})
export class AssetCategoryComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
  assetCategoryForm: FormGroup;
	loggedInUser;
  url: string;
  organizationId;
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
			assetCategoryDescription: ['',[Validators.required]]
		});
  }

  public hasError = (controlName: string, errorName: string) =>{		
		return  this.assetCategoryForm.controls[controlName].hasError(errorName);		
	}

  addAssetCategory(assetCatData) {
		if(assetCatData.invalid) {
			return;
		}
		this.url = '/assetCategory/create';
    var data ={
      organizationId: this.organizationId,
      assetCategory: assetCatData.value.assetCategory,
      assetCategoryDescription: assetCatData.value.assetCategoryDescription
    }
		
    this.subscriptions.push(this.apiService.post_transactions(this.url, data)
			.subscribe((response: any) => {
				if(response.success == true) {
					this.snackbarService.openSuccessBar('Your asset category added successfully.', "Asset Category");
          this.router.navigate(['/assetcategory/viewAssetCategory']);
        }
			},error => {
        var data = {
          reason: "Asset Category already exist!",
          status: ''
        };
        this.errorDialogService.openDialog(data);
      }));
	}

	goBack() {
		this.location.back();
	}
  ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}