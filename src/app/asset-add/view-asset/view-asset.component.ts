import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { faHandPointLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subscription } from 'rxjs';
import { ConfimationDialogComponent, ConfirmDialogModel } from 'src/app/dialogs/confimation-dialog/confimation-dialog.component';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { DataService } from 'src/app/services/data.service';
import { ErrorDialogService } from 'src/app/services/error-dialog.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-view-asset',
  templateUrl: './view-asset.component.html',
  styleUrls: ['./view-asset.component.css']
})
export class ViewAssetComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
  @ViewChild('template', { static: false }) private template;

  faHandPointLeft = faHandPointLeft;
	faSearch = faSearch;

	loggedInUser;
	url: string;
	dataSource = new MatTableDataSource<any>();
	selection = new SelectionModel<any>(true, []);
	totalRecord = 0;
	recordPerPage:any= 5;
	pageSizeOptions = [5,10,20,50,100];
	currentPage:any = 1;
  startIndex;
	selectedId: any = [];
	organizationId;
  assetCategoryDetails=[];
  assetName=null;
	assetCategory=null;
	assetDescription=null;
  allInstitutes = []
  curPage= 1;
  orgPerPage=5;
  pageIndex=0;
  pageSize=5
	filter:any={assetName:'',assetCategory:'',assetDescription:'',searchKey:''}
	sortkey:any={assetCategory:''}
  ModalFlag: boolean = false;
	modalRef: BsModalRef;

	dialogChangeEvent;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

	displayeColumns = [
		'action',
		'assetCategory',
    'assetName',
    'assetDescription'
	];

	constructor(private _formBuilder: FormBuilder, private apiService: ApiService,
		public dialogRef: MatDialogRef<ConfimationDialogComponent>,
		private route: ActivatedRoute,
		public router: Router,
		public errorDialogService: ErrorDialogService,
		public confirmDialogService: ConfirmDialogService,
		private dialog: MatDialog,
		public dataService: DataService,
		private location: Location,
		private modalService: BsModalService,
		public snackbarService: SnackbarService) { }

	ngOnInit() {
		this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
    this.organizationId = this.loggedInUser.reference.organizationId;
		if (typeof this.loggedInUser.timeZone === 'undefined'||  this.loggedInUser.timeZone == null ||  this.loggedInUser.timeZone == '') {
			this.loggedInUser.timeZone = 'Asia/Kolkata'
		}
		this.dataSource.sort = this.sort;
		this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['recordPerPage'];
		if(this.curPage && this.orgPerPage){
			this.pageIndex = this.curPage - 1
			this.recordPerPage = this.orgPerPage
			this.getAssetCategory(this.orgPerPage, this.curPage);
		}else{
			this.getAssetCategory(this.recordPerPage, this.currentPage);
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
	
	getAssetCategory(recordPerPage, currentPage){
		this.url = "/assetCategory/";
		var params = new HttpParams();
		this.startIndex = ((currentPage * recordPerPage) - recordPerPage)
		params = params.append('startIndex', this.startIndex);
		params = params.append('limit', recordPerPage);
		params = params.append('organizationId', this.organizationId);
   		params = params.append('flag', 'assetList');

    if(this.filter.assetCategory){
			params = params.append('assetCategory', this.filter.assetCategory);
		}
		if(this.filter.assetName){
			params = params.append('assetName', this.filter.assetName);
		}
		if(this.filter.assetDescription){
			params = params.append('assetDescription', this.filter.assetDescription);
		}
		if(this.filter.searchKey){
			params = params.append('searchKey', this.filter.searchKey);
		}
		if(this.assetCategory){
			var sortAssetCatOrder = this.assetCategory.direction || '';
			var sortAssetCatKey = this.assetCategory.active || '';

			params = params.append('sortKey', sortAssetCatKey);
			params = params.append('sortOrder', sortAssetCatOrder);
		}
	
		this.subscriptions.push(this.apiService.getAsset(this.url, params)
				.subscribe((response) => {
          if (response.success == true) {
						this.assetCategoryDetails = response.data.result;
           	this.totalRecord = response.data.totalCount;
						this.dataSource.data = this.assetCategoryDetails;
					}	
				}));
			}
		
	edit(row) {
		this.selectedId = row._id;
		if(this.curPage && this.orgPerPage){
			this.router.navigate(['/assetname/viewAsset/editAsset/' + this.selectedId + "/" + row.assetList._id],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage }} );
		}else{
			this.router.navigate(['/assetname/viewAsset/editAsset/' + this.selectedId + "/" + row.assetList._id],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.recordPerPage }});
		}
	}

  delete(row) {
		this.selectedId = row._id;  
		this.url = '/assetCategory/delete/' + this.selectedId + "/"+ row.assetList._id;
		var params = new HttpParams();
		this.subscriptions.push(this.apiService.post_transactions(this.url, params)
		.subscribe((response: any) => {	
				if (response.success == true) {
					this.snackbarService.openSuccessBar("Asset deleted successfully", "Asset");
					this.getAssetCategory(this.recordPerPage, this.currentPage);
				}
		}));		
	}

	goToDelete(row) {
		this.selectedId = row._id;
		const message = `Are you sure to delete this asset?`;
		const dialogData = new ConfirmDialogModel("Confirm Delete", message);
		const dialogRef = this.dialog.open(ConfimationDialogComponent, {
			width: '300px',
			data: dialogData,

		});
		this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
			if (result == true) {
				this.delete(row);
			} else {
				this.dialog.closeAll();
			}
		}));
	}

	sortData(event){
		this.assetCategory = event;
		this.getAssetCategory(this.recordPerPage, this.currentPage);
	}
	selectassetCategory(event){	
		this.assetCategory = event;
		this.getAssetCategory(this.recordPerPage, this.currentPage);
	}
	selectassetCatDes(event){	
		this.assetDescription = event;
		this.getAssetCategory(this.recordPerPage, this.currentPage);
	}
  selectassetCatName(event){	
		this.assetName = event;
		this.getAssetCategory(this.recordPerPage, this.currentPage);
	}
	clearFilter(event,value){
		value =''
		this.getAssetCategory(this.recordPerPage, this.currentPage);
	}
	onSearch(event){
		this.filter.searchKey = event
		this.getAssetCategory(this.recordPerPage, this.currentPage);
	}

	goBack() {
		this.location.back();
	}

	onChangedPage(pageData: PageEvent) {
		if(this.curPage && this.orgPerPage){
			this.curPage = pageData.pageIndex + 1
			this.orgPerPage = pageData.pageSize;
			this.getAssetCategory(this.orgPerPage, this.curPage);
		}else{
			this.currentPage = pageData.pageIndex + 1;
			this.recordPerPage = pageData.pageSize;~
			this.getAssetCategory(this.recordPerPage, this.currentPage);
		}
	}	
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};

}