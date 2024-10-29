import { SelectionModel } from '@angular/cdk/collections';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { ErrorDialogService } from '../../services/error-dialog.service';
import { RouteStateChangeService } from '../../services/route-state-change.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-partner-list',
  templateUrl: './partner-list.component.html',
  styleUrls: ['./partner-list.component.css']
})
export class PartnerListComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
  faSearch = faSearch;
    totalDept = 0;
    corPerPage= 5;
    pageSizeOptions = [5,10,20,50,100];
    currentPage = 1;
    role: string;
    entity: string;
    url: string;
    loggedInUser;
    id;
	location=null;
	organizationId=null;
	organizationName=null;
	entityId=null;
	entityName=null;
	status=null;
	address=null;
	displayedColumns = [
		'id',
		'orgId',
		'orgName',
		'partnerId',
		'partnerName',
		'location',
		'address',
		'status'
	];

  corporate: any[] = [];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  filter:any={location:'',address: '',organizationId: '',organizationName: '',entityId: '',entityName: '',status: '',searchKey:''}

  	dialogChangeEvent;
	newVerifier: any[];
	curPage= 1;
	orgPerPage=5;
	pageIndex=0;
	pageSize=5
	constructor(private apiService: ApiService,
			public dialoge: MatDialog,
			public router: Router,
			public route: ActivatedRoute,
			public routeStateService: RouteStateChangeService,
			public confirmDialogService: ConfirmDialogService,
			public errorDialogService: ErrorDialogService,
	  public snackbarService: SnackbarService) { }
    
    ngOnInit() {
      this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
	  this.curPage = this.route.snapshot.queryParams['currentPage'];
	  this.orgPerPage = this.route.snapshot.queryParams['recordPerPage'];
		if(this.curPage && this.orgPerPage){
			this.pageIndex = this.curPage - 1
			this.corPerPage = this.orgPerPage
			this.getCorporates(this.orgPerPage,this.curPage);
		}else{
			this.getCorporates(this.corPerPage,this.currentPage);
		}
     
      this.role = this.loggedInUser.reference.role;
      this.entity = this.loggedInUser.reference.entity;
      this.id = this.loggedInUser.reference.organizationId;
    }

	getCorporates(corPerPage,currentPage) {
		this.url = "/corporate/list";
		var params = new HttpParams();
		params = params.append('pagesize',corPerPage);
		params = params.append('page', currentPage);
		params = params.append('verifiertype','corporateverifier');
		if(this.filter.location){
			params = params.append('location', this.filter.location);
		}
		if(this.filter.address){
			params = params.append('address', this.filter.address);
		}
		if(this.filter.organizationId){
			params = params.append('organizationId', this.filter.organizationId);
		}
		if(this.filter.organizationName){
			params = params.append('organizationName', this.filter.organizationName);
		}
		if(this.filter.entityId){
			params = params.append('entityId', this.filter.entityId);
		}
		if(this.filter.entityName){
			params = params.append('entityName', this.filter.entityName);
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
					this.corporate = response.data.result.corporates.result;
					this.totalDept = response.data.result.corporates.totalCount;		
					this.dataSource.data = this.corporate;					
				}
			}))
  }

  selectlocation(event){	
	this.location = event;
	this.getCorporates(this.corPerPage, this.currentPage);
}

selectaddress(event){	
	this.address = event;
	this.getCorporates(this.corPerPage, this.currentPage);
}

selectorgId(event){	
	this.address = event;
	this.getCorporates(this.corPerPage, this.currentPage);
}

selectorgName(event){	
	this.address = event;
	this.getCorporates(this.corPerPage, this.currentPage);
}

selectentityId(event){	
	this.address = event;
	this.getCorporates(this.corPerPage, this.currentPage);
}

selectentityName(event){	
	this.address = event;
	this.getCorporates(this.corPerPage, this.currentPage);
}

selectstatus(event){	
	this.address = event;
	this.getCorporates(this.corPerPage, this.currentPage);
}
clearFilter(event,value){
	value =''
	this.getCorporates(this.corPerPage, this.currentPage);
}
onSearch(event){
	this.filter.searchKey = event
	this.getCorporates(this.corPerPage, this.currentPage);
}

onChangedCorp(pageData: PageEvent){
	if(this.curPage && this.orgPerPage){
		this.curPage = pageData.pageIndex + 1
		this.orgPerPage = pageData.pageSize;
		this.getCorporates(this.orgPerPage,  this.curPage);
	}else{
		this.currentPage = pageData.pageIndex + 1;
		this.corPerPage = pageData.pageSize;
		this.getCorporates(this.corPerPage,  this.currentPage);
	}
}
  
  	ngAfterViewInit() {
		this.setStatusListener();
	};

	openConfirmDialog(row) {
		var data = {
			corporates: row,
			isActive: row.isActive,
			status: ''
		};

		if(row.isActive == true) {
			data.isActive = false;
			data.status = 'Inactive';
		} else {
			data.isActive = true;
			data.status = 'Active';
		}
		this.confirmDialogService.open(data);
	};

	setStatusListener() {
		this.dialogChangeEvent = this.confirmDialogService.change.subscribe((data: any) => {
			if (data.doAction === true) {
				this.changeStatus(data);
			} else {
				this.getCorporates(this.corPerPage,  this.currentPage);
			}
		})
	};

	changeStatus(obj) {
		var corporateId = obj.corporates._id;
		this.url = '/corporate/'+ corporateId +'/changeStatus';
		var data = {
			isActive: obj.isActive
		};

		this.apiService.put(this.url, data)
			.subscribe((response) => {
				if(response.success == true) {
					this.snackbarService.openSuccessBar('Corporate status change successfully.', "Corporate");
					this.getCorporates(this.corPerPage,  this.currentPage);
				}
			});
	};
	viewDetails(row){
	this.url = '/corporate/' + row._id ;
	var params = new HttpParams();
	params = params.append('id', row._id);
	this.subscriptions.push(this.apiService.get(this.url, params)
		.subscribe((response: any) => {
		if(response.success == true){
			if(response.data){
			var corporateData = response.data;
			if(this.curPage && this.orgPerPage){
				this.router.navigate(['/partner/partnerDetails'],{ queryParams: { id:row._id ,fromAdmin:true,currentPage: this.curPage,recordPerPage: this.orgPerPage}} );
			}else{
				this.router.navigate(['/partner/partnerDetails'],{ queryParams: { id:row._id ,fromAdmin:true,currentPage: this.currentPage,recordPerPage: this.corPerPage}} );
			}
	}
  }
	}));
}
	ngOnDestroy() {
		this.dialogChangeEvent.unsubscribe();
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}
