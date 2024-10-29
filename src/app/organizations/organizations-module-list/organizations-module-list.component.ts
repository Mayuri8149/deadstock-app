// Start - Priyanka Patil (SNA-18) 07-06-2021
import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { ErrorDialogService } from 'src/app/services/error-dialog.service';
import { RouteStateChangeService } from 'src/app/services/route-state-change.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-organizations-module-list',
  templateUrl: './organizations-module-list.component.html',
  styleUrls: ['./organizations-module-list.component.css']
})
export class OrganizationsModuleListComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	faSearch = faSearch;
	totalInst = 0;
	instPerPage= 5;
	pageSizeOptions = [5,10,20,50,100];
	currentPage = 1;
	role: string;
	entity: string;
	url: string;
	loggedInUser;
	transtypes;
	allorganizations = [];
	selectedTransType: any = [];
	credData;
	id;
	userrefId:any;
	userIdArr = []
	dept = {
		organizationId: '',
		code: '',
		name: '',
		isActive:'',
		createdBy:{},
		updatedBy:{}
	};
	displayedColumns = [
		'actions',
		'organizationId',
		'organizationName',
		'category',
		'subcategory',
		'moduleId',
		'moduleName',
		'transactionTypeCode',
		'transactionTypeName',
		'description',
		'transaction',
		'status'
		];

	organizations = [];
	dataSource = new MatTableDataSource<any>();
	selection = new SelectionModel<any>(true, []);
	transactionTypeName=null;
	transactionTypeCode=null;
	additionalDescription=null;
	moduleName=null;
	moduleCode=null;
	organizationName=null;
	organizationCode=null;
	category=null;
	subcategory=null;
	transaction=null
	status=null;
	filter:any={transactionTypeName:'',transactionTypeCode:'',additionalDescription:'',transaction:'',moduleCode:'',moduleName:'',category:'',subcategory:'',organizationName:'',organizationCode:'',status:'',searchKey:''}

	dialogChangeEvent;
	curPage= 1;
	orgPerPage=5;
	pageIndex=0;
	pageSize=5

	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	constructor(private apiService: ApiService,
		public dialoge: MatDialog,
		public router: Router,
		public route: ActivatedRoute,
		public routeStateService: RouteStateChangeService,
		public confirmDialogService: ConfirmDialogService,
		private location: Location,
		public errorDialogService: ErrorDialogService,
		public snackbarService: SnackbarService) { }

	ngOnInit() {
		this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
		this.role = this.loggedInUser.reference.role;
		this.entity = this.loggedInUser.reference.entity;
		this.id = this.loggedInUser.reference.organizationId;
		this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['recordPerPage'];
		if(this.role == 'sysadmin' || this.role == 'subadmin'){
			this.getUserDetails()
		}else{
			if(this.curPage && this.orgPerPage){
				this.pageIndex = this.curPage - 1
				this.instPerPage = this.orgPerPage
				this.getOrganizations(this.orgPerPage, this.curPage);
			}else{
				this.getOrganizations(this.instPerPage, this.currentPage);
			}
		}
	}
	getUserDetails(){
		this.url = "/user/userList/getAllAdminlist";
		var params = new HttpParams();
		params = params.append('organizationId', this.loggedInUser.reference.organizationId);
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response) => {
				if (response.success == true) {
					for(var i=0;i<response.data.result.length;i++){
						this.userrefId = response.data.result[i].userId
						this.userIdArr.push(this.userrefId)
					}
					if(this.curPage && this.orgPerPage){
						this.pageIndex = this.curPage - 1
						this.instPerPage = this.orgPerPage
						this.getOrganizations(this.orgPerPage, this.curPage);
					}else{
						this.getOrganizations(this.instPerPage, this.currentPage);
					}


				}
			}));

	}
	getOrganizations(instPerPage,currentPage) {
		this.url = "/transactiontype/list";
		var params = new HttpParams();

		params = params.append('pagesize',instPerPage);
		params = params.append('page', currentPage);
		if(this.role == 'sysadmin' || this.role == 'subadmin'){
			params = params.append('referenceCreatedBy', JSON.stringify(this.userIdArr));
		}else{
			params = params.append('referenceCreatedBy', this.loggedInUser._id);
		}
		if(this.role == 'sysadmin' || this.role == 'subadmin'){
			params = params.append('showithoutOrgId', 'showithoutOrgId');
		}
		if(this.role == "admin"){
			params = params.append('organizationId', this.loggedInUser.reference.organizationId);
		}
		if(this.loggedInUser.corpData){
			params = params.append('corporateId', this.loggedInUser.corpData._id);
		}
		
		if(this.filter.transactionTypeName){
			params = params.append('transactionTypeName', this.filter.transactionTypeName);
		}
		if(this.filter.transactionTypeCode){
			params = params.append('transactionTypeCode', this.filter.transactionTypeCode);
		}
		if(this.filter.additionalDescription){
			params = params.append('additionalDescription', this.filter.additionalDescription);
		}
		if(this.filter.organizationCode){
			params = params.append('organizationCode', this.filter.organizationCode);
		}
		if(this.filter.organizationName){
			params = params.append('organizationName', this.filter.organizationName);
		}
		if(this.filter.moduleCode){
			params = params.append('moduleCode', this.filter.moduleCode);
		}
		if(this.filter.moduleName){
			params = params.append('moduleName', this.filter.moduleName);
		}
		if(this.filter.category){
			params = params.append('category', this.filter.category);
		}
		if(this.filter.subcategory){
			params = params.append('subcategory', this.filter.subcategory);
		}
		if(this.filter.transaction){
			params = params.append('transaction', this.filter.transaction);
		}
		if(this.filter.status){
			params = params.append('status', this.filter.status);
		}
		if(this.filter.searchKey){
			params = params.append('searchKey', this.filter.searchKey);
		}
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response) => {
				if(response.success == true) {
					this.transtypes = response.data.result.transtypes.transtypes;
					var orgData = this.transtypes;		   
					for (var i = 0; i < orgData.length; i++) {
						if (orgData[i].is_deleted == false) {
							orgData[i].status = "Active";
						} else {
							orgData[i].status = "Inactive";
						}
					}
					this.totalInst = response.data.result.transtypes.total_count;
					this.dataSource.data = orgData;
				}
			}))
	}
	
	view(i) {
		this.selectedTransType = this.dataSource.data[i];
		this.credData = this.selectedTransType;
		if(this.role == 'sysadmin' || this.role == 'subadmin'){
			if(this.curPage && this.orgPerPage){
				this.router.navigate(['/organizations/organizationModuleList/viewTransactionType/' + this.credData._id + "/" + this.credData.organizationId],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
			}else{
				this.router.navigate(['/organizations/organizationModuleList/viewTransactionType/' + this.credData._id + "/" + this.credData.organizationId],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.instPerPage}});
			}
		}else if(this.role == 'admin'){
			if(this.curPage && this.orgPerPage){
				this.router.navigate(['/organizations/organizationModuleList/viewTransactionType/' + this.credData.referenceId + "/" + this.credData.organizationId],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
			}else{
				this.router.navigate(['/organizations/organizationModuleList/viewTransactionType/' + this.credData.referenceId + "/" + this.credData.organizationId],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.instPerPage}});
			}
	   }
	}

	viewAssetCategories(i) {
		this.selectedTransType = this.dataSource.data[i];
		this.credData = this.selectedTransType;
		if(this.role == 'sysadmin' || this.role == 'subadmin'){
			if(this.curPage && this.orgPerPage){
				this.router.navigate(['/organizations/organizationModuleList/viewAssetCategories/' + this.credData._id + "/" + this.credData.organizationId],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
			}else{
				this.router.navigate(['/organizations/organizationModuleList/viewAssetCategories/' + this.credData._id + "/" + this.credData.organizationId],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.instPerPage}});
			}
		}else if(this.role == 'admin'){
			if(this.curPage && this.orgPerPage){
				this.router.navigate(['/organizations/organizationModuleList/viewAssetCategories/' + this.credData._id+ "/" + this.credData.organizationId],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
			}else{
				this.router.navigate(['/organizations/organizationModuleList/viewAssetCategories/' + this.credData._id+ "/" + this.credData.organizationId],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.instPerPage}});
			}
	   }
	}

	onChangedInst(pageData: PageEvent){
		if(this.curPage && this.orgPerPage){
			this.curPage = pageData.pageIndex + 1
			this.orgPerPage = pageData.pageSize;
			this.getOrganizations(this.orgPerPage,  this.curPage);
		}else{
			this.currentPage = pageData.pageIndex + 1;
			this.instPerPage = pageData.pageSize;
			this.getOrganizations(this.instPerPage,  this.currentPage);
		}
	}

	selecttransTypeName(event){	
		this.transactionTypeName = event;
		this.getOrganizations(this.instPerPage,  this.currentPage);
	}
	selecttransTypeCode(event){	
		this.transactionTypeCode = event;
		this.getOrganizations(this.instPerPage,  this.currentPage);
	}
	selectmoduleCode(event){	
		this.moduleCode = event;
		this.getOrganizations(this.instPerPage,  this.currentPage);
	}
	selectmoduleName(event){	
		this.moduleName = event;
		this.getOrganizations(this.instPerPage,  this.currentPage);
	}
	selectorgCode(event){	
		this.organizationCode = event;
		this.getOrganizations(this.instPerPage,  this.currentPage);
	}
	selectorgName(event){	
		this.organizationName = event;
		this.getOrganizations(this.instPerPage,  this.currentPage);
	}
	selectcategory(event){	
		this.category = event;
		this.getOrganizations(this.instPerPage,  this.currentPage);
	}
	selectsubcategory(event){	
		this.subcategory = event;
		this.getOrganizations(this.instPerPage,  this.currentPage);
	}
	selectadditionalDescription(event){	
		this.additionalDescription = event;
		this.getOrganizations(this.instPerPage,  this.currentPage);
	}
	selecttransaction(event){	
		this.transaction = event;
		this.getOrganizations(this.instPerPage,  this.currentPage);
	}
	selectstatus(event){	
		this.status = event;
		this.getOrganizations(this.instPerPage,  this.currentPage);
	}
	clearFilter(event,value){
		value =''
		this.getOrganizations(this.instPerPage,  this.currentPage);
	}
	onSearch(event){
		this.filter.searchKey = event
		this.getOrganizations(this.instPerPage,  this.currentPage);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	  };
}