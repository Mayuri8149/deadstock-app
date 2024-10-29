import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { faHandPointLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subscription } from 'rxjs';
import { DatetimeConvertor } from 'src/app/services/datetime-convertor';
import { ApiService } from '../../services/api.service';

@Component({
	selector: 'app-view-asset-transcation',
	templateUrl: './view-asset-transcation.component.html',
	styleUrls: ['./view-asset-transcation.component.css']
})
export class ViewAssetTranscationComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	@ViewChild('template', { static: false }) private template;
	faHandPointLeft = faHandPointLeft;
	faSearch = faSearch;
	user;
	role;
	entity;
	url;
	totalAsset = 0;
	assetPerPage:any= 5;
	pageSizeOptions = [5,10,20,50,100];
	currentPage:any = 1;
	assetData: any[] = [];
	newAsset: any[];
	newAssetData: any[];
	asset: any;
	inputAsset: any;
	inputEprAsset: any;
	transactionEntity;
	assetTypes;
	provenance;
	ModalFlag: boolean = false;
	modalRef: BsModalRef;
	displayedColumn=[];
	displayedModalColumns=[]
	dataSource = new MatTableDataSource<any>();
	dataSources = new MatTableDataSource<any>();
	selection = new SelectionModel<any>(true, []);
	id;
	assetsId;
	refAsset;
	transactionid;
	assetId=null;
	assetName=null;
	moduleName=null;
	moduleId=null;
	transactionTypeName=null;
	transactionTypeCode=null;
	assetLocation=null;
	transcationid=null;
	assetCategory=null;
	eprAssetId=null;
	eprAssetName=null;
	eprAssetCategory=null;
	eprTransactionid=null;
	branchLocation=null;
	filter:any={transactionTypeName:'',transactionTypeCode:'',moduleId:'',moduleName:'',assetId:'',assetName:'',assetLocation:'',transcationid:'',assetCategory:'',eprAssetId:'',eprAssetName:'',eprAssetCategory:'',eprTransactionid:'',branchLocation:'',searchKey:''}
	assetTransactionId=null;
	assetcategory=null;
	sortkey:any={assetId:''}
	startIndex;
	inputAssetField: any;
	userrefId:any;
	userIdArr = []
	eprAssetSummary;
	curPage:any=1;
    orgPerPage:any=5;
	constructor(private location: Location,
		private apiService: ApiService,
		public router: Router,
		private modalService: BsModalService,
		public route: ActivatedRoute,		
		public datetimeConvertor: DatetimeConvertor) { }

	ngOnInit() {
		this.user = JSON.parse(sessionStorage.getItem('user'));		
		this.role = this.user.reference.role;
		this.entity = this.user.reference.entity;
		this.transactionEntity = this.route.snapshot.params['transactionEntity'];
		this.transactionid = this.route.snapshot.params['transactionid'];
		this.eprAssetSummary = this.route.snapshot.params['eprAssetSummary'];
		this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['recordPerPage'];
		this.getAssetData(this.assetPerPage,this.currentPage);
		if(this.eprAssetSummary==1){
			this.displayedColumn = ['entityId','branchLocation','transcationEntity','moduleId','moduleName','transtypeCode','transactionTypeName','eprAssetId','eprAssetCategory','eprAssetName','eprTransactionid','location','eprAssetType','partnerEntity','partnerBranch','eprAssetQuantity','eprAssetUom','inputEprAssets','eprRefOrder','eprAssetMfgDate','eprAssetExpiryDate','created_on'];
			this.displayedModalColumns= ['inputEprAssetId','inputeprAssetCategory','inputeprAssetName','inputEprAssetQuantity','entity_epr_asset']
		}else{
			this.displayedColumn = ['entityId','branchLocation','transcationEntity','moduleId','moduleName','transtypeCode','transactionTypeName','assetId','assetCategory','assetName','transcationid','location','assetType','partnerEntity','partnerBranch','assetQuantity','assetUom','inputAsset','refOrder','effectiveDate','expiryDate','created_on'];
			this.displayedModalColumns= ['inputAssetId','inputAssetCategory','inputAssetName','inputAssetQuantity','entity_asset']
		}
	}

	getAssetData(assetPerPage,currentPage){
		if(this.user?.corpData){
			this.id = this.user.corpData.code
		}else{
			this.id = this.user.organizationCode
		}
		if(this.eprAssetSummary==1){
			this.url = '/eprAsset/';
		}else{
			this.url = '/asset/';
		}
		var params = new HttpParams();
		this.startIndex = ((currentPage * assetPerPage) - assetPerPage)
		params = params.append('startIndex', this.startIndex);
		params = params.append('limit', assetPerPage);
		params = params.append('transactionEntity', this.id);
		params = params.append('transactionid', this.transactionid);
		if(this.filter.moduleName){
			params = params.append('moduleName', this.filter.moduleName);
		}
		if(this.filter.moduleId){
			params = params.append('moduleId', this.filter.moduleId);
		}
		if(this.filter.transactionTypeName){
			params = params.append('transactionTypeName', this.filter.transactionTypeName);
		}
		if(this.filter.transactionTypeCode){
			params = params.append('transactionTypeCode', this.filter.transactionTypeCode);
		}
		if(this.filter.assetId){
			params = params.append('assetId', this.filter.assetId);
		}
		if(this.filter.assetCategory){
			params = params.append('assetCategory', this.filter.assetCategory);
		}
		if(this.filter.assetName){
			params = params.append('assetName', this.filter.assetName);
		}
		if(this.filter.assetLocation){
			params = params.append('assetLocation', this.filter.assetLocation);
		}
		if(this.filter.transcationid){
			params = params.append('assetTransactionId', this.filter.transcationid);
		}
		if(this.filter.eprAssetId){
			params = params.append('eprAssetId', this.filter.eprAssetId);
		}
		if(this.filter.eprAssetName){
			params = params.append('eprAssetName', this.filter.eprAssetName);
		}
		if(this.filter.eprTransactionid){
			params = params.append('eprTransactionId', this.filter.eprTransactionid);
		}
		if(this.filter.eprAssetCategory){
			params = params.append('eprAssetCategory', this.filter.eprAssetCategory);
		}
		if(this.filter.partnerBranch){
			params = params.append('partnerBranch', this.filter.partnerBranch);
		}
		if(this.filter.branchLocation){
			params = params.append('branchLocation', this.filter.branchLocation);
		}
		if(this.filter.searchKey){
			params = params.append('searchKey', this.filter.searchKey);
		}
		if(this.assetId){
			var sortAssetIdOrder = this.assetId.direction || '';
			var sortAssetIdKey = this.assetId.active || '';
			params = params.append('sortKey', sortAssetIdKey);
			params = params.append('sortOrder', sortAssetIdOrder);
		}
		this.subscriptions.push(this.apiService.getAsset(this.url, params)
			.subscribe((response: any) => {
				if(response.success == true) {
					this.asset = response.data.result;
					for (var i = 0; i < this.asset.length; i++) {
						if(response.data.result[i].transactionEntityType == "Organization"){
							this.asset[i].transactionEntityName = response.data.result[i].transactionEntityDetails.name
						}else if(response.data.result[i].transactionEntityType == "Partner"){
							this.asset[i].transactionEntityName = response.data.result[i].transactionEntityDetails.companyName
						}
						if(response.data.result[i].assetType == "Consume Asset" || response.data.result[i].assetType == "Receive Asset"){
							if(response.data.result[i].refEntityType == "Partner"){
								response.data.result[i].refEntityName = response.data.result[i].refEntityDetails.companyName
							}else if(response.data.result[i].refEntityType == "Organization"){
								response.data.result[i].refEntityName = response.data.result[i].refEntityDetails.name
							}
						}
						
						this.asset[i].effectiveDate = this.datetimeConvertor.convertDateTimeZone(this.asset[i].effectiveDate,"date");
						this.asset[i].expiryDate = this.datetimeConvertor.convertDateTimeZone(this.asset[i].expiryDate,"date");
						this.asset[i].created_on = this.datetimeConvertor.convertDateTimeZone(this.asset[i].created_on,"datetime");
						this.asset[i].eprAssetMfgDate = this.datetimeConvertor.convertDateTimeZone(this.asset[i].eprAssetMfgDate,"date");
						this.asset[i].eprAssetExpiryDate = this.datetimeConvertor.convertDateTimeZone(this.asset[i].eprAssetExpiryDate,"date");
						
						if(response.data.result[i]?.assetQuantity){
							this.asset[i].assetQuantity = response.data.result[i].assetQuantity.toFixed(response.data.result[i].uom?.decimal)
						}else if(response.data.result[i]?.eprAssetQuantity){
							this.asset[i].eprAssetQuantity = response.data.result[i].eprAssetQuantity.toFixed(response.data.result[i].uom?.decimal)
						}
					}  
					this.totalAsset = response.data.totalCount;
					this.dataSource.data = this.asset;
				}
			}));
	}
	getAsset(event){
		this.router.navigate(['/assetSummary/assetSummaryDetails/' + event.transactionid]);
	}
	getInputAsset(element){
		this.ModalFlag = true;
		this.newAssetData = [];
		this.inputAssetField = element.inputAssets;
			this.url = "/asset/" + element._id;
			var params = new HttpParams();
			this.subscriptions.push(this.apiService.getAsset(this.url, params)
				.subscribe((response) => {
					if(response.success == true) {
						this.inputAsset = response.data.inputAssets;
						for (var i = 0; i < this.inputAsset.length; i++) {
							this.inputAsset[i].inputAssetQuantity = response.data.inputAssets[i].inputAssetQuantity.toFixed(response.data.inputAssets[i].assetUom_details[0]?.decimal)
						}
						this.dataSources.data = this.inputAsset;
					}
				}))	

		this.modalRef = this.modalService.show(this.template, { class: 'modal-dialog-centered' });
	}
	geteprInputAsset(element){
		this.ModalFlag = true;
		this.newAssetData = [];
		this.inputAssetField = element.inputEprAssets;
		this.url = "/eprAsset/" + element._id;
			var params = new HttpParams();
			this.subscriptions.push(this.apiService.getAsset(this.url, params)
				.subscribe((response) => {
					if(response.success == true) {
						this.inputEprAsset = response.data.inputEprAssets;
						for (var i = 0; i < this.inputEprAsset.length; i++) {
							this.inputEprAsset[i].inputEprAssetQuantity = response.data.inputEprAssets[i].inputEprAssetQuantity.toFixed(response.data.inputEprAssets[i].assetUom_details[0]?.decimal)
						}
						this.dataSources.data = this.inputEprAsset;
					}
				}))	
		this.modalRef = this.modalService.show(this.template, { class: 'modal-dialog-centered' });
	}
	closedModal() {
		this.modalRef.hide();
	}
	onChangedAsset(pageData: PageEvent){
		this.currentPage = pageData.pageIndex + 1;
		this.assetPerPage = pageData.pageSize;
		this.getAssetData(this.assetPerPage,this.currentPage);	
	}
	clearFilters(){
		this.dataSource.filter = '';
		this.filter.assetId = '';
		this.filter.assetName = '';
		this.filter.transcationid = '';
		this.filter.assetLocation = '';
		this.filter.transactionTypeName = '';
		this.filter.transactionTypeCode = '';
		this.filter.moduleId = '';
		this.filter.moduleName = '';
		this.filter.eprAssetId='';
		this.filter.eprAssetName='';
		this.filter.eprAssetCategory='';
		this.filter.eprTransactionid='';
		this.filter.assetCategory='';
		this.filter.branchLocation='';
		this.getAssetData(this.assetPerPage,this.currentPage);	
	 }
	sortData(event){
		this.assetId = event;
		this.getAssetData(this.assetPerPage,this.currentPage);	
	}
	searchField(event,value){
		value=event
		this.getAssetData(this.assetPerPage,this.currentPage);	
	}
	clearFilter(event,value){
		value =''
		this.getAssetData(this.assetPerPage,this.currentPage);	
	}
	onSearch(event){
		this.filter.searchKey = event
		this.getAssetData(this.assetPerPage,this.currentPage);	
	}
  	goBack() {
		if(this.eprAssetSummary==1){
			this.router.navigate(['/assetsummary/eprAssetSummaryDetail'],{ queryParams: { eprAssetSummary:this.eprAssetSummary,currentPage: this.curPage, recordPerPage: this.orgPerPage}});
		}else{
			this.router.navigate(['/assetsummary/assetSummaryDetail'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
		}
	};
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}