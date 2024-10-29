// Start - Priyanka Patil (SNA-18) 07-06-2021
import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { faHandPointLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { DataService } from 'src/app/services/data.service';
import { ErrorDialogService } from 'src/app/services/error-dialog.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
	selector: 'app-view-transaction-type',
	templateUrl: './view-transaction-type.component.html',
	styleUrls: ['./view-transaction-type.component.css']
})
export class ViewPartnerTransactionTypeComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	faHandPointLeft = faHandPointLeft;
	faSearch = faSearch;
	loggedInUser;
	role;
	entity;
	url: string;
	transtypes;
	credData;
	dataSource = new MatTableDataSource<any>();
	selection = new SelectionModel<any>(true, []);
	transtypeId: any;
	referenceId;
	corporateId;
	allorganizations = [];
	totalRecord = 0;
	recordPerPage= 5;
	pageSizeOptions = [5,10,20,50,100];
	currentPage = 1;
	selectedId: any = [];
	transactionTypeName=null;
	transactionTypeCode=null;
	moduleName=null;
	moduleCode=null;
	organizationName=null;
	organizationCode=null;
	status=null;
	companyCode=null
	companyName=null
	filter:any={companyName:'',companyCode:'',transactionTypeName:'',transactionTypeCode:'',moduleCode:'',moduleName:'',organizationName:'',status:'',searchKey:''}
	dialogChangeEvent;
	curPage= 1;
	orgPerPage=5;
	pageIndex=0;
	pageSize=5
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

	displayeColumns = [
		'moduleId',
		'moduleName',
		'transactionTypeCode',
		'transactionTypeName',
		'organizationName',
		'corporateId',
		'corporateName',
	];

	constructor(private _formBuilder: FormBuilder, private apiService: ApiService,
		private route: ActivatedRoute,
		public router: Router,
		public errorDialogService: ErrorDialogService,
		public confirmDialogService: ConfirmDialogService,
		public dataService: DataService,
		private location: Location,
		public snackbarService: SnackbarService) { }

	ngOnInit() {
		this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
		if (typeof this.loggedInUser.timeZone === 'undefined'||  this.loggedInUser.timeZone == null ||  this.loggedInUser.timeZone == '') {
			this.loggedInUser.timeZone = 'Asia/Kolkata'
		}
		this.role = this.loggedInUser.reference.role;
		this.entity = this.loggedInUser.reference.entity;
		this.dataSource.sort = this.sort;
		this.transtypeId = this.route.snapshot.params['transtypeId'];;
		this.referenceId = this.route.snapshot.params['referenceId'];
		this.corporateId = this.route.snapshot.params['corporateId'];
		this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['recordPerPage'];
		this.getTransType(this.recordPerPage, this.currentPage);
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
	}

	getTransType(recordPerPage, currentPage){
		this.url = '/transactiontype/list';
		this.selection.clear();
		var params = new HttpParams();	
		params = params.append('pagesize', recordPerPage);
		params = params.append('page', currentPage);
		params = params.append('id', this.transtypeId);
		if(this.filter.transactionTypeName){
			params = params.append('transactionTypeName', this.filter.transactionTypeName);
		}
		if(this.filter.transactionTypeCode){
			params = params.append('transactionTypeCode', this.filter.transactionTypeCode);
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
		if(this.filter.status){
			params = params.append('status', this.filter.status);
		}
		if(this.filter.companyCode){
			params = params.append('companyCode', this.filter.companyCode);
		}
		if(this.filter.companyName){
			params = params.append('companyName', this.filter.companyName);
		}
		if(this.filter.searchKey){
			params = params.append('searchKey', this.filter.searchKey);
		}
		
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response: any) => {
				this.transtypes = response.data.result.transtypes.transtypes;				
				var credData = this.transtypes;
				this.totalRecord = response.data.result.transtypes.total_count;
				this.dataSource.data = credData;
			}))
	}

	goBack() {
		this.router.navigate(['/organizations/partnerList'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
	}
	selecttransTypeName(event){	
		this.transactionTypeName = event;
		this.getTransType(this.recordPerPage, this.currentPage);
	}
	selecttransTypeCode(event){	
		this.transactionTypeCode = event;
		this.getTransType(this.recordPerPage, this.currentPage);
	}
	selectmoduleCode(event){	
		this.moduleCode = event;
		this.getTransType(this.recordPerPage, this.currentPage);
	}
	selectmoduleName(event){	
		this.moduleName = event;
		this.getTransType(this.recordPerPage, this.currentPage);
	}
	selectcompanyCode(event){	
		this.companyCode = event;
		this.getTransType(this.recordPerPage, this.currentPage);
	}
	selectcompanyName(event){	
		this.companyName = event;
		this.getTransType(this.recordPerPage, this.currentPage);
	}
	selectstatus(event){	
		this.status = event;
		this.getTransType(this.recordPerPage, this.currentPage);
	}
	selectorgName(event){	
		this.organizationName = event;
		this.getTransType(this.recordPerPage, this.currentPage);
	}
	clearFilter(event,value){
		value =''
		this.getTransType(this.recordPerPage, this.currentPage);
	}
	onSearch(event){
		this.filter.searchKey = event
		this.getTransType(this.recordPerPage, this.currentPage);
	}
	onChangedPage(pageData: PageEvent) {
			this.currentPage = pageData.pageIndex + 1;
			this.recordPerPage = pageData.pageSize;~
			this.getTransType(this.recordPerPage, this.currentPage);
	}	
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	  };
}