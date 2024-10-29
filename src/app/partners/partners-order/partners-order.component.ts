import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { faCheck, faHandPointLeft, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Partner } from 'src/app/modals/partner';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { DatetimeConvertor } from 'src/app/services/datetime-convertor';
import { PartnerDataService } from '../partner-data.service';
import { Subscription } from 'rxjs';
@Component({
	selector: 'app-partners-order',
	templateUrl: './partners-order.component.html',
	styleUrls: ['./partners-order.component.css']
})
export class PartnersOrderComponent implements OnInit {
	private subscriptions: Subscription[] = [];
	faHandPointLeft = faHandPointLeft;
	faSearch = faSearch;
	faCheck = faCheck;
	faTimes = faTimes;
	totalTransactions = 0;
	partnerPerPage:any= 5;
	pageSizeOptions = [5,10,20,50,100];
	currentPage:any = 1;
	loggedInUser;
	role;
	entity;
	url;
	transactions;
	Name;
	id;
	selectedPartners: any = [];
	transaction;
	companyName;
	startIndex;
	orderId=null;
	branchLocation=null;
	moduleName=null;
	transactionTypeName=null;
	status=null;
	filter:any={transactionTypeName:'',moduleName:'',status:'',branchLocation:'',orderId:'',searchKey:''}
	sortkey:any={orderId:''}
	curPage= 1;
	orgPerPage=5;
	pageIndex=0;
	pageSize=5
	displayedColumns = [
		'action',
		'entity',
		'branchLocation',
		'moduleName',
		'transactionTypeName',
		'orderId',
		'status',
		'created_on'
	];

	dialogChangeEvent;
	dashboard: boolean = false;
	newPartners: Partner[] = [];

	dataSource = new MatTableDataSource<any>();
	selection = new SelectionModel<any>(true, []);

	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

	constructor(private apiService: ApiService,
		private route: ActivatedRoute,
		public router: Router,
		public confirmDialogService: ConfirmDialogService,
		public partnerdataService: PartnerDataService,
		private location: Location,	
		public datetimeConvertor: DatetimeConvertor) { }

