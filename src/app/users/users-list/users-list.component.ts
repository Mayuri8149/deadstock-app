import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { faEdit, faHandPointLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ConfimationDialogComponent } from 'src/app/dialogs/confimation-dialog/confimation-dialog.component';
import { Globals } from 'src/app/globals';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserModel } from '../../modals/user';
import { ErrorDialogService } from '../../services/error-dialog.service';
@Component({
	selector: 'app-users-list',
	templateUrl: './users-list.component.html',
	styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	faHandPointLeft = faHandPointLeft;
	faSearch = faSearch;
	faEdit = faEdit;
	totalRecord = 0;
	recordPerPage= 5;
	pageSizeOptions = [5,10,20,50,100];
	currentPage = 1;
	url;
	loginUser;
	userId;
	role;
	entity;
	organizationData: any;
	id;
	users: any[] = [];
	user: any = {};
	userType=null;
	userRole=null;
	userEntity=null;
	Entity_Name=null;
	Entity_Id=null;
	fullName=null;
	email=null;
	phoneNumber=null;
	status=null;
	deptName=null;
	firstName=null;
	lastName=null;
	partnerPerPage= 5;
	selecteduser: any = [];
	filter:any={userType:'',userRole: '',userEntity: '',Entity_Name: '',Entity_Id: '',fullName: '',email: '',phoneNumber: '',status: '',deptName: '',firstName:'',lastName:'',searchKey:''}

	displayedColumns = [
		'id',
		'userType',
		// 'userRole',
		// 'organizationName',
		// 'departmentName',
		// 'username',
		// 'emailId',
		// 'phone',
		// 'status',
	];
	displayColumns = [ 
		'id',	
		'userType',
		// 'userRole',
		// 'userentity', 
		// 'organizationId',
		// 'organizationName',
		// 'username', 
		// 'emailId', 
		// 'phone', 
		// 'status', 
		];

	datacorporateColumns = [
		'id',
		'userType',
		// 'userRole',
		// 'firstName',
		// 'lastName',
		// 'emailId',
		// 'phone',
		// 'status',
	];

	dataSource = new MatTableDataSource<UserModel>();
	selection = new SelectionModel<UserModel>(true, []);
	dialogChangeEvent;
	curPage= 1;
	orgPerPage=5;
	pageIndex=0;
	pageSize=5

	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

	constructor(private apiService: ApiService,
		public router: Router,
		public route: ActivatedRoute,
		public globals: Globals,
		private location: Location,
		public snackbarService: SnackbarService,
		public errorDialogService: ErrorDialogService,
		public confirmDialogService: ConfirmDialogService,
		private dialog: MatDialog,private confirmDialogRef: MatDialogRef<ConfimationDialogComponent>
		) {
		this.globals.stateRoute = this.router.url;
	}

	ngOnInit() {
		this.loginUser = JSON.parse(sessionStorage.getItem("user"));
		this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['recordPerPage'];
		this.role = this.loginUser.reference.role;
		this.entity = this.loginUser.reference.entity;
		this.id = this.loginUser.reference.organizationId;
		if(this.curPage && this.orgPerPage){
			this.pageIndex = this.curPage - 1
			this.recordPerPage = this.orgPerPage
			this.getUsers(this.orgPerPage, this.curPage);
		}else{
			this.getUsers(this.recordPerPage, this.currentPage);
		}
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
						this.router.navigate(['/users/userList/userAdd']);
					}
				}
			}));
	};

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	};

	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
	};

	getUsers(recordPerPage, currentPage) {
		this.selection.clear();
		this.url = "/menu/list";
		this.userId = this.loginUser._id;
		var params = new HttpParams();
		params = params.append('userId', this.loginUser._id);
		if (this.loginUser.reference.organizationId !==undefined) {
			params = params.append('organizationId', this.loginUser.reference.organizationId);
		}
		
		params = params.append('pagesize', recordPerPage);
		params = params.append('page', currentPage);
		params = params.append('role', this.role);
		params = params.append('entity', this.entity);
		// if (this.loginUser.reference.departmentId !== "111111111111111111111111") {
		if (this.loginUser.reference.departmentId !==undefined) {
			params = params.append('departmentId', this.loginUser.reference.departmentId);
		}
		
		if(this.filter.userType){
			params = params.append('userType', this.filter.userType);
		}
		if(this.filter.userRole){
			params = params.append('roleName', this.filter.userRole);
		}
		if(this.filter.userEntity){
			params = params.append('userEntity', this.filter.userEntity);
		}
		if(this.filter.Entity_Name){
			params = params.append('Entity_Name', this.filter.Entity_Name);
		}
		if(this.filter.Entity_Id){
			params = params.append('Entity_Id', this.filter.Entity_Id);
		}
		if(this.filter.fullName){
			params = params.append('fullName', this.filter.fullName);
		}
		if(this.filter.email){
			params = params.append('email', this.filter.email);
		}
		if(this.filter.phoneNumber){
			params = params.append('phoneNumber', this.filter.phoneNumber);
		}
		if(this.filter.status){
			params = params.append('status', this.filter.status);
		}
		if(this.filter.deptName){
			params = params.append('deptName', this.filter.deptName);
		}
		if(this.filter.firstName){
			params = params.append('firstName', this.filter.firstName);
		}
		if(this.filter.lastName){
			params = params.append('lastName', this.filter.lastName);
		}
		if(this.filter.searchKey){
			params = params.append('searchKey', this.filter.searchKey);
		}
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response) => {
				console.log('response---',response);
				if (response.success == true) {
					if (response.data.menus) {
						this.users = response.data.menus;						
						// this.totalRecord = response.data.result.totalCount;
						this.dataSource.data = this.users;
					}
				}
			}));
	};

	editUser(row) {
		this.users = row.userId;
		this.user = this.users[0];
		if(row.status == 'Active'){
			if(this.curPage && this.orgPerPage){
				this.router.navigate(['users/userList/userEdit/' + this.users],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
			}else{
				this.router.navigate(['users/userList/userEdit/' + this.users],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.recordPerPage}});
			}
		}else{
			var data = {
							reason: "This user is inactive. Active this user!",
						};
				this.errorDialogService.openDialog(data);
				if(this.curPage && this.orgPerPage){
					this.getUsers(this.orgPerPage, this.curPage);
				}else{
					this.getUsers(this.recordPerPage, this.currentPage);
				}
		}
	};
	
	selectUserType(event){	
        this.userType = event;
		this.getUsers(this.recordPerPage, 1);
	}

	selectUserRole(event){
        this.userRole = event;
		this.getUsers(this.recordPerPage, 1);
	}

	selectUserEntity(event){
        this.userEntity = event;
		this.getUsers(this.recordPerPage, 1);
	}

	selectEntity_Name(event){
        this.userRole = event;
		this.getUsers(this.recordPerPage, 1);
	}

	selectEntity_Id(event){	
        this.userRole = event;
		this.getUsers(this.recordPerPage, 1);
	}

	selectfullName(event){
        this.userRole = event;
		this.getUsers(this.recordPerPage, 1);
	}
	selectfirstName(event){
        this.firstName = event;
		this.getUsers(this.recordPerPage, 1);
	}
	selectlastName(event){
        this.lastName = event;
		this.getUsers(this.recordPerPage, 1);
	}

	selectemail(event){	
        this.userRole = event;
		this.getUsers(this.recordPerPage, 1);
	}

	selectphoneNumber(event){
        this.userRole = event;
		this.getUsers(this.recordPerPage, 1);
	}

	selectstatus(event){
        this.userRole = event;
		this.getUsers(this.recordPerPage, 1);
	}

	selectdeptName(event){
        this.userRole = event;
		this.getUsers(this.recordPerPage, 1);
	}
	clearFilter(event,value){
		value =''
		this.getUsers(this.recordPerPage, 1);
	}
	onSearch(event){
		this.filter.searchKey = event
		this.getUsers(this.recordPerPage, 1);
	}

	openConfirmDialog(row) {
		var data = {
			user: row,
			isActive: row.status,
			status: ''
		};

		if (row.status == 'Active') {
			data.isActive = 'Inactive';
			data.status = 'Inactive';
		} else {
			data.isActive = 'Active';
			data.status = 'Active';
		}
		this.confirmDialogService.open(data);
		this.dialogChangeEvent = this.confirmDialogService.change.subscribe((data: any) => {
			if (data.doAction === true) {
				this.changeStatus(data);
				this.dialogChangeEvent.unsubscribe();
			} else {
				if(this.curPage && this.orgPerPage){
					this.getUsers(this.orgPerPage, this.curPage);
				}else{
					this.getUsers(this.recordPerPage, this.currentPage);
				}
				this.dialogChangeEvent.unsubscribe();
			}
		})
	};
	
	changeStatus(obj) {
		var userId = obj.user.userId;
		this.url = '/user/' + userId + '/changeStatus';
		var data = {
			isActive: obj.isActive
		};
		this.apiService.put(this.url, data)
			.subscribe((response) => {
				if (response.success == true) {
					this.snackbarService.openSuccessBar('User status change successfully.', "User");
					if(this.curPage && this.orgPerPage){
						this.getUsers(this.orgPerPage, this.curPage);
					}else{
						this.getUsers(this.recordPerPage, this.currentPage);
					}
				}
			});
	};

	goBack() {
		this.location.back();
	};

	onChangedPage(pageData: PageEvent) {
		if(this.curPage && this.orgPerPage){
			this.curPage = pageData.pageIndex + 1
			this.orgPerPage = pageData.pageSize;
			this.getUsers(this.orgPerPage,  this.curPage);
		}else{
			this.currentPage = pageData.pageIndex + 1;
			this.recordPerPage = pageData.pageSize;
			this.getUsers(this.recordPerPage, this.currentPage);
		}
	}

	openAcces(selectedElement){
        sessionStorage.setItem('selectedUser', JSON.stringify(selectedElement));
		if(this.curPage && this.orgPerPage){
			this.router.navigate(['/users/userList/useracess/'  + selectedElement.user._id],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
		}else{
			this.router.navigate(['/users/userList/useracess/'  + selectedElement.user._id],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.recordPerPage}});
		}
    }
	
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}