import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
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
	selector: 'app-user-access',
	templateUrl: './user-access.component.html',
	styleUrls: ['./user-access.component.css']
})
export class UserAccessComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	faHandPointLeft = faHandPointLeft;
	faSearch = faSearch;
	loggedInUser: any = {}
	displayedColumns = [
		'moduleCode',
		'moduleName',
		'transactionTypeCode',
		'transactionTypeName',
		'additionalDescription',
		'isAdd',
		'isUpdate',
		'isRead',
		'isDelete',
		'Action'
	];
	dataSource = new MatTableDataSource<any>();
	selection = new SelectionModel<any>(true, []);
	data: any;
	totalRecord = 0;
	recordPerPage= 5;
	pageSizeOptions = [5,10,20,50,100];
	currentPage = 1;
	courseIdFilter = new FormControl();
	nameFilter = new FormControl();
	codeFilter = new FormControl();
	moduleIdFilter = new FormControl();
	dialogChangeEvent;
	url = ''
	certtypes = []
	selectedCerttypes = []
	userId: any
	allorganization = []
	deptId = ''
	usersAcees = []
	removeAccess = false
	selectedUser:any={}
	isUpdate = false
	transactionTypeName=null;
	transactionTypeCode=null;
	additionalDescription=null;
	moduleName=null;
	moduleCode=null;
	filter:any={transactionTypeName:'',transactionTypeCode:'',additionalDescription:'',moduleCode:'',moduleName:'',searchKey:''}
	curPage= 1;
	orgPerPage=5;
	pageIndex=0;
	pageSize=5
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	constructor(private _formBuilder: FormBuilder, private apiService: ApiService,
		private route: ActivatedRoute,
		public router: Router,
		public errorDialogService: ErrorDialogService,
		public confirmDialogService: ConfirmDialogService,
		public dataService: DataService,
		public snackbarService: SnackbarService,
		private location: Location
		) { }

	ngOnInit(): void {
		this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
		if (typeof this.loggedInUser.timeZone === 'undefined' || this.loggedInUser.timeZone == null || this.loggedInUser.timeZone == '') {
			this.loggedInUser.timeZone = 'Asia/Kolkata'
		}
		this.dataSource.sort = this.sort;
		this.userId = this.route.snapshot.params['id'];
		this.selectedUser = JSON.parse(sessionStorage.getItem('selectedUser'));
		this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['recordPerPage'];
		if(this.curPage && this.orgPerPage){
			this.getUserLinkCertificateType(this.orgPerPage, this.curPage);
		}else{
			this.getUserLinkCertificateType(this.recordPerPage, this.currentPage);
		}
	}

	getUserLinkCertificateType(recordPerPage, currentPage) {
		this.url = '/transactiontype/list';
		this.selection.clear();
		var params = new HttpParams();
		if (this.loggedInUser.reference.role == 'admin') {
			params = params.append('organizationId', this.loggedInUser.reference.organizationId);
			params = params.append('showToadmin', 'showToadmin');
		}
		
		if (this.loggedInUser.reference.role == 'Corporate Admin') {
			params = params.append('corporateId', this.loggedInUser.corpData._id);
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
		params = params.append('pagesize', recordPerPage);
		params = params.append('page', currentPage);
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response: any) => {
					this.certtypes = response.data.result.transtypes.transtypes;
					let certData = response.data.result.transtypes.transtypes;
					for (var i = 0; i < certData.length; i++) {
						var hashFields = certData[i].fields;
						var fields = {};
						hashFields.forEach((field) => {
							const formDataKey = Object.keys(field)[i];
							fields[formDataKey] = "";
						})
						certData[i].fields = fields;
						if (typeof certData[i].isRead === 'undefined') {
							certData[i].isRead = false
						} 
						if (typeof certData[i].isAdd === 'undefined') {
							certData[i].isAdd = false
						}
						if (typeof certData[i].isUpdate === 'undefined') {
							certData[i].isUpdate = false
						} 
						if (typeof certData[i].isDelete === 'undefined') {
							certData[i].isDelete = false
						} 
						if (typeof certData[i].update === 'undefined') {
							certData[i].update = false
						}
					}
					this.totalRecord = response.data.result.transtypes.total_count;
					this.dataSource.data = certData;
					this.getSelectedUserAccess(certData)
			}))
	}

	getSelectedUserAccess(certData) {
		this.url = "/useraccess/getPartnersByUserId";
		var params = new HttpParams();
		params = params.append('partnerId', this.selectedUser.user._id);
		params = params.append('pagesize', '0');
		params = params.append('page', '50');
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response) => {
				if (response.success == true) {
					for (let i = 0; i < response.data.partners.partners.length; i++) {
						this.usersAcees = response.data.partners.partners
						let index = certData.findIndex(x => x._id == response.data.partners.partners[i].transactionId)
						if (index > -1) {
							certData[index].update = true
							if (response.data.partners.partners[i].isRead == true) {
								certData[index].isRead = true
							}
							if (response.data.partners.partners[i].isWrite == true) {
								certData[index].isAdd = true
							}
							if (response.data.partners.partners[i].isUpdate == true) {
								certData[index].isUpdate = true
							}
							if (response.data.partners.partners[i].isDelete == true) {
								certData[index].isDelete = true
							}
						}
					}
					this.dataSource.data = certData
				}
			}));
	}


	changeRadioButton(row, event) {
		let index = this.dataSource.data.findIndex(x => x._id == row._id)
		if(event.checked == true){
		if (event.source.value == 'isRead') {
			this.dataSource.data[index].isRead = true
		} if (event.source.value == 'isAdd') {
			this.dataSource.data[index].isAdd = true
			this.dataSource.data[index].isRead = true
		} if (event.source.value == 'isUpdate') {
			this.dataSource.data[index].isUpdate = true
			this.dataSource.data[index].isRead = true
		} if (event.source.value == 'isDelete') {
			this.dataSource.data[index].isDelete = true
			this.dataSource.data[index].isRead = true
		}
	}else{
		if (event.source.value == 'isRead') {
			this.dataSource.data[index].isRead = false
		} if (event.source.value == 'isAdd') {
			this.dataSource.data[index].isAdd = false
			this.dataSource.data[index].isRead = false
		} if (event.source.value == 'isUpdate') {
			this.dataSource.data[index].isUpdate = false
		} if (event.source.value == 'isDelete') {
			this.dataSource.data[index].isDelete = false
		}
	}
		this.dataSource.data[index].showButton = true
	};


	openConfirmDialog(row) {
		var data = {
			item: row,
			isActive: true,
			status: 'provideAccess'
		};
		this.confirmDialogService.open(data);
	};

	ngAfterViewInit() {
		this.setStatusListener();
	};

	setStatusListener() {
		this.dialogChangeEvent = this.confirmDialogService.change.subscribe((data: any) => {
			if (data.doAction === true) {
				this.addUserAccess(data);
			} else {
				this.getUserLinkCertificateType(this.recordPerPage, this.currentPage);
			}
		})

	};

	ngOnDestroy() {
		this.dialogChangeEvent.unsubscribe();
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};

	addUserAccess(row) {
		this.selectedCerttypes.push(row.item)
		if (this.selectedCerttypes.length == 0) {
			var data = {
				reason: "Please select atleast one Transaction Type!",
				status: ''
			};
			this.errorDialogService.openDialog(data);
		} else if (this.selectedCerttypes.length > 1) {
			var data = {
				reason: "Please select only one Transaction Type!",
				status: ''
			};
			this.errorDialogService.openDialog(data);
		}
		else {
			var batch: any = {}
			this.url = "/batch/module/moduleId" 
			var params = new HttpParams();
			params = params.append('moduleId', this.selectedCerttypes[0].moduleId);
			this.subscriptions.push(this.apiService.get(this.url, params)
				.subscribe((response: any) => {
					if (response.success == true) {
						batch = response.data;
						let index =this.usersAcees.findIndex(x=>x.organizationId == row.item.organizationId && x.moduleId ==row.item.moduleId && x.transactionId == row.item._id && x.batchId == batch._id)
						if(index > -1){
							row.item._id = this.usersAcees[index].transactionId
							row.item.transactionTypeId = this.usersAcees[index].transTypeId
							this.isUpdate = row.item.update 
							if(row.item.isRead == true &&  this.usersAcees[index].isRead == true){
								row.item.isRead = true
							}
							if(row.item.isAdd == true && this.usersAcees[index].isAdd == true){
								row.item.isAdd = true
								row.item.isRead = true
							}
							if(row.item.isUpdate == true && this.usersAcees[index].isUpdate == true){
								row.item.isUpdate = true
								row.item.isRead = true
							}
							if(row.item.isDelete == true && this.usersAcees[index].isDelete == true){
								row.item.isDelete = true
								row.item.isRead = true
							}
							this.selectedCerttypes = []
							this.selectedCerttypes.push(row.item)
						}
						let insertTypes = {}
						for (let i = 0; i < this.selectedCerttypes.length; i++) {
							insertTypes = {
								organizationId: this.selectedCerttypes[i].organizationId,
								moduleId: this.selectedCerttypes[i].moduleId,
								batchId: batch._id,
								transactionId: this.selectedCerttypes[i]._id,
								transTypeId: this.selectedCerttypes[i].transactionTypeId,
								createdBy: this.loggedInUser._id,
								updatedBy: this.loggedInUser._id,
								partnerId: this.userId,
								isRead: this.selectedCerttypes[i].isRead,
								isWrite: this.selectedCerttypes[i].isAdd,
								isDelete: this.selectedCerttypes[i].isDelete,
								isUpdate: this.selectedCerttypes[i].isUpdate
							}
						}
						this.url = '/useraccess/create'
						this.subscriptions.push(this.apiService.post(this.url, insertTypes)
							.subscribe((response: any) => {
								if (response.success == true) {
									this.selectedCerttypes = []
									let index = this.dataSource.data.findIndex(x => x._id == row.item._id)
									this.dataSource.data[index].showButton = false
									if(this.isUpdate == false){
									this.snackbarService.openSuccessBar('Provide access successfully.', "User Access");
									}else{
										this.snackbarService.openSuccessBar('Provide access updated successfully.', "User Access");
									}
									this.getUserLinkCertificateType(this.recordPerPage, this.currentPage);
								}
							}));
					}
				}));
		}
	}

	ClearRecord(row){
		row.isAdd = false
		row.isRead = false
		row.isUpdate = false
		row.isDelete = false
		this.openConfirmDialog(row);
		this.getUserLinkCertificateType(this.recordPerPage, 1);
	}
	goBack() {
		this.router.navigate(['/users/userList'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
	};

	selecttransTypeName(event){	
		this.transactionTypeName = event;
		this.getUserLinkCertificateType(this.recordPerPage, this.currentPage);
	}
	selecttransTypeCode(event){	
		this.transactionTypeCode = event;
		this.getUserLinkCertificateType(this.recordPerPage, this.currentPage);
	}
	selectmoduleCode(event){	
		this.moduleCode = event;
		this.getUserLinkCertificateType(this.recordPerPage, this.currentPage);
	}
	selectmoduleName(event){	
		this.moduleName = event;
		this.getUserLinkCertificateType(this.recordPerPage, this.currentPage);
	}
	selectadditionalDescription(event){	
		this.additionalDescription = event;
		this.getUserLinkCertificateType(this.recordPerPage, this.currentPage);
	}
	clearFilter(event,value){
		value =''
		this.getUserLinkCertificateType(this.recordPerPage, this.currentPage);
	}
	onSearch(event){
		this.filter.searchKey = event
		this.getUserLinkCertificateType(this.recordPerPage, this.currentPage);
	}
	onChangedPage(pageData: PageEvent) {
		if(this.curPage && this.orgPerPage){
			this.curPage = pageData.pageIndex + 1
			this.orgPerPage = pageData.pageSize;
			this.getUserLinkCertificateType(this.orgPerPage,  this.curPage);
		}else{
			this.currentPage = pageData.pageIndex + 1;
			this.recordPerPage = pageData.pageSize;
			this.getUserLinkCertificateType(this.recordPerPage, this.currentPage);
		}
	}		
}