	ngOnInit() {

		this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
		if (typeof this.loggedInUser.timeZone === 'undefined'||  this.loggedInUser.timeZone == null ||  this.loggedInUser.timeZone == '') {
			this.loggedInUser.timeZone = 'Asia/Kolkata'
		}
		this.role = this.loggedInUser.reference.role;
		this.entity = this.loggedInUser.reference.entity;
		this.dataSource.sort = this.sort;
		if ('corpData' in this.loggedInUser) {
			this.companyName = this.loggedInUser.corpData.companyName;
			this.id = this.loggedInUser.corpData.code
		  } else {
			this.companyName = this.loggedInUser.organizationName;
			this.id = this.loggedInUser.organizationCode
		  }
		  this.curPage = this.route.snapshot.queryParams['currentPage'];
		  this.orgPerPage = this.route.snapshot.queryParams['recordPerPage'];
		  if(this.curPage && this.orgPerPage){
			  this.pageIndex = this.curPage - 1
			  this.partnerPerPage = this.orgPerPage
			  this.getPartnerOrders(this.orgPerPage, this.curPage);
		  }else{
			this.getPartnerOrders(this.partnerPerPage, 1);
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

	getPartnerOrders(partnerPerPage, currentPage) {
		//api rename
		this.url = "/order/orderapi/getPartnerOrders"
		var params = new HttpParams();
		this.startIndex = ((currentPage * partnerPerPage) - partnerPerPage)
		params = params.append('startIndex', this.startIndex);
		params = params.append('limit', partnerPerPage);
		params = params.append('transactionEntity', this.id);
		params = params.append('refEntity', this.id);
		params = params.append('organizationId', this.loggedInUser.reference.organizationId);
		if(this.filter.moduleName){
			params = params.append('moduleName', this.filter.moduleName);
		}
		if(this.filter.transactionTypeName){
			params = params.append('transactionTypeName', this.filter.transactionTypeName);
		}
		if(this.filter.branchLocation){
			params = params.append('branchLocation', this.filter.branchLocation);
		}
		if(this.filter.orderId){
			params = params.append('orderId', this.filter.orderId);
		}
		if(this.filter.status){
			params = params.append('status', this.filter.status);
		}
		if(this.filter.searchKey){
			params = params.append('searchKey', this.filter.searchKey);
		}
		if(this.orderId){
			var sortAssetIdOrder = this.orderId.direction || '';
			var sortAssetIdKey = this.orderId.active || '';

			params = params.append('sortKey', sortAssetIdKey);
			params = params.append('sortOrder', sortAssetIdOrder);
		}
		this.subscriptions.push(this.apiService.getAsset(this.url, params)
			.subscribe((response: any) => {
				if (response.success == true) {
					if (response.data.result) {
						this.transactions = response.data.result;
						for (var i = 0; i < this.transactions.length; i++) {
							if(this.transactions[i].status == "New") {
								this.transactions[i].status = "Open";
							} else {
								this.transactions[i].status = "Closed";
							}

							this.transactions[i].created_on = this.datetimeConvertor.convertDateTimeZone(this.transactions[i].created_on,"datetime");

							if(response.data.result[i].refEntityType == "Partner"){
								this.transactions[i].refEntityName = response.data.result[i].refEntityDetails.companyName
							}else if(response.data.result[i].refEntityType == "Organization"){
								this.transactions[i].refEntityName = response.data.result[i].refEntityDetails.name
							}
							if(response.data.result[i].transactionEntityType == "Partner"){
								this.transactions[i].branchLocation = response.data.result[i].transactionEntityDetails.location
								this.transactions[i].transactionEntityName = response.data.result[i].transactionEntityDetails.companyName
							}else if(response.data.result[i].transactionEntityType == "Organization"){
								this.transactions[i].branchLocation = response.data.result[i].transactionEntityDetails.location
								this.transactions[i].transactionEntityName = response.data.result[i].transactionEntityDetails.name
							}
						}
						this.totalTransactions = response.data.totalCount;
						this.dataSource.data = this.transactions;
					}
				}
			}));
	};

	viewTransaction(row) {
		this.selectedPartners = row._id
		if (this.selectedPartners) {
			this.transaction = this.selectedPartners;
			if(this.curPage && this.orgPerPage){
				this.router.navigate(['/transactions/partnersOrder/' + this.transaction + "/" + row.transtype.transaction],{ queryParams: { partnerOrder:true, currentPage: this.curPage, recordPerPage: this.orgPerPage }} );
			}else{
				this.router.navigate(['/transactions/partnersOrder/' + this.transaction + "/" + row.transtype.transaction],{ queryParams: { partnerOrder:true,currentPage: this.currentPage, recordPerPage: this.partnerPerPage }} );
			}
		} 
	}
	sortData(event){
		this.orderId = event;
		this.getPartnerOrders(this.partnerPerPage, this.currentPage);
	}
	selecttransTypeName(event){	
		this.transactionTypeName = event;
		this.getPartnerOrders(this.partnerPerPage, this.currentPage);
	}
	selectmoduleName(event){	
		this.moduleName = event;
		this.getPartnerOrders(this.partnerPerPage, this.currentPage);
	}
	selectbranchLocation(event){	
		this.branchLocation = event;
		this.getPartnerOrders(this.partnerPerPage, this.currentPage);
	}
	selectorderId(event){	
		this.orderId = event;
		this.getPartnerOrders(this.partnerPerPage, this.currentPage);
	}
	selectstatus(event){	
		this.status = event;
		this.getPartnerOrders(this.partnerPerPage, this.currentPage);
	}
	clearFilter(event,value){
		value =''
		this.getPartnerOrders(this.partnerPerPage, this.currentPage);
	}
	onSearch(event){
		this.filter.searchKey = event
		this.getPartnerOrders(this.partnerPerPage, this.currentPage);
	}

	goBack() {
		this.location.back();
	}

	onChangedPartner(pageData: PageEvent) {
		if(this.curPage && this.orgPerPage){
			this.curPage = pageData.pageIndex + 1
			this.orgPerPage = pageData.pageSize;
			this.getPartnerOrders(this.orgPerPage, this.curPage);
		}else{
			this.currentPage = pageData.pageIndex + 1;
			this.partnerPerPage = pageData.pageSize;
			this.getPartnerOrders(this.partnerPerPage, this.currentPage);
		}
	}
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
};