import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { faHandPointLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { ErrorDialogService } from '../../services/error-dialog.service';
import { RouteStateChangeService } from '../../services/route-state-change.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ApiService } from '../../services/api.service';

@Component({
	selector: 'app-list-of-branches',
	templateUrl: './list-of-branches.component.html',
	styleUrls: ['./list-of-branches.component.css']
})
export class ListOfBranchesComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	faHandPointLeft = faHandPointLeft;
	faSearch = faSearch;

	totalDept = 0;
	deptPerPage= 5;
	pageSizeOptions = [5,10,20,50,100];
	currentPage = 1;
	displayedColumns = ['actions', 'deptId','deptName','deptLocation','deptAddress','status'];
	dashboardColumns = ['deptId', 'deptName','deptLocation','deptAddress','status'];
	url: string;
	loggedInUser;
	activated;
	id;
	departmentId;
	organizationData: any;
	role: string;
	entity: string;
	departments: any[] = [];
	dataSource = new MatTableDataSource<any>();
	selection = new SelectionModel<any>(true, []);
	dialogChangeEvent;
	dashboard: boolean = false;
	deptId=null;
	deptName=null;
	deptLocation=null;
	deptAddress=null;
	status=null;
	filter:any={deptId:'',deptName: '',deptLocation: '',deptAddress: '',status: '',searchKey:''}
	curPage= 1;
	orgPerPage=5;
	pageIndex=0;
	pageSize=5
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

	constructor(private apiService: ApiService,
		public dialoge: MatDialog,
		public router: Router,
		public route: ActivatedRoute,
		public routeStateService: RouteStateChangeService,
		public confirmDialogService: ConfirmDialogService,
		private location: Location,
		public errorDialogService: ErrorDialogService,
		public snackbarService: SnackbarService) {
			this.subscriptions.push(this.route.queryParams.subscribe((params) => {
			let that = this;
			var queryData = params['dashboard'];
			if (queryData == 1) {
				that.dashboard = true;
			}
		}));
	}

	ngOnInit() {
		this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));	
		this.dataSource.sort = this.sort;
		this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['recordPerPage'];
		if(this.curPage && this.orgPerPage){
			this.pageIndex = this.curPage - 1
			this.deptPerPage = this.orgPerPage
			this.getDepartments(this.orgPerPage, this.curPage);
		}else{
			this.getDepartments(this.deptPerPage, this.currentPage);
		}
		this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
		if (typeof this.loggedInUser.timeZone === 'undefined'||  this.loggedInUser.timeZone == null ||  this.loggedInUser.timeZone == '') {
			this.loggedInUser.timeZone = 'Asia/Kolkata'
		}
		this.role = this.loggedInUser.reference.role;
		this.entity = this.loggedInUser.reference.entity;
		this.id = this.loggedInUser.reference.organizationId;
		this.departmentId = this.loggedInUser.reference.departmentId;
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
						this.router.navigate(['/branches/listofBranches/branchAdd']);
					}
				}
			}));
	};

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	};

	getDepartments(deptPerPage, currentPage) {
		this.url = "/department/list";
		var params = new HttpParams();
		params = params.append('organizationId', this.loggedInUser.reference.organizationId);
		params = params.append('pagesize', deptPerPage);
		params = params.append('page', currentPage);

		if (this.loggedInUser.reference.departmentId == '111111111111111111111111') {
			params = params.append('_id', '');
		} else {
			params = params.append('_id', this.loggedInUser.reference.departmentId);
		}
		if(this.filter.deptId){
			params = params.append('deptId', this.filter.deptId);
		}
		if(this.filter.deptName){
			params = params.append('deptName', this.filter.deptName);
		}
		if(this.filter.deptLocation){
			params = params.append('deptLocation', this.filter.deptLocation);
		}
		if(this.filter.deptAddress){
			params = params.append('deptAddress', this.filter.deptAddress);
		}
		if(this.filter.status){
			params = params.append('status', this.filter.status);
		}
		if(this.filter.searchKey){
			params = params.append('searchKey', this.filter.searchKey);
		}
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response) => {
				if (response.success == true) {
					this.departments = response.data.result.departments.result;
					for (var i = 0; i < this.departments.length; i++) {
						let createdAt = new Date(this.departments[i].createdAt).toLocaleString("en-US", { timeZone: this.loggedInUser.timeZone });
						this.departments[i].createdAt = createdAt
						let updatedAt = new Date(this.departments[i].updatedAt).toLocaleString("en-US", { timeZone: this.loggedInUser.timeZone });
						this.departments[i].updatedAt = updatedAt
						if (this.departments[i].isActive == true) {
							this.departments[i].status = "Active";
						} else {
							this.departments[i].status = "Inactive";
						}
					}
					this.totalDept = response.data.result.departments.totalCount;
					this.dataSource.data = this.departments;
				}
			}))
	}

	editDepartment(data) {
		var deptId = data._id;
		this.url = '/department/';
		this.apiService.put(this.url + deptId, data)
			.subscribe((response) => {
			})
	};

	ngAfterViewInit() {
		this.setStatusListener();
	};

	openConfirmDialog(row) {
		var data = {
			department: row,
			isActive: row.isActive,
			status: ''
		};

		if (row.isActive == true) {
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
				this.getDepartments(this.deptPerPage, 1);
			}
		})
	};

	changeStatus(obj) {
		var deptId = obj.department._id;
		this.url = '/department/' + deptId + '/changeStatus';
		var data = {
			isActive: obj.isActive
		};
		this.apiService.put(this.url, data)
			.subscribe((response) => {
				if (response.success == true) {
					this.snackbarService.openSuccessBar('Branch status change successfully.', "Branch");
					this.getDepartments(this.deptPerPage, 1);
				}
			});
	}

	selectdeptId(event){	
		this.deptId = event;
		this.getDepartments(this.deptPerPage, 1);
	}
	selectdeptName(event){	
		this.deptName = event;
		this.getDepartments(this.deptPerPage, 1);
	}
	selectdeptLocation(event){	
		this.deptLocation = event;
		this.getDepartments(this.deptPerPage, 1);
	}
	selectdeptAddress(event){	
		this.deptAddress = event;
		this.getDepartments(this.deptPerPage, 1);
	}
	selectstatus(event){	
		this.status = event;
		this.getDepartments(this.deptPerPage, 1);
	}
	clearFilter(event,value){
		value =''
		this.getDepartments(this.deptPerPage, 1);
	}
	onSearch(event){
		this.filter.searchKey = event
		this.getDepartments(this.deptPerPage, 1);
	}
	goBack() {
		this.location.back();
	};

	ngOnDestroy() {
		this.dialogChangeEvent.unsubscribe();
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};

	onChangedDept(pageData: PageEvent) {
		if(this.curPage && this.orgPerPage){
			this.curPage = pageData.pageIndex + 1
			this.orgPerPage = pageData.pageSize;
			this.getDepartments(this.orgPerPage,  this.curPage);
		}else{
			this.currentPage = pageData.pageIndex + 1;
			this.deptPerPage = pageData.pageSize;
			this.getDepartments(this.deptPerPage, this.currentPage);
		}
	}
}
