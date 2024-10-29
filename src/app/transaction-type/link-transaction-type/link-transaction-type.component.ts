import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
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
	selector: 'app-link-transaction-type',
	templateUrl: './link-transaction-type.component.html',
	styleUrls: ['./link-transaction-type.component.css']
})
export class LinkTransactionTypeComponent implements OnInit, OnDestroy {
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
	urlTrantype: string;
	credDataModule;
	credDataq: any;
	transtypesq;
	transactionTypes: any[] = [];
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
	finalTransactionForm: any;
	finalCertForm: any;
	transtypeId: any;
	selectedmodule;
	allorganization = [];
	organization;
	departments;
	createdBy: any = {}
	dialogChangeEvent;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

	displayedColumns = [
		'select',
		'module',
		'moduleId',
		'transactionTypeCode',
		'transactionTypeName',
		'transactionTypeDes'
	];
	filteredValues = {
		module:'',
		moduleId: '',
		transactionTypeCode:'',
		transactionTypeName: '',
		transactionTypeDes:''
	};
	batchmoduleid: any;
	data: any;
	totalRecord = 0;
	recordPerPage = 5;
	pageSizeOptions = [5,10,20,50,100];
	currentPage = 1;
	forApply = '';
	partners;
	deptId;
	transactionTypeName=null;
	transactionTypeCode=null;
	additionalDescription=null;
	moduleName=null;
	moduleCode=null;
	organizationNameCode=null;
	corporateNameCode=null;
	filter:any={transactionTypeName:'',transactionTypeCode:'',additionalDescription:'',moduleCode:'',moduleName:'',organizationNameCode:'',corporateNameCode:'',searchKey:''}
	curPage= 1;
	orgPerPage=5;
	pageIndex=0;
	pageSize=5
	constructor(private _formBuilder: FormBuilder, private apiService: ApiService,
		private route: ActivatedRoute,
		public router: Router,
		public errorDialogService: ErrorDialogService,
		public confirmDialogService: ConfirmDialogService,
		public dataService: DataService,
		private location: Location,
		private el: ElementRef,
		public snackbarService: SnackbarService) { }
	@ViewChild("autoPurchaseOrder") autocompletePurchaseOrder: MatAutocomplete;
	@ViewChild("Id_Container") divs: ElementRef;
	opened_AutoComplete = ()=> {
	let inputWidth = this.divs.nativeElement.getBoundingClientRect().width
	setTimeout(()=>{
	
	var screen_width = window.innerWidth;
	if(screen_width < 960){	
		let panel = this.autocompletePurchaseOrder.panel?.nativeElement;
		if (!panel ) return		
		panel.style.maxWidth = (inputWidth - 70) + "px";
	}	
	})
	}
	ngOnInit() {
		this.finalTransactionForm = this._formBuilder.group({
			buttonList: [''],
		});
		this.finalCertForm = this._formBuilder.group({
			btnList: [''],
		});

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
		this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['recordPerPage'];
		if(this.role == 'sysadmin' || this.role == 'subadmin'){
			if(this.curPage && this.orgPerPage){
				this.pageIndex = this.curPage - 1
				this.recordPerPage = this.orgPerPage
				this.getTransactionType(this.orgPerPage, this.curPage);
			}else{
				this.getTransactionType(this.recordPerPage, this.currentPage);
			}
		}else if(this.role == 'admin'){
			if(this.curPage && this.orgPerPage){
				this.pageIndex = this.curPage - 1
				this.recordPerPage = this.orgPerPage
				this.getTransactionType(this.orgPerPage, this.curPage);
			}else{
				this.getTransactionType(this.recordPerPage, this.currentPage);
			}
			this.forApply = 'approved'
		}else if(this.role == 'Corporate Admin' || this.role == 'verifier'){
			if(this.curPage && this.orgPerPage){
				this.pageIndex = this.curPage - 1
				this.recordPerPage = this.orgPerPage
				this.getTransactionType(this.orgPerPage, this.curPage);
			}else{
				this.getTransactionType(this.recordPerPage, this.currentPage);
			}
			this.forApply = 'approved'
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
	getPartners(recordPerPage, currentPage, by) {
		this.forApply = by
		this.url = "/invitepartner/getPartnersByOrgId";
		var params = new HttpParams();
		params = params.append('pagesize', recordPerPage);
		params = params.append('page', currentPage);
		params = params.append('status', 'approved');
		if(this.filter.corporateNameCode){
			params = params.append('corporateNameCode', this.filter.corporateNameCode);
		}
		if (this.loggedInUser.reference.role == 'admin') {
			params = params.append('partnerEntity', this.loggedInUser.reference.organizationId);
		}else{
			params = params.append('partnerEntity', this.loggedInUser.corpData._id);
		}
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response) => {
				if (response.success == true) {
					if(this.selection.selected.length>0){
						this.partners = response.data.partners.partners;
					}
				}
			}));
	};
	getorganization() {
		this.url = "/organization/list";
		var params = new HttpParams();
		params = params.append('pagesize', '100');
		params = params.append('page', '1');
		params = params.append('isActive', 'true');
		if(this.filter.organizationNameCode){
			params = params.append('organizationNameCode', this.filter.organizationNameCode);
		}
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response) => {
				if(response.success == true) {				
					if(this.selection.selected.length>0){
                    	this.organization =  response.data.organizations.result;
					}
				}
			}))
	}

	selectRow($event, row) {
		this.selection.clear();
		if(this.role == 'sysadmin' || this.role == 'subadmin'){
			this.finalTransactionForm.patchValue({buttonList:''});
			this.getorganization();
		}else {
			this.finalCertForm.patchValue({btnList:''});
			this.getPartners('','','');
		}
	}
	uncheck(e){
		if (e.target.checked == true){
			this.selection.clear();
			this.organization = [];
			this.organization.length=0
			this.filter.organizationNameCode = '';
			this.partners = [];
			this.partners.length = 0;
			this.filter.corporateNameCode=''
		}
	}

	getTransactionType(recordPerPage, currentPage) {
		this.url = '/transactiontype/list';
		var params = new HttpParams();
		params = params.append('pagesize', recordPerPage);
		params = params.append('page', currentPage);

		if(this.loggedInUser.corpData){
			params = params.append('corporateId', this.loggedInUser.corpData._id);
		}
		if(this.role == 'sysadmin'  || this.role == 'subadmin'){
			params = params.append('organizationId', this.loggedInUser.reference.organizationId);
		}
		if(this.role == 'admin'){
			params = params.append('organizationId', this.loggedInUser.reference.organizationId);
			params = params.append('showToadmin', 'showToadmin');
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
		if(this.filter.additionalDescription){
			params = params.append('additionalDescription', this.filter.additionalDescription);
		}
		if(this.filter.searchKey){
			params = params.append('searchKey', this.filter.searchKey);
		}
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response: any) => {
				this.transtypes = response.data.result.transtypes.transtypes;

					var credDatas = this.transtypes;
					for (var i = 0; i < credDatas.length; i++) {
						var transactionidFields = credDatas[i].fields;
						var fields = {};
						transactionidFields.forEach((field) => {
							const formDataKey = Object.keys(field)[i];
							fields[formDataKey] = "";
						})
						credDatas[i].fields = fields;
					}
					this.totalRecord = response.data.result.transtypes.total_count;
					this.dataSource.data = credDatas;					
			}))
	}

	buttonTypes(type, form: NgForm) {
		this.selectedBatches = this.selection.selected;
			this.urls = '/transtype/' + this.selectedBatches[0].transactionTypeId;

			var params = new HttpParams();
			this.subscriptions.push(this.apiService.get(this.urls, params)
				.subscribe((response: any) => {
					if (response.success == true) {
						this.transtypes = response.data.transType;
						this.urlTrantype = '/module/' + this.selectedBatches[0].module._id;
						var params = new HttpParams();
						params = params.append('organizationId', this.loggedInUser.reference.organizationId);
						this.urlDept = '/department/organization/' + type;
						var paramss = new HttpParams();
						this.subscriptions.push(this.apiService.get(this.urlDept, paramss)
						.subscribe((response: any) => {
							if (response.success == true) {
								this.deptDataorganization = response.data
								this.subscriptions.push(this.apiService.get(this.urlTrantype, params)
								.subscribe((response: any) => {
									if (response.success == true) {
										this.credDataModule = response.data
							
										this.urlTrantype = '/transtype/createTransType';
										var datas = {
											organizationId: type,
											referenceId: this.selectedBatches[0]._id,
											departmentId: this.deptDataorganization._id,
											moduleId: this.selectedBatches[0].module._id,
											transactionTypeName: this.transtypes.transactionTypeName,
											transactionTypeCode: this.transtypes.transactionTypeCode,
											additionalDescription: this.transtypes.additionalDescription,
											transactionTypePrefix: this.transtypes.transactionTypePrefix,
											transactionTypeAutoNumber: this.transtypes.transactionTypeAutoNumber,
											assetWithoutReference: this.transtypes.assetWithoutReference,
											transRole: this.transtypes.transRole,
											epr: this.transtypes.epr,
											eprReceive: this.transtypes.eprReceive,
											eprConsume: this.transtypes.eprConsume,
											eprPrint: this.transtypes.eprPrint,
											nft: this.transtypes.nft,
											orderType: this.transtypes.orderType,
											serialized: this.transtypes.serialized,
											provenance: this.transtypes.provenance,
											verifiable:this.transtypes.verifiable,
											fromToEntity: this.transtypes.fromToEntity,
											transaction: this.transtypes.transaction,
											orderReference: this.transtypes.orderReference,
											assetType: this.transtypes.assetType,
											pdffield: this.transtypes.pdffield,
											review: this.transtypes.review,
											certify: this.transtypes.certify,
											approve: this.transtypes.approve,
											asset: this.transtypes.asset,
											credImg: this.transtypes.credImg,
											htmlFile: this.transtypes.htmlFile,
											fields: this.transtypes.fields,
											staticFields: this.transtypes.staticFields,
											isPublic: this.transtypes.isPublic,
											viewPDF: this.transtypes.viewPDF,
											createdBy: this.createdBy,
											updatedBy: this.createdBy,
											status: this.transtypes.status,
											category: this.credDataModule.category,
											sub_category: this.credDataModule.sub_category,
											code: this.credDataModule.code,
   									        name: this.credDataModule.name,
											refModule: this.transtypes.refModule,
											refTransType: this.transtypes.refTransType,
											isExpiry: this.transtypes.isExpiry,
											inputAsset: this.transtypes.inputAsset,
											referenceCreatedBy: this.loggedInUser._id,
										};
										
										this.subscriptions.push(this.apiService.post(this.urlTrantype, datas)
											.subscribe((response: any) => {
												if (response.success == true) {
													this.snackbarService.openSuccessBar('Transaction Type linked successfully.', "Transaction Type Linked");
													this.selection.clear();
													this.organization = [];
													if(this.curPage && this.orgPerPage){
														this.getTransactionType(this.orgPerPage, this.curPage);
														this.router.navigate(['/transactionTypes/linkTransactionType'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
													}else{
														this.getTransactionType(this.recordPerPage, this.currentPage);
														this.router.navigate(['/transactionTypes/linkTransactionType'],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.recordPerPage}});
													}
													this.getorganization();
												}
											}, error => {
												this.selection.clear();
												this.organization = [];
												if(this.curPage && this.orgPerPage){
													this.getTransactionType(this.orgPerPage, this.curPage);
													this.router.navigate(['/transactionTypes/linkTransactionType'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
												}else{
													this.getTransactionType(this.recordPerPage, this.currentPage);
													this.router.navigate(['/transactionTypes/linkTransactionType'],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.recordPerPage}});
												}
												this.getorganization();
											}));
									}
								}))
							}
						}))
					}
				}, error => {
					this.selection.clear();
					this.organization = [];
					if(this.curPage && this.orgPerPage){
						this.getTransactionType(this.orgPerPage, this.curPage);
						this.router.navigate(['/transactionTypes/linkTransactionType'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
					}else{
						this.getTransactionType(this.recordPerPage, this.currentPage);
						this.router.navigate(['/transactionTypes/linkTransactionType'],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.recordPerPage}});
					}
				}))
	}

	btnTypes(type, form: NgForm) {
		this.selectedBatches = this.selection.selected;
			this.url = '/transactiontype/' + this.selectedBatches[0]._id;
			var params = new HttpParams();				
			this.subscriptions.push(this.apiService.get(this.url, params)
				.subscribe((response: any) => {
					if (response.success == true) {
						this.credData = response.data.transType					
					this.urlTrantype = '/transactiontype/create/';
					var datas = {
						corporateId: type,
						referenceCreatedBy: this.loggedInUser._id,
						referenceId: this.selectedBatches[0].referenceId,
						organizationId: this.credData.organizationId,
						departmentId: this.credData.departmentId,
						moduleId: this.credData.moduleId,
						transaction: this.credData.transaction,
						orderReference: this.credData.orderReference,
						transactionTypeName: this.credData.transactionTypeName,
						transactionTypeCode: this.credData.transactionTypeCode,
						transactionTypeId: this.credData.transactionTypeId,
						additionalDescription: this.credData.additionalDescription,
						transactionTypePrefix: this.credData.transactionTypePrefix,
						transactionTypeAutoNumber: this.credData.transactionTypeAutoNumber,
						assetWithoutReference: this.credData.assetWithoutReference,						
						transRole: this.credData.transRole,
						epr: this.credData.epr,
						eprReceive: this.credData.eprReceive,
						eprConsume: this.credData.eprConsume,
						eprPrint: this.credData.eprPrint,
						nft: this.credData.nft,
						orderType: this.credData.orderType,
						serialized: this.credData.serialized,
						provenance: this.credData.provenance,
						verifiable: this.credData.verifiable,
						fromToEntity: this.credData.fromToEntity,
						assetType: this.credData.assetType,
						pdffield: this.credData.pdffield,
						review: this.credData.review,
						certify: this.credData.certify,
						approve: this.credData.approve,
						asset: this.credData.asset,
						credImg: this.credData.credImg,
						fields: this.credData.fields,
						staticFields: this.credData.staticFields,
						isPublic: this.credData.isPublic,
						viewPDF: this.credData.viewPDF,
						createdBy: this.createdBy,
						updatedBy: this.createdBy,
						status: this.credData.status,
						isDigilockar: this.credData.isDigilockar,
						refModule: this.credData.refModule,
						refTransType: this.credData.refTransType,
						isExpiry: this.credData.isExpiry,
						inputAsset: this.credData.inputAsset
					};

					this.subscriptions.push(this.apiService.post(this.urlTrantype, datas)
						.subscribe((response: any) => {
							if (response.success == true) {
								this.snackbarService.openSuccessBar('Transaction Type linked successfully.', "Transaction Type Linked");
								this.selection.clear();
								this.organization = [];
								if(this.curPage && this.orgPerPage){
									this.getTransactionType(this.orgPerPage, this.curPage);
									this.router.navigate(['/transactionTypes/linkTransactionType'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
								}else{
									this.getTransactionType(this.recordPerPage, this.currentPage);
									this.router.navigate(['/transactionTypes/linkTransactionType'],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.recordPerPage}});
								}
								this.getPartners('','','');
							}
						}, error => {
							this.selection.clear();
							this.organization = [];
							if(this.curPage && this.orgPerPage){
								this.getTransactionType(this.orgPerPage, this.curPage);
								this.router.navigate(['/transactionTypes/linkTransactionType'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
							}else{
								this.getTransactionType(this.recordPerPage, this.currentPage);
								this.router.navigate(['/transactionTypes/linkTransactionType'],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.recordPerPage}});
							}
							this.getPartners('','','');
						}));
				}
			}, error => {
				this.selection.clear();
				this.partners = [];
				if(this.curPage && this.orgPerPage){
					this.getTransactionType(this.orgPerPage, this.curPage);
					this.router.navigate(['/transactionTypes/linkTransactionType'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
				}else{
					this.getTransactionType(this.recordPerPage, this.currentPage);
					this.router.navigate(['/transactionTypes/linkTransactionType'],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.recordPerPage}});
				}
			}));
	}
	view(i) {
		this.selectedTransType = this.dataSource.data[i];
		this.credData = this.selectedTransType;
		if(this.role == 'sysadmin'  || this.role == 'subadmin'){
			if(this.curPage && this.orgPerPage){
				this.router.navigate(['/transactionTypes/linkTransactionType/listlinkTransactionType/' + this.credData._id + '/view'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
			}else{
				this.router.navigate(['/transactionTypes/linkTransactionType/listlinkTransactionType/' + this.credData._id + '/view'],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.recordPerPage}});
			}
		}else {
			if(this.curPage && this.orgPerPage){
				this.router.navigate(['/transactionTypes/linkTransactionType/listlinkTransactionType/' + this.credData.referenceId + '/view'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
			}else{
				this.router.navigate(['/transactionTypes/linkTransactionType/listlinkTransactionType/' + this.credData.referenceId + '/view'],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.recordPerPage}});
			}
		}
	}
	goBack() {
		this.location.back();
	}
	selectadditionalDescription(event){	
		this.additionalDescription = event;
		this.getTransactionType(this.recordPerPage, this.currentPage);
	}
	selecttransTypeName(event){	
		this.transactionTypeName = event;
		this.getTransactionType(this.recordPerPage, this.currentPage);
	}
	selecttransTypeCode(event){	
		this.transactionTypeCode = event;
		this.getTransactionType(this.recordPerPage, this.currentPage);
	}
	selectmoduleCode(event){	
		this.moduleCode = event;
		this.getTransactionType(this.recordPerPage, this.currentPage);
	}
	selectmoduleName(event){	
		this.moduleName = event;
		this.getTransactionType(this.recordPerPage, this.currentPage);
	}
	clearFilter(event,value){
		value =''
		this.getTransactionType(this.recordPerPage, this.currentPage);
	}
	onSearch(event){
		this.filter.searchKey = event
		this.getTransactionType(this.recordPerPage, this.currentPage);
	}
	searchNameCode(event){	
		if(this.role == 'sysadmin' || this.role == 'subadmin'){
			this.filter.organizationNameCode = event;
        	this.getorganization()
		}else{
			this.filter.corporateNameCode = event;
			this.getPartners('','','');
		}
    }
	clearDropdown(event,value){
		value =''
		if(this.role == 'sysadmin' || this.role == 'subadmin'){
        	this.getorganization()
		}else{
			this.getPartners('','','');
		}
	}
	onChangedPage(pageData: PageEvent) {
		if(this.curPage && this.orgPerPage){
			this.curPage = pageData.pageIndex + 1
			this.orgPerPage = pageData.pageSize;
			this.getTransactionType(this.orgPerPage, this.curPage);
		}else{
			this.currentPage = pageData.pageIndex + 1;
			this.recordPerPage = pageData.pageSize;
			this.getTransactionType(this.recordPerPage, this.currentPage);
		}
	}
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	  };
}

export interface type {
	transactionTypeCode: string;
	moduleId: string;
	transactionTypeName: string;
	module: string;
}