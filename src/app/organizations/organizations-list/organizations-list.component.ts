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
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { ErrorDialogService } from 'src/app/services/error-dialog.service';
import { RouteStateChangeService } from 'src/app/services/route-state-change.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'app-organizations-list',
  templateUrl: './organizations-list.component.html',
  styleUrls: ['./organizations-list.component.css']
})
export class OrganizationsListComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	faSearch = faSearch;
	totalInst = 0;
	instPerPage= 5;
	pageSizeOptions = [5,10,20,50,100];
	currentPage = 1;
	role: string;
	entity: string;
	url: string;
	urlstring: string;
	loggedInUser;
	id;
	selectedOrganization: any = [];
	orgData;
	headquarter:any;
	isBlockchainService:any;
	dept = {
		organizationId: '',
		code: '',
		name: '',
		headquarter: '',
		isBlockchainService: '',
		isActive:'',
		createdBy:{},
		updatedBy:{}
	};
	displayedColumns = [
		'actions',
		'organizationId',
		'organizationName',
		'status'
		];

	organizations: any[] = [];
	orgDetails;
	dataSource = new MatTableDataSource<any>();
	selection = new SelectionModel<any>(true, []);
	organizationId=null;
	organizationName=null;
	status=null;
	filter:any={organizationId:'',organizationName:'',status:'',searchKey:''}
    @ViewChild('myModel',{static: false}) myModel: ModalDirective;

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
		this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['instPerPage'];
		if(this.curPage && this.orgPerPage){
			this.pageIndex = this.curPage - 1
			this.instPerPage = this.orgPerPage
			this.getOrganizations(this.orgPerPage, this.curPage);
		}else{
			this.getOrganizations(this.instPerPage, this.currentPage);
		}
		this.role = this.loggedInUser.reference.role;
		this.entity = this.loggedInUser.reference.entity;
		this.id = this.loggedInUser.reference.organizationId;
	}

	getOrganizations(instPerPage,currentPage) {
		this.url = "/organization/list";
		var params = new HttpParams();
		params = params.append('pagesize',instPerPage);
		params = params.append('page', currentPage);

		if(this.filter.organizationId){
			params = params.append('organizationId', this.filter.organizationId);
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
			.subscribe((response) => {
				if(response.success == true) {
					this.organizations = response.data.organizations.result;
					for(var i=0;i<this.organizations.length;i++) {
						if(this.organizations[i].isActive == true) {
							this.organizations[i].status = "Active";
						} else {
							this.organizations[i].status = "Inactive";
						}
						
						if (typeof this.organizations[i].createdBy === 'undefined' ||  this.organizations[i].createdBy == null ||  this.organizations[i].createdBy == '') {
							this.organizations[i].createdBy = {
								firstName: '-',
								lastName: '-'
							}
						}
						if (typeof this.organizations[i].updatedBy === 'undefined' ||  this.organizations[i].createdBy == null ||  this.organizations[i].createdBy == '') {
							this.organizations[i].updatedBy = {
								firstName: '-',
								lastName: '-'
							}
						}
						let createdAt = new Date(this.organizations[i].createdAt).toLocaleString("en-US", { timeZone: this.loggedInUser.timeZone });
							this.organizations[i].createdAt = createdAt
							let updatedAt = new Date(this.organizations[i].updatedAt).toLocaleString("en-US", { timeZone: this.loggedInUser.timeZone });
							this.organizations[i].updatedAt = updatedAt
					}
					this.totalInst = response.data.organizations.totalCount;
					this.dataSource.data = this.organizations;
				}
			}))
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

	ngAfterViewInit() {
		this.setStatusListener();
	};

	openConfirmDialog(row) {
		var data = {
			item: row,
			isActive: true,
			status: row.status,
			organizationId: row._id
		};

		if(row.status == 'Active') {
			data.isActive = false;
			data.status = 'Inactive';
		} else {
			data.isActive = true;
			data.status = 'orgActive';
		}
		this.confirmDialogService.open(data);
	};
	hide(){
		this.myModel.hide();
	  }

	addDept(data) {
		if(data.invalid) {
			return;
		}
		this.url = '/department/create';
	
		this.dept.organizationId = data.organization._id;
		this.dept.code = 'HO';
		this.dept.name = data.organization.name;
		this.headquarter = true
		this.dept.headquarter  = this.headquarter;
		this.isBlockchainService = true
		this.dept.isBlockchainService  = this.isBlockchainService;

		this.dept.createdBy = {
			firstName:this.loggedInUser.firstName,
			lastName:this.loggedInUser.lastName,
			email:this.loggedInUser.email
		},
		this.dept.updatedBy = {
			firstName:this.loggedInUser.firstName,
			lastName:this.loggedInUser.lastName,
			email:this.loggedInUser.email
		}
	
		this.dept.isActive = data.flag
	
		this.subscriptions.push(this.apiService.post(this.url, this.dept)
			.subscribe((response: any) => {
				if(response.success == true) {
					
				}
			}));
	}
	
	setStatusListener() {
		this.dialogChangeEvent = this.confirmDialogService.change.subscribe((data: any) => {
			if(data.doAction == true){
				data.flag = 'true'
				this.changeStatus(data)
			}
			if(this.curPage && this.orgPerPage){
				this.getOrganizations(this.orgPerPage,  this.curPage);
			}else{
				this.getOrganizations(this.instPerPage,  this.currentPage);
			}
		})
	};

	changeStatus(obj) {
		var organizationId = obj.organizationId;
	 	this.urlstring = '/organization/'+ organizationId +'/changeStatus';
		this.url = '/organization/'+ organizationId +'/changeStatus';
		var data = {
			isActive: obj.isActive,
			isBlockchainService: obj.isBlockchainService,
	 		organizationName: obj.item.name
		};
		this.apiService.put(this.url, data)
			.subscribe((response) => {
				if(response.success == true) {
					this.snackbarService.openSuccessBar('Organizations status change successfully.', "User");
					this.getOrganizations(this.instPerPage,  this.currentPage);
				}
			});
	};
	viewOrgDetails(row) {
		this.selectedOrganization = row._id;
		this.orgDetails = this.selectedOrganization;
		if(this.curPage && this.orgPerPage){
			this.router.navigate(['/organizations/organizationDetails'],{ queryParams: { id:row._id ,fromAdmin:true,currentPage: this.curPage,instPerPage: this.orgPerPage}} );
		}else{
			this.router.navigate(['/organizations/organizationDetails'],{ queryParams: { id:row._id ,fromAdmin:true,currentPage: this.currentPage,instPerPage: this.instPerPage}} );
		}
	}

	view(row) {
		this.organizations = row;
		this.orgData = this.organizations;
		if(this.curPage && this.orgPerPage){
			this.router.navigate(['/organizations/OrganizationsList/organizationUpdates/' + this.orgData._id],{ queryParams: { currentPage: this.curPage,instPerPage: this.orgPerPage}} );
		}else{
			this.router.navigate(['organizations/OrganizationsList/organizationUpdates/' + this.orgData._id],{ queryParams: { currentPage: this.currentPage,instPerPage: this.instPerPage}});
		}
	}
	goToViewNetwork(row) {
		if(this.curPage && this.orgPerPage){
			this.router.navigate(['/organizations/OrganizationsList/treeChart/' + row._id],{ queryParams: { currentPage: this.curPage,instPerPage: this.orgPerPage}} );
		}else{
			this.router.navigate(['/organizations/OrganizationsList/treeChart/' + row._id],{ queryParams: {currentPage: this.currentPage,instPerPage: this.instPerPage}});		
		}
	}
	selectorgId(event){	
		this.organizationId = event;
		this.getOrganizations(this.instPerPage,  this.currentPage);
	}
	selectorgName(event){	
		this.organizationName = event;
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
		this.dialogChangeEvent.unsubscribe();
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}
