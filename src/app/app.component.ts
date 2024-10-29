import { HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
	Event,
	NavigationCancel,
	NavigationEnd,
	NavigationError,
	NavigationStart,
	Router
} from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { Breadcrumb, PpBreadcrumbsService } from 'pp-breadcrumbs';
import { environment } from '../environments/environment';
import { Config } from './helper/config';
import { UserModel } from './modals/user';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { LoaderService } from './services/loader.service';
import { Subscription } from 'rxjs';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	private subscriptions: Subscription[] = [];
	title = 'snapperTransaction';
	isUserLogin: UserModel;
	showSpinner: Boolean = true;
	spinner;
	href;
	currentURL= "";
	url = ''
	digilockerDetails:any={}
	
	constructor(private breadcrumbsService: PpBreadcrumbsService,
				private router: Router,
				private bnIdle: BnNgIdleService,
				private authService: AuthService,
				public loaderService: LoaderService,
				public changeRef: ChangeDetectorRef,
				public apiService: ApiService,
				
				) {		
					this.subscriptions.push(this.authService.currentUser
						.subscribe((user) => {
							this.isUserLogin = user;
						}));	
						this.currentURL = window.location.href;
						if(this.currentURL.indexOf('http') == -1){
						this.currentURL = decodeURI(this.currentURL);
						}
						if(this.currentURL.indexOf('code=') != -1){
							let code= this.currentURL.split('code=');
							let codevalue= code[1].split('&');
							this.digilockerDetails =  {
								code:codevalue[0],
							}
							this.url = "/transaction/token";
							const payload = new HttpParams()
								.set('client_id', Config.digilockerDetails.client_id)
								.set('client_secret', Config.digilockerDetails.client_secret)
								.set('redirect_uri', Config.digilockerDetails.redirect_uri)
								.set('code', this.digilockerDetails.code)
								this.subscriptions.push(this.apiService.postDigilocker(this.url, payload)
							.subscribe((response: any) => {
							}));
							this.router.navigate(['/' + this.isUserLogin._id + '/cred']);
						}

						let stateUrlSplit= this.currentURL.split('&');
						if(stateUrlSplit[1]=="shareFlag=true" && this.isUserLogin==null){
							sessionStorage.setItem('pdfviewFromMail',this.currentURL)
							this.router.navigate(['/']);
						}
				
						else if (stateUrlSplit[1] == "isPublic=true" && this.isUserLogin == null) {
							var shareFlag;
							if (this.currentURL) {
								var splitValue = this.currentURL.split("?");
								var splitValueHash = splitValue[0].split("#")
								var queryStringSplit = splitValue[1].split("&");
								var flagValue1 = queryStringSplit[0].split("=");
								var flagValue2 = queryStringSplit[1].split("=");
								shareFlag = queryStringSplit[1];
							}
							this.router.navigate([splitValueHash[1]], { queryParams: { 'isDMS': flagValue1[1], 'isPublic': flagValue2[1] } });
						}
						if(this.currentURL.indexOf('partnerRegistration/') != -1){
							let index = this.currentURL.indexOf('partnerRegistration/')
							let url = []
							if(index > -1){
								url = this.currentURL.split('partnerRegistration/');
								sessionStorage.setItem('partnerId',url[1])
								this.router.navigate(['/partnerRegistration' ]);
							}							
						}
						
						this.subscriptions.push(this.router.events.subscribe((event: Event) => {							
							switch (true) {
							  case event instanceof NavigationStart: {
								this.showSpinner = true;				
								break;
							  }
					  
							  case event instanceof NavigationEnd: {
								this.showSpinner = false;
								break;
							  }
							  case event instanceof NavigationCancel:
							  case event instanceof NavigationError: {
								this.showSpinner = false;
								break;
							  }
							  default: {
								break;
							  }
							}
						}));
						
						this.breadcrumbsService.postProcess = (breadcrumbs: Breadcrumb[]) => {
							this.href = this.router.url;
							var splithref= this.href.split("/");
							if(splithref[3]!==undefined)
								var getHref= splithref[3]?.split("?");
								if(getHref!=undefined)
									var getHrefSplit= getHref[1]?.split("&");
							if(breadcrumbs.length !=0 && (this.isUserLogin.reference.role== "certifier" || this.isUserLogin.reference.role== "reviewer" || this.isUserLogin.reference.role== "manager")){
								if(this.isUserLogin.reference.role== "certifier" && breadcrumbs[0].path=="/transactions"){
									breadcrumbs[0].text = " Certify Transactions";
									breadcrumbs.unshift({ text: 'Home', path: '/home' });
								}else if(this.isUserLogin.reference.role== "reviewer" && breadcrumbs[0].path=="/transactions"){
									breadcrumbs[0].text = " Review Transactions";
									breadcrumbs.unshift({ text: 'Home', path: '/home' });
								}else if(this.isUserLogin.reference.role== "manager" && splithref[4]=='uploadedTransactions'){
									var sessionValue=sessionStorage.getItem('transactionTypeName');
									breadcrumbs.splice(1, 0,{text:'Batches',path: sessionValue});
									breadcrumbs.unshift({ text: 'Home', path: '/home' });
								}else{
									breadcrumbs.unshift({ text: 'Home', path: '/home' });
								}
							}else{
								if(this.isUserLogin !== null){
									if(this.href=="/transactions/transactions?dashboard=1"){
										let transactionDetails = JSON.parse(sessionStorage.getItem('transcationType'));
										if(transactionDetails){
										let moduleName = transactionDetails.module.name
										let transTypeName = transactionDetails.transactionType.transactionTypeName
										breadcrumbs.unshift({text:'Transactions',path:'/transactions/transactions?dashboard=1'});
										breadcrumbs.push({ text: moduleName + " "+ '/'  + " " + transTypeName , path: '/home' });
										}else{
											breadcrumbs.push({text:'Transactions',path:'/transactions/transactions?dashboard=1'});
										}
									}									
									else if(this.isUserLogin.reference.role== "Corporate Admin"){
										breadcrumbs.unshift({ text: `Home`, path: '/partner/partnerDashboard' });
									}
									else if(this.isUserLogin.reference.role== "partner" && getHref!==undefined && getHref[0]=="pdfView"){
										breadcrumbs.push({text:'View Transaction',path:':transactionId/pdfView'});
										breadcrumbs.unshift({ text: 'My Transactions', path: '/'+this.isUserLogin.reference.userId+'/cred' });
									}
									else if(this.isUserLogin.reference.role== "partner"){
										if(typeof splithref[1] === 'undefined' || splithref[1] == null || splithref[1]==''){
											splithref[1] = this.isUserLogin.reference.userId
										}
										breadcrumbs.unshift({ text: 'My Transactions', path: '/'+splithref[1]+'/cred' });
									}else if(this.isUserLogin.reference.entity=="organization" && this.isUserLogin.reference.role=="manager" && splithref[2]=="transactions"){
										var sessionValue=sessionStorage.getItem('transactionTypeName');															
										// breadcrumbs.splice(1, 0,{text:'Transaction Type List',path:'transTypeList?dashboard=yes'});
										// breadcrumbs.push({text:'Batches',path:sessionValue});
										breadcrumbs.splice(2, 0,{text:'Transactions',path:'/transactions'});										
										breadcrumbs.unshift({ text: `Home`, path: '/home' });
									}									
									else if(splithref[1]=="transactions/transactions?dashboard=1" && splithref[3]=="transactionView"){
										breadcrumbs.push({text:'Transactions',path:'/transactions/transactions?dashboard=1'});										
										breadcrumbs.splice(1, 0,{text:'View Transactions',path:'/transactionView/:transactionId'});
										breadcrumbs.unshift({ text: `Home`, path: '/home' });
									}
									else if(splithref[3]=="transactionView" && getHrefSplit[2]=="actionFlag=update"){
										breadcrumbs.splice(2, 0,{text:'Transactions',path:'/transactions/transactions?dashboard=1'});
										breadcrumbs.splice(3, 0,{text:'Update Transaction',path:'/transactionView/:transactionId'});
										breadcrumbs.unshift({ text: `Home`, path: '/home' });
									}
									else if(this.isUserLogin.reference.entity=="organization" && this.isUserLogin.reference.role=="manager" && splithref[3]=="transactionView"){
										var sessionValue=sessionStorage.getItem('transactionTypeName');
										breadcrumbs.splice(2, 0,{text:'Transactions',path:'/transactions/transactions?dashboard=1'});
										breadcrumbs.splice(3, 0,{text:'View Transaction',path:'/transactionView/:transactionId'});
										breadcrumbs.unshift({ text: `Home`, path: '/home' });
									}
									else if(this.isUserLogin.reference.entity=="organization" && this.isUserLogin.reference.role=="manager" && splithref[3]=="partners"){
										breadcrumbs.push({text:'Batches',path:'/organizationBatches'});
										breadcrumbs.splice(2, 0,{text:'View Partners',path:':batchId/partners'});
										breadcrumbs.unshift({ text: `Home`, path: '/home' });
									}else if(splithref[3]=="transactionView"){
										breadcrumbs.push({text:'Transactions',path:'/transactions'});
										breadcrumbs.splice(2, 0,{text:'View Transactions',path:'/transactionView/:transactionId'});
										breadcrumbs.unshift({ text: `Home`, path: '/home' });
									}
									else if(this.isUserLogin.reference.entity=="organization" && this.isUserLogin.reference.role=="reviewer" && splithref[3]=="partners"){
										breadcrumbs.push({text:'Review Batch Data',path:'/batchList'});
										breadcrumbs.splice(2, 0,{text:'View Partners',path:':batchId/partners'});
										breadcrumbs.unshift({ text: `Home`, path: '/home' });
									}else if(this.isUserLogin.reference.role== "subadmin"){
										if(this.href =="/users/userList"){
										}
									}else{	
										breadcrumbs.unshift({ text: `Home`, path: '/home' });
									}	
								}							
							}
							return breadcrumbs;
						  };
	}

	ngOnInit() {
		this.subscriptions.push(this.loaderService.spinner
			.subscribe((value) => {		
				if(sessionStorage.getItem('flagset')=='true'){
					this.showSpinner = false;
					sessionStorage.removeItem('flagset')
				}else{
					this.showSpinner = value;
				}							
				this.changeRef.detectChanges()
			}));	
			
			// 60 means 1 minutes. So 30 minutes 1800 seconds // 1hr means 3600 seconds
			this.subscriptions.push(this.bnIdle.startWatching(environment.sessionTimeoutTime).subscribe((isTimedOut: boolean) => {
				if (isTimedOut) {
				  this.authService.logout();
				}
			}));		  
	}
	ngAfterContentChecked() {
        this.changeRef.detectChanges();    
	}
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}