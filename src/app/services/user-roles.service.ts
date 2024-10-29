import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class UserRolesService {
	loggedInUser: any = {}
	constructor(private http: HttpClient,
		public router: Router) {

	}
	renderScreen(user, role, entity) {
		if (entity == 'system') {
			if (role == 'sysadmin') {
				this.router.navigate(['/home']);
			} else if (role == 'subadmin') {
				this.router.navigate(['/users/userList']);
			}
		}
		else if (entity == 'organization') {
			if (role == 'admin') {
				this.router.navigate(['/home']);
			} else if (role == 'manager') {
				this.router.navigate(['/home']);
			} else if (role == 'reviewer') {
				this.router.navigate(['/home']);
			} else if (role == 'certifier') {
				this.router.navigate(['/home']);
			}
			else if (role == 'Agency Admin') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/agencies/agencyDashboard']);
				}
			} else if (role == 'Agency Verifier') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/searchTransaction']);
				}
			} else if (role == 'Corporate Admin') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/partner/partnerDashboard']);
				}
			} else if (role == 'corporate verifier') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/searchTransaction']);
				}
			} else if (role == 'verifier') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/searchTransaction']);
				}
			} else if (role == 'approver') {
				this.router.navigate(['/home']);
			} else if (role == 'partner') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")

				} else {
					this.router.navigate(['/' + user._id + '/cred']);
				}
			}
		} else if (entity == 'affiliate') {
			if (role == 'admin') {
				this.router.navigate(['/home']);
			} else if (role == 'manager') {
				this.router.navigate(['/home']);
			} else if (role == 'reviewer') {
				this.router.navigate(['/home']);
			} else if (role == 'approver') {
				this.router.navigate(['/home']);
			} else if (role == 'partner') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/' + user._id + '/cred']);
				}
			} else if (role == 'certifier') {
				this.router.navigate(['/home']);
			}
			else if (role == 'Agency Admin') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/agencies/agencyDashboard']);
				}
			} else if (role == 'Agency Verifier') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/searchTransaction']);
				}
			} else if (role == 'Corporate Admin') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/partner/partnerDashboard']);
				}
			} else if (role == 'corporate verifier') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/searchTransaction']);
				}
			} else if (role == 'verifier') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/searchTransaction']);
				}
			}
		} else if (entity == 'corporate') {
			if (role == 'Corporate Admin') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/partner/partnerDashboard']);
				}
			} else if (role == 'corporate verifier') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/searchTransaction']);
				}
			}
			else if (role == 'Agency Admin') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/agencies/agencyDashboard']);
				}
			} else if (role == 'Agency Verifier') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/searchTransaction']);
				}
			} else if (role == 'admin') {
				this.router.navigate(['/home']);
			} else if (role == 'manager') {
				this.router.navigate(['/home']);
			} else if (role == 'reviewer') {
				this.router.navigate(['/home']);
			} else if (role == 'certifier') {
				this.router.navigate(['/home']);
			} else if (role == 'verifier') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/searchTransaction']);
				}
			} else if (role == 'approver') {
				this.router.navigate(['/home']);
			} else if (role == 'partner') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/' + user._id + '/cred']);
				}
			}
		} else if (entity == 'agency') {
			if (role == 'Agency Admin') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/agencies/agencyDashboard']);
				}
			} else if (role == 'Agency Verifier') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/searchTransaction']);
				}
			}
			else if (role == 'Corporate Admin') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/partner/partnerDashboard']);
				}
			} else if (role == 'corporate verifier') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/searchTransaction']);
				}
			} else if (role == 'admin') {
				this.router.navigate(['/home']);
			} else if (role == 'manager') {
				this.router.navigate(['/home']);
			} else if (role == 'reviewer') {
				this.router.navigate(['/home']);
			} else if (role == 'certifier') {
				this.router.navigate(['/home']);
			} else if (role == 'verifier') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/searchTransaction']);
				}
			} else if (role == 'approver') {
				this.router.navigate(['/home']);
			} else if (role == 'partner') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/' + user._id + '/cred']);
				}
			}
		} else if (entity == 'corporate') {
			if (role == 'Corporate Admin') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/partner/partnerDashboard']);
				}
			} else if (role == 'corporate verifier') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/searchTransaction']);
				}
			}
		} else if (entity == 'agency') {
			if (role == 'Agency Admin') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/agencies/agencyDashboard']);
				}				
			} else if (role == 'Agency Verifier') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/searchTransaction']);
				}			
			}
		}
		else if (entity == 'affiliate') {
			if (role == 'partner') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				else if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/searchTransaction']);
				}
			}
			else if (role == 'admin') {
				this.router.navigate(['/home']);
			} else if (role == 'manager') {
				this.router.navigate(['/home']);
			} else if (role == 'reviewer') {
				this.router.navigate(['/home']);
			} else if (role == 'certifier') {
				this.router.navigate(['/home']);
			} else if (role == 'Agency Admin') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/agencies/agencyDashboard']);
				}
			} else if (role == 'Agency Verifier') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/searchTransaction']);
				}
			} else if (role == 'Corporate Admin') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/partner/partnerDashboard']);
				}
			} else if (role == 'corporate verifier') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/searchTransaction']);
				}
			} else if (role == 'verifier') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/searchTransaction']);
				}
			} else if (role == 'approver') {
				this.router.navigate(['/home']);
			}
		}
		else if (entity == 'individual') {
			if (role == 'verifier') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/searchTransaction']);
				}
			}
			else if (role == 'admin') {
				this.router.navigate(['/home']);
			} else if (role == 'manager') {
				this.router.navigate(['/home']);
			} else if (role == 'reviewer') {
				this.router.navigate(['/home']);
			} else if (role == 'certifier') {
				this.router.navigate(['/home']);
			} else if (role == 'Agency Admin') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/agencies/agencyDashboard']);
				}
			} else if (role == 'Agency Verifier') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/searchTransaction']);
				}
			} else if (role == 'Corporate Admin') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/partner/partnerDashboard']);
				}
			} else if (role == 'corporate verifier') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/searchTransaction']);
				}
			} else if (role == 'verifier') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/searchTransaction']);
				}
			} else if (role == 'approver') {
				this.router.navigate(['/home']);
			} else if (role == 'partner') {
				var getSessionValue = sessionStorage.getItem("pdfviewFromMail");
				var shareFlag;
				if (getSessionValue) {
					var splitValue = getSessionValue.split("?");
					var splitValueHash = splitValue[0].split("#")
					var queryStringSplit = splitValue[1].split("&");
					var flagValue1 = queryStringSplit[0].split("=");
					var flagValue2 = queryStringSplit[1].split("=");
					shareFlag = queryStringSplit[1];
				}
				if (getSessionValue !== undefined && shareFlag == "shareFlag=true") {
					this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'shareFlag': flagValue2[1] } });
					sessionStorage.removeItem("pdfviewFromMail")
				} else {
					this.router.navigate(['/' + user._id + '/cred']);
				}
			}
		} else {
			this.router.navigate(['/home']);
		}
	}
}