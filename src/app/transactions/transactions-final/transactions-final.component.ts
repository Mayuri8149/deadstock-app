import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { faCheck, faEdit, faEye, faHandPointLeft, faReplyAll, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Boolean } from 'aws-sdk/clients/apigateway';
import * as _ from 'lodash';
import { Moment } from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { DataService } from 'src/app/services/data.service';
import { DatetimeConvertor } from 'src/app/services/datetime-convertor';
import { ErrorDialogService } from 'src/app/services/error-dialog.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UploadService } from 'src/app/services/upload.service';
import { CompressImageService } from 'src/app/trans-type-list/dynamic-add-trans-integrated/compress-image.service';
import { PurchaseOrderModalComponent } from 'src/app/trans-type-list/dynamic-add-trans-integrated/purchase-order-modal/purchase-order-modal.component';
import { environment } from 'src/environments/environment';

export class AppDateAdapter extends NativeDateAdapter {

	format(date: Date, displayFormat: Object): string {
	  if (displayFormat == "input") {
		let day = date.getDay();
		let month = date.getMonth() + 1;
		let year = date.getFullYear();
		return this._to2digit(month) + '/' + year;
	  } else {
		return date.toDateString();
	  }
	}
  
	private _to2digit(n: number) {
	  return ('00' + n).slice(-2);
	}   
  }
  
  export const APP_DATE_FORMATS = {
	parse: {
	  dateInput: 'DD/MM/YYYY',
	},
	display: {
	  dateInput: 'DD/MM/YYYY',
	  monthYearLabel: 'MMM YYYY',
	  dateA11yLabel: 'LL',
	  monthYearA11yLabel: 'MMMM YYYY',
	},
  }
    
