import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { faEdit, faHandPointLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subscription } from 'rxjs';
import { ConfimationDialogComponent } from 'src/app/dialogs/confimation-dialog/confimation-dialog.component';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ErrorDialogService } from '../services/error-dialog.service';

@Component({
	selector: 'app-invitepartners',
	templateUrl: './invitepartners.component.html',
	styleUrls: ['./invitepartners.component.css']
})
export class InvitepartnersComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	status: boolean = false;
	faHandPointLeft = faHandPointLeft;
	faSearch = faSearch;
	faEdit = faEdit;
	totalRecord = 0;
	recordPerPage:any= 5;
	pageSizeOptions = [5,10,20,50,100];
	currentPage:any= 1;
	startIndex;
	url;
	loginUser;
	userId;
	id;
	invitePartners = []
	displayedColumns = [
		'id',
		'entityId',
		'entityName',
		'email',
		'cstatus',
	];

	dataSource = new MatTableDataSource<any>();
	selection = new SelectionModel<any>(true, []);
	entityFilter = new FormControl();
	
	dialogChangeEvent;
	listActivited = ''
	corporateData:any={}
	modalRef: BsModalRef;
	@ViewChild('template', { static: false }) private template;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	clsName: string;
	clsInVitedName: string;
	clsRegisteredName: string;
	clsApprovedPartnerName: string;
	urlState;
	entity_Name;
	entityId=null;
	entityName=null;
	email=null;
	entity=null;
	cstatus=null;
	filter:any={entity:'',entityId:'',entityName:'',email:'',cstatus:'',searchKey:''}
	curPage= 1;
	orgPerPage=5;
	pageIndex=0;
	pageSize=5
	isBlockchainService:any;
	corporates: any[] = [];
	corpData;
	urlstring: String;
	constructor(private apiService: ApiService,
		private route: ActivatedRoute,
		public router: Router,
		private location: Location,
		public snackbarService: SnackbarService,
		public errorDialogService: ErrorDialogService,
		public confirmDialogService: ConfirmDialogService,
		private modalService: BsModalService,
		private dialog: MatDialog, private confirmDialogRef: MatDialogRef<ConfimationDialogComponent>
	) {
	}

	ngOnInit() {
		var dashboard1 = this.router.url.split('/invitepartners?urlState');
		this.urlState = dashboard1[1];
		this.listActivited = 'invited'
		this.loginUser = JSON.parse(sessionStorage.getItem("user"));
		if (typeof this.loginUser.timeZone === 'undefined' || this.loginUser.timeZone == null || this.loginUser.timeZone == '') {
			this.loginUser.timeZone = 'Asia/Kolkata'
		}

		if ('corpData' in this.loginUser) {
			this.entity_Name = this.loginUser.corpData.companyName;
		  } else {
			this.entity_Name = this.loginUser.organizationName;
		  }
		  this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['recordPerPage'];
		if(this.curPage && this.orgPerPage){
			this.pageIndex = this.curPage - 1
			this.recordPerPage = this.orgPerPage
			this.getInvitePartners(this.orgPerPage, this.curPage,this.listActivited);
		}else{
			this.getInvitePartners(this.recordPerPage, this.currentPage,this.listActivited);
		}
	}

	getInvitePartners(recordPerPage, currentPage,listActivited) {		
		this.listActivited = listActivited
		if(this.listActivited=="invited"){
			this.clsInVitedName = "add-btn-active"
			this.clsRegisteredName = "add-btn"
			this.clsApprovedPartnerName = "add-btn"
		}else if(this.listActivited=="registered"){
			this.clsInVitedName = "add-btn"
			this.clsRegisteredName = "add-btn-active"
			this.clsApprovedPartnerName = "add-btn"
		}else if(this.listActivited=="signedUp"){
			this.clsInVitedName = "add-btn"
			this.clsRegisteredName = "add-btn"
			this.clsApprovedPartnerName = "add-btn-active"
		}
		this.url = "/partners/getPartnersList";
		var params = new HttpParams();
		this.startIndex = ((currentPage * recordPerPage) - recordPerPage)
		params = params.append('startIndex', this.startIndex);
		params = params.append('limit', recordPerPage);
		if (this.loginUser.reference.role == 'admin') {
			params = params.append('partnerEntity', this.loginUser.reference.organizationId);
		}else{
			params = params.append('partnerEntity', this.loginUser.corpData._id);
		}
		
		if(this.filter.entityId){
			params = params.append('entityId', this.filter.entityId);
		}
		if(this.filter.entityName){
			params = params.append('entityName', this.filter.entityName);
		}
		if(this.filter.email){
			params = params.append('email', this.filter.email);
		}
		if(this.filter.cstatus){
			params = params.append('pstatus', this.filter.cstatus);
		}
		if(this.filter.searchKey){
			params = params.append('searchKey', this.filter.searchKey);
		}
		
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response) => {
				if (response.success == true) {
					if (response.data.partners) {
						this.invitePartners = response.data.partners;
						for (var i = 0; i < this.invitePartners.length; i++) {
							if (typeof this.invitePartners[i].user === 'undefined' ||  this.invitePartners[i].user == null ||  this.invitePartners[i].user == '') {
								this.invitePartners[i].user = {
									firstName: '-',
									lastName: '-',
									phoneNumber:'-'
								}
							}
							if (this.loginUser.reference.role == 'admin') {
								this.invitePartners[i].entityBy = this.invitePartners[i].entityName
							}else{
								this.invitePartners[i].entityBy = this.invitePartners[i].entityName
							}
							if (this.invitePartners[i].status == 'invited') {
								this.invitePartners[i].status = "Invited";
							}else if (this.invitePartners[i].status == 'approved') {
								this.invitePartners[i].status = "Approved";
							} else if (this.invitePartners[i].status == 'signedUp') {
								this.invitePartners[i].status = "Signed-Up";
							} 
							 else {
								this.invitePartners[i].status = "Inactive";
							}
							if (typeof this.invitePartners[i].createdAt !== undefined || this.invitePartners[i].createdAt != 'null' || this.invitePartners[i].createdAt != '') {
								let createdAt = new Date(this.invitePartners[i].createdAt).toLocaleString("en-US", { timeZone: this.loginUser.timeZone });
								this.invitePartners[i].createdAt = createdAt
							}
						}
						this.totalRecord = response.data.total_count;
						this.dataSource.data = this.invitePartners;
					}
				}
			}));
	};

	selectentityId(event){	
		this.entityId = event;
		this.getInvitePartners(this.recordPerPage, this.currentPage,this.listActivited);
	}
	selectentityName(event){	
		this.entityName = event;
		this.getInvitePartners(this.recordPerPage, this.currentPage,this.listActivited);
	}
	selectemail(event){	
		this.email = event;
		this.getInvitePartners(this.recordPerPage, this.currentPage,this.listActivited);
	}
	selectentity(event){	
		this.entity = event;
		this.getInvitePartners(this.recordPerPage, this.currentPage,this.listActivited);
	}
	selectstatus(event){	
		this.cstatus = event;
		this.getInvitePartners(this.recordPerPage, this.currentPage,this.listActivited);
	}
	clearFilter(event,value){
		value =''
		this.getInvitePartners(this.recordPerPage, this.currentPage,this.listActivited);
	}
	onSearch(event){
		this.filter.searchKey = event
		this.getInvitePartners(this.recordPerPage, this.currentPage,this.listActivited);
	}
	onChangedPage(pageData: PageEvent) {
		if(this.curPage && this.orgPerPage){
			this.curPage = pageData.pageIndex + 1
			this.orgPerPage = pageData.pageSize;
			this.getInvitePartners(this.orgPerPage,  this.curPage,this.listActivited);
		}else{
			this.currentPage = pageData.pageIndex + 1;
			this.recordPerPage = pageData.pageSize;
			this.getInvitePartners(this.recordPerPage, this.currentPage,this.listActivited);
		}
	}

	PartnerList(type){
		this.router.navigate(['/partners/partnerList']);
	}
	InvitedPartnerList(type){
		this.router.navigate(['/partners/invitepartners']);
	}

	openConfirmDialog(row) {
        var data = {
            item: row,
            isActive: true,
            status: row.status,
			corporateId: row.corporate._id
        };

        if (row.status == 'Approved') {
            data.isActive = false;
            data.status = 'Inactive';
        }else if (row.status == 'Invited') {
            data.isActive = false;
            data.status = 'Invited';
        } else {
            data.isActive = true;
            data.status = 'Approved';
        }
        this.confirmDialogService.open(data);
    };

	ngAfterViewInit() {
		this.setStatusListener();
	};

	setStatusListener() {
		this.dialogChangeEvent = this.confirmDialogService.change.subscribe((data: any) => {
			if (data.doAction === true && data.status != 'Invited') {
				this.approvedPartner(data);
			}else if(data.doAction === true && data.status == 'Invited'){
				this.resendInvitation(data);
			} else {
				this.getInvitePartners(this.recordPerPage, this.currentPage,'invited');
			}
		})
	};

	ngOnDestroy() {
		this.dialogChangeEvent.unsubscribe();
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};

	approvedPartner(data) {
		if (data.status == 'Approved') {
			data.item.status = 'approved'
			data.item.updatedBy = this.loginUser._id
			if(data.isBlockchainService){
				data.item.isBlockchainService = data.isBlockchainService
			}else{
				data.item.isBlockchainService = data.item.isBlockchainService
			}
		} else {
			data.item.status = 'inactive'
			data.item.updatedBy = this.loginUser._id
			data.item.disAproved = true
		}
		this.urlstring = "/invitepartner/" + data.item._id + "/changeStatus";
		const dataItem = data.item
		this.apiService.put(this.urlstring, dataItem)
			.subscribe((response) => {
				if(response.success == true) {
					if (data.status == 'Approved') {
						this.snackbarService.openSuccessBar("Partner approved successfully..", 'Successfully');
					}else{
						this.snackbarService.openSuccessBar("Partner inactivated successfully..", 'Successfully');
					}
					this.getInvitePartners(this.recordPerPage, this.currentPage,this.listActivited);
				}
			});
	}
	view(row) {
		this.corporates = row;
		this.corpData = this.corporates;
		if(this.curPage && this.orgPerPage){
			this.router.navigate(['partners/invitepartners/partnerUpdates/' + this.corpData._id + "/" + this.corpData.corporate.isBlockchainService],{ queryParams: { listActivited: this.listActivited, currentPage: this.curPage,recordPerPage: this.orgPerPage}} );
		}else{
			this.router.navigate(['partners/invitepartners/partnerUpdates/' + this.corpData._id + "/" + this.corpData.corporate.isBlockchainService],{ queryParams: { listActivited: this.listActivited, currentPage: this.currentPage,recordPerPage: this.recordPerPage}});
		}
	}
	viewSuperUsers(row) {
		this.router.navigate(['/partners/superusers/'],{ queryParams: { id:row.childEntity }} );
	}

	viewDetails(row){
		if (row.corporate) {
			this.id = row.corporate._id;

			this.url = '/corporate/' + this.id ;
			var params = new HttpParams();
			params = params.append('id', this.id);
			this.subscriptions.push(this.apiService.get(this.url, params)
				.subscribe((response: any) => {
				if(response.success == true){
					if(response.data){
					this.corporateData = response.data;
					this.router.navigate(['/partner/partnerDetails'],{ queryParams: { id:this.id ,fromAdmin:true}} );
					}
				}
			}));

		  } else {
			this.id = row.organizationDetails._id;
			this.url = '/organization/' + this.id ;
			var params = new HttpParams();
			params = params.append('id', this.id);
			this.subscriptions.push(this.apiService.get(this.url, params)
				.subscribe((response: any) => {
				if(response.success == true){
					if(response.data){
					this.corporateData = response.data;
					this.router.navigate(['/organizations/organizationDetails'],{ queryParams: { id:this.id ,fromAdmin:true}} );
					}
				}
			}));
		  }		
	}

	resendInvitation(data) {
		this.url = "/organization/" + this.loginUser.reference.organizationId;
		var params = '';
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response: any) => {
				if (response.success == true) {
					var organizationData = response.data;

					if (organizationData.isActive == false && this.loginUser.reference.role == 'admin') {
						var data1 = {
							reason: "Your organization is yet not Active. It is pending for KYC.  ",
							status: ''
						};
						this.errorDialogService.openDialog(data1);
					} else {
						this.url = "/invitepartner/resendInvitation";
						let details = {
							_id: data.item._id,
							email: data.item.email,
							entityId: data.item.entityId,
							organizationName: organizationData.name,
						}
						this.subscriptions.push(this.apiService.post(this.url, details)
							.subscribe((response: any) => {
								if (response.success == true) {
									this.snackbarService.openSuccessBar("Resend invitation successfully..", 'Successfully');
								}
							}));
					}
				}
			}));
	}

	getOrganization() {
		if(this.loginUser.corpData){
			this.url = "/organization/" + this.loginUser.corpData.organizationId;
		}else{
			this.url = "/organization/" + this.loginUser.reference.organizationId;
		}

		var params = new HttpParams();
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response: any) => {
				if (response.success == true) {
					var organizationData = response.data;

					if (organizationData.isActive == false && this.loginUser.reference.role == 'admin') {
						var data = {
							reason: "Your organization is yet not Active. It is pending for KYC.  ",
							status: ''
						};
						this.errorDialogService.openDialog(data);
					} else {
						this.router.navigate(['/partners/invitepartners/sendinvitation']);
					}
				}
			}));
	};

	closedModal() {
		this.modalRef.hide();
	  }
	  goBack() {
		this.location.back();
	}	
}