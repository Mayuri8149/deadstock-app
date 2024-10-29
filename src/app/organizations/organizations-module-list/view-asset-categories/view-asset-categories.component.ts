// Start - Priyanka Patil (SNA-18) 07-06-2021
import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-view-asset-categories',
	templateUrl: './view-asset-categories.component.html',
	styleUrls: ['./view-asset-categories.component.css']
})
export class ViewAssetCategoriesComponent implements OnInit {
	private subscriptions: Subscription[] = [];
	faHandPointLeft = faHandPointLeft;
	faSearch = faSearch;
	totalRecord = 0;
	recordPerPage:any= 5;
	pageSizeOptions = [5,10,20,50,100];
	currentPage:any = 1;
  	startIndex;
	loggedInUser;
	role;
	entity;
	url: string;
	assetCategories = [];
	assetCat;
	dataSource = new MatTableDataSource<any>();
	selection = new SelectionModel<any>(true, []);
	organizationId: any;
	assetcatId:any;
	transactionId;
	editable: boolean = false;
	transactionTypeName=null;
	transactionTypeCode=null;
	assetCategory=null;
	assetCategoryDescription=null;
	moduleName=null;
	moduleCode=null;
	organizationName=null;
	provenanceTemplatePath=null;
	category=null;
	subcategory=null;
	filter:any={transactionTypeName:'',transactionTypeCode:'',assetCategory:'',assetCategoryDescription:'',moduleCode:'',moduleName:'',category:'',subcategory:'',organizationName:'',provenanceTemplatePath:''}

	dialogChangeEvent;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

	displayedColumns = [
		'assetCategory',
		'assetCategoryDescription',
		'provenanceTemplatePath',
	];
	
	constructor(private _formBuilder: FormBuilder, private apiService: ApiService,
		private route: ActivatedRoute,
		public router: Router,
		public errorDialogService: ErrorDialogService,
		public confirmDialogService: ConfirmDialogService,
		public dataService: DataService,
		private location: Location,
		public snackbarService: SnackbarService) { }

	ngOnInit() {
		this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
		if (typeof this.loggedInUser.timeZone === 'undefined'||  this.loggedInUser.timeZone == null ||  this.loggedInUser.timeZone == '') {
			this.loggedInUser.timeZone = 'Asia/Kolkata'
		}
		this.role = this.loggedInUser.reference.role;
		this.entity = this.loggedInUser.reference.entity;
		this.dataSource.sort = this.sort;
		this.transactionId = this.route.snapshot.params['transactionId'];
		this.organizationId = this.route.snapshot.params['organizationId'];
		this.getAssetCategories(this.recordPerPage, this.currentPage);
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

	getAssetCategories(recordPerPage, currentPage){
		this.url = '/assetcategory/';
		this.selection.clear();

		var params = new HttpParams();
		params = params.append('organizationId', this.organizationId);
		this.startIndex = ((currentPage * recordPerPage) - recordPerPage)
		params = params.append('startIndex', this.startIndex);
		params = params.append('limit', recordPerPage);
		params = params.append('provenanceTemplatePath', "false");
			
		if(this.filter.transactionTypeName){
			params = params.append('transactionTypeName', this.filter.transactionTypeName);
		}
		if(this.filter.transactionTypeCode){
			params = params.append('transactionTypeCode', this.filter.transactionTypeCode);
		}
		if(this.filter.organizationName){
			params = params.append('organizationName', this.filter.organizationName);
		}
		if(this.filter.moduleCode){
			params = params.append('moduleCode', this.filter.moduleCode);
		}
		if(this.filter.moduleName){
			params = params.append('moduleName', this.filter.moduleName);
		}
		if(this.filter.category){
			params = params.append('category', this.filter.category);
		}
		if(this.filter.subcategory){
			params = params.append('subcategory', this.filter.subcategory);
		}
		if(this.filter.assetCategory){
			params = params.append('assetCategory', this.filter.assetCategory);
		}
		if(this.filter.assetCategoryDescription){
			params = params.append('assetCategoryDescription', this.filter.assetCategoryDescription);
		}
		if(this.filter.provenanceTemplatePath){
			params = params.append('provenanceTemplatePath', this.filter.provenanceTemplatePath);
		}

			this.subscriptions.push(this.apiService.getAsset(this.url, params)
					.subscribe((response) => {
				if (response.success == true) {
					this.assetCategories = response.data.result;
					for(var i=0;i<this.assetCategories.length;i++){
							this.assetCategories[i].provenanceTemplatePath = environment.awsTemplatePath + "/" + this.assetCategories[i].provenanceTemplatePath
					}
					this.totalRecord = response.data.totalCount;
					this.dataSource.data = this.assetCategories;
				}
			}))
	}
	
	goBack() {
		this.location.back();
	}

	selecttransTypeName(event){	
		this.transactionTypeName = event;
		this.getAssetCategories(this.recordPerPage, this.currentPage);
	}
	selecttransTypeCode(event){	
		this.transactionTypeCode = event;
		this.getAssetCategories(this.recordPerPage, this.currentPage);
	}
	selectmoduleCode(event){	
		this.moduleCode = event;
		this.getAssetCategories(this.recordPerPage, this.currentPage);
	}
	selectmoduleName(event){	
		this.moduleName = event;
		this.getAssetCategories(this.recordPerPage, this.currentPage);
	}
	selectorgName(event){	
		this.organizationName = event;
		this.getAssetCategories(this.recordPerPage, this.currentPage);
	}
	selectcategory(event){	
		this.category = event;
		this.getAssetCategories(this.recordPerPage, this.currentPage);
	}
	selectsubcategory(event){	
		this.subcategory = event;
		this.getAssetCategories(this.recordPerPage, this.currentPage);
	}
	selectassetCategory(event){	
		this.assetCategory = event;
		this.getAssetCategories(this.recordPerPage, this.currentPage);
	}
	selectassetCategoryDescription(event){	
		this.assetCategoryDescription = event;
		this.getAssetCategories(this.recordPerPage, this.currentPage);
	}
	selectprovenanceTemplatePath(event){	
		this.provenanceTemplatePath = event;
		this.getAssetCategories(this.recordPerPage, this.currentPage);
	}

	onChangedPage(pageData: PageEvent) {
		this.currentPage = pageData.pageIndex + 1;
		this.recordPerPage = pageData.pageSize;
		this.getAssetCategories(this.recordPerPage, this.currentPage);
	}	
}