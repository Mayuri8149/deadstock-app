import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { faEdit, faHandPointLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ConfimationDialogComponent } from 'src/app/dialogs/confimation-dialog/confimation-dialog.component';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-partner-super-users',
  templateUrl: './partner-super-users.component.html',
  styleUrls: ['./partner-super-users.component.css']
})
export class PartnerSuperUsersComponent implements OnInit {
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
	superUsers = []
  	displayedColumns = [
		'entityId',
		'entityName',
		'name',
		'email',
		'phoneNo',
	];
  	dataSource = new MatTableDataSource<any>();
	selection = new SelectionModel<any>(true, []);
	dialogChangeEvent;
	partnerId = ''
	email=null;
	companyCode=null;
	companyName=null;
	userName=null;
	phoneNumber=null;
	filter:any={companyCode:'',companyName:'',userName:'',email:'',phoneNumber:'',searchKey:''}
	curPage= 1;
	orgPerPage=5;
	pageIndex=0;
	pageSize=5
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

	constructor(private apiService: ApiService,
		public router: Router,
		private location: Location,
    private route: ActivatedRoute,
		public snackbarService: SnackbarService,
		public confirmDialogService: ConfirmDialogService,
		private dialog: MatDialog, private confirmDialogRef: MatDialogRef<ConfimationDialogComponent>
	) {
	}

  ngOnInit(): void {
		this.loginUser = JSON.parse(sessionStorage.getItem("user"));
		if (typeof this.loginUser.timeZone === 'undefined' || this.loginUser.timeZone == null || this.loginUser.timeZone == '') {
			this.loginUser.timeZone = 'Asia/Kolkata'
		}
    this.partnerId =  this.route.snapshot.queryParams['id'];
		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;
		this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['recordPerPage'];
		this.getPartnerSuperUsers(this.recordPerPage, 1);
  }

  getPartnerSuperUsers(recordPerPage,currentPage){
    var params = new HttpParams();
		params = params.append('pagesize', recordPerPage);
		params = params.append('page', currentPage);
		params = params.append('corporateId', this.partnerId);
		if(this.filter.email){
			params = params.append('email', this.filter.email);
		}if(this.filter.companyCode){
			params = params.append('companyCode', this.filter.companyCode);
		}
		if(this.filter.companyName){
			params = params.append('companyName', this.filter.companyName);
		}
		if(this.filter.userName){
			params = params.append('userName', this.filter.userName);
		}
		if(this.filter.phoneNumber){
			params = params.append('phoneNumber', this.filter.phoneNumber);
		}
		if(this.filter.searchKey){
			params = params.append('searchKey', this.filter.searchKey);
		}
		this.url = "/user/getPartnersSuperUsers";
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response) => {
				if (response.success == true) {
					if (response.data.superUsers.superUsers) {
						this.superUsers = response.data.superUsers.superUsers;
						for (var i = 0; i < this.superUsers.length; i++) {
							if (typeof this.superUsers[i].createdAt !== undefined || this.superUsers[i].createdAt != 'null' || this.superUsers[i].createdAt != '') {
								let createdAt = new Date(this.superUsers[i].createdAt).toLocaleString("en-US", { timeZone: this.loginUser.timeZone });
								this.superUsers[i].createdAt = createdAt
							}
						}
						this.totalRecord = response.data.superUsers.total_count;
						this.dataSource.data = this.superUsers;
					}
				}
			}));
  }

	selectemail(event){	
		this.email = event;
		this.getPartnerSuperUsers(this.recordPerPage, this.currentPage);
	}
	selectcompanyCode(event){	
		this.companyCode = event;
		this.getPartnerSuperUsers(this.recordPerPage, this.currentPage);
	}
	selectcompanyName(event){	
		this.companyName = event;
		this.getPartnerSuperUsers(this.recordPerPage, this.currentPage);
	}
	selectuserName(event){	
		this.userName = event;
		this.getPartnerSuperUsers(this.recordPerPage, this.currentPage);
	}
	selectphoneNumber(event){	
		this.phoneNumber = event;
		this.getPartnerSuperUsers(this.recordPerPage, this.currentPage);
	}
	clearFilter(event,value){
		value =''
		this.getPartnerSuperUsers(this.recordPerPage, this.currentPage);
	}
	onSearch(event){
		this.filter.searchKey = event
		this.getPartnerSuperUsers(this.recordPerPage, this.currentPage);
	}
	onChangedPage(pageData: PageEvent) {
		this.currentPage = pageData.pageIndex + 1;
		this.recordPerPage = pageData.pageSize;
		this.getPartnerSuperUsers(this.recordPerPage, this.currentPage);
	}

  goBack() {
	this.router.navigate(['/partners/partnerList'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});

	}
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}
