import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { faCheck, faEye, faHandPointLeft, faSearch, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ConfimationDialogComponent, ConfirmDialogModel } from 'src/app/dialogs/confimation-dialog/confimation-dialog.component';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { DataService } from 'src/app/services/data.service';
import { ErrorDialogService } from 'src/app/services/error-dialog.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
	selector: 'app-list-transaction-type',
	templateUrl: './list-transaction-type.component.html',
	styleUrls: ['./list-transaction-type.component.css']
})
export class ListTransactionTypeComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	faHandPointLeft = faHandPointLeft;
	faSearch = faSearch;
	faCheck = faCheck;
	faTimes = faTimes;
	faEye = faEye;
	faTrashAlt = faTrashAlt;
	totalRecord = 0;
	recordPerPage= 5;
	pageSizeOptions = [5,10,20,50,100];
	currentPage = 1;
	url: string;
	urlTransType: string;
	urlC: string
	loggedInUser;
	role;
	entity;
	transactionTypeName=null;
	transactionTypeCode=null;
	transTypeDescription=null;
	filter:any={transactionTypeName:'',transactionTypeCode:'',transTypeDescription:'',searchKey:''}
	organizationData: any;
	transactionTypes: any[] = [];
	selectedTransType: any = [];
	dataSource = new MatTableDataSource<any>();
	selection = new SelectionModel<any>(true, []);
	dashboard;
	curPage= 1;
	orgPerPage=5;
	pageIndex=0;
	pageSize=5
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

	displayedColumns = [
		'view',
		'transactionTypeCode',
		'transactionTypeName',
		'transTypeDescription'	
	];

	filename: any;
	transTypeId: any;
	transtypeId: any;
	module: any;
	credData: any;
	credDataId: any;
	transtype: any;
	id: any;
	routeParams: any;
	updatedUrl: string;
	transtypes: any;
	dialogChangeEvent: any;

	constructor(public dialogRef: MatDialogRef<ConfimationDialogComponent>,
		private dialog: MatDialog,
		private apiService: ApiService,
		private location: Location,
		private route: ActivatedRoute,
		public dataService: DataService,
		public router: Router,
		public errorDialogService: ErrorDialogService,
		public confirmDialogService: ConfirmDialogService,
		public snackbarService: SnackbarService) { }

	ngOnInit() {
		this.filename = [];
		this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
		if (typeof this.loggedInUser.timeZone === 'undefined'||  this.loggedInUser.timeZone == null ||  this.loggedInUser.timeZone == '') {
			this.loggedInUser.timeZone = 'Asia/Kolkata'
		}
		this.role = this.loggedInUser.reference.role;
		this.entity = this.loggedInUser.reference.entity;
		this.id = this.loggedInUser.reference.organizationId;
		this.transtypeId = this.route.snapshot.params['transtypeId'];
		this.dataSource.sort = this.sort;
		this.dataService.setTransType(this.transtypeId);
		this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['recordPerPage'];
		if(this.curPage && this.orgPerPage){
			this.pageIndex = this.curPage - 1
			this.recordPerPage = this.orgPerPage
			this.getAllTransType(this.recordPerPage, this.curPage);
		}else{
			this.getAllTransType(this.recordPerPage, this.currentPage);
		}
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	};

	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
	};

	goBack() {
		this.location.back();
	}

	getOrganization(id) {	
			this.url = "/organization/" + id;
			var params = '';		
			this.subscriptions.push(this.apiService.get(this.url, params)
				.subscribe((response: any) => {
					if (response.success == true) {
						this.organizationData = response.data;		
						if (this.organizationData.isActive == false && this.role == 'admin' && this.entity == 'organization') {
							var data = {
								reason: "Your organization is yet not Active. It is pending for KYC.  ",
								status: ''
							};
							this.errorDialogService.openDialog(data);
						} else {
							this.router.navigate(['/transactionTypes/listTransactionType/addTransactionType']);
						}
					}
				}));
		};

	editTransType(data) {
		if(this.curPage && this.orgPerPage){
			this.router.navigate(['/transactionTypes/listTransactionType/addTransactionType/'+data._id],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
		}else{
			this.router.navigate(['/transactionTypes/listTransactionType/addTransactionType/'+data._id],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.recordPerPage}});
		}
	};
	getAllTransType(recordPerPage, currentPage) {
		this.url = '/transtype/list';
		this.selection.clear();
		var params = new HttpParams();
		params = params.append('organizationId', this.loggedInUser.reference.organizationId);
		params = params.append('pagesize', recordPerPage);
		params = params.append('page', currentPage);
		params = params.append('role', this.loggedInUser.reference.role);

		if(this.filter.transTypeDescription){
			params = params.append('transTypeDescription', this.filter.transTypeDescription);
		}
		if(this.filter.transactionTypeName){
			params = params.append('transactionTypeName', this.filter.transactionTypeName);
		}
		if(this.filter.transactionTypeCode){
			params = params.append('transactionTypeCode', this.filter.transactionTypeCode);
		}
		if(this.filter.searchKey){
			params = params.append('searchKey', this.filter.searchKey);
		}
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response: any) => {
				this.credData = response.data.result.transtypes;
				var credData = response.data.result.transtypes;

				for(var i=0; i<this.credData.length; i++) {
					if(this.credData[i].status == true) {
						this.credData[i].status = "Active";
					} else {
						this.credData[i].status = "Inactive";
					}
					
					let createdAt = new Date(this.credData[i].createdAt).toLocaleString("en-US", { timeZone: this.loggedInUser.timeZone });
					this.credData[i].createdAt = createdAt
					if(typeof this.credData[i].updatedAt === 'undefined'){
						this.credData[i].updatedAt = this.credData[i].createdAt
					}
					let updatedAt = new Date(this.credData[i].updatedAt).toLocaleString("en-US", { timeZone: this.loggedInUser.timeZone });
					this.credData[i].updatedAt = updatedAt
					var transactionidFields = credData[i].fields;
					var fields = {};
					if(transactionidFields!=undefined){
						transactionidFields.forEach((field) => {
							var formDataKey = Object.keys(field)[i];
							fields[formDataKey] = "";	
						})
					}					
					credData[i].fields = fields;
				}
				this.transtypes = credData;
				this.totalRecord = response.data.result.totalCount;
				this.dataSource.data = credData;
			}));
	}

	selecttransTypeDescription(event){	
		this.transTypeDescription = event;
		this.getAllTransType(this.recordPerPage, this.currentPage);
	}
	selecttransTypeName(event){	
		this.transactionTypeName = event;
		this.getAllTransType(this.recordPerPage, this.currentPage);
	}
	selecttransTypeCode(event){	
		this.transactionTypeCode = event;
		this.getAllTransType(this.recordPerPage, this.currentPage);
	}
	clearFilter(event,value){
		value =''
		this.getAllTransType(this.recordPerPage, this.currentPage);
	}
	onSearch(event){
		this.filter.searchKey = event
		this.getAllTransType(this.recordPerPage, this.currentPage);
	}

	viewfields() {
		this.url = '/transactiontype/' + this.transtypeId;
		var params = new HttpParams();
		params = params.append('organizationId', this.loggedInUser.reference.organizationId);
		params = params.append('departmentId', this.loggedInUser.reference.departmentId);
		params = params.append('id', this.transtypeId);

		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response: any) => {
				if (response.success == true) {
					if (response.data.transType) {
						this.credData = response.data.transType;
						this.router.navigate(['/transactionTypes/' + this.credData._id + '/viewFields']);
					}
				}
			}))
	}

	goToDelete(row) {
		this.selectedTransType = row._id;
		const message = `Are you sure to delete this transaction type?`;
		const dialogData = new ConfirmDialogModel("Confirm Delete", message);
		const dialogRef = this.dialog.open(ConfimationDialogComponent, {
			width: '300px',
			data: dialogData,

		});
		this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
			if (result == true) {
				this.deleteTransType();
			} else {
				this.dialog.closeAll();
			}
		}));
	}
	deleteTransType() {
		this.urlC = '/transactiontype/transactionType/' + this.selectedTransType;
		var params = new HttpParams();
		this.subscriptions.push(this.apiService.get(this.urlC, params)
			.subscribe((response: any) => {
				if (response.success == true) {
					this.transtypes = response.data;
					var obj = {
						draftIds: [],
						organizationId: this.loggedInUser.reference.organizationId
					};

					obj.draftIds.push(this.selectedTransType);
					if (this.transtypes.transType.length > 0) {
						var data = {
							reason: "Transaction type is linked to a Module so cannot delete Transaction Type!",
							status: ''
						};
						this.errorDialogService.openDialog(data);
					} else {
						this.url = "/transtype/delete";
						var data1 = {
							_id: this.selectedTransType
						}
						this.subscriptions.push(this.apiService.post(this.url, obj)
							.subscribe((response: any) => {
								if (response.success == true) {
									this.snackbarService.openSuccessBar("Transaction Type deleted successfully", "Transaction Type");
									this.getAllTransType(this.recordPerPage, this.currentPage);
								}
							}))
					}
				}
			}));
	}

	Upload(files) {
		const form = new FormData();
		form.append('file', files[0], files[0].name);
		this.url = '/transactiontype/list'
		this.subscriptions.push(this.apiService.post(this.url, form)
			.subscribe((response: any) => {
				if (response.success == true) {
					this.snackbarService.openSuccessBar("transaction uploaded successfully", "transactions");
				}
			}))
	};

	view(i) {
		this.selectedTransType = this.dataSource.data[i];
		this.credData = this.selectedTransType;
		if(this.curPage && this.orgPerPage){
			this.router.navigate(['/transactionTypes/listTransactionType/' + this.credData._id + '/viewFields'],{ queryParams: { currentPage: this.curPage,recordPerPage: this.orgPerPage}} );
		}else{
			this.router.navigate(['/transactionTypes/listTransactionType/' + this.credData._id + '/viewFields'],{ queryParams: { currentPage: this.currentPage,recordPerPage: this.recordPerPage}});
		}
	}

	onChangedPage(pageData: PageEvent) {
		if(this.curPage && this.orgPerPage){
			this.curPage = pageData.pageIndex + 1
			this.orgPerPage = pageData.pageSize;
			this.getAllTransType(this.orgPerPage, this.curPage);
		}else{
			this.currentPage = pageData.pageIndex + 1;
			this.recordPerPage = pageData.pageSize;
			this.getAllTransType(this.recordPerPage, this.currentPage);
		}
	}

	openConfirmDialog(row) {
		var data = {
			transType: row,
			isActive: row.isActive,
			status: ''
		};

		if (row.status == 'Inactive') {
			data.isActive = true;
			data.status = 'Active';
		} else {
			data.isActive = false;
			data.status = 'Inactive';
		}
		this.confirmDialogService.open(data);
		this.dialogChangeEvent = this.confirmDialogService.change.subscribe((data: any) => {
			if (data.doAction === true) {
				this.changeStatus(data);
				this.dialogChangeEvent.unsubscribe();
			} else {
				this.getAllTransType(this.recordPerPage, this.currentPage);
				this.dialogChangeEvent.unsubscribe();
			}
		})
	};

	changeStatus(obj) {
		var transTypeId = obj.transType._id;
		this.url = "/transtype/" + transTypeId + "/changeStatus";
		var data = {
			isActive: obj.isActive
		};

		this.apiService.put(this.url, data)
			.subscribe((response) => {
				if (response.success == true) {
					this.snackbarService.openSuccessBar('Transaction type status change successfully.', "Transaction");
					this.getAllTransType(this.recordPerPage, this.currentPage);
				}
			});
	};

	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
	
}
export interface type {
	organizationId: string;
	transactionTypeName: string;
	fields: Object;
}