@Component({
	selector: 'app-transactions-final',
	templateUrl: './transactions-final.component.html',
	styleUrls: ['./transactions-final.component.css'],
	providers: [
		{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
		{ provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
	  ]
})
export class TransactionsFinalComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	transactionidFieldForms: FormGroup;
	transactionidFieldViewForms: FormGroup;
	faReplyAll = faReplyAll;
	faHandPointLeft = faHandPointLeft;
	faSearch = faSearch;
	faEye = faEye;
	faCheck = faCheck;
	faEdit = faEdit;
	faTrash = faTrash;
	totalTransactions = 0;
	transactionsPerPage:any= 5;
	pageSizeOptions = [5,10,20,50,100];
	currentPage:any= 1;
	loggedInUser;
	isCorporate;
	role;
	entity;
	url;
	name: String;
	batchId;
	affiliateId;
	selectedTransactions: any = [];
	transaction;
	transactions = [];
	transactionDetails:any={}
	users: any[] = [];
	startIndex;
	assetId=null;
	assetName=null;
	moduleName=null;
	transactionTypeName=null;
	assetLocation=null;
	status=null;
	assetCategory=null;
	branchLocation=null;
	orderId=null;
	refEntityName=null;
	eprAssetName=null;
	eprOrderId=null;
	eprAssetId=null;
	eprAssetCategory=null;
	refTransactions;
	filter:any={transactionTypeName:'',moduleName:'',assetId:'',assetName:'',assetLocation:'',status:'',assetCategory:'',branchLocation:'',orderId:'',refEntityName:'',eprOrderId:'',eprAssetId:'',eprAssetCategory:'',eprAssetName:'',searchKey:''}
	sortkey:any={assetId:''}
	displayedColumns = [];
	dialogChangeEvent;
	dashboard: boolean | any = false;
	isActiveTab: boolean = false;
	isWriteshow: boolean = true;
	refCount=0;
	dataSource = new MatTableDataSource<any>();
	selection = new SelectionModel<any>(true, []);
	id;
	@Input() transactionData: {};
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('myModel',{static: false}) myModel: ModalDirective;
	@ViewChild('myModel1',{static: false}) myModel1: ModalDirective;
	@ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
	href;
	newAsset: any[];
	companyName;
	orderurl:String;
	eprOrderurl:String;
	eprAsseturl:String;
	showCreateForm:Boolean;
	showisWrite:Boolean;
	staticFolderName:any;
	transactionEntityBranch;
	curPage= 1;
	orgPerPage=5;
	pageIndex=0;
	pageSize=5
	writeAccessCount=0;
	outsideCreate:Boolean;
	updateurl:String;
	outSideCount=0;
	valArr=[];
	valArr1=[];
	valArr11=[];
	modaleFlag: boolean;
	outsideKey:any;
	outsideValue:any;
	selectedFiles: FileList;
	imageError = [];
	showImg =[];
	fileUploaded = [];
	resultSrc = [];
	fileNative = [];
	filenameArr =[];
	imageArr = [];
	modaleFlagCert: boolean = false;
	modaleFlagDyn: boolean =false;
	indField: any;
	urlSrc = [];
	isPdf: boolean = false;
	isImage: boolean = false;
	selectedstaticFiles: FileList;
	imageErrorStatic: string = '';
	showImgStatic: boolean;
	fileUploadedStatic: any;
	isImageStatic: boolean;
	isPdfStatic: boolean;
	resultSrcStatic: any;
	urlSrcStatic: any;
	urlSrcStatic1: any;
	fileStaticName: string;
	fileValueStatic: File;
	formValues: any;
	dataPosts:any; 
	outsideArr=[]
	trxId;
	data:any;
	orderDetailsData = [];
	lineArr=[]
	outsideTransaction:any
	getorderurl:String
	uploadedFileName;
	traceChainUrl;
	found: boolean;
	modalView: Boolean;
	showRevokeDelete:Boolean;
	outsideView:Boolean;
	outSideViewCount=0
	sessionTimeZoneValue: any;
	outSideVal:Boolean;
	outSideArray = [];
	outSArr=[]
	valOArr=[];
	outSideLength=0;
	constructor(public router: Router,
		private apiService: ApiService,
		private route: ActivatedRoute,
		public dialog: MatDialog,
		private dataService: DataService,
		private errorDialogService: ErrorDialogService,
		public confirmDialogService: ConfirmDialogService,
		private location: Location,
		public snackbarService: SnackbarService,
		private uploadService: UploadService,
		private _formBuilder: FormBuilder,
		private compressImage: CompressImageService,    
		public loaderService: LoaderService,
		public datetimeConvertor: DatetimeConvertor,
	) {
	}

	ngOnInit() {
		this.subscriptions.push(this.route.queryParams.subscribe((params) => {
			let that = this;
			var queryData = params['dashboard'];
			var batchTab = params['batchTab'];
			if (queryData == 1) {
				that.dashboard = true;
			} else {
				that.dashboard = false;
			}

			if (batchTab == 0) {
				that.isActiveTab = true;
			} else if (batchTab == 1) {
				that.isActiveTab = false;
			}
		}));
		this.href = this.router.url;
		if (this.href == "/transactions?dashboard=1") {
			this.dashboard = true;
		} else {
			this.dashboard = false;
		}
		this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
		this.transactionDetails = JSON.parse(sessionStorage.getItem('transcationType'));
		if (typeof this.loggedInUser.timeZone === 'undefined' || this.loggedInUser.timeZone == null || this.loggedInUser.timeZone == '') {
			this.loggedInUser.timeZone = 'Asia/Kolkata'
		}
		this.isCorporate = false;
		if ('corpData' in this.loggedInUser) {
			this.isCorporate = true;
		}
		if ('corpData' in this.loggedInUser) {
			this.companyName = this.loggedInUser?.corpData?.companyName;
			this.id = this.loggedInUser?.corpData?.code
		  } else {
			this.companyName = this.transactionDetails?.organization?.name;
			this.id = this.loggedInUser?.organizationCode
			this.transactionEntityBranch=this.loggedInUser?.branchCode
		  }
		
		this.role = this.loggedInUser.reference.role;
		this.entity = this.loggedInUser.reference.entity;
		this.batchId = this.route.snapshot.params['batchId'];
		this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['recordPerPage'];
		this.traceChainUrl = environment.awsImgPath
		this.dataService.setBatch(this.batchId);
		this.dataSource.sort = this.sort;
		this.transactionidFieldForms = this._formBuilder.group({});
		this.transactionidFieldViewForms = this._formBuilder.group({});
		if(this.transactionDetails == null){
            this.getSelectedUserAccess()
		}else{
			this.getRefTransactions();
		}
		if(this.transactionDetails?.transactionType?.transaction == 'Asset' && this.transactionDetails?.transactionType?.isExpiry == true && this.transactionDetails.transactionType.transRole!='Digital'){
			this.displayedColumns = ['action', 'companyName','branchLocation', 'moduleName','transactionTypeName','assetId','assetCategory','assetName','assetQuantity','assetLocation','effectivedate','expirydate','created_on','status'];
		}else if(this.transactionDetails?.transactionType?.transaction == 'Asset' && (this.transactionDetails?.transactionType?.isExpiry == false || this.transactionDetails?.transactionType?.isExpiry == null) && this.transactionDetails.transactionType.transRole!='Digital'){
			this.displayedColumns = ['action', 'companyName','branchLocation', 'moduleName','transactionTypeName', 'assetId','assetCategory','assetName','assetQuantity','assetLocation','created_on','status'];
		}else if(this.transactionDetails?.transactionType?.transaction == 'Order' && this.transactionDetails.transactionType.transRole!='Digital'){
			this.displayedColumns = ['action', 'companyName','branchLocation', 'moduleName','transactionTypeName', 'orderId','refEntityName','refbranchName','assetLocation','created_on','status'];
		}else if(this.transactionDetails?.transactionType?.transaction == 'Asset' && this.transactionDetails?.transactionType?.isExpiry == true && this.transactionDetails.transactionType.transRole=='Digital'){
			this.displayedColumns = ['action', 'companyName','branchLocation', 'moduleName','transactionTypeName','eprAssetId','eprAssetCategory','eprAssetName','eprAssetQuantity','assetLocation','effectivedate','expirydate','created_on','status'];
		}else if(this.transactionDetails?.transactionType?.transaction == 'Asset' && (this.transactionDetails?.transactionType?.isExpiry == false || this.transactionDetails?.transactionType?.isExpiry == null) && this.transactionDetails.transactionType.transRole=='Digital'){
			this.displayedColumns = ['action', 'companyName','branchLocation', 'moduleName','transactionTypeName', 'eprAssetId','eprAssetCategory','eprAssetName','eprAssetQuantity','assetLocation','created_on','status'];
		}else if(this.transactionDetails?.transactionType?.transaction == 'Order' && this.transactionDetails.transactionType.transRole=='Digital'){
			this.displayedColumns = ['action', 'companyName','branchLocation', 'moduleName','transactionTypeName', 'eprOrderId','refEntityName','refbranchName','assetLocation','created_on','status'];
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

	getTransactions(transactionsPerPage, currentPage) {
			this.url = "/asset/";
			var params = new HttpParams();			
			params = params.append('transactionEntity', this.id);
			params = params.append('organizationId', this.transactionDetails.organizationId);
			params = params.append('transactionTypeCode', this.transactionDetails.transactionType.transactionTypeCode);
			this.startIndex = ((currentPage * transactionsPerPage) - transactionsPerPage)
			params = params.append('startIndex', this.startIndex);
			params = params.append('limit', transactionsPerPage);
			if(this.transactionDetails.transactionType.inputAsset==true){
				params = params.append('inputAssetFlag', "true");
			}

			if(this.filter.moduleName){
				params = params.append('moduleName', this.filter.moduleName);
			}
			if(this.filter.transactionTypeName){
				params = params.append('transactionTypeName', this.filter.transactionTypeName);
			}
			if(this.filter.assetId){
				params = params.append('assetId', this.filter.assetId);
			}
			if(this.filter.assetName){
				params = params.append('assetName', this.filter.assetName);
			}
			if(this.filter.assetLocation){
				params = params.append('assetLocation', this.filter.assetLocation);
			}
			if(this.filter.status){
				params = params.append('status', this.filter.status);
			}
			if(this.filter.assetCategory){
				params = params.append('assetCategory', this.filter.assetCategory);
			}
			if(this.filter.branchLocation){
				params = params.append('branchLocation', this.filter.branchLocation);
			}
			if(this.filter.orderId){
				params = params.append('orderId', this.filter.orderId);
			}
			if(this.filter.refEntityName){
				params = params.append('refEntityName', this.filter.refEntityName);
			}
			
			if(this.filter.eprOrderId){
				params = params.append('eprOrderId', this.filter.eprOrderId);
			}
			if(this.filter.eprAssetId){
				params = params.append('eprAssetId', this.filter.eprAssetId);
			}
			if(this.filter.eprAssetCategory){
				params = params.append('eprAssetCategory', this.filter.eprAssetCategory);
			}
			if(this.filter.eprAssetName){
				params = params.append('eprAssetName', this.filter.eprAssetName);
			}
			if(this.filter.eprAssetQuantity){
				params = params.append('eprAssetQuantity', this.filter.eprAssetQuantity);
			}
			if(this.filter.searchKey){
				params = params.append('searchKey', this.filter.searchKey);
			}
			if(this.assetId){
				var sortAssetIdOrder = this.assetId.direction || '';
				var sortAssetIdKey = this.assetId.active || '';

				params = params.append('sortKey', sortAssetIdKey);
				params = params.append('sortOrder', sortAssetIdOrder);
			}
			
			if(this.transactionDetails.transactionType.transaction=="Order" && this.transactionDetails.transactionType.transRole!='Digital'){  // (this.transactionDetails.transactionType.epr == false || this.transactionDetails.transactionType.epr == null || this.transactionDetails.transactionType.epr == ''
				if(this.refCount!=0 || this.isWriteshow!=true){
					params = params.append('isRefEntity', 'true');
				}
				params = params.append('statusFlag', 'Cancelled');
				this.orderurl ="/order/"
				this.subscriptions.push(this.apiService.getAsset(this.orderurl, params)
				.subscribe((response: any) => {
					if (response.success == true) {
						this.transactions = response.data.result;
							for (var i = 0; i < this.transactions.length; i++) {
								if(this.transactions[i].status == "New") {
									this.transactions[i].status = "Open";
								} else {
									this.transactions[i].status = "Closed";
								}

								// this code added to convert date time as per user timezone set in profile
								this.transactions[i].created_on = this.datetimeConvertor.convertDateTimeZone(this.transactions[i].created_on,"datetime");
								
								if(response.data.result[i].refEntityType == "Partner" && response.data.result[i].refEntityDetails){
									this.transactions[i].refEntityName = response.data.result[i].refEntityDetails?.companyName
								}else if(response.data.result[i].refEntityType == "Organization"){
									this.transactions[i].refEntityName = response.data.result[i].refEntityDetails?.name
								}
								if(response.data.result[i].transactionEntityType == "Partner" && response.data.result[i].transactionEntityDetails){
									this.transactions[i].companyName = response.data.result[i].transactionEntityDetails.companyName
									this.transactions[i].branchLocation = response.data.result[i].transactionEntityDetails?.location
								}else if(response.data.result[i].transactionEntityType == "Organization"){
									this.transactions[i].companyName = response.data.result[i].transactionEntityDetails.name
									this.transactions[i].branchLocation = response.data.result[i].transactionEntityDetails?.location
								}
							}
							if(this.refCount>0){
								this.transactions.forEach( (item, index) => {
									if(item.transactionEntity !== this.id || item.transactionEntityBranch !== this.transactionEntityBranch) {
										this.transactions[index].showCreateForm = true
									}
								})
							}

							this.transactions.forEach( (item, index1) => {
								var vals = []
								item.transtype.fields.forEach((value,index)=>{
									vals[index] = item.transtype.fields[index][0];
									if(vals[index].is_outside_level == true) {
										this.valArr.push({key:vals[index].key,value:vals[index].value})
										this.transactions[index1].outsideCreate = true
										this.outSideCount++
									}
								})
							})

							this.transactions.forEach( (item, index1) => {
								var vals1 = []
								item.transtype.fields.forEach((value,index)=>{
									vals1[index] = item.transtype.fields[index][0];
									if(vals1[index].is_outside_level == true) {
										this.valOArr.push({key:vals1[index].key,value:vals1[index].value})
										if(this.transactions[index1]?.outside_docs && Object.keys(this.transactions[index1]?.outside_docs).length > 0){
											this.transactions[index1].outSideVal = true
										}
									}
								})
							})
							
							this.transactions.forEach( (item, index) => {
								if(this.transactionEntityBranch){
									if(item.transactionEntityBranch === this.transactionEntityBranch) {
										this.transactions[index].showRevokeDelete = true
									}
								}else{
									if(item.transactionEntity === this.id) {
										this.transactions[index].showRevokeDelete = true
									}
								}
								
							})
						this.totalTransactions = response.data.totalCount;
						this.dataSource.data = this.transactions;
						
					}		
				}));
			}else if(this.transactionDetails.transactionType.transaction=="Asset" && this.transactionDetails.transactionType.transRole!='Digital'){
				params = params.append('statusFlag', 'Revoked');
				this.subscriptions.push(this.apiService.getAsset(this.url, params)
				.subscribe((response: any) => {
					if (response.success == true) {
						this.transactions = response.data.result;
							for (var i = 0; i < this.transactions.length; i++) {
								if(this.transactions[i].status == "New") {
									this.transactions[i].status = "Open";
								} else {
									this.transactions[i].status = "Closed";
								}
								// this code added to convert date time as per user timezone set in profile
								this.transactions[i].created_on = this.datetimeConvertor.convertDateTimeZone(this.transactions[i].created_on,"datetime");
								this.transactions[i].effectiveDate = this.datetimeConvertor.convertDateTimeZone(this.transactions[i].effectiveDate,"date");
								this.transactions[i].expiryDate = this.datetimeConvertor.convertDateTimeZone(this.transactions[i].expiryDate,"date");
								
								this.transactions[i].assetQuantity = response.data.result[i].assetQuantity.toFixed(response.data.result[i].uom?.decimal)
								if(response.data.result[i].refEntityType == "Partner"){
									response.data.result[i].refEntityName = response.data.result[i].refEntityDetails.companyName
								}else if(response.data.result[i].refEntityType == "Organization"){
									response.data.result[i].refEntityName = response.data.result[i].refEntityDetails.name
								}
								if(response.data.result[i].transactionEntityType == "Partner"){
									this.transactions[i].companyName = response.data.result[i].transactionEntityDetails.companyName
									this.transactions[i].branchLocation = response.data.result[i].transactionEntityDetails.location
								}else if(response.data.result[i].transactionEntityType == "Organization"){
									this.transactions[i].companyName = response.data.result[i].transactionEntityDetails.name
									this.transactions[i].branchLocation = response.data.result[i].transactionEntityDetails.location
								}
							}
							if(this.refCount>0){
								this.transactions.forEach( (item, index) => {
									if(item.transactionEntity !== this.id || item.transactionEntityBranch !== this.transactionEntityBranch) {
										this.transactions[index].showCreateForm = true
									}
								})
							}
							this.transactions.forEach( (item, index1) => {
								var vals = []
								item.transtype.fields.forEach((value,index)=>{
									vals[index] = item.transtype.fields[index][0];
									if(vals[index].is_outside_level == true) {
										this.valArr.push({key:vals[index].key,value:vals[index].value})
										this.transactions[index1].outsideCreate = true
										this.outSideCount++
									}
								})
							})
							this.transactions.forEach( (item, index) => {
								if(this.transactionEntityBranch){
									if(item.transactionEntityBranch === this.transactionEntityBranch) {
										this.transactions[index].showRevokeDelete = true
									}
								}else{
									if(item.transactionEntity === this.id) {
										this.transactions[index].showRevokeDelete = true
									}
								}
							})
						this.totalTransactions = response.data.totalCount;
						this.dataSource.data = this.transactions;
					}		
				}));
			}else if(this.transactionDetails.transactionType.transaction=="Order" && this.transactionDetails.transactionType.transRole =='Digital'){
				if(this.refCount!=0 || this.isWriteshow!=true){
					params = params.append('isRefEntity', 'true');
				}
				this.eprOrderurl ="/eprOrder/"
				this.subscriptions.push(this.apiService.getAsset(this.eprOrderurl, params).subscribe((response: any) => {
					if (response.success == true) {
						this.transactions = response.data.result;
							for (var i = 0; i < this.transactions.length; i++) {
								if(this.transactions[i].status == "New") {
									this.transactions[i].status = "Open";
								} else {
									this.transactions[i].status = "Closed";
								}

								if(response.data.result[i].refEntityType == "Partner" && response.data.result[i].refEntityDetails){
									this.transactions[i].refEntityName = response.data.result[i].refEntityDetails?.companyName
								}else if(response.data.result[i].refEntityType == "Organization"){
									this.transactions[i].refEntityName = response.data.result[i].refEntityDetails?.name
								}
								if(response.data.result[i].transactionEntityType == "Partner" && response.data.result[i].transactionEntityDetails){
									this.transactions[i].companyName = response.data.result[i].transactionEntityDetails.companyName
									this.transactions[i].branchLocation = response.data.result[i].transactionEntityDetails?.location
								}else if(response.data.result[i].transactionEntityType == "Organization"){
									this.transactions[i].companyName = response.data.result[i].transactionEntityDetails.name
									this.transactions[i].branchLocation = response.data.result[i].transactionEntityDetails?.location
								}
							}
							if(this.refCount>0){
								this.transactions.forEach( (item, index) => {
									if(item.transactionEntity !== this.id || item.transactionEntityBranch !== this.transactionEntityBranch) {
										this.transactions[index].showCreateForm = true
									}
								})
							}
							this.transactions.forEach( (item, index1) => {
								var vals = []
								item.transtype.fields.forEach((value,index)=>{
									vals[index] = item.transtype.fields[index][0];
									if(vals[index].is_outside_level == true) {
										this.valArr.push({key:vals[index].key,value:vals[index].value})
										this.transactions[index1].outsideCreate = true
										this.outSideCount++
									}
								})
							})
							this.transactions.forEach( (item, index) => {
								if(this.transactionEntityBranch){
									if(item.transactionEntityBranch === this.transactionEntityBranch) {
										this.transactions[index].showRevokeDelete = true
									}
								}else{
									if(item.transactionEntity === this.id) {
										this.transactions[index].showRevokeDelete = true
									}
								}
							})
							this.totalTransactions = response.data.totalCount;
							this.dataSource.data = this.transactions;
						
					}		
				}));
			}else if(this.transactionDetails.transactionType.transaction=="Asset" && this.transactionDetails.transactionType.transRole=='Digital'){
				this.eprAsseturl ="/eprAsset/"
				this.subscriptions.push(this.apiService.getAsset(this.eprAsseturl, params).subscribe((response: any) => {
					if (response.success == true) {
						this.transactions = response.data.result;
							for (var i = 0; i < this.transactions.length; i++) {
								if(this.transactions[i].status == "New") {
									this.transactions[i].status = "Open";
								} else {
									this.transactions[i].status = "Closed";
								}
								this.transactions[i].eprAssetQuantity = response.data.result[i].eprAssetQuantity.toFixed(response.data.result[i].uom?.decimal)
								if(response.data.result[i].refEntityType == "Partner"){
									response.data.result[i].refEntityName = response.data.result[i].refEntityDetails.companyName
								}else if(response.data.result[i].refEntityType == "Organization"){
									response.data.result[i].refEntityName = response.data.result[i].refEntityDetails.name
								}
								if(response.data.result[i].transactionEntityType == "Partner"){
									this.transactions[i].companyName = response.data.result[i].transactionEntityDetails.companyName
									this.transactions[i].branchLocation = response.data.result[i].transactionEntityDetails.location
								}else if(response.data.result[i].transactionEntityType == "Organization"){
									this.transactions[i].companyName = response.data.result[i].transactionEntityDetails.name
									this.transactions[i].branchLocation = response.data.result[i].transactionEntityDetails.location
								}
							}
							if(this.refCount>0){
								this.transactions.forEach( (item, index) => {
									if(item.transactionEntity !== this.id || item.transactionEntityBranch !== this.transactionEntityBranch) {
										this.transactions[index].showCreateForm = true
									}
								})
							}

							this.transactions.forEach( (item, index1) => {
								var vals = []
								item.transtype.fields.forEach((value,index)=>{
									vals[index] = item.transtype.fields[index][0];
									if(vals[index].is_outside_level == true) {
										this.valArr.push({key:vals[index].key,value:vals[index].value})
										this.transactions[index1].outsideCreate = true
										this.outSideCount++
									}
								})
							})
							this.transactions.forEach( (item, index) => {
								if(this.transactionEntityBranch){
									if(item.transactionEntityBranch === this.transactionEntityBranch) {
										this.transactions[index].showRevokeDelete = true
									}
								}else{
									if(item.transactionEntity === this.id) {
										this.transactions[index].showRevokeDelete = true
									}
								}
							})
						this.totalTransactions = response.data.totalCount;
						this.dataSource.data = this.transactions;
					}		
				}));
			}
			
		}

		onClickMenu(transactionData){			
				var vals = []
				transactionData.transtype.fields.forEach((value,index)=>{
					vals[index] = transactionData.transtype.fields[index][0];
					if(vals[index].is_outside_level == true) {
						this.valArr11.push({key:vals[index].key,value:vals[index].value})
					}
				})

				var result = this.valArr11.reduce((unique, o) => {
				if(!unique.some(obj => obj.key === o.key && obj.value === o.value)) {
				  unique.push(o);
				}
				return unique;
			},[]);
			this.outsideArr = result
			if(transactionData.outside_docs){
			var trxOutSideData = transactionData.outside_docs
				Object.keys(trxOutSideData).forEach(key => {
					this.outsideArr.forEach( (item1, ind) => {
						if(key == item1.key){
							this.outsideArr[ind].flag = true
						}
					});
				})
			}
		}
		onClickOutsideMenu(transactionData){			
			var vals = []
			transactionData.transtype.fields.forEach((value,index)=>{
				vals[index] = transactionData.transtype.fields[index][0];
				if(vals[index].is_outside_level == true) {
					this.valArr11.push({key:vals[index].key,value:vals[index].value})
				}
			})

			var result = this.valArr11.reduce((unique, o) => {
			if(!unique.some(obj => obj.key === o.key && obj.value === o.value)) {
			  unique.push(o);
			}
			return unique;
		},[]);
		this.outsideArr = result
		if(transactionData.outside_docs){
		var trxOutSideData = transactionData.outside_docs
			Object.keys(trxOutSideData).forEach(key => {
				this.outsideArr.forEach( (item1, ind) => {
					if(key == item1.key){
						this.outsideArr[ind].flag = true
						// this.outSideLength++
						if(this.outsideArr[ind].flag==true){
							this.outSideArray.push({key:this.outsideArr[ind].key,value:this.outsideArr[ind].value})
							var result1 = this.outSideArray.reduce((unique, o) => {
								if(!unique.some(obj => obj.key === o.key && obj.value === o.value)) {
								  unique.push(o);
								}
								return unique;
							},[]);
							this.outSArr = result1
						}
					}
				});
			})
		}
	}
		closeMenu(){
			this.valArr11=[]
			this.outsideArr = []
			this.outSideLength=0
			this.outSideArray = []
		}

		close(){
			this.valArr11=[]
			this.outsideArr = []
			this.outSideLength=0
			this.outSideArray = []
		}
	   getRefTransactions() {
			this.url = "/transactiontype/refTransType";
			var params = new HttpParams();
			
			params = params.append('organizationId', this.transactionDetails.organizationId);
			params = params.append('transactionTypeCode', this.transactionDetails.transactionType.transactionTypeCode);
			this.subscriptions.push(this.apiService.get(this.url, params)
				.subscribe((response: any) => {
					if (response.success == true) {
						this.refTransactions = response.data.result.transtypes.transtypes;
						this.refCount = response.data.result.transtypes.total_count	     
						if(response.data.result.transtypes.total_count>0){
							
							this.refTransactions.forEach( (item, index) => {
								if(item.useraccesses.isWrite == true) {
									this.refTransactions[index].showisWrite = true
									this.writeAccessCount++
								}
							})
						}
						if(this.curPage && this.orgPerPage){
							this.pageIndex = this.curPage - 1
							this.transactionsPerPage = this.orgPerPage
							this.getTransactions(this.orgPerPage, this.curPage);
						}else{
							this.getTransactions(this.transactionsPerPage, this.currentPage);
						}
					}		
				}));			
		}	

	createForm(row,transcationType){
		sessionStorage.setItem('transcationType', JSON.stringify(transcationType));
		if(this.curPage && this.orgPerPage){
			this.router.navigate(['/transTypeList?dashboard=1/' + transcationType._id + '/' + transcationType.useraccesses.batchId + '/' + '/addTransIntegrated/'+ row._id + "/" + this.transactionDetails._id],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage }});
		}else{
			this.router.navigate(['/transTypeList?dashboard=1/' + transcationType._id + '/' + transcationType.useraccesses.batchId + '/' + '/addTransIntegrated/'+ row._id + "/" + this.transactionDetails._id],{ queryParams: { partnerOrder:true,currentPage: this.currentPage, recordPerPage: this.transactionsPerPage }});
		}
	}

	createOutSideForm(row,value){
		this.myModel.show();
		this.modalView = false
		this.outsideKey = value.key
		this.outsideValue = value.value
		this.trxId = row._id
		var formDataObj = {};
		let formDataKey = this.outsideKey;
		  
		formDataObj[formDataKey] = new FormControl(''); 
	
		this.transactionidFieldForms = new FormGroup(formDataObj);
		if (this.outsideValue == "Date") {
			this.transactionidFieldForms.controls[this.outsideKey].setValue('');
		} else if (this.outsideValue == "String") {
			this.transactionidFieldForms.controls[this.outsideKey].setValue('');
		} else if (this.outsideValue == "Number") {
			this.transactionidFieldForms.controls[this.outsideKey].setValue('');
		} else if (this.outsideValue == "File") {
			this.transactionidFieldForms.controls[this.outsideKey].setValue('');
		} else if (this.outsideValue == "JSON") {
			this.transactionidFieldForms.controls[this.outsideKey].setValue('');
		}
		if(this.transactionDetails.transactionType.transaction=="Order" && this.transactionDetails.transactionType.transRole!='Digital'){
			this.getorderurl ="/order/" + this.trxId;
		}else if(this.transactionDetails.transactionType.transaction=="Asset" && this.transactionDetails.transactionType.transRole!='Digital'){
			this.getorderurl ="/asset/" + this.trxId;
		}else if(this.transactionDetails.transactionType.transaction=="Order" && this.transactionDetails.transactionType.transRole =='Digital'){
			this.getorderurl ="/eprOrder/" + this.trxId;
		}else if(this.transactionDetails.transactionType.transaction=="Asset" && this.transactionDetails.transactionType.transRole =='Digital'){
			this.getorderurl ="/eprAsset/" + this.trxId;
		}
		var params = new HttpParams();
		this.subscriptions.push(this.apiService.getAsset(this.getorderurl, params)
		.subscribe((response: any) => {
			if (response.success == true) {
				this.outsideTransaction = response.data._id;
				var values = this.outsideTransaction.outside_docs
							if(values){
								var keysValue1 = Object.keys(values);
								var valueObj1 = Object.values(values);
									keysValue1.forEach((value,index)=>{
										if(value === this.outsideKey){
											this.orderDetailsData[keysValue1[index]] = valueObj1[index]	
											this.uploadedFileName = valueObj1[index]
											this.found = true;
											this.transactionidFieldForms.patchValue(this.orderDetailsData);
										}
									})
							}
				}
			}))
			  
			formDataObj[formDataKey] = new FormControl(''); 
			this.transactionidFieldForms = new FormGroup(formDataObj);
			if (this.outsideValue == "Date") {
				this.transactionidFieldForms.controls[this.outsideKey].setValue('');
			} else if (this.outsideValue == "String") {
				this.transactionidFieldForms.controls[this.outsideKey].setValue('');
			} else if (this.outsideValue == "Number") {
				this.transactionidFieldForms.controls[this.outsideKey].setValue('');
			} else if (this.outsideValue == "File") {
				this.transactionidFieldForms.controls[this.outsideKey].setValue('');
			} else if (this.outsideValue == "JSON") {
				this.transactionidFieldForms.controls[this.outsideKey].setValue('');
			}
			this.found = false;
	}
	hide2(){
		this.myModel.hide();
	}
	hide1(){
		this.myModel1.hide();
	}
	viewOutSideForm(row,value){
		this.myModel.show();
		this.modalView = true
		this.outsideKey = value.key
		this.outsideValue = value.value
		this.trxId = row._id
		var formDataObj = {};
		let formDataKey = this.outsideKey;		  
		formDataObj[formDataKey] = new FormControl(''); 	
		this.transactionidFieldViewForms = new FormGroup(formDataObj);
	
		if(this.transactionDetails.transactionType.transaction=="Order" && this.transactionDetails.transactionType.transRole!='Digital'){
			this.getorderurl ="/order/" + this.trxId;
		}else if(this.transactionDetails.transactionType.transaction=="Asset" && this.transactionDetails.transactionType.transRole!='Digital'){
			this.getorderurl ="/asset/" + this.trxId;
		}else if(this.transactionDetails.transactionType.transaction=="Order" && this.transactionDetails.transactionType.transRole =='Digital'){
			this.getorderurl ="/eprOrder/" + this.trxId;
		}else if(this.transactionDetails.transactionType.transaction=="Asset" && this.transactionDetails.transactionType.transRole =='Digital'){
			this.getorderurl ="/eprAsset/" + this.trxId;
		}
		var params = new HttpParams();
		this.subscriptions.push(this.apiService.getAsset(this.getorderurl, params)
		.subscribe((response: any) => {
			if (response.success == true) {
				this.outsideTransaction = response.data._id;
				var values = this.outsideTransaction.outside_docs
							if(values){
								var keysValue1 = Object.keys(values);
								var valueObj1 = Object.values(values);
									keysValue1.forEach((value,index)=>{
										if(value === this.outsideKey){
											this.orderDetailsData[keysValue1[index]] = valueObj1[index]	
											this.uploadedFileName = valueObj1[index]
											this.found = true;
											this.transactionidFieldViewForms.patchValue(this.orderDetailsData);
										}
									})
							}
				}
			}))
	}

	chooseStaticUploadFile(event) {
		this.selectedstaticFiles = event.target.files;		
		const max_size =  10485760 //2097152;    
		const allowed_types = ['image/png', 'image/jpeg','image/jpg','application/pdf'];
		this.imageErrorStatic = '';
		if (this.selectedstaticFiles[0].size > max_size) {
			this.showImgStatic =false;
			this.imageErrorStatic ='Maximum size allowed is 10MB';
			return false;
		}
	
		if (!_.includes(allowed_types, this.selectedstaticFiles[0].type)) {
			this.showImgStatic =false;
			this.imageErrorStatic = 'Only Files are allowed ( JPG | PNG | JPEG | PDF)';
			return false;
		}
		this.showImgStatic =true;
		this.fileUploadedStatic=event.target.files;
		this.fileStaticName =this.uploadService.findFileName(this.selectedstaticFiles[0].name); 
		const uploadedFileType=this.selectedstaticFiles[0].type;
		if(uploadedFileType=='image/jpeg' || uploadedFileType=='image/jpg' || uploadedFileType=='image/png')
		{
		  this.loaderService.show();
		  let image: File = event.target.files[0];
		  this.subscriptions.push(this.compressImage.compress(image)
		  .pipe(take(1))
		  .subscribe(compressedImage => {
			var reader = new FileReader();
			reader.readAsDataURL(compressedImage);
			reader.onload = (event: any) => {
			  this.resultSrcStatic = event.target.result;
			  this.fileValueStatic =compressedImage;
			  this.loaderService.hide();
			}
		  }))
		}else{
		  var reader = new FileReader();
		  reader.readAsDataURL(event.target.files[0]);
		  reader.onload = (event: any) => {
			this.resultSrcStatic = event.target.result;
		  }
		  this.fileValueStatic =this.selectedstaticFiles.item(0);
		}
		if(this.fileStaticName!=undefined){
			this.transactionidFieldForms.controls[this.outsideKey].setValue(this.fileStaticName);
		}
	};

	async submitTransaction(data1) {
		if(data1.invalid){
			return;
		}
		this.data = {  
			id: this.trxId
		}
		if(this.fileStaticName!=undefined){
			var outside_docs = {}
			outside_docs[this.outsideKey] = this.fileStaticName;
			this.data.outside_docs=outside_docs;
			if(this.outsideTransaction.outside_docs){
				this.data.outside_docs = Object.assign(this.outsideTransaction.outside_docs, outside_docs);
			}
		}else{
			this.data.outside_docs=data1.form.value;
			if(this.outsideTransaction.outside_docs){
				this.data.outside_docs = Object.assign(this.outsideTransaction.outside_docs, data1.form.value);
			}
		}
		if(this.transactionDetails.transactionType.transaction=="Order" && this.transactionDetails.transactionType.transRole!='Digital'){
			this.updateurl ="/order/edit/"
		}else if(this.transactionDetails.transactionType.transaction=="Asset" && this.transactionDetails.transactionType.transRole!='Digital'){
			this.updateurl ="/asset/edit/"
		}else if(this.transactionDetails.transactionType.transaction=="Order" && this.transactionDetails.transactionType.transRole =='Digital'){
			this.updateurl ="/eprOrder/edit/"
		}else if(this.transactionDetails.transactionType.transaction=="Asset" && this.transactionDetails.transactionType.transRole =='Digital'){
			this.updateurl ="/eprAsset/edit/"
		}
		 this.subscriptions.push(this.apiService.post_transactions(this.updateurl, this.data)
		  .subscribe((response: any) => {   
			  if (response.data) {
				if (response.success == true) {
				  if(this.fileStaticName!=undefined){
					const fileKeyStatic= "transactions/outside-media/"+this.fileStaticName;
					this.uploadService.uploadFile(this.fileValueStatic,fileKeyStatic);
				  }
				  	this.snackbarService.openSuccessBar('Your Record is updated successfully.', "Transaction");
					this.router.navigate(['/transactions/transactions?dashboard=1']);
				}
			  }
		  }))
	  }
	
	
	deleteStaticFile(){
		delete this.fileStaticName;
		delete this.fileValueStatic;
		this.showImgStatic=false
		this.transactionidFieldForms.controls[this.outsideKey].setValue('');
	}

	previewFileStatic(files){
		this.modaleFlagCert= true;
		this.modaleFlag= true;
		this.myModel1.show();
			if (files && files[0]) {
			if(files[0].type == "application/pdf") {
				this.isImageStatic = false;
				this.isPdfStatic = true;      // required, going forward
			}else {
				this.isPdfStatic = false;
				this.isImageStatic = true;    // required, going forward
			}
			this.urlSrcStatic1 =this.resultSrcStatic;
			}
	}

	async previewFile(files){
		this.modaleFlagCert= false;
  		this.modaleFlag= false;
		const ext = files.split('.').pop();
		if(ext == "pdf") {
			this.isImageStatic = false;
			this.isPdfStatic = true; 
		}else {
			this.isPdfStatic = false;
			this.isImageStatic = true;
		}
		this.staticFolderName = "transactions/outside-media/"
		const bucketName= environment.Bucket
		const fileName= this.staticFolderName + this.uploadedFileName
		const returnRes= await this.uploadService.fileExist(bucketName,fileName)
  
		if(returnRes==true){
			this.modaleFlag= true;
			this.myModel1.show();
			this.urlSrcStatic = this.staticFolderName + this.uploadedFileName;
		}else{
			this.snackbarService.openSuccessBar("File not found", "File");
		}

	  }


	chosenYearHandler(normalizedYear: Moment, controlName: string) {
		const ctrlValue = this.transactionidFieldForms.controls[controlName].value;
		ctrlValue.year(normalizedYear.year());
		this.transactionidFieldForms.controls[controlName].setValue(ctrlValue)
	}
	
	chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>, controlName: string) {
		const ctrlValue = this.transactionidFieldForms.controls[controlName].value;
		ctrlValue.month(normalizedMonth.month());
		this.transactionidFieldForms.controls[controlName].setValue(ctrlValue);
	}
	sortData(event){
		this.assetId = event;
		this.getTransactions(this.transactionsPerPage, this.currentPage);
	}
	searchField(event,value){
		value=event
		this.getTransactions(this.transactionsPerPage, this.currentPage);
	}
	clearFilter(event,value){
		value =''
		this.getTransactions(this.transactionsPerPage, this.currentPage);

	}
	onSearch(event){
		this.filter.searchKey = event
		this.getTransactions(this.transactionsPerPage, this.currentPage);
		
	  }
	viewTransaction(row) {
		this.selectedTransactions = row._id
		if (this.selectedTransactions) {
			this.transaction = this.selectedTransactions;
				if(this.curPage && this.orgPerPage){
					this.router.navigate(['/transactions/transactions/transactionView/' + this.transaction],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage, actionFlag:'revoke' }});
				}else{
					this.router.navigate(['/transactions/transactions/transactionView/' + this.transaction],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.transactionsPerPage, actionFlag:'revoke' }});
				}
			} else {
			this.transaction = this.selectedTransactions;
			if (!this.isActiveTab && this.transaction.generateType == 'manual') {
				if(this.curPage && this.orgPerPage){
					this.router.navigate(['/' + this.transaction + '/pdfView'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage }});
				}else{
					this.router.navigate(['/' + this.transaction + '/pdfView'],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.transactionsPerPage }});
				}
			} else if (this.isActiveTab || (!this.isActiveTab && this.transaction.generateType == 'auto')) {
				if(this.curPage && this.orgPerPage){
					this.router.navigate(['/transactions/transactions/transactionView/' + this.transaction],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage }});
				}else{
					this.router.navigate(['/transactions/transactions/transactionView/' + this.transaction],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.transactionsPerPage }});
				}
			}
		}
	}

	updateTransaction(row) {
		this.selectedTransactions = row?._id
		if (this.selectedTransactions) {
			this.transaction = this.selectedTransactions;
				if(this.curPage && this.orgPerPage){
					this.router.navigate(['/transactions/transactions/transactionView/' + this.transaction],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage, actionFlag:'update' }});
				}else{
					this.router.navigate(['/transactions/transactions/transactionView/' + this.transaction],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.transactionsPerPage, actionFlag:'update' }});
				}			
		}
	}

	openDialogPopUp(action,obj) {
		obj.action = action;
		let widthDialog;
		let heightDialog;	
		widthDialog = '60%';
		heightDialog = 'auto';
		const dialogRef = this.dialog.open( PurchaseOrderModalComponent, {
			width: widthDialog,
			height: heightDialog,
			data:obj,
			disableClose: true
		});
		this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
			if(result.event == 'Update'){
			//	this.updateRowData(result.data);
			}else if(result.event == 'Delete'){
				this.revokeTransaction(result.data);
			}
		}));
	}

	revokeTransaction(row) {
		let params = {}
		if(row?.transtype?.transaction=="Asset"){
			params = {
				entityAsset: row?.entityAsset,
				transactionid: row?.transactionid,
				status: 'Revoked'
			};
			this.url = "/asset/revokeAsset";
		}else if(row?.transtype?.transaction=="Order"){
			params = {
				orderId: row?.orderId,
				transactionid: row?.transactionid,
				status: 'Cancelled'
			};
			this.url = "/order/revokeOrder";
		}
		
		this.apiService.put_transactions(this.url, params)
				.subscribe((response: any) => {
					if (response.success == true) {						
						this.getTransactions(this.transactionsPerPage, this.currentPage);
					}else{
						this.snackbarService.openSuccessBar(response?.data?.message, "");
					}
				},
				(error) => {
				  this.snackbarService.openSuccessBar('Not Found.', "");
			  });	
	}
	
	async viewattachment(row) {		
		this.staticFolderName = "transactions/static-media/"
		const bucketName= environment.Bucket
		const fileName= this.staticFolderName + row.upload_file
		const returnRes= await this.uploadService.fileExist(bucketName,fileName)
		
		if(returnRes==true){
			window.open(environment.awsImgPath +  "/" + this.staticFolderName + row.upload_file, "_blank");
		}else{
			this.snackbarService.openSuccessBar("File not found", "File");
		}
	}

	goBack() {
		if (this.href == "/transactions/transactions?dashboard=1") {
			this.location.back();
		} 
		else if (this.href == "/transactions/transactions") {
			this.location.back();
		}else {
			var sessionValue = sessionStorage.getItem('transactionTypeName');
			this.router.navigate([sessionValue]);
		}
	}

	onChangedTransactions(pageData: PageEvent) {
		if(this.curPage && this.orgPerPage){
			this.curPage = pageData.pageIndex + 1
			this.orgPerPage = pageData.pageSize;
			this.getTransactions(this.orgPerPage, this.curPage);
		}else{
			this.currentPage = pageData.pageIndex + 1;
			this.transactionsPerPage = pageData.pageSize;
			this.getTransactions(this.transactionsPerPage, this.currentPage);
		}
	}

	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};

	removeTransaction(row) {
		this.selectedTransactions = []
		this.selectedTransactions.push(row.item)
		if (this.selectedTransactions.length == 0) {
			var data = {
				reason: "Please select Transaction!",
				status: ''
			};
			this.errorDialogService.openDialog(data);
		} else if (this.selectedTransactions.length > 1) {
			var data = {
				reason: "Please select only one Transaction!",
				status: ''
			};
			this.errorDialogService.openDialog(data);
		}
		else {
			let insertTypes = {}
			for (let i = 0; i < this.selectedTransactions.length; i++) {
				insertTypes = {
					id: this.selectedTransactions[i]._id,
				}
			}
			this.url = '/transaction/removeTransaction'
			this.subscriptions.push(this.apiService.post(this.url, insertTypes)
				.subscribe((response: any) => {
					if (response.success == true) {
						this.selectedTransactions = []
						this.snackbarService.openSuccessBar('Transaction remove successfully.', "Transaction");
						this.getTransactions(this.transactionsPerPage, this.currentPage);
					}
				}));
		}
	}
	
	getSelectedUserAccess() {
		this.url = "/useraccess/getPartnersByUserId";
		var params = new HttpParams();
		params = params.append('partnerId', this.loggedInUser._id);
		params = params.append('pagesize', '0');
		params = params.append('page', '50');
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response) => {
				if (response.success == true) {
					this.transactionDetails = response.data.partners.partners[0]
					this.getTransactions(this.transactionsPerPage, 1);
				}
			}));
	}
}