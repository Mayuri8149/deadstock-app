import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ErrorDialogService } from '../services/error-dialog.service';
import { SnackbarService } from '../services/snackbar.service';
import { PasswordMatch } from '../validators/password.validator';
import { Subscription } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent{
  private subscriptions: Subscription[] = [];
	loggedInUser;
  changePwd: FormGroup;
	errmsg: any;
  isValidemail: boolean;
  url;
  constructor(private formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router,
  public snackbarService: SnackbarService,
  public loaderService: LoaderService,
  private apiService: ApiService,
  public errorDialogService: ErrorDialogService) {}

public noWhitespaceValidator(control: FormControl) {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : { 'whitespace': true };
}
ngOnInit() {
  this.isValidemail=true;
	this.changePwd = this.formBuilder.group({
		currentpwd: [''],
    newpassword: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?#.^&])[A-Za-z\d$@$!%*?&].{7,}')]],
	 confirmPassword: ['', Validators.required]
	}, {
		validator: PasswordMatch('newpassword', 'confirmPassword')
	});
}

public hasError = (controlName: string, errorName: string) =>{
	return  this.changePwd.controls[controlName].hasError(errorName);
}

async changePassword(form: NgForm) {
   this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
   var userId = this.loggedInUser._id;
   var emailId = this.loggedInUser.email;
   var data = {
   userId: userId,
   email: emailId,
   currentpwd: form.value.currentpwd,
   newpassword: form.value.newpassword,
   confirmPassword: form.value.confirmPassword,
 }

  var newpass = form.value.newpassword;
  var emailParts = emailId.split("@");
  if(newpass.indexOf(emailParts[0]) > -1 || newpass.indexOf(emailParts[1]) > -1){
      this.isValidemail=false;
      this.changePwd.get('newpassword').markAsTouched();
      this.changePwd.controls['newpassword'].setErrors({'incorrect': true});
      return false;
  }
	if(form.invalid) {
    this.changePwd.get('currentpwd').markAsTouched();
    this.changePwd.get('newpassword').markAsTouched();
    this.changePwd.get('confirmPassword').markAsTouched();
		return false;
	}
  this.loaderService.show();
  this.url = '/user/changepassword';
  this.subscriptions.push(this.apiService.post(this.url, data)
		.subscribe((response: any) => {
			if(response.success == true) {
        this.loaderService.show();
        if(form.value.currentpwd == form.value.newpassword){
          var data = {
            reason: "Current password and New Password cannot be same!",
            status: ''
          };
          this.errorDialogService.openDialog(data);
        }
        else{
        this.loaderService.show();
				this.snackbarService.openSuccessBar('Your password updated successfully...', "Password");
        this.authService.logout();
		    this.router.navigate(['']);
        }
			}
		},(error )=>{
      this.errmsg = error.error.errors[0].msg;
      var data = {
        reason: this.errmsg,
        status: ''
      };
      this.errorDialogService.openDialog(data);
      }
));
}
ngOnDestroy() {
	this.subscriptions.forEach(subscription => subscription.unsubscribe());
};
}