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
  selector: 'app-uom-update',
  templateUrl: './uom-update.component.html',
  styleUrls: ['./uom-update.component.css']
})
export class UomUpdateComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
  url: String;
  loggedInUser;
  UOMForm: FormGroup;
  noWhitespaceValidator: any;
  id;
  UOM;
  organizationId;
  moduleId;
  UOMData;
  AssetUOMData: {
		id: '',
		uom: '';
		decimal: '';
	};
  curPage:any=1;
  orgPerPage:any=5;
  constructor(private _formBuilder: FormBuilder, private apiService: ApiService, private route: ActivatedRoute, public router: Router, private location: Location, public snackbarService: SnackbarService,public errorDialogService: ErrorDialogService) { }

  ngOnInit(): void {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
    this.organizationId = this.loggedInUser.reference.organizationId;
    this.UOMForm = this._formBuilder.group({
      uom: ['', [Validators.required]],
      decimal: ['', [Validators.required]]
    });
    this.id = this.route.snapshot.params['id'];
    this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['recordPerPage'];
    this.getUOM(this.id);
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.UOMForm.controls[controlName].hasError(errorName);
  }

  updateUOM(details) {
    if(details.invalid) {
      return;
    }
  
    this.url = '/uom/edit';
    this.UOMData = details.value;

    var data = {
      id : this.id,
      organizationId: this.organizationId,
      uom : this.UOMData.uom,
      decimal : this.UOMData.decimal
    }

    this.subscriptions.push(this.apiService.post_transactions(this.url, data)
    .subscribe((response: any) => {
      if(response.success == true){
            this.snackbarService.openSuccessBar('UOM updated successfully.', "UOM");
            this.goBack()
          }
      },error => {
        var data = {
          reason: "UOM already exist!",
          status: ''
        };
        this.errorDialogService.openDialog(data);
      }));
}

  getUOM(id){
    this.url = "/uom/" + id;
		var params = new HttpParams();
		this.subscriptions.push(this.apiService.getAsset(this.url, params)
			.subscribe((response) => {
				if(response.success == true ) {	
					this.UOM = response.data;
					this.UOMForm.patchValue(this.UOM);
				} 
			}));
  }

  goBack() {
    this.router.navigate(['/assetuom/viewAssetUOM'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});

  }
  ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}