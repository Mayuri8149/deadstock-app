import { HttpParams } from '@angular/common/http';
import { Component, NgModule, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { sortArrayOfObjects } from 'src/sortArrayOfObjects';
import { ApiService } from '../services/api.service';
import { SnackbarService } from '../services/snackbar.service';
import { YearDatePickerComponent } from '../trans-type-list/dynamic-add-trans-integrated/year-date-picker/year-date-picker.component';

// @NgModule({
//   imports: [ BrowserModule ],
//   declarations: [ YearDatePickerComponent]
// })

@Component({
  selector: 'app-epr-dashboard',
  templateUrl: './epr-dashboard.component.html',
  styleUrls: ['./epr-dashboard.component.css']
})
export class EprDashboardComponent implements OnInit, OnDestroy {
  showTargetOrder_Tbl:any;
  showDeliveryOrder_Tbl:any;
  showInputAsset_Tbl:any;
  @ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

	displayeColumnsTargetOrder = [
		'customerName',
    'lineno',
		'assetCategory',
    'assetName',
    'targetQty',
    'achievedQty',
    'balQty',
		'state',
		'targetOrder',
		'year',
    'action',
	];
  displayeColumnsTargetOrderDetails = [
		'certNo',
		'customerName',
		'state',
    'targetOrder',
    'assetCategory',
		'deliveryDt',
    'deliveryQty',
    'action'
	];
  displayeColumnsDeliveryOrder = [
		'customerName',
		'state',
		'month',
    'targetOrder',
		'plasticCategory',
    'deliveryDate',
    'action'
	];

  displayeColumnsShipOrder = [
		'customerName',
		'dateShip',
		'shipOrder',
    'lineno',
		'assetCategory',
    'assetName',
    'qty'
	];
   url: string; 
  private subscriptions: Subscription[] = [];
  loggedInUser: any;
  organizationId: any;
  assetCategoryList =[];
  stateList =[];
  monthValue: any;
  partnerList = [];
  searchFrm: FormGroup;
  ordersList =[];
  ordersListLimited =[];
  orderID: any;
  readonlyOrderId: string;
  orderItemLineList = [];
  dataSource =[];
  asstCatDetails: any;
  componyNameDetails: any;
  stateDetails: any;
  assetsListLimited =[];
  certFlag: boolean =false;
  inputAssetArr:any = [];
  inputAssetDetails = [];
  customerID: any;
  stateID: any;
  assetCategoryID: any;
  countFrm: FormGroup;
  countAssetCategoryValue = 0;
  shipDetails =[];
  showShipOrder_Tbl: boolean=false;
  eprOrderID: any;
  orderArr = [];
  constructor(private apiService: ApiService,
              private _formBuilder: FormBuilder,
              public snackbarService: SnackbarService,
              public router: Router) {
     };

  ngOnInit(): void {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
    this.organizationId = this.loggedInUser.reference.organizationId;

    this.searchFrm = this._formBuilder.group({
      partners: [''],
      state: [''],
      purchaseOrder:[''],
      readonlyOrderId:[''],
      assetCategory: [''],
    });
    
    this.getAssetCategoriesByTransType();
    this.getState();
    this.getPartners();
    this.getOrdersByTransType();
};

async onSelPartnerID(event) { 
  this.customerID =event
  if(this.customerID!==undefined){
    this.getOrdersByOrderID();
  }
}
async onSelState(event) { 
  this.stateID= event
  if(this.stateID!==undefined){
    this.getOrdersByOrderID();
  }
}

  receivedYear(monthValue) {
      if(this.orderID!=undefined){
        this.monthValue = monthValue;
      }else{
        this.snackbarService.openSuccessBar('Please select Targert OrderID first!', "Transaction");
      }
  }

  getPartners() {
    this.url = "/partner";
    var params = new HttpParams();
    
    params = params.append('userId', this.organizationId);
    params = params.append('startIndex', '0');
    params = params.append('limit', '2000');
    params = params.append('allFields', "true");
    this.subscriptions.push(this.apiService.getAsset(this.url, params)
      .subscribe((response) => {
        if (response.success == true) {
          let partnerList = [];
          let partnerArray = response.data.result;
          for (var i = 0; i < partnerArray.length; i++) {
            if (partnerArray[i].status == 'approved') { 
             partnerList.push(partnerArray[i]);
            }
          }
          this.partnerList = partnerList;
        }
      }))
  }
  getAssetCategoriesByTransType() {
    this.url = "/assetCategory";
    var params = new HttpParams();
    params = params.append('startIndex', "0");
    params = params.append('limit', "2000");
    params = params.append('organizationId', this.organizationId);
    this.subscriptions.push(this.apiService.getAsset(this.url, params)
      .subscribe((response: any) => {
        if (response.data && response.data.result) {
          const assetCatList = [];
          const assetCatArray = response.data.result;
          for (var i = 0; i < assetCatArray.length; i++) {
            if(assetCatArray[i].assetCategory!=undefined){
              assetCatList.push(assetCatArray[i]);
            }            
          }
         this.assetCategoryList = assetCatList; 
        }        
      }));
  }

  getState() {
    this.url = "/state/get_states";
    var params = new HttpParams();
    params = params.append('organizationId', this.organizationId);
    this.subscriptions.push(this.apiService.getAsset(this.url, params)
      .subscribe((response: any) => {
        if (response.data) {
          this.stateList=response.data;
        }        
      }));
  }

  showTbl_targetDetails(ele){
    this.showTargetOrder_Tbl=true;
    this.asstCatDetails=ele.assetCategoryName
    this.componyNameDetails=ele.companyName
    this.stateDetails=ele.state
    this.assetsListLimited = [];
    this.getCertDataByOrderId();
  }

  showTbl_DeliveryOrder(event){
    this.inputAssetArr = event.inputAsset;
    this.inputAssetDetails  =[];
    this.getInputAssetDataByEntityAsset();
    this.showDeliveryOrder_Tbl=true;
    this.showInputAsset_Tbl=false;
  }

  previewCertFile(certFileName){
    this.certFlag=true;
    const filePath = environment.awsEprCertPath+certFileName;
    window.open(filePath, "_blank");	
  }  

  showTbl_inputAsset(){
    this.showInputAsset_Tbl=true;
  }
  
  getOrdersByTransType() {
    var params = new HttpParams();    
    this.url = "/eprOrder/getEprOrdersByStatus";   
    params = params.append('startIndex', "0");
    params = params.append('limit', "2000");
    params = params.append('organizationId', this.organizationId);
    params = params.append('allFields', "true");
    params = params.append('epr', "true");
    params = params.append('transRole', "Digital");
    params = params.append('eprReceive', "false");
    params = params.append('eprConsume', "false");
    
    this.subscriptions.push(this.apiService.getAsset(this.url, params)
      .subscribe((response: any) => {
        if (response.success && response.data.totalCount>0) {
          if (response.data && response.data.result) {
            const ordersList = response.data.result;
            let SuggestArr = [];            
            ordersList.forEach(function (value,index) {
              let addOrderList = {
                orderId: value?._id?.eprOrderId,
              };
              SuggestArr.push(addOrderList);
            });

            this.ordersListLimited = SuggestArr;
          }
        }
      }))
  }

  getOrdersByOrderID() {
    var params = new HttpParams();    
    this.url = "/eprOrder/getEprOrdersByStatus";   
    params = params.append('startIndex', "0");
    params = params.append('limit', "2000");
    params = params.append('organizationId', this.organizationId);
    params = params.append('allFields', "true");
    params = params.append('epr', "true");
    params = params.append('transRole', "Digital");
    params = params.append('eprReceive', "false");
    params = params.append('eprConsume', "false");
    if(this.orderID!=undefined){
        params = params.append('eprOrderId', this.orderID);  
        if(this.customerID!=undefined){
          params = params.append('refEntity', this.customerID);
        }
        if(this.stateID!=undefined){
          params = params.append('state', this.stateID);
        }
        if(this.monthValue!=undefined){
          params = params.append('month', this.monthValue);
        }
        this.subscriptions.push(this.apiService.getAsset(this.url, params)
          .subscribe((response: any) => {
            if (response.success && response.data.totalCount>0) {
              if (response.data && response.data.result) {
                this.ordersList = response.data.result;
                let orderItemsArr= [];
                
                this.ordersList.forEach(function (value,index) {
                  let orderItem=[]
                  value.eprOrderDetails.forEach(function (val,ind) {
                    let orderItmObj={
                      targetDate:value._id?.created_on,
                      companyName:value._id?.refEntityDetails?.companyName,
                      line_number:val.orderEprItems?.epr_line_number,
                      assetCategoryName:val.orderEprItems?.assetcat_details[0]?.assetCategory,
                      order_item:val.orderEprItems?.epr_order_item,
                      order_quantity:val.orderEprItems?.epr_order_quantity,
                      eprRefRemainedQuantity:val?.orderEprItems.epr_quantity_data[0]?.eprRefRemainedQuantity,
                      eprRefStepQuantity:val?.orderEprItems.epr_quantity_data[0]?.eprRefStepQuantity,
                      order_uom:val.orderEprItems?.epr_order_uom,
                      ordered_assetId:val.orderEprItems?.epr_ordered_assetId,
                      entity_asset:val.orderEprItems?.epr_entity_asset,
                      _id:val.orderEprItems?._id,
                      asset_category:val.orderEprItems?.epr_asset_category,
                      state:val.orderEprItems?.state,
                    }
                    orderItem[ind]=orderItmObj
                  });
                  orderItem = sortArrayOfObjects(orderItem, "line_number", "ascending")
                  orderItemsArr=orderItem;
                });

                this.dataSource=orderItemsArr;
              }
            }
          }))
      }else{
        this.snackbarService.openSuccessBar('Please select Targert OrderID first!', "Transaction");
      }
  }

  getCertDataByOrderId() {
    var params = new HttpParams();    
    this.url = "/eprAsset/getEprAssetsByTargetOrder";   
    params = params.append('organizationId', this.organizationId);
    params = params.append('limit', '1000');
    params = params.append('eprOrderId', this.orderID);
    params = params.append('eprAssetType', 'Certificate');
   
    this.subscriptions.push(this.apiService.getAsset(this.url, params)
      .subscribe((response: any) => {
        if (response.success && response.data.totalCount>0) {
          let assetsSuggestArr=[];
          const assetArray = response.data.result;         
              assetArray.forEach(function (value) {
                let allKeys = [];
                let allValues = [];
                let fields = [];
                let linkArr = [];
                if(value?.asset?.outside_docs){
                  allKeys = Object.keys(JSON.parse(JSON.stringify(value?.asset?.outside_docs)));
                  allValues = Object.values(JSON.parse(JSON.stringify(value?.asset?.outside_docs)));
                
                  for (var iLoop = 0; iLoop < allKeys.length; iLoop++) {
                      const textSplit=allValues[iLoop].split('.')[1]  
                      if(textSplit!=undefined){
                        linkArr[iLoop]=true
                      }else{
                        linkArr[iLoop]=false
                      }
                      fields[allKeys[iLoop]] = allValues[iLoop];
                  }
                }
                
                const addassetsList = {
                  certNo:value.asset?.certificateNumber,
                  assetId:value.eprAssetId,
                  assetCategoryName:value?.assetcategory?.assetCategory,
                  assetName: value?.asset?.eprAssetName,
                  assetQuantity:value.balancedQuantity,
                  inputAsset:value?.asset?.inputEprAssets,
                  deliveryDate:value?.asset?.created_on,
                  deliveredQty:value?.asset?.eprAssetQuantity,
                  outside_docs:allKeys,
                  allValues:fields,
                  linkArr:linkArr
                };
                assetsSuggestArr.push(addassetsList);  
                
              });
              this.assetsListLimited=assetsSuggestArr;
        }else{
          this.snackbarService.openSuccessBar('Certificate not found!', "Certificate");
        }
      }))
  }

  getInputAssetDataByEntityAsset() {
    var params = new HttpParams();    
    this.url = "/eprAsset/getEprAssetsByEntityAsset";
   
    params = params.append('organizationId', this.organizationId);
    params = params.append('limit', '1000');
    const assetPayloadData = this.inputAssetArr.map(z => (z.inputEprAssetId))
    params = params.append('eprEntityAsset', assetPayloadData);
    params = params.append('assetType', 'Receive Asset');
   
    this.subscriptions.push(this.apiService.getAsset(this.url, params)
      .subscribe((response: any) => {
       if (response.success) {
          let assetsSuggestArr=[];
          const assetArray = response.data;
              assetArray.forEach(function (value) {
                const addassetsList = {
                  assetName: value?.asset?.eprAssetName,
                  assetQuantity:value.balancedQuantity,
                  partnerName:value?.refcorporates_details[0]?.companyName?value?.refcorporates_details[0]?.companyName:value?.reforganizations_details[0]?.name,
                  state:value?.state,
                  eprOrderId:value?.eprOrderId,
                  assetCategoryName:value?.assetcategory?.assetCategory,
                  deliveryDate:value?.created_on,
                  deliveredQty:value?.eprAssetQuantity,
                  eprRefOrder:value?.eprRefOrder
                };
                assetsSuggestArr.push(addassetsList);   
              });

              this.inputAssetDetails=assetsSuggestArr;
       }else{
        this.snackbarService.openSuccessBar('Input Credits not found!', "Credit");
      }
      }))
  }

  onSelPurchaseOrder(orderData) {
    this.orderID=orderData;
    if(this.orderID!==undefined){
      this.getOrdersByOrderID();
    }
  }

  openPreview(data){
    const envPath="https://tracechain.s3.ap-south-1.amazonaws.com/transactions/outside-media/";
    const filePath = envPath+data;
    window.open(filePath, "_blank");	
  }
  
  clearPurchaseOrderFields(){
    this.readonlyOrderId='';
    this.assetsListLimited = [];
    this.inputAssetDetails = [];
    this.dataSource = [];
    this.shipDetails = [];
  }

  viewTransaction(row) {
		this.eprOrderID = row.eprOrderId;
    this.getOrderDataByEprOrderId();		
	}

  getOrderDataByEprOrderId() {
    this.shipDetails = [];
    this.showShipOrder_Tbl=true;    
    var params = new HttpParams();    
    this.url = "/order";   
    params = params.append('startIndex', "0");
    params = params.append('limit', "2000");
    params = params.append('organizationId', this.organizationId);
    params = params.append('allFields', "true");
    params = params.append('isRefEntity', 'true');

    if(this.eprOrderID!=undefined){
      params = params.append('refOrder', this.eprOrderID);
        this.subscriptions.push(this.apiService.getAsset(this.url, params)
          .subscribe((response: any) => {
            if (response.success && response.data.totalCount>0) {
              if (response.data && response.data.result) {
                this.ordersList = response.data.result;
                  this.router.navigate(['/transactions/transactions/transactionView/' + this.ordersList[0]?._id?.id]);
              }
            }
          }))
      }else{
        this.snackbarService.openSuccessBar('Ship order not found!', "Credit");
      }
  }

  viewTransactionDetails(element) {
    this.shipDetails = [];
    this.showShipOrder_Tbl=true;    
    var params = new HttpParams();    
    this.url = "/order";   
    params = params.append('startIndex', "0");
    params = params.append('limit', "2000");
    params = params.append('organizationId', this.organizationId);
    params = params.append('allFields', "true");
    params = params.append('isRefEntity', 'true');
    if(element.eprRefOrder!=undefined){
      params = params.append('refOrder', element.eprRefOrder);
        this.subscriptions.push(this.apiService.getAsset(this.url, params)
          .subscribe((response: any) => {
            if (response.success && response.data.totalCount>0) {
              if (response.data && response.data.result) {
                this.ordersList = response.data.result;
                let orderItemsArr= [];                
                this.ordersList.forEach(function (value,index) {
                  let orderItem=[]
                  value.orderDetails.forEach(function (val,ind) {
                    let orderItmObj={
                      orderId:value._id?.orderId,
                      targetDate:value._id?.created_on,
                      companyName:value._id?.refEntityDetails?.companyName?value._id?.refEntityDetails?.companyName:value._id?.refEntityDetails?.name,
                      line_number:val.orderItems?.line_number,
                      assetCategoryName:val.orderItems?.assetcat_details[0]?.assetCategory,
                      order_item:val.orderItems?.order_item,
                      order_quantity:val.orderItems?.order_quantity,
                      order_uom:val.orderItems?.order_uom,
                      ordered_assetId:val.orderItems?.ordered_assetId,
                      entity_asset:val.orderItems?.entity_asset,
                      _id:val.orderItems?._id,
                      asset_category:val.orderItems?.asset_category,
                      state:val.orderItems?.state,
                    }
                    orderItem[ind]=orderItmObj
                  });
                  orderItem = sortArrayOfObjects(orderItem, "line_number", "ascending")
                  orderItemsArr=orderItem;
                });
                this.shipDetails=orderItemsArr;
              }
            }
          }))
      }else{
        this.snackbarService.openSuccessBar('Ship order not found!', "Credit");
      }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
  
}