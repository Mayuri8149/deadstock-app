import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
//  End - Priyanka Patil 08-01-2021 (SCI-I558)
import { Subscription } from 'rxjs';
import { ErrorDialogService } from '../services/error-dialog.service';
@Component({
    selector: 'app-partner-registration',
    templateUrl: './partner-registration.component.html',
    styleUrls: ['./partner-registration.component.css']
})

export class PartnerRegistrationComponent implements OnInit { 
    private subscriptions: Subscription[] = [];
    url;
    companyDetails: FormGroup;
    individualDetails: FormGroup;
    fromPage: string;
    constructor(
        private authService: AuthService,
        public dialogRef: MatDialogRef<PartnerRegistrationComponent>,
        private http: HttpClient,
        public dialog: MatDialog,
        private _formBuilder: FormBuilder, 
        public router: Router,
        private location: Location,
        public apiService: ApiService,
        public snackbarService: SnackbarService,
        public errorDialogService: ErrorDialogService,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
        }

    ngOnInit() {       
        const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
        this.companyDetails = this._formBuilder.group({
            companyName: ['', [Validators.required, Validators.pattern('^(?! )(?!.* $)[A-Za-z0-9_@./#&+-][A-Za-z0-9 _@./#&+-]*$')]],
            firstName: ['', [Validators.required, Validators.pattern('^(?! )(?!.* $)[a-zA-Z ()-]+$')]],
            lastName: ['', [Validators.required, Validators.pattern('^(?! )(?!.* $)[a-zA-Z ()-]+$')]],
            email: ['',[Validators.required, Validators.email]],
            // ****************************Start Mahalaxmi (SCI-I764) 09/02/2021 **************************************************
			phoneNumber: [undefined, [Validators.required]],
			// ****************************End Mahalaxmi (SCI-I764) 09/02/2021 **************************************************
            //  Start - Priyanka Patil 08-01-2021 (SCI-I558)
            // Start - Recaptch commented code - Priyanka Patil 03-02-2021 (Develop)
            // recaptcha: (['', Validators.required]),
            // End - Recaptch commented code - Priyanka Patil 03-02-2021 (Develop)
			//  End - Priyanka Patil 08-01-2021 (SCI-I558)
        });   
        if(!sessionStorage.getItem('partnerId')){
            this.router.navigate(['']);
        }   
    }

    onCountryChange(event){
    }
    
	telInputObject(event){
	}
    
	resolved(captchaResponse: string, res) {
		this.sendTokenToBackend(captchaResponse); 
	  }

	  sendTokenToBackend(tok){
		this.subscriptions.push(this.authService.sendToken(tok).subscribe(
			data => {
			},
			err => {
			},
			() => {}
		));
	}

    registerCorporate(company: NgForm) {
 // ============================ Start - Shubhangi (SNA-I5) - 13-05-2021 ============================
 let partnerId = sessionStorage.getItem('partnerId')
 let splitCode = partnerId.split('/Id/')
 let corporateId = partnerId.split('/')[0];
 // ============================ End - Shubhangi (SNA-I5) - 13-05-2021 ============================
        if(company.invalid ) {
            return false;
        }
        var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        var data = {
            companyName: company.value.companyName,            
            firstName: company.value.firstName,
            lastName: company.value.lastName,
            email: company.value.email,
            phoneNumber: company.value.phoneNumber,
            verifiertype : "corporateverifier",
            role: "Corporate Admin",
            entity: "corporate",
            corporateId: corporateId,
            //  Start- Shubhangi, 01-02-2020, SCI-I718
            timeZone:timeZone,
				createdBy : {
					firstName:company.value.firstName,
					lastName:company.value.lastName,
					email:company.value.email
				},
				updatedBy : {
					firstName:company.value.firstName,
					lastName:company.value.lastName,
					email:company.value.email
				},
                code:splitCode[1],
        }
        this.url = '/corporate/register';
        this.subscriptions.push(this.apiService.post_transactions(this.url, data)
            .subscribe((response: any) => {
                if(response.success == true) {    
                    this.router.navigate(['/email-verification/' + response.data.result.otp.userId]);
                 }else{
                    this.router.navigate(['']);
                }
            },  
            (error) => {
                  var data = {
                    reason: "This Email Id already exists!",
                    status: ''
                  };
                  this.errorDialogService.openDialog(data);
			  }));
    } 

    registerIndividual(individual: NgForm) {
        if(individual.invalid ) {
            return false;
        }
         var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        var data = {
            firstName: individual.value.firstName,
            lastName: individual.value.lastName,
            email: individual.value.email,
            phoneNumber: individual.value.phoneNumber,
            verifiertype : "individualverifier",            
            entity: "individual",
            role: "verifier",
            timeZone:timeZone,
				createdBy : {
					firstName:individual.value.firstName,
					lastName:individual.value.lastName,
					email:individual.value.email
				},
				updatedBy : {
					firstName:individual.value.firstName,
					lastName:individual.value.lastName,
					email:individual.value.email
				}
        }
        this.url = '/corporate/register';

        this.subscriptions.push(this.apiService.post(this.url, data)
            .subscribe((response: any) => {
                if(response.success == true) {                    
                    var data = {
						reason: "Corporate Registered Successfully, Check Email for OTP!",
						status: ''
					};
				    const dialogRef = this.dialog.open(AlertDialogComponent, {
					width: '335px',
					data: data,
				});
                    this.dialogRef.close();
                    this.router.navigate(['/resetPassword']);
                }       
            }));
    }     

    goBack() {
        this.location.back();

    }   
    goHomePage() {
        this.router.navigate(['/']);
    } 
    
    goOrganizationPage() {
		this.router.navigate(['/registration']);
	}

	goCorporatePage() {
		this.router.navigate(['/partnerRegistration']);
	}
    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
      }
}
