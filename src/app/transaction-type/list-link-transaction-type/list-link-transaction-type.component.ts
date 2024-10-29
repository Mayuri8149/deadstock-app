import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { faHandPointLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { DataService } from 'src/app/services/data.service';
import { ErrorDialogService } from 'src/app/services/error-dialog.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Subscription } from 'rxjs';
@Component({
	selector: 'app-list-link-transaction-type',
	templateUrl: './list-link-transaction-type.component.html',
	styleUrls: ['./list-link-transaction-type.component.css']
})
export class ListLinkTransactionTypeComponent implements OnInit {
	private subscriptions: Subscription[] = [];
	faHandPointLeft = faHandPointLeft;
	faSearch = faSearch;
	loggedInUser;
	role;
	entity;
	url: string;
	urls: string;
	urlDept: string;
	deptDataorganization;
	urlCertype: string;
	credDatamodule;
	credDataq: any;
	transtypesq;
	transactiontypes: any[] = [];
	selectedTransType: any = [];
	affiliateId;
	batch;
	batches;
	selectedBatches;
	tabIndex: Number = 0;
	dashboard;
	transtypes;
	module;
	moduleId;
	credData;
	dataSource = new MatTableDataSource<any>();
	selection = new SelectionModel<any>(true, []);
	finalCertificateForm: any;
	finalCertForm: any;
	transtypeId: any;
	referenceId;
	selectedmodule;
	allorganizations = [];
	organizations;
	createdBy: any = {}
	allInstitutes = []
	institutes
	transactionTypeName=null;
	transactionTypeCode=null;
	moduleName=null;
	moduleCode=null;
	companyName=null;
	organizationName=null;
	status=null;
	filter:any={transactionTypeName:'',transactionTypeCode:'',moduleCode:'',moduleName:'',companyName:'',organizationName:'',status:'',searchKey:''}

	dialogChangeEvent;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

	displayedColumns = [
		'select',
		'moduleId',
		'moduleName',
		'transactionTypeCode',
		'transactionTypeName',
		'organizationName',
		'status'
	];
	displayeColumns = [
		'select',
		'moduleId',
		'moduleName',
		'transactionTypeCode',
		'transactionTypeName',
		'corporateName',
		'status'
	];

	batchmoduleid: any;
	data: any;
	totalRecord = 0;
	recordPerPage= 5;
	pageSizeOptions = [5,10,20,50,100];
	currentPage = 1;
	curPage= 1;
	orgPerPage=5;
	pageIndex=0;
	pageSize=5
	forApply = '';
	partners = [];
	deptId;
	href;
	userrefId:any;
	userIdArr = []
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
		this.transtypeId = this.route.snapshot.params['transtypeId'];
		var dashboard1 = this.router.url.split('/transTypeList?dashboard=');
		this.dashboard = dashboard1[1];
		var dashboard2 = window.localStorage.setItem('dashboard', dashboard1[1]);
		this.createdBy = {
				firstName: this.loggedInUser.firstName,
				lastName: this.loggedInUser.lastName,
				email: this.loggedInUser.email
			}
		this.referenceId = this.route.snapshot.params['referenceId'];
		this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['recordPerPage'];
		if(this.role == 'sysadmin' || this.role == 'subadmin'){
			this.getUserDetails();
		}else if(this.role == 'admin'){
			this.getDepartments();
			this.forApply = 'approved'
			this.getPartners(this.recordPerPage, 1,this.forApply);
		}else if(this.role == 'Corporate Admin' || this.role == 'verifier'){
			this.getTransType(this.recordPerPage, 1);
			this.forApply = 'approved'
			this.getPartners(this.recordPerPage, 1,this.forApply);
		}
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
					this.getTransType(this.recordPerPage, 1);
				}
			}));
	}

	getTransType(recordPerPage, currentPage){		
		this.url = '/transactiontype/transcationlist';
		this.selection.clear();
		var params = new HttpParams();	
		params = params.append('pagesize', recordPerPage);
		params = params.append('page', currentPage);
		params = params.append('referenceId', this.referenceId);
		if(this.role == 'sysadmin' || this.role == 'subadmin'){
			params = params.append('referenceCreatedBy', JSON.stringify(this.userIdArr));
		}else{
			params = params.append('referenceCreatedBy', this.loggedInUser._id);
		}

		if(this.role == 'admin'){
			params = params.append('organizationId', this.loggedInUser.reference.organizationId);
		}
		if(this.filter.moduleName){
			params = params.append('moduleName', this.filter.moduleName);
		}
		if(this.filter.moduleCode){
			params = params.append('moduleCode', this.filter.moduleCode);
		}
		if(this.filter.transactionTypeName){
			params = params.append('transactionTypeName', this.filter.transactionTypeName);
		}
		if(this.filter.transactionTypeCode){
			params = params.append('transactionTypeCode', this.filter.transactionTypeCode);
		}
		if(this.filter.companyName){
			params = params.append('companyName', this.filter.companyName);
		}
		if(this.filter.organizationName){
			params = params.append('organizationName', this.filter.organizationName);
		}
		if(this.filter.status){
			params = params.append('status', this.filter.status);
		}
		if(this.filter.searchKey){
			params = params.append('searchKey', this.filter.searchKey);
		}
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response: any) => {
				this.transtypes = response.data.result.transtypes.transtypes;
				var credData = this.transtypes;
				for (var i = 0; i < credData.length; i++) {
					if (credData[i].is_deleted == false) {
						credData[i].status = "Active";
					} else {
						credData[i].status = "Inactive";
					}
				}
				this.totalRecord = response.data.result.transtypes.total_count;
				this.dataSource.data = credData;
			}));
	}
	openConfirmDialog(row) {
		var data = {
			transType: row,
			isActive: row.is_deleted,
			status: ''
		};

		if (row.is_deleted == false) {
			data.isActive = true;
			data.status = 'Inactive';
		} else {
			data.isActive = false;
			data.status = 'Active';
		}
		this.confirmDialogService.open(data);
		this.dialogChangeEvent = this.confirmDialogService.change.subscribe((data: any) => {
			if (data.doAction === true) {
				this.changeStatus(data);
				this.dialogChangeEvent.unsubscribe();
			} else {
				this.getTransType(this.recordPerPage, this.currentPage);
				this.dialogChangeEvent.unsubscribe();
			}
		})
	};

	changeStatus(obj) {
		var transTypeId = obj.transType._id;
		this.url = "/transactiontype/" + transTypeId + "/changeStatus";
		var data = {
			isActive: obj.isActive,
			organizationId: obj.transType.organizationId,
			moduleId: obj.transType.moduleId
		};

		this.apiService.put(this.url, data)
			.subscribe((response) => {
				if (response.success == true) {
					if(obj.isActive == false){
						this.snackbarService.openSuccessBar('Transcation type active successfully.', "Transcation Type");
						this.getTransType(this.recordPerPage, this.currentPage);
					}else{
						this.snackbarService.openSuccessBar('Transcation type inactive successfully.', "Transcation Type");
						this.getTransType(this.recordPerPage, this.currentPage);
					}
				}
			});
	};
	getDepartments() {
		this.url = "/department/list";
		var params = new HttpParams();
		params = params.append('organizationId', this.loggedInUser.reference.organizationId);
		params = params.append('skip', '0');
		params = params.append('limit', '50');

		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response) => {
				if(response.success == true) {					
					this.deptId = response.data.result.departments.result[0]._id;
					this.getTransType(this.recordPerPage, 1);
				}
			}));
	}

	getPartners(recordPerPage, currentPage, by) {
		this.forApply = by
		this.selection.clear();
		this.url = "/invitepartner/getPartnersByOrgId";
		var params = new HttpParams();
		params = params.append('pagesize', recordPerPage);
		params = params.append('page', currentPage);
		params = params.append('status', 'approved');
		if (this.loggedInUser.reference.role == 'admin') {
			params = params.append('partnerEntity', this.loggedInUser.reference.organizationId);
		}else{
			params = params.append('partnerEntity', this.loggedInUser.corpData._id);
		}
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response) => {
				if (response.success == true) {
					this.allInstitutes = response.data.partners.partners;
					var activeinstitutes = [];
						for (var i = 0; i < this.allInstitutes.length; i++) {
							if (this.allInstitutes[i].createdBy == this.loggedInUser._id) {
								activeinstitutes.push(this.allInstitutes[i]);
							}
						}
					this.partners = activeinstitutes;
				}
			}));
	};

	goBack() {
		this.router.navigate(['/transactionTypes/linkTransactionType/'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
    };

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
	selectcompanyName(event){	
		this.companyName = event;
		this.getTransType(this.recordPerPage, this.currentPage);
	}
	selectorgName(event){	
		this.organizationName = event;
		this.getTransType(this.recordPerPage, this.currentPage);
	}
	selectstatus(event){	
		this.status = event;
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
			this.recordPerPage = pageData.pageSize;
			this.getTransType(this.recordPerPage, this.currentPage);
	}
	createAssetCategory(element){
		sessionStorage.setItem('credData', JSON.stringify(element));
		this.router.navigate(['/transactionTypes/linkTransactionType/listlinkTransactionType/' + this.referenceId + '/view/addAssetCategory' + "/" + element.organizationId]);
	}	
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}

export interface type {
	organizationName: string;
	moduleName:string;
	moduleId: string;
	transactionTypeName: string;
	transactionTypeCode:string,
	corporateName:string,
	status: string
}