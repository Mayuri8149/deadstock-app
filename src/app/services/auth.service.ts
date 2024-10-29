import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';
import { UserModel } from '../modals/user';
import { ErrorDialogService } from './error-dialog.service';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	baseURL: string = environment.baseUrl + '/api/v1';
	user;
	flag = false;
	refList:any={}
	@Output() isUserLoggedIn: boolean = false;
	public currentUserSubject: BehaviorSubject<UserModel>;
	public currentUser: Observable<UserModel>;	
	constructor(public globals: Globals,
				public router: Router,
				private http: HttpClient,
				private jwtHelperService: JwtHelperService,
				public errorDialogService: ErrorDialogService
				) {
					this.currentUserSubject = new BehaviorSubject<UserModel>(JSON.parse(sessionStorage.getItem('user')));
					this.currentUser = this.currentUserSubject.asObservable();
				}

	public get currentUserValue(): UserModel {
		return this.currentUserSubject.value;
	}

	sendToken(token){
		return this.http.post(this.baseURL+"/user/token_validate", {recaptcha: token}).pipe(
			map((result: any) => {
				return result;	
			}
		))
	}
	
	login(dataarr) {
		return  this.http.post(this.baseURL+'/user/signin', dataarr)
					.pipe(
						map((result: any) => {
							if(result.success == true) {
								if(result.data) {
									if(result.data._id) {
										this.user = result.data;
										this.user.logoutFlag = dataarr.logoutFlag;
										this.user.password = dataarr.password;
										this.user.branch = result.data.departmentLocation;
										this.user.branchCode = result.data.branchCode;
										sessionStorage.setItem('user', JSON.stringify(this.user));
										if(typeof this.user.referenceList === 'undefined'){
											this.user.referenceList = []
										}
										if(this.user.referenceList.length == 0 || this.user.referenceList.length == 1){
										this.currentUserSubject.next(this.user);
										}
									} else if(result.data.email && result.data.message && result.data.message == 'User not verified') {
										sessionStorage.setItem('emailId', result.data.email);
										var data = {
											reason: "OTP send on your Email for set password!",
											status: ''
										};
										this.errorDialogService.openAlertPopup(data);
									} 
								}								
							}
							return this.user;
						})
					)
	}

	token() {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'refreshtoken' : this.getRefreshToken()
		})

		return this.http.post(this.baseURL+'/user/token', {}, { headers: headers })
							.pipe(
								map((result: any) => {
									if(result.success == true) {
										this.user = result.data;
										sessionStorage.setItem('user', JSON.stringify(this.user));
										this.currentUserSubject.next(this.user);
									}
									return this.user;	
								})
							)
	}

	logout() {
		var user = JSON.parse(sessionStorage.getItem('user'));
		if(user.logoutFlag == true){
			this.flag = true;
			sessionStorage.setItem('logoutFlag', "true");
		}
		sessionStorage.removeItem('user');
		sessionStorage.removeItem('transactionTypeName');
		sessionStorage.removeItem('transcationType');
		sessionStorage.removeItem("pdfviewFromMail")
		if(this.flag == true){
			window.location.href="https://snapcert.io/";
		}
		else{
			this.currentUserSubject.next(null);
			this.router.navigate(['/']);
		}
	}

	getAccessToken() {
		var user = JSON.parse(sessionStorage.getItem('user'));
		if( user && user.accessToken){
			var accessToken = user.accessToken;
			return accessToken;
		}
		return false;
	}

	getRefreshToken() {
		var user = JSON.parse(sessionStorage.getItem('user'));
		if( user && user.refreshToken){
			var refreshToken = user.refreshToken;
			return refreshToken;
		}
		return false;
	}

	isAuthenticated(): boolean {
		this.user = JSON.parse(sessionStorage.getItem('user'));
		if(this.user.token){
			this.globals.isUserLoggedIn = true;
			return true;
		}
		return false;
	}

	isAuthorized(allowedRoles: string, allowedEntity: string): boolean {
		if (allowedRoles == null || allowedRoles.length < 0 || allowedEntity == null || allowedEntity.length < 0) {
			return false;
		}

		const token = this.getAccessToken();
		const decodeToken = this.jwtHelperService.decodeToken(token);
		
		if (!decodeToken) {
			return false;
		}
		return  allowedRoles.includes(decodeToken['role']) &&
				allowedEntity.includes(decodeToken['entity']);
	}

	resendOtpShowHide(data: object) {
		return	this.http.post(this.baseURL+'/user/otpShowHide', data)
				.pipe(
					map((result: any) => {
						return result;	
					})
				)
	}
	forgotPassword(data: object) {
		return	this.http.post(this.baseURL+'/user/forgotpassword', data)
				.pipe(
					map((result: any) => {
						return result;	
					})
				)
	}

	resetPassword(data: object) {
		return	this.http.post(this.baseURL+'/user/resetpassword', data)
				.pipe(
					map((result: any) => {
						return result;	
					})
				)
	}

	changePassword(data: object) {
		return	this.http.post(this.baseURL+'/user/changepassword', data)
				.pipe(
					map((result: any) => {
						return result;	
					})
				)
	}

	getCredById(params) {
		return	this.http.get(this.baseURL+'/transaction/getCredById', {params: params})
				.pipe(
					map((result: any) => {
						return result;	
					})
				)
	}

	scanProd(data: object) {
		return	this.http.post(this.baseURL+'/transaction/getProduct', data)
				.pipe(
					map((result: any) => {
						return result;	
					})
				)
	}
}