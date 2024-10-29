import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ErrorDialogService } from '../services/error-dialog.service';
import { ValidateNumber } from '../validators/number.validator';

@Component({
  selector: 'app-asset-uom',
  templateUrl: './asset-uom.component.html',
  styleUrls: ['./asset-uom.component.css']
})
export class AssetUomComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];

  uomForm: FormGroup;
	loggedInUser;
  url: string;
  organizationId;

  constructor(private _formBuilder: FormBuilder,
    private apiService: ApiService,
    public router: Router,
    private location: Location,
    public errorDialogService: ErrorDialogService,
    public snackbarService: SnackbarService,
    public validateNumber: ValidateNumber) { }

  ngOnInit(): void {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
    this.organizationId = this.loggedInUser.reference.organizationId;
		this.uomForm = this._formBuilder.group({
      uom: ['',[Validators.required]],
			decimal: ['',[Validators.required]]
		});
  }

  public hasError = (controlName: string, errorName: string) =>{		
		return  this.uomForm.controls[controlName].hasError(errorName);		
	}

  addUom(uomData) {
		if(uomData.invalid) {
			return;
		}
		this.url = '/uom/create';

    var data ={
      organizationId: this.organizationId,
      uom: uomData.value.uom,
      decimal: uomData.value.decimal
    }
		
    this.subscriptions.push(this.apiService.post_transactions(this.url, data)
			.subscribe((response: any) => {
				if(response.success == true) {
					this.snackbarService.openSuccessBar('UOM added successfully.', "UOM");
          this.router.navigate(['/assetuom/viewAssetUOM']);
        }
      },error => {
          var data = {
            reason: "UOM already exist!",
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

  validateNo(e){
    this.validateNumber.validateNo(e);
  }  
}