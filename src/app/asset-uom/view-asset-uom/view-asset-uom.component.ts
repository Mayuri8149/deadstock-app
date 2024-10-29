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
import { Subscription } from 'rxjs';
import { ConfimationDialogComponent, ConfirmDialogModel } from 'src/app/dialogs/confimation-dialog/confimation-dialog.component';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { DataService } from 'src/app/services/data.service';
import { ErrorDialogService } from 'src/app/services/error-dialog.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-view-asset-uom',
  templateUrl: './view-asset-uom.component.html',
  styleUrls: ['./view-asset-uom.component.css']
})
export class ViewAssetUomComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
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
  uomDetails=[];
	uom=null;
	decimal=null;
	filter:any={uom:'',decimal:'',searchKey:''}
	sortkey:any={uom:''}
	curPage= 1;
	orgPerPage=5;
	pageIndex=0;
	pageSize=5
	dialogChangeEvent;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

	displayeColumns = [
		'action',
		'uom',
		'decimal'
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
			this.getuom(this.orgPerPage, this.curPage);
		}else{
			this.getuom(this.recordPerPage, this.currentPage);
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
	
	getuom(recordPerPage, currentPage){
		this.url = "/uom/";
		var params = new HttpParams();
    this.startIndex = ((currentPage * recordPerPage) - recordPerPage)
    params = params.append('startIndex', this.startIndex);
    params = params.append('limit', recordPerPage);

		params = params.append('organizationId', this.organizationId);

		if(this.filter.uom){
			params = params.append('uom', this.filter.uom);
		}
		if(this.filter.decimal){
			params = params.append('decimal', this.filter.decimal);
		}
		if(this.filter.searchKey){
			params = params.append('searchKey', this.filter.searchKey);
		}
		if(this.uom){
			var sortAssetCatOrder = this.uom.direction || '';
			var sortAssetCatKey = this.uom.active || '';
			params = params.append('sortKey', sortAssetCatKey);
			params = params.append('sortOrder', sortAssetCatOrder);
		}
	
		this.subscriptions.push(this.apiService.getAsset(this.url, params)
				.subscribe((response) => {
          if (response.success == true) {
						this.uomDetails = response.data.result;
						this.totalRecord = response.data.totalCount;
						this.dataSource.data = this.uomDetails;
					}	
				}));
			}
			
	edit(row) {
		this.selectedId = row._id;
		if(this.curPage && this.orgPerPage){
			this.router.navigate(['/assetuom/viewAssetUOM/editUOM/' + this.selectedId],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage }} );
		}else{
			this.router.navigate(['/assetuom/viewAssetUOM/editUOM/' + this.selectedId],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.recordPerPage }} );
		}
	}

	delete(row) {
		this.selectedId = row._id;
		this.url = '/uom/delete/' + this.selectedId;
		var params = new HttpParams();
		this.subscriptions.push(this.apiService.post_transactions(this.url, params)
		.subscribe((response: any) => {	
				if (response.success == true) {
					this.snackbarService.openSuccessBar("UOM deleted successfully", "UOM");
					this.getuom(this.recordPerPage, this.currentPage);
				}
		}));		
	}

	goToDelete(row) {
		this.selectedId = row._id;
		const message = `Are you sure to delete this UOM?`;
		const dialogData = new ConfirmDialogModel("Confirm Delete", message);
		const dialogRef = this.dialog.open(ConfimationDialogComponent, {
			width: '300px',
			data: dialogData,

		});
		dialogRef.afterClosed().subscribe(result => {
			if (result == true) {
				this.delete(row);
			} else {
				this.dialog.closeAll();
			}
		});
	}

	sortData(event){
		this.uom = event;
		this.getuom(this.recordPerPage, this.currentPage);
	}

	selectuom(event){	
		this.uom = event;
		this.getuom(this.recordPerPage, this.currentPage);
	}
	selectdecimal(event){	
		this.decimal = event;
		this.getuom(this.recordPerPage, this.currentPage);
	}
	clearFilter(event,value){
		value =''
		this.getuom(this.recordPerPage, this.currentPage);
	}
	onSearch(event){
		this.filter.searchKey = event
		this.getuom(this.recordPerPage, this.currentPage);
	}
	goBack() {
		this.location.back();
	}

	onChangedPage(pageData: PageEvent) {
		if(this.curPage && this.orgPerPage){
			this.curPage = pageData.pageIndex + 1
			this.orgPerPage = pageData.pageSize;
			this.getuom(this.orgPerPage, this.curPage);
		}else{
			this.currentPage = pageData.pageIndex + 1;
			this.recordPerPage = pageData.pageSize;~
			this.getuom(this.recordPerPage, this.currentPage);
		}
	}	
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}
