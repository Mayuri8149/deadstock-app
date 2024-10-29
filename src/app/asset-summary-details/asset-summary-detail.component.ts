import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { faHandPointLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { DatetimeConvertor } from 'src/app/services/datetime-convertor';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { environment } from 'src/environments/environment';
import { ApiService } from '../services/api.service';
import { UploadService } from '../services/upload.service';
import { ContractService } from '../services/wallet-connect.service'

@Component({
	selector: 'app-asset-detail-summary',
	templateUrl: './asset-summary-detail.component.html',
	styleUrls: ['./asset-summary-detail.component.css']
})
export class AssetSummaryDetailComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	@ViewChild(MatSort) sort: MatSort;
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
	asset: any;
	assetId=null;
	assetName=null;
	assetTransactionId=null;
	assetLocation=null;
	transcationid=null;
	assetCategory=null;
	eprAssetId=null;
	eprAssetName=null;
	eprAssetCategory=null;
	eprTransactionid=null;
	filter:any={assetTransactionId:'',assetLocation:'',assetName:'',assetId:'',assetCategory:'',eprAssetId:'',eprAssetName:'',eprAssetCategory:'',eprTransactionid:'',searchKey:''}
	sortkey:any={assetId:''}
	curPage= 1;
	orgPerPage=5;
	pageIndex=0;
	pageSize=5
	displayedColumns = [
		'action',
		'entityId',
		'assetId',
		'assetName',
		'assetCategory',
		'transcationid',
		'assetLocation',
		'producedQuantity',
		'receivedQuantity',
		'consumedQuantity',
		'rejectedQuantity',
		'balancedQuantity',
		'assetUom',
		'assetMfgDate',
		'assetExpiryDate',
		];

	dataSource = new MatTableDataSource<any>();
	selection = new SelectionModel<any>(true, []);
	hrefVar: string;
	transactionDetails:any={};
	companyName;
	id;
	organizationId;
	startIndex
	combineInputAssetIDArr = [];
	seData = {
		organizationId: '',
		assetObjectId:''
		};
	eprAssetSummary;
	trxId;
	href;
	metamaskFlag: any;
	signtrx: Promise<void>;
	imgURL: string;
	assetDetailsforNFT: {};
	constructor(private location: Location,
		private apiService: ApiService,
		public router: Router,
		public route: ActivatedRoute,
		public snackbarService: SnackbarService,
		private uploadService: UploadService,		
		public datetimeConvertor: DatetimeConvertor,
		public contractService:ContractService) { }

	ngOnInit() {
		this.user = JSON.parse(sessionStorage.getItem('user'));	
		this.transactionDetails = JSON.parse(sessionStorage.getItem('transcationType'));
		this.subscriptions.push(this.route.queryParams.subscribe((params) => {
			this.eprAssetSummary = params['eprAssetSummary'];
		}))
		this.href = this.router.url;
		var splithref= this.href.split("/");
		var getHref= splithref[2].split("?");
		if(getHref[0]=='eprAssetSummaryDetail'){
			this.eprAssetSummary = 1
		}else{
			this.eprAssetSummary = 2
		}
		if(this.eprAssetSummary==undefined){
			this.eprAssetSummary = 2
		}
		if ('corpData' in this.user) {
			this.companyName = this.user.corpData.companyName;
			this.organizationId = this.user.corpData.organizationId;
			this.id = this.user.corpData.code
		  } else {
			this.companyName = this.user.organizationName;
			this.organizationId = this.user.reference.organizationId;
			this.id = this.user.organizationCode
		  }
		this.role = this.user.reference.role;
		this.entity = this.user.reference.entity;
		this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['recordPerPage'];
		if(this.curPage && this.orgPerPage){
			this.pageIndex = this.curPage - 1
			this.assetPerPage = this.orgPerPage
			this.getAssetData(this.orgPerPage, this.curPage);
		}else{
			this.getAssetData(this.assetPerPage,this.currentPage);
		}
		this.dataSource.sort = this.sort;
		if(this.eprAssetSummary==1){
			this.displayedColumns = ['action','entityId','eprAssetId','eprAssetName','eprAssetCategory','eprTransactionid','assetLocation','producedQuantity','receivedQuantity','consumedQuantity','rejectedQuantity','balancedQuantity','eprAssetUom','eprAssetMfgDate','eprAssetExpiryDate'];
		}else{
			this.displayedColumns = ['action','entityId','assetId','assetName','assetCategory','transcationid','assetLocation','producedQuantity','receivedQuantity','consumedQuantity','rejectedQuantity','balancedQuantity','assetUom','assetMfgDate','assetExpiryDate'];
		}
	}

	getAssetData(assetPerPage,currentPage){
		if(this.eprAssetSummary==1){
			this.url = "/eprAsset/get_epr_entityAssets";
		}else{
			this.url = "/asset/get_entity_assets";
		}
		var params = new HttpParams();
		this.startIndex = ((currentPage * assetPerPage) - assetPerPage)
		params = params.append('startIndex', this.startIndex);
		params = params.append('limit', assetPerPage);
		params = params.append('organizationId', this.organizationId);
		params = params.append('transactionEntity', this.id);
		params = params.append('getAllBalancedQuantity', "true");
		params = params.append('allFields', "true");
		params = params.append('nftFlag', 'true');
		if(this.filter.assetId){
			params = params.append('assetId', this.filter.assetId);
		}
		if(this.filter.assetName){
			params = params.append('assetName', this.filter.assetName);
		}
		if(this.filter.assetLocation){
			params = params.append('assetLocation', this.filter.assetLocation);
		}
		if(this.filter.assetTransactionId){
			params = params.append('assetTransactionId', this.filter.assetTransactionId);
		}
		if(this.filter.assetCategory){
			params = params.append('assetCategory', this.filter.assetCategory);
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
					this.asset = response.data.result
					for (var i = 0; i < this.asset.length; i++) {	
						// this code added to convert date time as per user timezone set in profile
						this.asset[i].assetMfgDate = this.datetimeConvertor.convertDateTimeZone(this.asset[i].assetMfgDate,"date");
						this.asset[i].assetExpiryDate = this.datetimeConvertor.convertDateTimeZone(this.asset[i].assetExpiryDate,"date");
					
						this.asset[i].producedQuantity = response.data.result[i].producedQuantity.toFixed(response.data.result[i].uom?.decimal)
						this.asset[i].receivedQuantity = response.data.result[i].receivedQuantity.toFixed(response.data.result[i].uom?.decimal)
						this.asset[i].consumedQuantity = response.data.result[i].consumedQuantity.toFixed(response.data.result[i].uom?.decimal)
						this.asset[i].balancedQuantity = response.data.result[i].balancedQuantity.toFixed(response.data.result[i].uom?.decimal)
						this.asset[i].rejectedQuantity = response.data.result[i].rejectedQuantity.toFixed(response.data.result[i].uom?.decimal)
					}
					this.totalAsset = response.data.totalCount;
					this.dataSource.data = this.asset;
				}
			}));
	}
	
	async openHTML(event){
		if(event?.assetcategory?.provenanceTemplatePath!=undefined){
			const filePath = environment.awsTemplatePath+"provenance/"+event?.assetcategory?.provenanceTemplatePath+"/"+event.transactionid+".html";
			const bucketName= environment.Bucket;
			const fileName= "provenance/"+event?.assetcategory?.provenanceTemplatePath+"/"+event.transactionid+".html"
			const returnRes= await this.uploadService.fileExist(bucketName,fileName)
			 if(returnRes==true){
				window.open(filePath, "_blank");	
			 }else{
				this.snackbarService.openSuccessBar("Layout is not created yet.Please create it first", "Provenance");
			 }
		}else{
			const msgStr="Template layout is not exists for this asset category.Please upload first From S3!";
			this.snackbarService.openSuccessBar(msgStr, "Provenance");
		}
	}	

	getSelectedUserAccess() {
		this.url = "/useraccess/getPartnersByUserId";
		var params = new HttpParams();
		params = params.append('partnerId', this.user._id);
		params = params.append('pagesize', this.currentPage);
		params = params.append('page', this.assetPerPage);
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response) => {
				if (response.success == true) {
					this.transactionDetails = response.data.partners.partners[0]
					this.getAssetData(this.assetPerPage,this.currentPage);
				}
			}));
	}
	getAsset(event){
		if(this.eprAssetSummary==1){
			if(this.curPage && this.orgPerPage){
				this.router.navigate(['/assetsummary/eprAssetSummaryDetail/eprViewAssetTranscation/' + event.eprTransactionid + "/" + event.asset.transactionEntity + "/" + event.asset.provenance + "/" + this.eprAssetSummary],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage }} );
			}else{
				this.router.navigate(['/assetsummary/eprAssetSummaryDetail/eprViewAssetTranscation/' + event.eprTransactionid + "/" + event.asset.transactionEntity + "/" + event.asset.provenance + "/" + this.eprAssetSummary],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.assetPerPage }});
			}
		}else{
			if(this.curPage && this.orgPerPage){
				this.router.navigate(['/assetsummary/assetSummaryDetail/ViewAssetTranscation/' + event.transactionid + "/" + event.asset.transactionEntity + "/" + event.asset.provenance + "/" + this.eprAssetSummary],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage }} );
			}else{
				this.router.navigate(['/assetsummary/assetSummaryDetail/ViewAssetTranscation/' + event.transactionid + "/" + event.asset.transactionEntity + "/" + event.asset.provenance + "/" + this.eprAssetSummary],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.assetPerPage }});
			}
		}
	}
	async printHtml(event){
		this.url = "/order/provenance" ;
        this.seData.organizationId = this.user.reference.organizationId;
		this.seData.assetObjectId = event.asset._id;
		console.log("transactionTypeNFT",event?.transactionTypeNFT?.nft);
		console.log("event:",event);
		
		// return false;
        this.subscriptions.push(this.apiService.post_transactions(this.url, this.seData)
		.subscribe(async (response: any) => {
            if(response.success == true) {        
            
 				const filePath = response.data.Url;
                const bucketName= environment.Bucket;
				const fileName= "provenance/"+event?.assetcategory?.provenanceTemplatePath+"/"+event.transactionid+".html"
				const returnRes= await this.uploadService.fileExist(bucketName,fileName)
				
				if(returnRes==true){
					// window.open(filePath, "_blank");	
					this.snackbarService.openSuccessBar("Layout is created Successfully. Click on view icon to review it.", "Provenance");
				}else{
					this.snackbarService.openSuccessBar("Layout is not created yet.Please create it first", "Provenance");
				}

				if(event.asset.upload_file != undefined){
					console.log("upload_file:"+environment.awsImgPath+'/transactions/static-media/'+event.asset.upload_file);
					this.imgURL= environment.awsImgPath+'/transactions/static-media/'+event.asset.upload_file;		
				}else{
					console.log("undefined");
					this.imgURL="";
				}

				// this.contractService.updateAsset(event.transactionid, "Created", null);
				if(event?.transactionTypeNFT?.nft==true){
					this.metamaskFlag=await this.contractService.loadWeb3(response.data,event.transactionid,this.imgURL);   
					console.log("flag:::",this.metamaskFlag);  
					if(this.metamaskFlag != undefined){
						this.getAssetData(this.assetPerPage,this.currentPage); 
					}
				}
			}
		},
		(error) => {           
			const msgStr="Template layout is not exists for this asset category.Please upload first From S3!";
			this.snackbarService.openSuccessBar(msgStr, "Provenance");
		}));
	}
	
	viewNFT(event){
		console.log("event nft:", event);
		console.log("nft id:", event.asset.nftDetails.id);

		this.assetDetailsforNFT={
			assetName:event?.asset?.assetName,
			assetId:event?.asset?.assetId,
			assetImage:event?.asset?.upload_file,
			assetQuantity:event?.asset?.assetQuantity,
			provenanceURL: environment.awsTemplatePath+"provenance/"+event?.assetcategory?.provenanceTemplatePath+"/"+event.transactionid+".html"
		}
		// this.router.navigate(['/viewnft/' + event.asset.nftDetails.id, { state:{nftdetails: JSON.stringify(this.assetDetailsforNFT)}}]);		
		this.router.navigate(
					['/viewnft/'+ event.asset.nftDetails.id],
					{ state: { navSettings: JSON.stringify(this.assetDetailsforNFT) } });
	}

	clearFilters(){
		this.dataSource.filter = '';
		this.filter.assetId = '';
		this.filter.assetName = '';
		this.filter.assetTransactionId = '';
		this.filter.assetLocation = '';
		this.filter.eprAssetId='';
		this.filter.eprAssetName='';
		this.filter.eprAssetCategory='';
		this.filter.eprTransactionid='';
		this.filter.assetCategory='';
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
	onChangedAsset(pageData: PageEvent){
		if(this.curPage && this.orgPerPage){
			this.curPage = pageData.pageIndex + 1
			this.orgPerPage = pageData.pageSize;
			this.getAssetData(this.orgPerPage, this.curPage);
		}else{
			this.currentPage = pageData.pageIndex + 1;
			this.assetPerPage = pageData.pageSize;
			this.getAssetData(this.assetPerPage,this.currentPage);
		}
	}
  	goBack() {
		this.location.back();
	};
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}