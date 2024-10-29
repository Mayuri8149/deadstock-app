import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UploadService } from 'src/app/services/upload.service';
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
  filename: any;
  fileData: File = null;
  myFiles:string [] = [];
  filesToUpload: Array<File> = [];
  localUrl: any[];
  folderName:any;
  islayoutPathError = false;
  assetCategoryDetails=[];
  organizationId;
  assetCategoryId;
  provenanceTemplatePath;
  flag = true
  constructor(private _formBuilder: FormBuilder, private apiService: ApiService, private route: ActivatedRoute, public router: Router, private location: Location, public snackbarService: SnackbarService,private uploadService: UploadService) { }

  ngOnInit(): void {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
    this.AssetCategoryForm = this._formBuilder.group({
      assetCategory: ['',[Validators.required]],
      provenanceTemplatePath: ['', [Validators.required]]
    });
    this.referenceId = this.route.snapshot.params['referenceId'];
    this.organizationId = this.route.snapshot.params['organizationId'];
    this.getAssetCategory()
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.AssetCategoryForm.controls[controlName].hasError(errorName);
  }

  layoutPathErrorHandler() {
    if (this.AssetCategoryForm.get('layoutPath').hasError('required')) {
      return 'Path is required';
    }
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

      btnTypes(type){
        this.assetCategoryId = type._id
        this.url = "/assetCategory/" + this.assetCategoryId;
        var params = new HttpParams();
            
        this.subscriptions.push(this.apiService.getAsset(this.url, params)
            .subscribe((response) => {
              if (response.success == true) {
                this.AssetCategoryForm.patchValue({ provenanceTemplatePath: response.data.provenanceTemplatePath });
                if(response.data.provenanceTemplatePath){
                  this.flag = false
                }else{
                  this.flag = true
                }
              }	
            }));
      }

      createAssetCategory(details) {
        if (details.invalid && this.AssetCategoryForm.get('layoutPath').invalid) {
          this.islayoutPathError = true;
        }
        let selectedItem = JSON.parse(sessionStorage.getItem('credData'));
        this.url = "/assetCategory/editAssetCat";
     
        var data = {
          id: this.assetCategoryId,
          provenanceTemplatePath: details.value.provenanceTemplatePath
        };
    
        this.subscriptions.push(this.apiService.post_transactions(this.url, data)
          .subscribe((response:any) => {
            if (response.success == true) {
              let credDataId = sessionStorage.getItem('credDataId');
              if(this.flag == true){
                this.snackbarService.openSuccessBar('Asset category Details Added successfully.', "Asset category Details");
							}else{
								this.snackbarService.openSuccessBar('Asset category Details updated successfully.', "Asset category Details");
							}
              this.goBack()
            }
          }));  
      };

  goBack() {
    this.location.back();
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  };
}