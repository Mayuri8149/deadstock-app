import {
	HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor,
	HttpRequest
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, delay, finalize, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { ErrorDialogService } from '../services/error-dialog.service';
import { LoaderService } from '../services/loader.service';
import { Subscription } from 'rxjs';
@Injectable() 
export class HttpConfigInterceptor implements HttpInterceptor { 
	private subscriptions: Subscription[] = [];
	constructor(public errorDialogService: ErrorDialogService,
				public dialog: MatDialog,
				public http: HttpClient,
				public authService: AuthService,
				public loaderService: LoaderService,
				private injector: Injector) { }
	private _refreshSubject: Subject<any> = new Subject<any>();

	private _ifTokenExpired() {
		this.subscriptions.push(this._refreshSubject.subscribe({
			complete: () => {
				this._refreshSubject = new Subject<any>();
			}
		}));
		if (this._refreshSubject.observers.length === 1) {
			this.subscriptions.push(this.authService.token().subscribe(this._refreshSubject));
		}
		return this._refreshSubject;
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if(request.url== environment.bingMapBaseURL + "REST/v1/Autosuggest"){
			this.loaderService.hide(); // to hide loader for location autosuggest api
		}else{
			this.loaderService.show();
		}		
		return next.handle(request).pipe(
				delay(200),
				finalize(() => this.loaderService.hide()),
				catchError((response: HttpErrorResponse) => {
					let data = {};					
					let status = response.status;
					let url = response.url;					
					let showDialog = false;
					if(status == 500) {	
						showDialog = true;
						if( url.indexOf('/user/token') !== -1) {
							this.authService.logout(); // GO TO LOGIN PAGE
						}
					} else if(status == 401) {
						if( url.indexOf('/user/token') !== -1) {
							this.authService.logout(); // GO TO LOGIN PAGE
						} else {
							return this._ifTokenExpired().pipe(
								switchMap(() => {
									return next.handle(this.updateHeader(request));
								})
							);							
						}
					} else if(status == 400) {
						showDialog = true;	
					}

					if(showDialog) {
						data = {
							reason: response.error.errors[0].msg,
							status: response.status
						};
						this.dialog.closeAll();
						this.errorDialogService.openDialog(data);
					}					
					return throwError(response);
				}),
			);
	}

	updateHeader(req) {
		let xApiToken = this.authService.getAccessToken();
		req = req.clone({
			headers: req.headers.set("x-api-token", xApiToken)
		});
		return req;
	}
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}