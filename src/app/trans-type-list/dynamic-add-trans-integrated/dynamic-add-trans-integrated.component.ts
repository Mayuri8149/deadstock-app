import { DatePipe, Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { faEye, faHandPointLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Moment } from 'moment';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { retry, take } from 'rxjs/operators'; //added take directly
import { Transaction } from 'src/app/modals/transaction';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { DatetimeConvertor } from 'src/app/services/datetime-convertor';
import { ErrorDialogService } from 'src/app/services/error-dialog.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UploadService } from 'src/app/services/upload.service';
import { environment } from 'src/environments/environment';
import { sortArrayOfObjects } from 'src/sortArrayOfObjects';
import { LoaderService } from '../../services/loader.service';
import { ValidateNumber } from '../../validators/number.validator';
import { CompressImageService } from './compress-image.service';
import { PurchaseOrderModalComponent } from './purchase-order-modal/purchase-order-modal.component';
import { TransferNftService } from '../../services/transfer-nft.service'
import { PutonsaleNftService } from '../../services/putonsale_nft.service';

import { ContractService } from '../../services/wallet-connect.service'

export class AppDateAdapter extends NativeDateAdapter {

  format(date: Date, displayFormat: Object): string {
    if (displayFormat == "input") {
      let day = date.getDay();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      return this._to2digit(month) + '/' + year;
    } else {
      return date.toDateString();
    }
  }

  private _to2digit(n: number) {
    return ('00' + n).slice(-2);
  } 
}

export const APP_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
}

@Component({
  selector: 'app-dynamic-add-trans-integrated',
  templateUrl: './dynamic-add-trans-integrated.component.html',
  styleUrls: ['./dynamic-add-trans-integrated.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class DynamicAddTransIntegratedComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  farmProducePost = {};
  dataSource = [];
  dataSourceAsset = [];
  planModel: any;
  searchTransactionForm: FormGroup;
  faEye = faEye;
  faTrash=faTrash;
  faHandPointLeft = faHandPointLeft;
  transactionidFieldForm: FormGroup;
  pdfTransactionForm: FormGroup;
  PDFchecked = true;
  fileData: File = null;
  fileCertData: File = null;
  staticFileTemplate: any;
  uploadedpdf: '';
  uploadedCertificate: '';
  viewpdf: any;
  pdffield: any;
  transactionAutoNumber: any;
  transactionAutoNumberLabel: any;
  url;
  urls;
  urlUserAccess;
  transcationTypeList = [];
  ifCertificate: any;
  ifFromToEntity: any;
  isAsset: any;
  isInputAsset: any;
  isProvenance: any;
  isOrder: any;
  isPartner: any;
  onChangeOrder: any;
  refEntity: any;
  expiryPeriod: any;
  expiryDate: any;
  assetLocation: any;
  dateDuration;
  transTypes = {
    inputAsset: '',
    fromToEntity: '',
    transactionTypeName: '',
    orderReference: '',
    module: {
      name: '',
    },
    organization: {
      name: '',
    },
  };
  geolocation={
    address: '',
    neighborhood: '',
    formattedAddress: '',
    city: '',
    state: '',
    postalcode: '',
    latitude: '',
    longitude: '',
    country: ''
  } 
  locObj = {
    longitude: '',
    latitude: ''
  };
  transType;
  transaction: Transaction;
  transactionid;
  fields = [];
  shipOrderClosedFlag: boolean = false;
  corpFlag: boolean = false;
  formBuilder: any;
  datatype: any;
  loggedInUser: any;
  transactionType: any;
  name;
  tabIndex: Number = 0;
  moduleId: any;
  transtypeId: any;
  ids: any;
  formValues: any;
  pdfupload: any;
  filename: any;
  filenameCert: any;
  prescriptiontype: any;
  prescriptionflag: any;
  isRefOrder: any;
  isRefAsset: any;
  isRefOrderLable: any;
  ordersList = [];
  ordersListLimited = [];
  assetsList = [];
  assetsListLimited = [];
  departmentsList = [];
  autoValue: any;
  prefix: any;
  length: any;
  startingnumber: any;
  lastnumber: any;
  autofieldvalue: any;
  autoFlag: any;
  companyName;
  organizationId;
  organizationCode;
  organizationName;
  corporateId;
  hideFeild = true
  transactiontypeId;
  orderId: any;
  assetId: any;
  readonlyAsset;
  orderTransactionID: any;
  assetTransactionID: any;
  assetType: any;
  orderReference: any;
  assetCategoryList: any[];
  neBlob: any;
  entityName;  
  branchName: any;
  entityID;
  branchCode;
  assetName: any;
  transactionflag: any;
  transactionTypeNameflag: any;
  inputAssetflag: boolean = false;
  fromToEntityflag: any;
  fromToEntity: any;
  inputAsset: any;
  verifiable: boolean = false;
  checkedoutsideorg: boolean;
  locationlist: any[];
  addressLine: any;
  adminDistrict: any;
  countryRegion: any;
  locality: any;
  postalCode: any;
  locationbranch: any;
  location_lat: any;
  location_long: any;
  uploadedCertificateBuffer: any;
  show: boolean;
  tableLength: number;
  orderDetailsData = [];
  partnerList =[];
  datasTypeDrp = "Branch/Partner list";
  isShownAddRecord:boolean=false;
  term: string;
  addRowDataPass = {};
  transactionEntity: any;
  transactionEntityBranch: any;
  loggedInUserID: any;
  referenceEntityBranch: any = "";
  transTypeFieldData: any;
  selectedFiles: FileList;
  purchaseOrderPost = {};
  readonlyOrderId;
  refEntityName: any;
  quantity: any;
  transactionEntityName: any;
  uom;
  dataPosts:any; 
  orderTypeStr: string;
  refTransactionEntity: any;
  brCode: any;
  orderItemLineList: any[];
  lineListArr = [];
  readonlyLine;
  orderID: any;
  refOrderTransactionid: any;
  sessionTransType: any;
  imageArr = [];
  errMsg = [];
  imageError = [];
  fields1 = [];
  lineLevelArr = [];
  urlSrc = [];
  isPdf: boolean = false;
  isImage: boolean = false;
  orderData;
  @ViewChild('myModel',{static: false}) myModel: ModalDirective;
  showImg =[];
  lineArr = [];
  previewViewSrc:any = [];
  tableSrc: any;
  indField: any;
  fileUploaded = [];
  resultSrc = [];
  fileNative = [];
  filenameArr =[];
  fileUploadArr = [];
  fileUploadNameArr = [];
  displayedColumnsArr = {action:'Actions', id:'Sr.No.', assetCategoryName:'Asset category',orderId:'Order ID',lineNo:'Line No.',assetId:'Asset ID',assetName:'Asset Name',enteredquantity:'Asset Quantity', entereduom:'Asset UOM',acceptedQuantity:'Accepted Quantity',rejectedQuantity:'Rejected Quantity',comment:'Comment',state:'State'};
  displayedColumnsAssetArr = {action:'Actions', id:'Sr.No.',effectiveDate:'Effective Date',expiryPeriod:'Expiry Duration',period:'Duration Unit',expiryDate:'Expiry Date', assetCategoryName:'Asset category',orderId:'Order ID',lineNo:'Line No.',assetId:'Asset ID',assetName:'Asset Name',enteredquantity:'Asset Quantity', entereduom:'Asset UOM',acceptedQuantity:'Accepted Quantity',rejectedQuantity:'Rejected Quantity',comment:'Comment',state:'State'};
  enableBranchPatnerDrp: boolean = true;
  enableAutoAssetLocation: boolean = false;
  enableAddMore: boolean = false;
  disableOptionLine = [];
  enableOrderField: boolean = true;
  enableLineNo: boolean =true;
  withoutRefship: boolean = false;
  purchaseSaleOrderFlag: boolean =false;
  enableAssetID: boolean = true;
  selectedstaticFiles: FileList;
  imageErrorStatic: string = '';
  showImgStatic: boolean;
  fileUploadedStatic: any;
  isImageStatic: boolean;
  isPdfStatic: boolean;
  resultSrcStatic: any;
  urlSrcStatic: any;
  modaleFlag: boolean;
  fileStaticName: string;
  fileValueStatic: File;
  autoAssetLocationlat: any;
  autoAssetLocationlang: any;
  autolocation: any;
  assetLocationAuto: string;
  refEntityTypePartner: any;
  orgList: any;
  orgId:string = "";
  isShowBrachDrp: boolean = false;
  assetWithoutReference: any;
  isShownAddRecordWithTable: boolean =false;
  found:any;
  foundBranch:any;
  orderItemDetails: any[];
  orderItemDetailsArr  = [];
  referredAssetFlag: boolean = false;
  referredOrderFlag: boolean = false;
  orderDetailsArray = [];
  orderDetailsAllData: { referredAsset: boolean; referredOrder: boolean; orderItems: any[]; }[];
  refAssetCheckFlag:boolean =false;
  uomLists =[];
  assetCatNameLists = [];
  enableAssetNameDrp: boolean = true;
  selectCategoryID: any;
  autoDetectLocation:false;
  disableOptionAssetName = [];
  assetCategoryListArr: any[];
  addRowDataWithoutReference: { lineNo: any; orderId: any; transactionEntity: any; organizationId: any; refOrderTransactionid: any; objectID: any; assetName: any; enteredquantity: any; entereduom: any; assetCategory: any;id: any};
  expiry: boolean = false;
  refEntityTypeList : string[] = ['Partner', 'Branch'];
  selectedrefOrder:any;
  partnerData: any;
  branchData: any;
  refTransType: any;
  refModule: any;
  orderWithoutReference: boolean = false;
  selectedCertFiles: FileList;
  fileCertName: string;
  fileValueCert: any;
  showCert: boolean;
  certError: string = '';
  fileUploadedCert: any;
  resultSrcCert: any;
  urlSrcCert: any;
  isPdfCert: boolean;
  isImageCert: boolean;
  modaleFlagCert: boolean = false;
  modaleFlagDyn: boolean =false;
  searchorderID=null;
  searchInputAssetID=null;
 filter: any={searchorderID: ''};
 filterInputAsset: any={searchInputAssetID: ''};
	branch: any;
  transRoleFlag: any;
  eprFlag: boolean= false;
  eprConsumeFlag: boolean= false;
  eprReceiveFlag: boolean= false;
  orderDetailsEprAllData: { referredEprAsset: boolean; referredEprOrder: boolean; orderEprItems: any[]; }[];
  targetOrder: any;
  targetAssetName: any;
  targetQty: number = 0;
  targetUom: any;
  targetAssetCategory: any;
  targetState: any;
  assetLocationAutoSuggest: any='';
  orderTypeName: any;
  targetAssetCategoryID: any;
  stateList=[]
  chkAddRecordItems: boolean = false;
  chkLocation_lbl: boolean = false;
  provenanceFlag: boolean = false;
  Quantity_decimal:any;
  isEnteredQuantity: boolean = true;
  yearValue: any;
  monthValue: any;
  eprorderID: any;
  chkLocationChosen_flag: boolean = false;
  isReadOnlyLineNo: boolean;
  isReadOnlyAssetIDMain: boolean;
  entereQuantity;
  old_entereQuantity;
  assetDetailsData = [];
  assetFinalArr = [];
  chkAddAssetItems: boolean =false;
  isShownAddRecordWithTableAsset: boolean = false;
  isShownAddRecordAsset: boolean =false;
  linenumberFlag: boolean =  true;
  transferNFT: Promise<boolean>;
  orderItemList: any;
  nftFlag: any;
  constructor(private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    public apiService: ApiService,
    public errorDialogService: ErrorDialogService,
    public confirmDialogService: ConfirmDialogService,
    public router: Router,
    private location: Location,
    public snackbarService: SnackbarService,
    private dialog: MatDialog,
    private modalService: BsModalService,
    private uploadService: UploadService,
    private sanitizer: DomSanitizer,
    private compressImage: CompressImageService,    
    public loaderService: LoaderService,
    public validateNumber: ValidateNumber,
    public datetimeConvertor: DatetimeConvertor,
    public transferNftService:TransferNftService,
    public putonsaleNftService:PutonsaleNftService,
    public contractService:ContractService) {      
  } 

  object: {};
   dataSourceOption = [
    { value: DataDynamicTable }
  ];

  displayedColumns = [];
  displayedColumnsAsset = [];
  columnOptions = [];
  datasControl = new FormControl();
  columnsControl = new FormControl();
  create: any;
  selected: any;
  selectedrefEntityType: any;
  selectedrefBranch:any
  selectedrefOrderLineNumber:any;
  order_Id:any;
  transactionDetailsId;
  selectedassetCategory;
  @ViewChild('table') table: MatTable<any>;
  @ViewChild('tableAsset') tableAsset: MatTable<any>;
  @ViewChild(PurchaseOrderModalComponent) PurchaseOrderModalComponent; 

  ngOnInit() {
    this.checkedoutsideorg = true;
    this.planModel = { start_time: new Date() };
    this.ifCertificate, this.ifFromToEntity, this.isAsset, this.isOrder, this.isPartner, this.isRefOrder, this.isInputAsset, this.isProvenance, this.isRefAsset, this.onChangeOrder = false;
    this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
    this.transactionType = JSON.parse(sessionStorage.getItem('transcationType'));
    this.transRoleFlag = this.transactionType?.transactionType?.transRole;
    this.eprFlag = this.transactionType?.transactionType?.epr;
    this.eprReceiveFlag = this.transactionType?.transactionType?.eprReceive;
    this.eprConsumeFlag = this.transactionType?.transactionType?.eprConsume;
    this.create = this.route.snapshot.params['create']
    this.transactionDetailsId = this.route.snapshot.params['transactionDetailsId']
    if(this.create!=undefined){
      this.transactionType.transactionType = this.transactionType
      this.transactionType.organizationId = this.transactionType.useraccesses.organizationId
    }
    if(this.transactionType.transactionType.fromToEntity=="self" && this.transactionType.transactionType.isExpiry == false){
      this.enableAddMore = false;
    }
    if((this.transactionType.transactionType.refModule==undefined || this.transactionType.transactionType.refModule=='' || this.transactionType.transactionType.refModule==null) && (this.transactionType.transactionType.refTransType==undefined || this.transactionType.transactionType.refTransType=='' || this.transactionType.transactionType.refTransType==null)){
      this.orderWithoutReference=true;
    }
    this.provenanceFlag = this.transactionType?.transactionType?.provenance    
    this.assetWithoutReference = this.transactionType.transactionType.assetWithoutReference;
    this.sessionTransType = this.transactionType.transactionType;
    this.searchTransactionForm = this._formBuilder.group({
    organizationId: [{ value: '', disabled: true }],
    moduleId: [{ value: '', disabled: true }],
    transactionTypeId: [{ value: '', disabled: true }],
    branch: [{ value: '', disabled: true }],
    readonlyAssetId: [{ value: '', disabled: true }],
    fromToEntity: new FormControl(''),
    partners: [''],
    assetCategory: [''],
    shipOrderClosed: [''],
    effectiveDate: [''],
    expiryPeriod: [''],
    expiryDate: [''],
    period: [''],
    refAsset: [''],
    assetName: [''],
    assetLocation: [''],
    enteredquantity: [''],
    entereduom: [''],
    purchaseOrder: [''],
    readonlyOrderId : [{value: '', disabled: true}],
    readonlyLine: [{value: '', disabled: true}],
    lineNo:[''],
    refBranch:[''],
    state:[''],
    month:[''],
    assetCategoryName:[''],
    trans_from_address:['']
  });

  this.pdfTransactionForm = this._formBuilder.group({
    uploadedpdf: [''],
    uploadedCertificate: [''],    
    autoDetectLocation:[''],
    assetLocationAuto:[''],
    uploadFile:['']
  })

  this.transactionidFieldForm = this._formBuilder.group({});
    this.transtypeId = this.route.snapshot.params['transtypeId'];
    this.getTransTypeByModuleId(this.transtypeId);
    if(this.transactionType.transactionType.transaction=='Asset'){
      this.onChangeDatasAsset();
      this.onChangeDatas();
    }else{
      this.onChangeDatas();
    }
    
    this.datasControl.setValue(this.dataSourceOption[0].value);
    this.dataSource=[];
    this.dataSourceAsset=[];
    if(this.transactionType?.transactionType?.transaction == 'Asset' && this.transactionType.transactionType.inputAsset == false){ 
      this.isShownAddRecord = true
      this.isShownAddRecordWithTable = true
    }

    if(this.transactionType?.transactionType?.transaction != 'Asset'){
      this.isShownAddRecordAsset=true
      this.isShownAddRecordWithTableAsset = true
    }
    
    this.organizationCode = this.loggedInUser.organizationCode;
    if ('corpData' in this.loggedInUser) {
      this.companyName = this.loggedInUser.corpData.companyName;
      this.transactionEntity = this.loggedInUser.corpData.code;
      this.organizationName = this.loggedInUser.corpData.companyName;
      this.corporateId = this.loggedInUser.corpData._id;
      this.branch = this.loggedInUser.corpData.location;
      this.corpFlag = true;     
      this.loggedInUserID = this.loggedInUser.corpData._id;
      this.organizationId = this.loggedInUser.corpData.organizationId;
    } else {
      this.companyName = this.loggedInUser.organizationName;
      this.transactionEntity = this.loggedInUser.organizationCode;
      this.organizationName = this.loggedInUser.organizationName;
      this.assetLocation = this.loggedInUser.departmentLocation;
      this.branch = this.loggedInUser.departmentLocation;
      this.corpFlag = false;
      this.transactionEntityBranch=this.loggedInUser.branchCode
      this.loggedInUserID = this.loggedInUser._id;
      this.organizationId = this.loggedInUser.reference.organizationId;
    }
    this.getAssetCategoriesByTransType();
    if(this.create!=undefined){
      this.getPartners();
      this.getTransTypeData();
    }
    if((this.orderWithoutReference && this.sessionTransType.assetType == 'Consume Asset') || (this.sessionTransType.inputAsset && this.transRoleFlag != 'Digital')){
      this.getAssetsByTransType();
      this.enableAssetID = false;
    }
    
    if(!this.orderWithoutReference){
      this.getByRefTransType();
    }
    
    this.getState();
    if(this.sessionTransType.orderReference == 'Internal'){
      this.getDepartmentByOrganization(false);
    }else if(this.sessionTransType.orderReference == 'Partner'){
      this.getPartners();
    }
  }   
  receivedYear(p) {
  this.yearValue = p;
  this.getAssetsByTransType();
}

receivedMonth(monthValue) {
  this.monthValue = monthValue;
  this.getAssetsByTransType();
}
  onChangeDatas() {
    this.subscriptions.push(this.datasControl.valueChanges.subscribe((data: any) => {
      if(data[0]!= undefined){
        this.displayedColumns = Object.keys(data[0]);
      }else{
          if(this.transRoleFlag=='Digital' && this.eprConsumeFlag){
            this.displayedColumnsArr.orderId="Target Order";
            this.displayedColumns = ['action', 'id','assetCategoryName','orderId','lineNo','assetId','assetName','enteredquantity', 'entereduom', 'state'];
            if(this.lineArr!=undefined){
              const keysValue = Object.keys(this.lineArr);
              this.displayedColumns = this.displayedColumns.concat(keysValue);
            } 
          }else if(this.transRoleFlag=='Digital' && this.eprReceiveFlag){
            this.displayedColumnsArr.orderId="Ship Order";
            this.displayedColumns = ['action', 'id','assetCategoryName','orderId','lineNo','assetId','assetName','enteredquantity', 'entereduom','acceptedQuantity','rejectedQuantity','comment','state'];
            if(this.lineArr!=undefined){
              const keysValue = Object.keys(this.lineArr);
              this.displayedColumns = this.displayedColumns.concat(keysValue);
            } 
          }
          else if(this.transactionType.transactionType.assetType == 'Receive Asset'){
            this.displayedColumnsArr.orderId="Ship Order";
            this.displayedColumns = ['action', 'id','assetCategoryName','orderId','lineNo','assetId','assetName','enteredquantity', 'entereduom','acceptedQuantity','rejectedQuantity','comment'];
            if(this.lineArr!=undefined){
              const keysValue = Object.keys(this.lineArr);
              this.displayedColumns = this.displayedColumns.concat(keysValue); 
            }
          }else if(!this.orderWithoutReference && this.transactionType.transactionType.assetType == 'Consume Asset'){
            if(!this.orderWithoutReference && this.transactionType.transactionType.assetType == 'Consume Asset'){
              if(this.sessionTransType.refModule!='SAL'){
                this.displayedColumnsArr.orderId="Purchase Order";
              }else{
                this.displayedColumnsArr.orderId="Sales Order";
              }
              
              if(this.assetWithoutReference){
                this.displayedColumns = ['action', 'id','assetCategoryName','orderId','lineNo','assetName','enteredquantity', 'entereduom'];
              }else{
                this.displayedColumns = ['action', 'id','assetCategoryName','orderId','lineNo','assetId','assetName','enteredquantity', 'entereduom'];
              }
            }else{
              this.displayedColumnsArr.orderId="Purchase Order";
              this.displayedColumns = ['action', 'id','orderId','lineNo','assetId','assetName','enteredquantity', 'entereduom'];
            }
            if(this.lineArr!=undefined){
              const keysValue = Object.keys(this.lineArr);
              this.displayedColumns = this.displayedColumns.concat(keysValue);
            } 
        }
        else if(this.orderWithoutReference && this.transactionType.transactionType.assetType == 'Consume Asset'){
          this.displayedColumns = ['action', 'id','lineNo','assetId','assetCategoryName','assetName','enteredquantity', 'entereduom'];
          if(this.lineArr!=undefined){
            const keysValue = Object.keys(this.lineArr);
            this.displayedColumns = this.displayedColumns.concat(keysValue);
          }
        } else if(!this.orderWithoutReference && this.transactionType.transactionType.transaction == 'Order'){
          this.displayedColumns = ['action', 'id','orderId','lineNo','assetCategoryName','assetName','enteredquantity', 'entereduom'];
          if(this.lineArr!=undefined){
            const keysValue = Object.keys(this.lineArr);
            this.displayedColumns = this.displayedColumns.concat(keysValue);
          }
        }
        else{
          if(this.transRoleFlag=='Digital' && this.orderWithoutReference){
            this.displayedColumns = ['action', 'id','assetCategoryName','assetName','enteredquantity', 'entereduom', 'state'];
          }else{
            this.displayedColumns = ['action', 'id','assetCategoryName','assetName','enteredquantity', 'entereduom'];
          }
          const keysValue = Object.values(this.lineArr);
          this.displayedColumns = this.displayedColumns.concat(keysValue); 
        }
      }
      this.dataSource = data;
    }));
  }

  onChangeDatasAsset() {
    this.subscriptions.push(this.datasControl.valueChanges.subscribe((data: any) => {
      if(data[0]!= undefined){
        this.displayedColumnsAsset = Object.keys(data[0]);
      }else if(this.transactionType.transactionType.isExpiry == true){
        this.displayedColumnsAsset = ['action', 'id','effectiveDate','expiryPeriod','period','expiryDate','assetCategoryName','assetName','enteredquantity', 'entereduom'];
      }else{
        this.displayedColumnsAsset = ['action', 'id','assetCategoryName','assetName','enteredquantity', 'entereduom'];
      }
      this.dataSourceAsset = data;
    }));
  }
  getTransTypeData(){
    this.url = "/order/" + this.create;
			var params = new HttpParams();
			
      this.subscriptions.push(this.apiService.getAsset(this.url, params)
			.subscribe((response: any) => {
					if (response.success == true) {
						this.orderData = response.data._id;
            if(this.orderData.refEntityType=="Organization"){
              this.selected = "Branch";
            }else{
              this.selected = this.orderData.refEntityType;
            }
            this.selectedrefEntityType = this.orderData.transactionEntity;
            if(this.orderData?.branch){
              this.selectedrefBranch = this.orderData.branch.code
            }
            this.onSelPartnerID(this.selectedrefEntityType)
            if(this.orderData?.branch){
              this.order_Id = this.orderData.orderId + "|" + this.orderData.transactionEntity + "." + this.orderData.branch.code + "." + this.orderData.orderId;
            }else{
              this.order_Id = this.orderData.orderId + "|" + this.orderData.transactionEntity + "." +  this.orderData.orderId;
            }
					}		
				}));
  }
  getOrderDetails(rowData,flagAction){
    if(this.assetWithoutReference){
      this.referredAssetFlag = false;
      this.referredOrderFlag = true;
    }else if(this.orderWithoutReference && this.assetType == 'Consume Asset'){
      this.referredAssetFlag = true;
      this.referredOrderFlag = false;
    }else if(this.orderWithoutReference){
      this.referredAssetFlag = false;
      this.referredOrderFlag = false;
    }else{
      this.referredAssetFlag = true;
      this.referredOrderFlag = true;
    }
    if(rowData.id!='' && flagAction=="Delete"){
      this.orderDetailsData.splice(rowData.id-1,1);
      if(this.inputAssetflag){
        this.orderDetailsArray.splice(rowData.id-1,1);
      }else{
        if(this.eprFlag && this.transRoleFlag=='Digital'){
          this.orderDetailsEprAllData.splice(rowData.id-1,1);
        }else{
          this.orderDetailsAllData.splice(rowData.id-1,1);
        }
      }
    }else{
      this.dataSource.forEach((value,ind) => {
        const tableKeys = Object.keys(value);
        if(this.orderWithoutReference){
          value.lineNo = value.id
        }
          
        let lineLevelField:any;
        if(value.lineList!=undefined){
          const keysValue = Object.keys(value.lineList);
          lineLevelField = {};
          tableKeys.forEach( async(eleTbl, indexTbl) => { 
            keysValue.map( async(ele, index) => { 
              if(eleTbl==ele){
                if(value.lineList[ele]!=undefined){
                  lineLevelField[ele]=value.lineList[ele];
                }else{
                  lineLevelField[ele]='';
                }
              }
            });
          });
        if(this.inputAssetflag){
          let inputAssData;
          if(this.eprFlag && this.transRoleFlag=='Digital'){
            inputAssData = {
              inputEprAssetId:value.entity_asset,
              inputEprAssetQuantity:value.enteredquantity,
              inputEprAssetUom:value.entereduom,
              entity_epr_asset:value.entity_asset,
              line_level_fields:lineLevelField!=undefined?lineLevelField:""
            }
          }else{
            inputAssData = {
              inputAssetId:value.entity_asset,
              inputAssetQuantity:value.enteredquantity,
              inputAssetUom:value.entereduom,
              entity_asset:value.entity_asset,
              line_level_fields:lineLevelField!=undefined?lineLevelField:""
            }
          }
         
          this.orderDetailsArray[ind] = inputAssData;
        }
          let ordData;
          if(this.eprFlag && this.transRoleFlag=='Digital'){
            ordData = {
              epr_order_item:value.assetName,
              epr_order_quantity:value.enteredquantity,
              epr_order_uom:value.entereduom,
              epr_asset_category:value.assetCategory!=undefined?value.assetCategory:"",
              epr_ordered_assetId:value.assetId!=undefined?value.assetId:"",
              epr_entity_asset:value.entity_asset!=undefined?value.entity_asset:"",
              epr_ref_order:value.orderId!=undefined?value.orderId:"",
              epr_ref_order_transactionid:value.refOrderTransactionid!=undefined?value.refOrderTransactionid:"",
              epr_accepted_quantity:value.acceptedQuantity!=undefined?value.acceptedQuantity:"",
              objectID:value.objectID!=undefined?value.objectID:"",
              epr_rejected_quantity:value.rejectedQuantity!=undefined?value.rejectedQuantity:"",
              epr_rejection_note:value.comment!=undefined?value.comment:"",
              epr_line_level_fields:lineLevelField!=undefined?lineLevelField:"",
              epr_line_number:value.lineNo!=undefined?value.lineNo:"",
              state:value.state!=undefined?value.state:"",
            }
          }else{
            ordData = {
              order_item:value.assetName,
              order_quantity:value.enteredquantity,
              order_uom:value.entereduom,
              asset_category:value.assetCategory!=undefined?value.assetCategory:"",
              ordered_assetId:value.assetId!=undefined?value.assetId:"",
              entity_asset:value.entity_asset!=undefined?value.entity_asset:"",
              ref_order:value.orderId!=undefined?value.orderId:"",
              ref_order_transactionid:value.refOrderTransactionid!=undefined?value.refOrderTransactionid:"",
              accepted_quantity:value.acceptedQuantity!=undefined?value.acceptedQuantity:"",
              objectID:value.objectID!=undefined?value.objectID:"",
              rejected_quantity:value.rejectedQuantity!=undefined?value.rejectedQuantity:"",
              rejection_note:value.comment!=undefined?value.comment:"",
              state:value.state!=undefined?value.state:"",
              line_level_fields:lineLevelField!=undefined?lineLevelField:"",
              line_number:value.lineNo!=undefined?value.lineNo:"",
              nft_status:value.nft_status!=undefined?value.nft_status:"",
            }
          }
          this.orderDetailsData[ind] = ordData;
          if(value.orderItemDetails != undefined && this.refAssetCheckFlag){
            this.referredAssetFlag = false;
            this.referredOrderFlag = true;
          }      
        }        
      });
    } 
    if(this.inputAssetflag == false && this.orderDetailsData.length>0){
      if(this.eprFlag && this.transRoleFlag=='Digital'){
        this.orderDetailsEprAllData = [
          {
            "referredEprAsset":this.referredAssetFlag,
            "referredEprOrder": this.referredOrderFlag, 
            "orderEprItems": this.orderDetailsData
          }
        ];
      }else{
        this.orderDetailsAllData = [
          {
            "referredAsset":this.referredAssetFlag,
            "referredOrder": this.referredOrderFlag, 
            "orderItems": this.orderDetailsData
          }
        ];
      }      
    }
  }

  getAssetDetails(rowData,flagAction){
    if(rowData.id!='' && flagAction=="Delete"){
      this.assetDetailsData.splice(rowData.id-1,1);
    }else{
      this.dataSourceAsset.forEach((value,ind) => {  
            const assetData = {
              assetCategory:value?.assetCategory!=undefined?value?.assetCategory:"",
              assetName:value?.assetName,
              assetQuantity:value?.enteredquantity,
              assetUom:value?.entereduom,
              expiryDate:value?.expiryDate,
              effectiveDate:value?.effectiveDate
            }
          this.assetDetailsData[ind] = assetData;
      });
    }
  }
addRowData(row_obj){
  //This flag added for readonly lineno
  this.isReadOnlyAssetIDMain = false
  this.isReadOnlyLineNo = false
  this.targetQty = this.targetQty+parseInt(row_obj.enteredquantity);
  this.targetUom = row_obj.entereduom;
  this.searchTransactionForm.patchValue({lineNo:''});
  this.fileUploadArr=  this.fileUploadArr.concat(row_obj.fileNative);
  this.fileUploadNameArr=this.fileUploadNameArr.concat(row_obj.filenameArr); 
   if(row_obj.lineList!=undefined){
      const keysValue = Object.keys(row_obj.lineList);
      const valueObj = Object.values(row_obj.lineList);
      if(this.dataSource.length==0){
        for(var i = 0; i < keysValue.length; i++) {
          this.displayedColumnsArr[keysValue[i]]=keysValue[i];
        }
        this.displayedColumns = this.displayedColumns.concat(keysValue);  
      }
      this.displayedColumns = this.displayedColumns.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
      })
      
      let previewArr =[];
      for(var j = 0; j < this.displayedColumns.length; j++) {
        for(var i = 0; i < keysValue.length; i++) {
            if(valueObj[i]!=undefined){
              row_obj[keysValue[i]] = valueObj[i];
            }
              if(row_obj.srcarr[i]!=undefined && keysValue[i]==this.displayedColumns[j]){
                previewArr[keysValue[i]]=row_obj.srcarr[i];
                this.previewViewSrc[(row_obj.id-1)]=previewArr;
              }
        }
      }
    }else{
      this.previewViewSrc = []
    }
   if(this.lineListArr!=undefined){
    this.lineListArr.forEach( (item, index) => {
      if(index === row_obj.lineNo-1 && row_obj.orderId == this.orderID){
        this.disableOptionLine[this.orderID+"_"+index] = true;
      } 
    });
   }
   this.linenumberFlag = true
   for(i=0;i<this.lineListArr.length;i++){
    var searchOrderId = row_obj.orderId+"_"+i
    var n = Object.keys(this.disableOptionLine).includes(searchOrderId)
    if(n==true){
    }else{
      this.linenumberFlag = false
    }
   }
   if(this.linenumberFlag == true){
    this.orderID = "";
    this.enableLineNo  = true;
    this.searchTransactionForm.patchValue({purchaseOrder:''});
   }
  if(row_obj.assetCategory){
    row_obj.assetCategoryName =this.assetCategoryListArr[row_obj.assetCategory].assetCategory;
  }
   if(this.inputAssetflag || (this.orderWithoutReference && this.assetType == 'Consume Asset')){
      this.disableOptionAssetName[row_obj.assetId] = true;
   }
    this.dataSource.push(row_obj);
    this.getOrderDetails('','');
    this.table.renderRows();    
    
    if(this.transRoleFlag!="Digital" && this.transactionflag!='Asset' && this.create==undefined){
      this.readonlyOrderId='';
    }
      this.filterInputAsset.term='';
      this.readonlyLine='';
    if(this.create==undefined){
      this.readonlyOrderId='';
     // this.refOrderTransactionid = "";
    }
   
    if(this.orderWithoutReference){
      this.enableAddMore = false;
    }else{
      this.enableAddMore = true;
    }
}
updateRowData(row_obj){
  this.fileUploadArr=  this.fileUploadArr.concat(row_obj.fileNative);
  this.fileUploadNameArr=this.fileUploadNameArr.concat(row_obj.filenameArr);   
  let keysValue = Object.keys(row_obj.lineList);
  let valueObj = Object.values(row_obj.lineList);
  this.dataSource = this.dataSource.filter((value,key)=>{
    if(value.id == row_obj.id){
      value.assetName = row_obj.assetName;
      value.enteredquantity = row_obj.enteredquantity;
      value.entereduom = row_obj.entereduom;
      if(row_obj.acceptedQuantity){
        value.acceptedQuantity = row_obj.acceptedQuantity;
      }
      if(row_obj.rejectedQuantity){
        value.rejectedQuantity = row_obj.rejectedQuantity;
      }
      if(row_obj.comment){
        value.comment = row_obj.comment;
      }
      if(row_obj.assetCategory){
        value.assetCategory = row_obj.assetCategory;
      }
      if(row_obj.assetCategoryName){
        value.assetCategoryName = row_obj.assetCategoryName;
      }
      if(row_obj.state){
        value.state = row_obj.state;
      }
      if(row_obj.lineList){
        value.lineList = row_obj.lineList;
      }
      if(row_obj.srcarr){
        value.srcarr = row_obj.srcarr;
      }
      if(row_obj.fileNative){
        value.fileNative = row_obj.fileNative;
      }
        let previewArr = []
        for(var j = 0; j < this.displayedColumns.length; j++) {
          for(var i = 0; i < keysValue.length; i++) {
              value[keysValue[i]] = valueObj[i];
                if(value[keysValue[i]]!="" && row_obj.srcarr[i]!=undefined && keysValue[i]==this.displayedColumns[j]){
                  previewArr[keysValue[i]]=row_obj.srcarr[i];
                  this.previewViewSrc[key]=previewArr;
                  value.srcarr[i]=row_obj.srcarr[i];
                }else{
                  if(this.previewViewSrc[key]!=undefined && keysValue[i]==this.displayedColumns[j]){
                    delete this.previewViewSrc[key][keysValue[i]];
                  }                    
                }            
          }
        }
        
    }
    return true;
  });  
  this.getOrderDetails('',"");
}

deleteRowData(row_obj){
  this.previewViewSrc.splice((row_obj.id-1),1);
  this.dataSource = this.dataSource.filter((value,key)=>{
    this.lineListArr.forEach( (item, index) => {
      if(index === row_obj.lineNo-1 && row_obj.orderId == value.orderId){
        this.disableOptionLine[value.orderId+"_"+index] = false;
      } 
    });
    if(this.inputAssetflag || (this.orderWithoutReference && this.assetType == 'Consume Asset')){
      if(value.assetId==row_obj.assetId)
      this.disableOptionAssetName[value.assetId] = false;
    }
    return value.id != row_obj.id;
  });
  this.dataSource.forEach( (itm, ind) => {
    this.dataSource[ind].id =ind+1;    
  });    
  this.getOrderDetails(row_obj,"Delete");
}
 
  openDialog(action,obj) {
    obj.lineList = this.lineLevelArr;
    if(this.inputAssetflag==true){
      this.orderTypeStr = "Process Food";
      this.withoutRefship =false;
      this.purchaseSaleOrderFlag=false;
    }else if(this.orderWithoutReference && (this.assetType == 'Consume Asset' || this.eprConsumeFlag)){
      this.orderTypeStr = "Ship Order";
      this.withoutRefship =true;
      this.purchaseSaleOrderFlag=false;
    }else if(!this.orderWithoutReference && (this.assetType == 'Consume Asset' || this.eprConsumeFlag)) {
      this.orderTypeStr = "Ship Order";
      this.withoutRefship =false;
      this.purchaseSaleOrderFlag=false;
    }else if(this.assetType == 'Receive Asset' || this.eprReceiveFlag) {
      this.orderTypeStr = "Material Receipt";
      this.withoutRefship =false;
      this.purchaseSaleOrderFlag=false;
    }else if(this.orderWithoutReference){
      this.orderTypeStr = this.transactionTypeNameflag;
      this.purchaseSaleOrderFlag=true;
      this.withoutRefship =false;
    }else if(!this.orderWithoutReference){
        this.orderTypeStr = this.transactionTypeNameflag;
        this.purchaseSaleOrderFlag=false;
        this.withoutRefship =false;
        obj.independentRefOnlyOrder=true
    }else if(this.fromToEntityflag=="self"){
      this.orderTypeStr = "Sales";
      this.withoutRefship =false;
      this.purchaseSaleOrderFlag=false;
    }else{
      this.withoutRefship =false;
      this.purchaseSaleOrderFlag=false;
    }
    this.tableLength = this.dataSource.length+1;
    if(action=="Add"){
      obj.id=this.tableLength;
    }
    obj.action = action;
    obj.typeOrd = this.orderTypeStr;
    obj.withoutRefship = this.withoutRefship;
    obj.purchaseSaleOrderFlag = this.purchaseSaleOrderFlag;
    obj.assetWithoutReference =this.assetWithoutReference;
    let widthDialog;
    let heightDialog;
    widthDialog = '60%';
    heightDialog = 'auto';    
		const dialogRef = this.dialog.open( PurchaseOrderModalComponent, {
			width: widthDialog,
			height: heightDialog,
      data:obj,
			disableClose: true
		});
    
		dialogRef.afterClosed().subscribe(result => {
      
      console.log("this.nftFlag:",this.nftFlag);
      console.log("this.nft_status:",result.data.nft_status);
      console.log("popup result:",result);
      console.log("this.assetType:",this.assetType);
      
      if(result.event == 'Add'){
        if(this.nftFlag==true ){
          console.log("NFT true");
          if(this.assetType == 'Receive Asset' && (result.data.nft_status =="OnSale" || result.data.nft_status =="Sold")){
            console.log("Receive yes");
            this.addRowData(result.data);
          }else if(this.assetType == 'Consume Asset' && (result.data.nft_status =="Created" || result.data.nft_status =="Sold" || result.data.nft_status =="OnSale")){
            console.log("Consume yes");
            this.addRowData(result.data);
          }else if(this.assetType == 'Produce Asset'){
            this.addRowData(result.data);
          }else{
            console.log("Consume no");
            this.snackbarService.openSuccessBar('NFT is not created/on Sale so can not add record.', "NFT");
          }

        }else{
          this.addRowData(result.data);
        }
        
      }else if(result.event == 'Update'){
        // this.updateRowData(result.data);
        if(this.nftFlag==true ){
          console.log("NFT true");
          if(this.assetType == 'Receive Asset' && (result.data.nft_status =="OnSale" || result.data.nft_status =="Sold")){
            console.log("Receive yes");
            this.updateRowData(result.data);
          }else if(this.assetType == 'Consume Asset' && (result.data.nft_status =="Created" || result.data.nft_status =="Sold" || result.data.nft_status =="OnSale")){
            console.log("Consume yes");
            this.updateRowData(result.data);
          }else if(this.assetType == 'Produce Asset'){
            this.updateRowData(result.data);
          }else{
            console.log("Consume no");
            this.snackbarService.openSuccessBar('NFT is not created/on Sale so can not add record.', "NFT");
          }

        }else{
          this.updateRowData(result.data);
        }
      }else if(result.event == 'Delete'){
        this.deleteRowData(result.data);
      }
		});
	}


  openDialogAsset(action,obj) {
    this.orderTypeStr = "asset";
    if(action=="Add"){
      obj.id=this.dataSourceAsset.length+1;
    }
    obj.action = action;
    obj.typeOrd = "asset";
    obj.typeisExpiry = this.transactionType.transactionType.isExpiry;
    let widthDialog;
    let heightDialog;
    widthDialog = '60%';
    heightDialog = 'auto';    
		const dialogRef = this.dialog.open( PurchaseOrderModalComponent, {
			width: widthDialog,
			height: heightDialog,
      data:obj,
			disableClose: true
		});
		dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.addRowDataAsset(result.data);
      }else if(result.event == 'Update'){
        this.updateRowDataAsset(result.data);
      }else if(result.event == 'Delete'){
        this.deleteRowDataAsset(result.data);
      }
		});
	}

  addRowDataAsset(row_obj){
    if(row_obj.assetCategory){
      row_obj.assetCategoryName =this.assetCategoryListArr[row_obj.assetCategory].assetCategory;
    }
      this.dataSourceAsset.push(row_obj);
      this.getAssetDetails('','');
      this.tableAsset.renderRows();    
  }
  updateRowDataAsset(row_obj){
    this.dataSourceAsset = this.dataSourceAsset.filter((value,key)=>{
      if(value.id == row_obj.id){
        value.assetName = row_obj.assetName;
        value.enteredquantity = row_obj.enteredquantity;
        value.entereduom = row_obj.entereduom;
        if(row_obj.assetCategory){
          value.assetCategory = row_obj.assetCategory;
        }
        if(row_obj.assetCategoryName){
          value.assetCategoryName = row_obj.assetCategoryName;
        } 
        if(row_obj?.effectiveDate){
          value.effectiveDate = row_obj.effectiveDate;
        }  
        if(row_obj?.expiryPeriod){
          value.expiryPeriod = row_obj.expiryPeriod;
        }  
        if(row_obj?.period){
          value.period = row_obj.period;
        }  
        if(row_obj?.expiryDate){
          value.expiryDate = row_obj.expiryDate;
        }   
      }
      return true;
    });  
    this.getAssetDetails('',"");
  }
  callOrderAPI(event){
    if(!event){  
      this.isReadOnlyLineNo = true;
      this.readonlyLine='';
    }
    this.filter.searchorderID=event;    
    this.getOrdersByTransType()
  }
  callInputAssetAPI(event){
    // if(!event){  
    //   this.isReadOnlyLineNo = true;
    //   this.readonlyLine='';
    // }
    this.filterInputAsset.searchInputAssetID=event;
    this.getAssetsByTransType();
  }
  deleteRowDataAsset(row_obj){
    this.dataSourceAsset = this.dataSourceAsset.filter((value,key)=>{
      return value.id != row_obj.id;
    });
    this.dataSource.forEach( (itm, ind) => {
      this.dataSource[ind].id =ind+1;    
    });    
    this.getAssetDetails(row_obj,"Delete");
  }

	goBack() {
    if(this.create!=undefined){
      this.getTransactionData()
    }else{
      this.location.back();
    }
	}

  public hasError = (controlName: string, errorName: string) => {
    return this.searchTransactionForm.controls[controlName].hasError(errorName);
  }

  public hasErrorPdf = (controlName: string, errorName: string) => {
    return this.pdfTransactionForm.controls[controlName].hasError(errorName);
  }

  chosenYearHandler(normalizedYear: Moment, controlName: string) {
    const ctrlValue = this.transactionidFieldForm.controls[controlName].value;
    ctrlValue.year(normalizedYear.year());
    this.transactionidFieldForm.controls[controlName].setValue(ctrlValue)
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>, controlName: string) {
    const ctrlValue = this.transactionidFieldForm.controls[controlName].value;
    ctrlValue.month(normalizedMonth.month());
    this.transactionidFieldForm.controls[controlName].setValue(ctrlValue);
  }

  onSellocation(locationData) {
    let locationArr = (locationData != '') ? locationData.split("|") : [];
    if (locationArr.length) {        
      this.chkLocationChosen_flag=true;    
      this.chkLocation_lbl=false;
      this.addressLine = locationArr[1];
      this.adminDistrict = locationArr[2];
      this.countryRegion = locationArr[3];
      this.locality = locationArr[4];
      this.postalCode = locationArr[5];
      this.locationbranch = locationArr[0];
      this.pdfTransactionForm.patchValue({ assetLocationAuto: locationArr[0] });
      this.url = environment.bingMapBaseURL + "REST/v1/Locations";
      var params = new HttpParams();
      params = params.append('q', this.locationbranch);
      params = params.append('maxResults', '10');
      params = params.append('key', environment.bingMapAPIKey);
      this.subscriptions.push(this.apiService.getExternalURL(this.url, params)
        .subscribe((response: any) => {
          // to set values to this.geolocation
          this.autolocation = response.resourceSets[0].resources[0].address;
          this.geolocation.address=this.addressLine;
          this.geolocation.formattedAddress=this.locationbranch;
          this.geolocation.city=this.locality;
          this.geolocation.state=this.adminDistrict;
          this.geolocation.postalcode=this.postalCode;
          this.geolocation.latitude=response.resourceSets[0].resources[0].geocodePoints[0].coordinates[0];
          this.geolocation.longitude=response.resourceSets[0].resources[0].geocodePoints[0].coordinates[1];
          this.geolocation.country=this.countryRegion;
        }));
    } else {   
      this.chkLocationChosen_flag=false;    
      this.chkLocation_lbl=true;
    }
  }

  getCitySuggestion(searchValue: string): void {
    this.locationbranch = "";
    this.url = environment.bingMapBaseURL + "REST/v1/Autosuggest";
    var params = new HttpParams();
    params = params.append('query', searchValue);
    params = params.append('key', environment.bingMapAPIKey);
    if(searchValue!=""){
      this.subscriptions.push(this.apiService.getExternalURL(this.url, params)
      .subscribe((response: any) => {
        if(response!=null){
          this.locationlist = response.resourceSets[0].resources[0].value;
        }
      }));
    }else{
      this.locationlist = [];
    }    
  }

  async getByRefTransType() {
    this.url = "/order/getTransTypeData";
    var params = new HttpParams();    
    params = params.append('organizationId', this.organizationId);
    params = params.append('moduleId', this.transactionType.transactionType.moduleId);
    params = params.append('transactionTypeCode', this.transactionType.transactionType.transactionTypeCode);
    await this.subscriptions.push(this.apiService.getAsset(this.url, params)
      .subscribe((response: any) => {
        if (response.success) {
          if(response.data.transactionTypeName!=undefined){
            this.orderTypeName = response.data.transactionTypeName
            this.displayedColumnsArr.orderId=this.orderTypeName;
          }
          if(response.data.assetWithoutReference && response.data.assetWithoutReference!=undefined){
            this.refAssetCheckFlag = response.data.assetWithoutReference;
          }
        }
      }))
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

  async getOrdersByTransType() {
    this.isReadOnlyLineNo = true;
    var params = new HttpParams();    
    if(this.eprFlag && this.transRoleFlag=='Digital'){
      this.url = "/eprOrder";
      if(this.filter.searchorderID){
        params = params.append('eprOrderId', this.filter.searchorderID);  
      }
    }else{
      this.url = "/order";
      params = params.append('isPartner', "true");
      if(this.filter.searchorderID){
        params = params.append('orderId', this.filter.searchorderID);  
      }
    }
    if(this.sessionTransType.orderReference == 'Internal'){
      params = params.append('trxEntityBranchLocation', this.transactionEntityBranch);
    }
    params = params.append('isRefEntity', 'true');
    params = params.append('startIndex', "0");
    params = params.append('limit', "10");
    params = params.append('organizationId', this.organizationId);
    params = params.append('allFields', "true");  
    if(this.referenceEntityBranch){
      params = params.append('branchCode', this.referenceEntityBranch);  
    }
    if(!this.orderWithoutReference){
      params = params.append('transactionTypeCode', this.sessionTransType.refTransType);
      params = params.append('transactionEntity',this.refTransactionEntity);
    }else{
      params = params.append('transactionTypeCode', this.sessionTransType.refTransType);
      params = params.append('transactionEntity', this.refTransactionEntity);  
    }
    await this.subscriptions.push(this.apiService.getAsset(this.url, params)
      .subscribe((response: any) => {
        if (response.success && response.data.totalCount>0) {
          if (response.data && response.data.result) {            
            this.isRefOrder = true;
            var orderList = [];
            var SuggestArr = [];           
            var orderArray = response.data.result;
            for (var i = 0; i < orderArray.length; i++) {
                if(orderArray[i]._id.status!='Closed'){
                  orderList.push(orderArray[i]);
                  this.ordersList = orderList;
                }
            }
            let orderDetailsArr= [];
            let orderItemsArr= [];
            if(this.ordersList.length>0){
              if(this.eprFlag && this.transRoleFlag=='Digital'){
              this.ordersList.forEach(function (value,index) {
                  let addOrderList = {
                    orderId: value?._id?.eprOrderId,
                    transactionid: value?._id?.eprTransactionid!=""?value?._id?.eprTransactionid:''
                  };
                  SuggestArr.push(addOrderList);
                  let orderItem=[]
                  value.eprOrderDetails.forEach(function (val,ind) {
                    const orderItmObj={
                      line_number:val.orderEprItems?.epr_line_number,
                      assetCategoryName:val.orderEprItems?.assetcat_details[0]?.assetCategory,
                      order_item:val.orderEprItems?.epr_order_item,
                      order_quantity:val.orderEprItems.epr_quantity_data.length>0  && val.orderEprItems.epr_quantity_data!=undefined && val.orderEprItems.epr_quantity_data[0].eprRefRemainedQuantity!=undefined?(val.orderEprItems.epr_quantity_data[0].eprRefRemainedQuantity).toFixed(val.orderEprItems?.assetUom_details[0]?.decimal):(val.orderEprItems?.epr_order_quantity).toFixed(val.orderEprItems?.assetUom_details[0]?.decimal),
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
                  orderItemsArr[value?._id?.eprOrderId]=orderItem;
                  orderDetailsArr[value?._id?.eprOrderId]=value.eprOrderDetails;
              });
            }else{
              this.ordersList.forEach(function (value,index) {
                  let addOrderList = {
                    orderId: value?._id?.orderId,
                    transactionid: value?._id?.transactionid!=""?value?._id?.transactionid:'',
                    trans_from_address: value?._id?.trans_from_address,
                  };
                  SuggestArr.push(addOrderList);
                  let orderItem=[]
                  value.orderDetails.forEach(function (val,ind) {
                    const orderItmObj={
                      line_number:val.orderItems?.line_number,
                      assetCategoryName:val.orderItems?.assetcat_details[0]?.assetCategory,
                      order_item:val.orderItems?.order_item,
                      order_quantity:val.orderItems?.quantity_data?.length>0  && val.orderItems?.quantity_data!=undefined && val.orderItems?.quantity_data[0]?.refRemainedQuantity!=undefined?(val.orderItems?.quantity_data[0]?.refRemainedQuantity).toFixed(val.orderItems?.assetUom_details[0]?.decimal):(val.orderItems?.order_quantity).toFixed(val.orderItems?.assetUom_details[0]?.decimal),
                      order_uom:val.orderItems?.order_uom,
                      ordered_assetId:val.orderItems?.ordered_assetId,
                      entity_asset:val.orderItems?.entity_asset,
                      _id:val.orderItems?._id,
                      asset_category:val.orderItems?.asset_category,
                      nft_status:val.orderItems?.nft_status
                    }
                    orderItem[ind]=orderItmObj
                  });
                  orderItem = sortArrayOfObjects(orderItem, "line_number", "ascending")
                  orderItemsArr[value?._id?.orderId]=orderItem;
                  orderDetailsArr[value?._id?.orderId]=orderItem;
              });
             
            }
            this.ordersListLimited = SuggestArr;
            this.orderItemLineList=orderItemsArr;
            this.orderItemDetails=orderDetailsArr;
            if(this.create!=undefined){
              this.onSelPurchaseOrder(this.order_Id)
            }            
            }else{
              this.ordersListLimited = [{ orderId: 'No record found',transactionid:'' }];
              this.isRefOrderLable = 'null';
            }            
          }
        } else {
          this.ordersListLimited = [{ orderId: 'No record found',transactionid:'' }];
          this.isRefOrderLable = 'null';
        }
      }))
  }

  onSelPurchaseOrder(orderData) {
    let orderArr = (orderData!='') ? orderData.split("|") :[];
    if(orderArr[0]!='No record found'){
      this.enableAddMore= true;
      this.searchTransactionForm.patchValue({purchaseOrder:''});
      this.searchTransactionForm.patchValue({trans_from_address:orderArr[2]});
      this.enableLineNo  = false;
      this.orderID = "";
      this.refOrderTransactionid = "";
      this.lineListArr = this.orderItemLineList[orderArr[0]];
      this.orderItemDetailsArr = this.orderItemDetails[orderArr[0]];
      this.orderID = orderArr[0];
      this.eprorderID = orderArr[0];
      this.refOrderTransactionid = orderArr[1];
    }
    this.searchTransactionForm.patchValue({purchaseOrder:orderArr[0]});
    this.searchTransactionForm.patchValue({trans_from_address:orderArr[2]});
    this.lineListArr = this.orderItemLineList[orderArr[0]];
    this.orderItemDetailsArr = this.orderItemDetails[orderArr[0]];
    this.orderID = orderArr[0];
    this.refOrderTransactionid = orderArr[1];    
    this.isReadOnlyLineNo = false;
    this.readonlyLine='';
  }
  

  onSelLine(data) {
    this.isReadOnlyLineNo = true;
    if(this.transRoleFlag=="Digital" && this.transactionflag=='Asset'){
      this.enableAddMore = true;
    }else{
      this.enableAddMore = false;
      this.chkAddRecordItems = false
    }
    
    this.searchTransactionForm.patchValue({lineNo:''});
    let orderArr = (data!='') ? data.split("|") :[];
    const obj =orderArr[0]+". "+orderArr[1]+"|"+orderArr[2]+"|"+orderArr[3]+"|"+orderArr[4]
  this.searchTransactionForm.patchValue({lineNo:obj});
    if(!this.orderWithoutReference && (this.assetType == 'Consume Asset' || (this.eprFlag && this.eprConsumeFlag))) {
      if(this.transRoleFlag=='Digital' && this.eprFlag && this.eprConsumeFlag){
        this.addRowDataPass = {
          lineNo:orderArr[0],
          orderId:this.orderID,
          transactionEntity:this.transactionEntity,
          organizationId:this.organizationId,
          refOrderTransactionid:this.refOrderTransactionid,
          objectID:orderArr[7],
          assetCategory:orderArr[8],
          state:orderArr[9]
        }
      }else{
        this.addRowDataPass = {
          lineNo:orderArr[0],
          orderId:this.orderID,
          transactionEntity:this.transactionEntity,
          organizationId:this.organizationId,
          refOrderTransactionid:this.refOrderTransactionid,
          objectID:orderArr[7],
          assetCategoryName:orderArr[1]
        }
      }
      if(this.assetWithoutReference){
        this.addRowDataPass = {
          lineNo:orderArr[0],
          orderId:this.orderID,
          transactionEntity:this.transactionEntity,
          organizationId:this.organizationId,
          refOrderTransactionid:this.refOrderTransactionid,
          objectID:orderArr[7],
          assetCategory:orderArr[8],
          assetName:orderArr[2],
          entereduom:orderArr[4],
          state:orderArr[9]
        }
      }
    }else if(this.assetType == 'Receive Asset' || this.eprReceiveFlag) {
      this.addRowDataPass = {
        lineNo:orderArr[0],
        assetId:orderArr[5],
        assetName: orderArr[2],
        enteredquantity: orderArr[3],
        entereduom: orderArr[4],
        entity_asset: orderArr[6],
        orderId:this.orderID,
        refOrderTransactionid:this.refOrderTransactionid,
        orderItemDetails:this.orderItemDetailsArr,
        assetCategory:orderArr[8],
        nft_status:orderArr[10]
      }
    }else if(!this.orderWithoutReference){
      this.addRowDataPass = {
        lineNo:orderArr[0],
        orderId:this.orderID,
        transactionEntity:this.transactionEntity,
        organizationId:this.organizationId,
        refOrderTransactionid:this.refOrderTransactionid,
        objectID:orderArr[7],
        assetName:orderArr[2],
        enteredquantity:orderArr[3],
        availableQuantity:orderArr[3],
        entereduom:orderArr[4],
        assetCategory:orderArr[8],
      }
    }
  }

  chooseFile(event, keys,index) {    
    this.selectedFiles = event.target.files;
    //const max_size =  10485760 //20971520;    
    const allowed_types = ['image/png', 'image/jpeg','image/jpg','image/gif','application/pdf'];
    this.imageError[index] = "";
    if (this.selectedFiles[0]?.size > environment.imgSize && this.selectedFiles[0]?.type!='application/pdf') {
      this.showImg[index] =false;
        this.imageError[index] =
          'Maximum size allowed is 10MB';
        return false;
    }
    if (this.selectedFiles[0]?.size > environment.pdfSize && this.selectedFiles[0]?.type=='application/pdf') {
      this.showImg[index] =false;
        this.imageError[index] =
          'Maximum size allowed is 2MB';
        return false;
    }
    const fExt=this.selectedFiles[0]?.name.split(".");
    if (!_.includes(allowed_types, this.selectedFiles[0]?.type) || fExt[1]=='jfif') {
      this.showImg[index] =false;
        this.imageError[index] = 'Only Files are allowed ( JPG | PNG | JPEG | GIF | PDF)';
        return false;
    }
    
    this.fileUploaded[index]=event.target.files; 
    const filename =this.uploadService.findFileName(this.selectedFiles[0].name);
    const uploadedFilesType=this.selectedFiles[0].type;
    this.showImg[index] =true;
      
    if(uploadedFilesType=='image/jpeg' || uploadedFilesType=='image/jpg' || uploadedFilesType=='image/png')
    {
      this.loaderService.show();
      let image: File = this.selectedFiles.item(0);
      //this.subscriptions.push(
        this.compressImage.compress(image)
      .pipe(take(1))
      .subscribe(compressedImage => {
        var reader = new FileReader();
        reader.readAsDataURL(compressedImage);
        reader.onload = (event: any) => {
          this.resultSrc[index] = event.target.result; 
          this.fileNative[index] =compressedImage;
          this.loaderService.hide();
        }
      })
      //)
    }else{
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
          this.resultSrc[index] = event.target.result;
          this.fileNative[index] =this.selectedFiles.item(0);
        }
    }
    this.filenameArr[index] =filename;
    this.transactionidFieldForm.controls[keys].setValue(filename);
    this.imageArr["filename_"+index] =filename;     
};

previewFile(files, index,flagLevel){
  this.modaleFlagDyn= true;
  this.modaleFlagCert= false;
  this.modaleFlag= false;
  this.indField = "";
  this.myModel.show();
  this.indField=index;
  if(flagLevel){
    if (files && files[0]) {
      if(files[0].type == "application/pdf") {
          this.isImage = false;
          this.isPdf = true;      // required, going forward
      }
      else {
          this.isPdf = false;
          this.isImage = true;    // required, going forward
      }
      this.urlSrc[index] =this.resultSrc[index];
    }
  }else{
    const splitExt =files.split(";base64")[0];
    const ext = splitExt.split("/")[1];
    if(ext == "pdf") {
      this.isImage = false;
      this.isPdf = true;      // required, going forward
    }else {
        this.isPdf = false;
        this.isImage = true;    // required, going forward
    }
    this.urlSrc[index] = files;
  }
}

deletePreviewFile(keys, index,flagLevel){
   this.fileNative.splice(index,1);
   this.filenameArr.splice(index,1);
   if(flagLevel){   
    this.transactionidFieldForm.controls[keys].setValue('');
     this.showImg[index]=false
   }
}

deleteStaticFile(){
  delete this.fileStaticName;
  delete this.fileValueStatic;
  this.showImgStatic=false
}

deleteCertFile(){
  delete this.fileCertName;
  delete this.fileValueCert;
  this.showCert=false
}

previewFileStatic(files){
  this.modaleFlagCert= false;
  this.modaleFlag= true;
  this.modaleFlagDyn= false;
  this.myModel.show();
    if (files && files[0]) {
      if(files[0].type == "application/pdf") {
          this.isImageStatic = false;
          this.isPdfStatic = true;      // required, going forward
      }else {
          this.isPdfStatic = false;
          this.isImageStatic = true;    // required, going forward
      }
      this.urlSrcStatic =this.resultSrcStatic;
    }
}
previewFileCert(files){
  this.modaleFlagCert= true;
  this.modaleFlag= false;
  this.modaleFlagDyn= false;
  this.myModel.show();
    if (files && files[0]) {
      if(files[0].type == "application/pdf") {
          this.isImageCert = false;
          this.isPdfCert = true;      // required, going forward
      }else {
          this.isPdfCert = false;
          this.isImageCert = true;    // required, going forward
      }
      this.urlSrcCert =this.resultSrcCert;
    }
}

  hide(){
    this.myModel.hide();
  }

  chooseStaticUploadFile(event) {
    this.selectedstaticFiles = event.target.files;
    //const max_size =  10485760 //2097152;    
    const allowed_types = ['image/png', 'image/jpeg','image/jpg','image/gif','application/pdf'];
    this.imageErrorStatic = '';
    
    if (this.selectedstaticFiles[0]?.size > environment.imgSize && this.selectedstaticFiles[0]?.type!='application/pdf') {
        this.showImgStatic =false;
        this.imageErrorStatic ='Maximum size allowed is 10MB';
        return false;
    }
    if (this.selectedstaticFiles[0]?.size > environment.pdfSize && this.selectedstaticFiles[0]?.type=='application/pdf') {
      this.showImgStatic =false;
      this.imageErrorStatic ='Maximum size allowed is 2MB';
      return false;
    }
    const fExt=this.selectedstaticFiles[0]?.name.split(".");
    if (!_.includes(allowed_types, this.selectedstaticFiles[0]?.type) || fExt[1]=='jfif') {
        this.showImgStatic =false;
        this.imageErrorStatic = 'Only Files are allowed ( JPG | PNG | JPEG | GIF | PDF)';
        return false;
    }
    this.showImgStatic =true;
    this.fileUploadedStatic=event.target.files;
    this.fileStaticName =this.uploadService.findFileName(this.selectedstaticFiles[0].name); 
    const uploadedFileType=this.selectedstaticFiles[0].type;
    if(uploadedFileType=='image/jpeg' || uploadedFileType=='image/jpg' || uploadedFileType=='image/png')
    {
      this.loaderService.show();
      let image: File = event.target.files[0];
     // this.subscriptions.push(
        this.compressImage.compress(image)
      .pipe(take(1))
      .subscribe(compressedImage => {
        var reader = new FileReader();
        reader.readAsDataURL(compressedImage);
        reader.onload = (event: any) => {
          this.resultSrcStatic = event.target.result;
          this.fileValueStatic =compressedImage;
          this.loaderService.hide();
        }
      })
      //)
    }else{
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.resultSrcStatic = event.target.result;
      }
      this.fileValueStatic =this.selectedstaticFiles.item(0);
    }    
};

ChooseCertificateFile(event) {  
  this.selectedCertFiles = event.target.files;
  const max_size =  10485760 //20971520;    
  const allowed_types = ['image/png', 'image/jpeg','image/jpg','image/gif','application/pdf'];
  this.certError = '';
  if (this.selectedCertFiles[0]?.size > environment.imgSize && this.selectedCertFiles[0]?.type!='application/pdf') {
      this.showCert =false;
      this.certError ='Maximum size allowed is 10MB';
      return false;
  }
  if (this.selectedCertFiles[0]?.size > environment.pdfSize && this.selectedCertFiles[0]?.type=='application/pdf') {
    this.showCert =false;
    this.certError ='Maximum size allowed is 2MB';
    return false;
}
  const fExt=this.selectedCertFiles[0]?.name.split(".");
  if (!_.includes(allowed_types, this.selectedCertFiles[0]?.type) || fExt[1]=='jfif') {
      this.showCert =false;
      this.certError = 'Only Files are allowed ( JPG | PNG | JPEG | GIF | PDF)';
      return false;
  } 
  
  this.showCert =true;
  this.fileUploadedCert=event.target.files;
  this.fileCertName =this.uploadService.findFileName(this.selectedCertFiles[0].name);
  const uploadedCertType=this.selectedCertFiles[0].type;
  if(uploadedCertType=='image/jpeg' || uploadedCertType=='image/jpg' || uploadedCertType=='image/png')
    {
    this.loaderService.show();
    let image: File = event.target.files[0];
   // this.subscriptions.push(
      this.compressImage.compress(image)
      .pipe(take(1))
      .subscribe(compressedImage => {
        var reader = new FileReader();
        reader.readAsDataURL(compressedImage);
        reader.onload = (event: any) => {
          this.resultSrcCert = event.target.result;
          this.fileValueCert =compressedImage;
          this.loaderService.hide();
        }
      })
      //)
    }else{
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);   
      reader.onload = (event: any) => {   
        this.resultSrcCert = event.target.result;    
      }    
      this.fileCertName =this.uploadService.findFileName(this.selectedCertFiles[0].name);    
      this.fileValueCert =this.selectedCertFiles.item(0);
    }
};

  getAssetsByTransType() {
    var params = new HttpParams();
    if(this.eprFlag && this.transRoleFlag=='Digital'){
      this.url = "/eprAsset/get_epr_entityAssets";
      // if(this.searchTransactionForm.get('assetCategory')?.value!==undefined){
      //   this.targetAssetCategoryID=this.searchTransactionForm.get('assetCategory')?.value._id;
      //   params = params.append('eprAssetCategoryId', this.targetAssetCategoryID);
      // }
      const payLoadDate = "0"+this.monthValue+"-"+this.yearValue;
      params = params.append('payloadDate', payLoadDate);
     
      params = params.append('state', this.targetState);
      params = params.append('eprAssetType','Credit');
    }else{
      // if(this.selectedassetCategory){
      //   params = params.append('assetCategoryId', this.selectedassetCategory);
      // }
      this.url = "/asset/get_entity_assets";
      if(this.transactionEntityBranch!=undefined){
        params = params.append('transactionEntityBranch', this.transactionEntityBranch);
      }
      
      params = params.append('nftFlag', 'true');
    }
   
    if(this.filterInputAsset.searchInputAssetID){
      params = params.append('inputAssetSearch_key', this.filterInputAsset.searchInputAssetID);  
    }
    params = params.append('transactionEntity', this.transactionEntity);    
    params = params.append('organizationId', this.organizationId);
    params = params.append('limit', '10');

    this.subscriptions.push(this.apiService.getAsset(this.url, params)
        .subscribe((response: any) => {
          if (response.data && response.data.result) {
            let assetsSuggestArr=[];
            const assetArray = response.data.result;           
              if(this.eprFlag && this.transRoleFlag=='Digital'){
                assetArray.forEach(function (value) {
                    const addassetsList = {
                      assetId:value.eprAssetId,
                      assetUom:value.asset?.eprAssetUom,
                      transactionid:value?.eprTransactionid,
                      assetCategoryName:value?.assetcategory?.assetCategory,
                      assetCategory:value?.asset?.eprAssetCategory,
                      assetName: value?.asset?.eprAssetName,
                      assetQuantity:(value.balancedQuantity).toFixed(value.uom.decimal),
                      transactionEntity:value?.asset?.transactionEntity,
                      entityAsset:value.eprEntityAsset,
                    };                 
                  assetsSuggestArr.push(addassetsList);   
               });
              }else{
                assetArray.forEach(function (value) {
                    const addassetsList = {
                      assetId:value.assetId,
                      assetUom:value.assetUom,
                      transactionid:value.transactionid,
                      assetCategoryName:value?.assetcategory?.assetCategory,
                      assetCategory:value?.asset?.assetCategory,
                      assetName: value?.asset?.assetName,
                      assetQuantity:(value.balancedQuantity).toFixed(value.uom.decimal),
                      transactionEntity:value?.asset?.transactionEntity,
                      entityAsset:value.entityAsset,
                      nft_status:value.asset?.nft_status
                    };
                  assetsSuggestArr.push(addassetsList);   
               });
              }
              this.assetsListLimited=assetsSuggestArr;
          }else{
            this.assetsListLimited = [{ orderId: 0, assetName: 'No record found' }];
          }          
        }));
  }

  clearAssetIdFields(){
    this.isReadOnlyAssetIDMain=false;
    this.filterInputAsset.term='';
    this.assetTransactionID = '';
    this.assetName = '';
    this.filterInputAsset.searchInputAssetID='';
    this.getAssetsByTransType();
  }

  onSelAssetID(assetData) { 
    this.enableAddMore = false;
    this.chkAddRecordItems = false;
    if(assetData){
      this.isReadOnlyAssetIDMain=true;
    }
    if(this.transRoleFlag!="Digital" && this.transactionflag!='Asset'){
      this.readonlyOrderId='';
    }
    let assetArr = (assetData!='') ? assetData.split("|") :[];
    const obj =assetArr[0]+"|"+assetArr[4]+"|"+assetArr[1]+"|"+assetArr[5]+"|"+assetArr[2]
    this.searchTransactionForm.patchValue({refAsset:obj});
      this.addRowDataPass = {
        assetId:assetArr[1],
        assetName: assetArr[4],
        availableQuantity: assetArr[5],
        entereduom: assetArr[2],
        transactionEntity:assetArr[6],
        entity_asset:assetArr[7],
        assetCategory:assetArr[8],
        nft_status:assetArr[9],
      }
  }

  getAssetCategoriesByTransType() {
    this.url = "/assetCategory";
    var params = new HttpParams();
    params = params.append('startIndex', "0");
    params = params.append('limit', "200");
    params = params.append('organizationId', this.organizationId);
    this.subscriptions.push(this.apiService.getAsset(this.url, params)
      .subscribe((response: any) => {
        if (response.data && response.data.result) {
          var assetCatList = [];
          var assetCatListArr = [];
          var assetCatNameList = [];
          var assetCatArray = response.data.result;
          for (var i = 0; i < assetCatArray.length; i++) {
            if(assetCatArray[i].assetCategory!=undefined){
              assetCatList.push(assetCatArray[i]);
              assetCatListArr[assetCatArray[i]._id]=assetCatArray[i];
              assetCatNameList[assetCatArray[i]._id]=assetCatArray[i].assetList;
            }            
          }
          this.assetCategoryListArr = assetCatListArr;
          this.assetCategoryList = assetCatList;
          this.assetCatNameLists = assetCatNameList;         
        }        
      }));
  }

    onSelState(state) {
      if(state!=undefined){
        if(this.eprFlag && this.transRoleFlag=='Digital' && this.transactionflag=="Asset"){ 
          this.getAssetsByTransType();       
          this.targetState = state;
        }
      }
    }
  
  getUom() {
    this.url = "/uom";
    var params = new HttpParams();
    params = params.append('startIndex', "0");
    params = params.append('limit', "200");
    params = params.append('organizationId', this.organizationId);
    this.subscriptions.push(this.apiService.getAsset(this.url, params)
      .subscribe((response: any) => {
        if (response.data && response.data.result) {
          var uomList = [];
          var assetCatArray = response.data.result;
          for (var i = 0; i < assetCatArray.length; i++) {
            uomList.push(assetCatArray[i]);
          }
          this.uomLists = uomList;
        }        
      }));
  }

  onChangeUOM(event: any){
    this.searchTransactionForm.patchValue({enteredquantity:''});
    this.isEnteredQuantity = false
    this.Quantity_decimal = event.decimal
  }

  getDecimal(){
    let pattern = new RegExp('^$|^[0-9]+(\.[0-9]{0,'+this.Quantity_decimal+'})?$')
    let result = pattern.test(this.entereQuantity);
    if(!result){
      if(this.entereQuantity == null){
        this.entereQuantity = ''
      }else{
        this.entereQuantity = this.old_entereQuantity;
      }
    }else{
      this.old_entereQuantity = this.entereQuantity;

      if(this.entereQuantity.toString().split('.')[1] != undefined){
        var decimalPlaces = this.entereQuantity.toString().split('.')[1].length;
        var decimals = Number(this.entereQuantity).toFixed(decimalPlaces);
        this.entereQuantity = decimals
      }else{
        this.entereQuantity = parseFloat(this.old_entereQuantity)
      }
    }
    this.validateNumber.validateNo(this.entereQuantity);
 }

  getTransTypeByModuleId(transtypeId) {
    this.url = "/transactiontype/list";
    var params = new HttpParams();
    params = params.append('dynamicForm', 'dynamicForm')
    params = params.append('transTypeId', transtypeId);
    params = params.append('pagesize', '2000');
    params = params.append('page', '1');
    this.subscriptions.push(this.apiService.get(this.url, params)
      .subscribe((response: any) => {
        if (response.success == true) {
          if (response.data && response.data.result.transtypes) {
            this.transTypes = response.data.result.transtypes.transtypes[0];
            this.assetType = response.data.result.transtypes.transtypes[0].assetType;
            this.transactionflag = response.data.result.transtypes.transtypes[0].transaction;
            this.transactionTypeNameflag = response.data.result.transtypes.transtypes[0].transactionTypeName;
            this.nftFlag = response.data.result.transtypes.transtypes[0].nft;
            console.log("this.nftFlag : ",this.nftFlag);
            if(response.data.result.transtypes.transtypes[0].inputAsset==true){
              this.inputAssetflag = response.data.result.transtypes.transtypes[0].inputAsset;
            }else{
              this.inputAssetflag = false;
            }
            this.fromToEntityflag = response.data.result.transtypes.transtypes[0].fromToEntity;
            this.verifiable = response.data.result.transtypes.transtypes[0].verifiable;
            this.refModule = response.data.result.transtypes.transtypes[0].refModule;
            this.refTransType=response.data.result.transtypes.transtypes[0].refTransType;
            
            if (this.transactionflag == 'Asset' && this.assetType == 'Produce Asset') {
              const controleffectiveDate = <FormControl>this.searchTransactionForm.get('effectiveDate');
              controleffectiveDate.setValidators([Validators.required]);
              const controlAssetCategory = <FormControl>this.searchTransactionForm.get('assetCategory');
              controlAssetCategory.setValidators([Validators.required]);
              const controlexpiryDate = <FormControl>this.searchTransactionForm.get('expiryDate');
              controlexpiryDate.setValidators([Validators.required]);
              const controlExpiryPeriod = <FormControl>this.searchTransactionForm.get('expiryPeriod');
              controlExpiryPeriod.setValidators([Validators.required,Validators.min(1)]);
              const controlPeriod = <FormControl>this.searchTransactionForm.get('period');
              controlPeriod.setValidators([Validators.required]);

              const controlassetName = <FormControl>this.searchTransactionForm.get('assetName');
              controlassetName.setValidators([Validators.required]);

              const controlenteredquantity = <FormControl>this.searchTransactionForm.get('enteredquantity');
              controlenteredquantity.setValidators([Validators.required,Validators.pattern('^0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*$')]);

              const controlentereduom = <FormControl>this.searchTransactionForm.get('entereduom');
              controlentereduom.setValidators([Validators.required]);
              const controlassetLocation = <FormControl>this.searchTransactionForm.get('assetLocation');
              controlassetLocation.setValidators([Validators.required]);

              if (this.inputAssetflag == true) {
                const controlassetCategory = <FormControl>this.searchTransactionForm.get('assetCategory');
                controlassetCategory.setValidators([Validators.required]);
              }
            }
            else if (this.transactionflag == 'Order' && this.assetType == 'Consume Asset') {
            
              if (this.fromToEntityflag == 'reference') {
                const controlassetName = <FormControl>this.searchTransactionForm.get('assetName');
                controlassetName.setValidators([Validators.required])
              }
              if (this.fromToEntityflag == 'partner') {
                const controlassetName = <FormControl>this.searchTransactionForm.get('assetName');
                controlassetName.setValidators([Validators.required]);
              }
            }
            else if (this.transactionflag == 'Order' && this.assetType == 'Receive Asset') {
              const controlassetName = <FormControl>this.searchTransactionForm.get('assetName');
              controlassetName.setValidators([Validators.required]);

            }
            else if (this.transactionflag == 'Order' && (this.assetType == 'undefined' || this.assetType == undefined)) {
              const controlassetName = <FormControl>this.searchTransactionForm.get('assetName');
              controlassetName.setValidators([Validators.required]);             
              const controlentereduom = <FormControl>this.searchTransactionForm.get('entereduom');
              controlentereduom.setValidators([Validators.required]);
              controlentereduom.setValidators([Validators.pattern("[a-zA-Z]*")]);
            }

            if (this.fromToEntityflag == 'partner') {
              const controlpartners = <FormControl>this.searchTransactionForm.get('partners');
              controlpartners.setValidators([Validators.required]);
            }

            this.orderReference = this.transTypes.orderReference;
            if(this.orderReference==undefined || this.orderReference=='' || this.orderReference==null){
              this.enableOrderField = false;
              if(this.transactionflag == 'Order' && !this.orderWithoutReference){
                this.getOrdersByTransType();
              }
            }
            
            if(this.orderReference=="Internal"){
              const controlRefBranch = <FormControl>this.searchTransactionForm.get('refBranch');
              controlRefBranch.setValidators([Validators.required]);
            }
        
            if (response.data.result.transtypes.transtypes[0].refModule != undefined && response.data.result.transtypes.transtypes[0].refTransType != undefined) {
              var data = {
                refModule: response.data.result.transtypes.transtypes[0].refModule,
                refTransType: response.data.result.transtypes.transtypes[0].refTransType,
                organizationId: this.transactionType.organizationId,
                orderReference: this.transTypes.orderReference,
              }
            }
            this.pdfupload = response.data.result.transtypes.transtypes[0].pdfupload;
            this.prescriptionflag = response.data.result.transtypes.transtypes[0].prescriptiontype;
            this.prescriptiontype = response.data.result.transtypes.transtypes[0].transactionTypeName;
            this.fromToEntity = response.data.result.transtypes.transtypes[0].fromToEntity;
            this.inputAsset = response.data.result.transtypes.transtypes[0].inputAsset;
            var transaction = response.data.result.transtypes.transtypes[0].transaction;
            var FromToEntity = response.data.result.transtypes.transtypes[0].fromToEntity;
            var expiry = response.data.result.transtypes.transtypes[0].isExpiry;
            this.transactionAutoNumber = response.data.result.transtypes.transtypes[0].transactionAutoNumber;
            var inputAsset = response.data.result.transtypes.transtypes[0].inputAsset;
            this.moduleId = response.data.result.transtypes.transtypes[0].module._id
            this.pdffield = response.data.result.transtypes.transtypes[0].pdffield
            this.viewpdf = response.data.result.transtypes.transtypes[0].viewPDF
            this.transactiontypeId = response.data.result.transtypes.transtypes[0].transactionTypeId
            
            if(this.isInputAsset || this.assetType == 'Receive Asset' || this.assetType == 'Consume Asset' || (this.orderWithoutReference && this.fromToEntityflag!='self')){
              this.enableAddMore= true;
            }
            if (this.eprFlag && !this.orderWithoutReference) {
              const controlLoc = <FormControl>this.pdfTransactionForm.get('assetLocationAuto');
              controlLoc.setValidators([Validators.required]);
            }
            this.expiry = expiry;
            if (transaction == 'Asset') {
              this.getUom();
              this.PDFchecked = false;
              this.transactionAutoNumberLabel = 'Asset Id'
              if (FromToEntity == 'partner' && expiry) {
                this.isAsset = true;
                this.isPartner = true;
                this.ifFromToEntity = true;
                this.hideFeild = false;
              } else if (FromToEntity == 'partner' && !expiry) {
                this.isPartner = true;
                this.ifFromToEntity = true;
                this.hideFeild = false;
              } else if (FromToEntity == 'self' && expiry) {
                this.isAsset = true;
                this.ifFromToEntity = true;
                this.hideFeild = false;
              } else if (FromToEntity == 'self' && !expiry) {
                this.ifFromToEntity = true;
                this.hideFeild = false;
                this.isAsset = true;
              }
            
              if (inputAsset) {
                this.isInputAsset = true;
                this.isProvenance = true;
              }
            } else if (transaction == 'Order') {
              this.transactionAutoNumberLabel = 'Order Id'
              this.PDFchecked = false;
              this.isOrder = true;
              if (FromToEntity == 'partner') {
                this.isPartner = true;
                this.ifFromToEntity = true;
                this.hideFeild = false;
              } else if (FromToEntity == 'self') {
                this.hideFeild = false;
              } else {
                var data = {
                  refModule: response.data.result.transtypes.transtypes[0].refModule,
                  refTransType: response.data.result.transtypes.transtypes[0].refTransType,
                  organizationId: this.transactionType.organizationId,
                  orderReference: this.transTypes.orderReference,
                }
                this.ifFromToEntity = true;
                this.hideFeild = false;
              }
            } else {
              this.ifCertificate = true;              
            }
            this.ids = response.data.result.transtypes.transtypes;
            this.fields1 = response.data.result.transtypes.transtypes[0].fields;
            for (var i = 0; i < this.fields1.length; i++) {
              if(this.fields1[i][0].is_line_level==true){
                this.lineLevelArr[i]=this.fields1[i][0];
                this.lineArr[i] = this.fields1[i][0].key;
              }else{
                if(this.fields1[i][0]?.is_outside_level==true){
                }else{
                  this.fields[i]=this.fields1[i][0];
                }
              }
            }
            this.fields = this.fields.filter(item => item);
            this.lineLevelArr = this.lineLevelArr.filter(item => item);
            this.object = this.fields;
            this.generateFieldsForm();
          }
        }
      }))
  }

  getDepartmentByOrganization(flagD) {
    this.url = "/branch"
    var params = new HttpParams();
    if(flagD){
      if(this.orgId!=""){
        params = params.append('organizationId', this.orgId);
      }
    }else{
      params = params.append('organizationId', this.organizationId);
    }
    params = params.append('startIndex', "0");
    params = params.append('limit', "10");
    params = params.append('allFields', "true");

    this.subscriptions.push(this.apiService.getAsset(this.url, params)
      .subscribe((response) => {
        if (response.success == true) {
          var departmentList = [];
          var departmentArray = response.data.result;
          for (var i = 0; i < departmentArray.length; i++) {
            if(this.transactionEntityBranch!=departmentArray[i].code){
              departmentList.push(departmentArray[i]);
            }
          }
          this.departmentsList = departmentList;
        }
        if(this.create!=undefined){
          this.foundBranch = this.departmentsList.find(element => element = this.orderData.branch);
          this.onSelRefBranch(this.foundBranch.code)
        }
      }))
  }

  generateFieldsForm() {
    var formDataObj = {};
    var formData = this.fields;
    for (var i = 0; i < this.fields.length; i++) {
      let formDataKey = this.fields[i].key;
      if (this.fields[i].transactionid == true) {
        formDataObj[formDataKey] = new FormControl('');
      } else if (this.fields[i].value == "File") {
        formDataObj[formDataKey] = new FormControl('');
      } else {
        formDataObj[formDataKey] = new FormControl('');
      }

      this.transactionidFieldForm = new FormGroup(formDataObj);
      if (this.fields[i].value == "Date") {
        this.transactionidFieldForm.controls[this.fields[i].key].setValue('');
      } else if (this.fields[i].value == "String") {
        this.transactionidFieldForm.controls[this.fields[i].key].setValue('');
      } else if (this.fields[i].value == "Number") {
        this.transactionidFieldForm.controls[this.fields[i].key].setValue('');
      } else if (this.fields[i].value == "File") {
        this.transactionidFieldForm.controls[this.fields[i].key].setValue('');
      } else if (this.fields[i].value == "JSON") {
        this.transactionidFieldForm.controls[this.fields[i].key].setValue('');
      }
      if (this.fields[i].auto == true) {
        this.fields[i].value = 'String';
        this.autoFlag = this.fields[i].auto;
        this.autofieldvalue = this.fields[i].key;
        this.prefix = this.fields[i].prefix;
        this.length = this.fields[i].length;
        this.startingnumber = this.fields[i].startingnumber;
        if (this.length == this.startingnumber.toString().length) {
          this.lastnumber = this.fields[i].lastnumber;
          this.autoValue = this.prefix + '' + this.lastnumber;
          this.transactionidFieldForm.controls[this.fields[i].key].setValue(this.autoValue);
        } else {
          this.lastnumber = this.fields[i].lastnumber;
          this.lastnumber = this.lastnumber.toString().padStart(this.length, '0');
          this.autoValue = this.prefix + '' + this.lastnumber;
          this.transactionidFieldForm.controls[this.fields[i].key].setValue(this.autoValue);
        }
      }
    }
    this.object = this.fields;
    this.datatype = Object.keys(this.fields);
  }

  getExpiryPeriod(event: any) {
    this.expiryPeriod = event.target.value;
    this.getExpiryDate(this.dateDuration)
  }

  convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
  }

  getExpiryDate(event: any) {
    var period = this.expiryPeriod;
    var duration = event;
    var effectiveDate = new Date(this.planModel.start_time).toUTCString();
    this.dateDuration = event
    if (this.dateDuration == 'days') {
      var today = new Date(new Date(this.planModel.start_time).setUTCDate(new Date(this.planModel.start_time).getUTCDate() + parseInt(period) - 1));
      var date = this.convertDate(today);
      var dateArray = date.split("/");
      var newDate = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
      this.expiryDate = new Date(newDate);
    } else if (this.dateDuration == 'months') {
      var today = new Date(new Date(this.planModel.start_time).setUTCMonth(new Date(this.planModel.start_time).getUTCMonth() + parseInt(period)));
      var date = this.convertDate(today.setDate(today.getDate() - 1));
      var dateArray = date.split("/");
      var newDate = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
      this.expiryDate = new Date(newDate);
    } else if (this.dateDuration == 'years') {
      var today = new Date(new Date(this.planModel.start_time).setUTCFullYear(new Date(this.planModel.start_time).getUTCFullYear() + parseInt(period)));
      var date = this.convertDate(today.setDate(today.getDate() - 1));
      var dateArray = date.split("/");
      var newDate = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
      this.expiryDate = new Date(newDate);
    }
  }

  async onSelPartnerID(partnerCode) { 
    this.enableAddMore = true;
    this.enableAssetID= true
    if(partnerCode!==undefined){
      this.partnerList.forEach((value,ind) => { 
        if(partnerCode==value.code){
          this.partnerData=value;
        } 
      });
        this.refTransactionEntity = "";
        this.referenceEntityBranch = "";     
        if(this.partnerData?.type=="Organization"){
          this.orgId = this.partnerData?._id;
          this.isShowBrachDrp = true;
          const controlRefBranch = <FormControl>this.searchTransactionForm.get('refBranch');
          controlRefBranch.setValidators([Validators.required]);
          this.getDepartmentByOrganization(true);
        }else{
          if(this.assetType != 'Receive Asset' && this.assetType != 'Consume Asset'){
            this.enableAddMore = false;
          }
          this.filterInputAsset.term='';
          this.readonlyLine='';
          this.readonlyOrderId='';
          this.orderID = "";
          this.refOrderTransactionid = "";
          this.searchTransactionForm.patchValue({purchaseOrder:''});
          this.searchTransactionForm.patchValue({lineNo:''});
          this.enableLineNo=true
          const controlRefBranch = this.searchTransactionForm.controls['refBranch'];
          controlRefBranch.setErrors(null);
          this.orgId = "";
          this.enableAssetID = false;
          this.enableOrderField = false;
          this.isShowBrachDrp = false;
          this.refTransactionEntity = this.partnerData?.code;
          if((this.transactionflag == 'Order' && !this.orderWithoutReference) || (this.transRoleFlag=='Digital' && this.transactionflag=='Asset')){
            await this.getOrdersByTransType();
          }
        }
        this.refEntityTypePartner = this.partnerData?.type;     
    }
  }

  async onSelRefBranch(branchCode) { 
    this.enableAddMore = true;
    this.enableAssetID= true
    if(this.create!=undefined){
      branchCode = this.selectedrefBranch
    }
    if(branchCode!==undefined){
      this.filterInputAsset.term='';
      this.readonlyLine='';
      this.readonlyOrderId='';
      this.orderID = "";
      this.refOrderTransactionid = "";
      this.searchTransactionForm.patchValue({purchaseOrder:''});
      this.searchTransactionForm.patchValue({lineNo:''});
      if(this.orderWithoutReference){
        this.enableAddMore = false;
      }
      
      this.departmentsList.forEach((value,ind) => { 
        if(branchCode==value.code){
          this.branchData=value;
        } 
      });
      this.referenceEntityBranch = this.branchData?.code;
     
      this.refTransactionEntity = this.branchData?.organizations?.code;
      this.enableAssetID = false;
      this.enableOrderField = false;
      if(this.orderReference=='Internal'){
        this.refEntityTypePartner="Organization"
      }
      await this.getOrdersByTransType();
    }
  }

  getPartners() {
    this.url = "/partner";
    var params = new HttpParams();
    if (this.corpFlag) {
      params = params.append('userId', this.corporateId);
    } else {
      params = params.append('userId', this.organizationId);
    }
    params = params.append('startIndex', '0');
    params = params.append('limit', '100');
    params = params.append('allFields', "true");
    this.subscriptions.push(this.apiService.getAsset(this.url, params)
      .subscribe((response) => {
        if (response.success == true) {
          let partnerList = [];
          let partnerArray = response.data.result;
          for (var i = 0; i < partnerArray.length; i++) {
            if (partnerArray[i].status == 'approved' && this.transactionEntity!= partnerArray[i].code) { 
             partnerList.push(partnerArray[i]);
            }
          }
          this.partnerList = partnerList;
        }
      }))
  }

  onSelCategory(assetCat) {
  if(assetCat!=undefined){
    this.selectedassetCategory = assetCat._id
      this.enableAssetNameDrp=false;
      this.selectCategoryID= assetCat?._id;
      this.searchTransactionForm.get('assetName').reset();
    }
    this.getAssetsByTransType()
    this.enableAssetID = false;
  }
 
  changeEffectiveDate(value) {
    this.getExpiryDate(this.dateDuration)
  }

  async uploadFile(){
    let fileKeyArr = [];
    if(this.fileNative!=undefined){
      this.fileNative = this.fileNative.filter(function (e) {return e != null;});
      this.filenameArr = this.filenameArr.filter(function (e) {return e != null;});
    }
    if(this.fileUploadArr!=undefined){
      this.fileUploadArr = this.fileUploadArr.filter(function (e) {return e != null;});
      this.fileUploadNameArr = this.fileUploadNameArr.filter(function (e) {return e != null;});
    }
    let concatFileUploadArr = this.fileNative.concat(this.fileUploadArr)
    let concatFileUploadNameArr = this.filenameArr.concat(this.fileUploadNameArr)
    concatFileUploadArr.forEach((value,ind) => { 
      if(value!==undefined){
        const fileKeyDyn= "transactions/dynamic-media/"+concatFileUploadNameArr[ind];
        fileKeyArr.push(fileKeyDyn);
      } 
    });
    if(this.fileStaticName!=undefined){
      concatFileUploadArr=concatFileUploadArr.concat([this.fileValueStatic])
      const fileKeyStatic= "transactions/static-media/"+this.fileStaticName;
      fileKeyArr=fileKeyArr.concat([fileKeyStatic])      
     }
     if(this.fileCertName!=undefined){
      concatFileUploadArr=concatFileUploadArr.concat([this.fileValueCert])
      const fileKeyCert= "transactions/certificates/"+this.fileCertName;
      fileKeyArr=fileKeyArr.concat([fileKeyCert])
     }
    if(concatFileUploadArr!=undefined){
      this.loaderService.show();
      await this.uploadService.uploadFileSync(concatFileUploadArr,fileKeyArr)
        .then((dataReturn: any) => {
          if(dataReturn.length>0){
            this.loaderService.show();
            this.saveTransaction(this.url, this.dataPosts,dataReturn);
          //  this.loaderService.hide();
          }else{
            this.saveTransaction(this.url, this.dataPosts,undefined);
          }            
        })
        .catch((error) => {
        });
    }
  }

  async submitTransaction(data, data1, data2) {
    console.log("data:",data);
    if (data.invalid) {
      this.searchTransactionForm.get('assetName').markAsTouched();
      this.searchTransactionForm.get('assetLocation').markAsTouched();
      this.searchTransactionForm.get('effectiveDate').markAsTouched();
      this.searchTransactionForm.get('expiryPeriod').markAsTouched();
      this.searchTransactionForm.get('period').markAsTouched();
      this.searchTransactionForm.get('expiryDate').markAsTouched();
      this.searchTransactionForm.get('enteredquantity').markAsTouched();
      this.searchTransactionForm.get('entereduom').markAsTouched();
      this.searchTransactionForm.get('assetCategory').markAsTouched();
      this.searchTransactionForm.get('partners').markAsTouched();
      this.searchTransactionForm.get('assetLocation').markAsTouched();
      this.searchTransactionForm.get('refBranch').markAsTouched();
      return;
    }
    if (data2.invalid) {
      return;
    }

    if(this.chkLocationChosen_flag == false && this.eprFlag && !this.orderWithoutReference){
      this.chkLocation_lbl=true;
      return false;
    }

    this.formValues = JSON.stringify(data1.form.value);
    var allKeys = [];
    var allValues = [];
    var fields = {};
    allKeys = Object.keys(JSON.parse(JSON.stringify(data1.form.value)));
    allValues = Object.values(JSON.parse(JSON.stringify(data1.form.value)));
  
    for (var iLoop = 0; iLoop < allKeys.length; iLoop++) {
      fields[allKeys[iLoop]] = allValues[iLoop];
    }
    
    let transactionEntityType;
    if(this.corpFlag){
      transactionEntityType="Partner";
    }else{
      transactionEntityType="Organization";
    }

    let refEntityType;  
    if(this.refEntityTypePartner!=undefined){
      refEntityType=this.refEntityTypePartner;      
    }else{
      refEntityType = transactionEntityType;
    } 
    if(data.form.value.partners=="" && (this.orderReference=='' || this.orderReference==null)){
      this.refTransactionEntity = this.transactionEntity;
    }
    this.dataPosts = {
      organizationId: this.ids[0].organizationId,
      moduleCode: this.ids[0].module.code,
      transtypeCode: this.transactionType.transactionType.transactionTypeCode,
      transactionEntity: this.transactionEntity,
      transactionEntityType:transactionEntityType,
      refEntity: this.refTransactionEntity,
      refEntityType: refEntityType,      
      fields: fields,
      status: "New",
    }
    this.dataPosts.trans_from_address=data?.form?.value?.trans_from_address;
   
    if(this.referenceEntityBranch!="" && this.referenceEntityBranch!=undefined){
      this.dataPosts.refEntityBranch=this.referenceEntityBranch;
    }else{
      if(refEntityType!="Partner"){
        this.dataPosts.refEntityBranch= this.transactionEntityBranch;
      }
    }
    if(this.transactionEntityBranch!=="" && this.transactionEntityBranch!=undefined){
      this.dataPosts.transactionEntityBranch = this.transactionEntityBranch;
    }
    if(data.form.value.assetCategory!=""){
      if(this.transRoleFlag=="Digital"){
        this.dataPosts.eprAssetCategory= data.form.value.assetCategory ?data.form.value.assetCategory:'';
      }else{
        this.dataPosts.assetCategory= data.form.value.assetCategory ?data.form.value.assetCategory._id:'';
      }
    }
    // if(data2.form.value.assetLocationAuto!=""){
    //   this.dataPosts.location = data2.form.value.assetLocationAuto;
    // }
      this.dataPosts.geolocation = this.geolocation;
    if(data.form.value.assetName!=""){
      if(this.eprFlag && this.transRoleFlag=='Digital'){
        this.dataPosts.eprAssetName= data.form.value.assetName;
      }else{
        this.dataPosts.assetName= data.form.value.assetName;
      }
      
    }
    if(data.form.value.enteredquantity!=""){
      if(this.eprFlag && this.transRoleFlag=='Digital'){
        this.dataPosts.eprAssetQuantity=data.form.value.enteredquantity
      }else{
        this.dataPosts.assetQuantity =  data.form.value.enteredquantity;
      }      
    }
    if(data.form.value.entereduom!=""){
      if(this.eprFlag && this.transRoleFlag=='Digital'){
        if(this.transactionflag=="Asset")
          this.dataPosts.eprAssetUom=data.form.value.entereduom;
        else
          this.dataPosts.eprAssetUom=data.form.value.entereduom.uom;
      }else{
        this.dataPosts.assetUom = data.form.value.entereduom.uom;
      }
    }
    if(data.form.value.effectiveDate!=""){
      if(this.eprFlag && this.transRoleFlag=='Digital'){
        this.dataPosts.eprAssetMfgDate = moment(data.form.value.effectiveDate).utc().format();
      }else{
        this.dataPosts.effectiveDate = moment(data.form.value.effectiveDate).utc().format();
      }
    }    
    if(data.form.value.expiryDate!=""){
      if(this.eprFlag && this.transRoleFlag=='Digital'){
        this.dataPosts.eprAssetExpiryDate = moment(data.form.value.expiryDate).utc().format();
      }else{
        this.dataPosts.expiryDate = moment(data.form.value.expiryDate).utc().format();
      }
    }
    
    switch (this.transRoleFlag) {
      case 'Digital':
          if(this.transactionflag == 'Asset'){
            if(this.inputAssetflag == true){
              if(this.orderDetailsArray.length==0){
                this.chkAddRecordItems = true
                return false
              }else{
               this.chkAddRecordItems = false
              }
              this.dataPosts.inputEprAssets=this.orderDetailsArray;
              if(this.eprorderID!=undefined){
                this.dataPosts.eprOrderId=this.eprorderID;
              }
            }
            this.url = "/eprAsset/add_asset"; // Farm Produce // Process food - Same
          }else if(this.transactionflag == 'Order'){ 
           if(this.orderDetailsEprAllData==undefined || this.orderDetailsEprAllData?.length==0){
            this.chkAddRecordItems = true
            return false
          }else{
           this.chkAddRecordItems = false
          }
            this.dataPosts.eprOrderDetails = this.orderDetailsEprAllData     
            this.url = "/eprorder/add_eprorder"; // Target OrderPurchase Order //Ship Order - Same
          }
          break;
      case 'Physical':
          if(this.transactionflag == 'Asset'){
            if(this.assetDetailsData?.length>0){
              this.chkAddAssetItems = false
              for(var i = 0; i <  this.assetDetailsData?.length; i++) {
                this.assetDetailsData[i].organizationId= this.ids[0]?.organizationId
                this.assetDetailsData[i].moduleCode = this.ids[0]?.module.code
                this.assetDetailsData[i].transtypeCode=this.transactionType?.transactionType?.transactionTypeCode
                this.assetDetailsData[i].transactionEntity= this.transactionEntity
                this.assetDetailsData[i].transactionEntityType=transactionEntityType
                this.assetDetailsData[i].refEntity=this.refTransactionEntity
                this.assetDetailsData[i].refEntityType= refEntityType
                this.assetDetailsData[i].fields=fields
                this.assetDetailsData[i].status= "New"
                //this.assetDetailsData[i].location= data2?.form?.value?.assetLocationAuto!=""?data2?.form?.value?.assetLocationAuto:""
                this.assetDetailsData[i].geolocation= this.geolocation
                this.assetDetailsData[i].upload_file= this.fileStaticName
                this.assetDetailsData[i].upload_certificate= this.fileCertName
                this.assetDetailsData[i].refEntityBranch= this.dataPosts?.refEntityBranch
                this.assetDetailsData[i].transactionEntityBranch= this.dataPosts?.transactionEntityBranch
            }
          }else{
            this.chkAddAssetItems = true
            return false
          }
            this.dataPosts.assets =this.assetDetailsData; 
            delete this.dataPosts.organizationId   
            delete this.dataPosts.transtypeCode               
            delete this.dataPosts.transactionEntity                           
            delete this.dataPosts.transactionEntityType               
            delete this.dataPosts.refEntity               
            delete this.dataPosts.refEntityType               
            delete this.dataPosts.fields   
            delete this.dataPosts.status               
            //delete this.dataPosts.location               
            delete this.dataPosts.geolocation
            delete this.dataPosts.upload_file                           
            delete this.dataPosts.upload_certificate  
            delete this.dataPosts.moduleCode
            delete this.dataPosts.refEntityBranch
            delete this.dataPosts.transactionEntityBranch
            if(this.inputAssetflag == true){                     
              if(this.orderDetailsArray.length==0){
                this.chkAddRecordItems = true
                return false
              }else{
                this.chkAddRecordItems = false
              }
              this.dataPosts.inputAssets=this.orderDetailsArray;
            }
            this.url = "/asset/add_asset"; // Farm Produce // Process food - Same
          }else if(this.transactionflag == 'Order'){ // && this.inputAssetflag == false && (this.fromToEntityflag=='partner' || this.assetType == 'Receive Asset' || (this.fromToEntityflag == 'reference' && this.assetType == 'Consume Asset') || (this.fromToEntityflag == 'self' && this.assetType == 'Consume Asset'))){
            if(this.orderDetailsAllData==undefined || this.orderDetailsAllData?.length==0){
              this.chkAddRecordItems = true
              return false
            }else{
              this.chkAddRecordItems = false
            }
            this.dataPosts.orderDetails = this.orderDetailsAllData     
            this.url = "/order/add_order"; // Purchase Order //Ship Order - Same
          }
          break;
      default:
          if(this.transactionflag == 'Asset'){
            if(this.assetDetailsData?.length>0){
              this.chkAddAssetItems = false
              for(var i = 0; i <  this.assetDetailsData?.length; i++) {
                this.assetDetailsData[i].organizationId= this.ids[0]?.organizationId
                this.assetDetailsData[i].moduleCode = this.ids[0]?.module.code
                this.assetDetailsData[i].transtypeCode=this.transactionType?.transactionType?.transactionTypeCode
                this.assetDetailsData[i].transactionEntity= this.transactionEntity
                this.assetDetailsData[i].transactionEntityType=transactionEntityType
                this.assetDetailsData[i].refEntity=this.refTransactionEntity
                this.assetDetailsData[i].refEntityType= refEntityType
                this.assetDetailsData[i].fields=fields
                this.assetDetailsData[i].status= "New"
               // this.assetDetailsData[i].location= data2?.form?.value?.assetLocationAuto!=""?data2?.form?.value?.assetLocationAuto:""
                this.assetDetailsData[i].geolocation= this.geolocation
                this.assetDetailsData[i].upload_file= this.fileStaticName
                this.assetDetailsData[i].upload_certificate= this.fileCertName
                this.assetDetailsData[i].refEntityBranch= this.dataPosts?.refEntityBranch
                this.assetDetailsData[i].transactionEntityBranch= this.dataPosts?.transactionEntityBranch
            }
          }else{
            this.chkAddAssetItems = true
            return false
          }
            this.dataPosts.assets =this.assetDetailsData; 
            delete this.dataPosts.organizationId   
            delete this.dataPosts.transtypeCode               
            delete this.dataPosts.transactionEntity                           
            delete this.dataPosts.transactionEntityType               
            delete this.dataPosts.refEntity               
            delete this.dataPosts.refEntityType               
            delete this.dataPosts.fields   
            delete this.dataPosts.status               
           // delete this.dataPosts.location               
            delete this.dataPosts.geolocation
            delete this.dataPosts.upload_file                           
            delete this.dataPosts.upload_certificate  
            delete this.dataPosts.moduleCode
            delete this.dataPosts.refEntityBranch
            delete this.dataPosts.transactionEntityBranch
            if(this.inputAssetflag == true){
              if(this.orderDetailsArray.length==0){
                this.chkAddRecordItems = true
                return false
              }else{
                this.chkAddRecordItems = false
              }
              this.dataPosts.inputAssets=this.orderDetailsArray;
            }
            this.url = "/asset/add_asset"; // Farm Produce // Process food - Same
          }else if(this.transactionflag == 'Order'){ // && this.inputAssetflag == false && (this.fromToEntityflag=='partner' || this.assetType == 'Receive Asset' || (this.fromToEntityflag == 'reference' && this.assetType == 'Consume Asset') || (this.fromToEntityflag == 'self' && this.assetType == 'Consume Asset'))){
            if(this.orderDetailsAllData==undefined || this.orderDetailsAllData?.length==0){
              this.chkAddRecordItems = true
              return false
            }else{
              this.chkAddRecordItems = false
            }
            this.dataPosts.orderDetails = this.orderDetailsAllData     
            this.url = "/order/add_order"; // Purchase Order //Ship Order - Same
          }
          break;
  }
    this.uploadFile();

  }

  async saveTransaction(url, dataPosts,fileData){
    console.log("url",url);
    console.log("dataPosts",dataPosts);
    //  return false;
    if(fileData!=undefined){
      fileData.forEach(element => {
        if(element?.Key!=undefined){
          const splitKey=element?.Key.split('/')[1];
          if(this.fileStaticName!=undefined && splitKey=='static-media'){
            this.dataPosts.upload_file=this.fileStaticName;
          }
          if(this.fileCertName!=undefined && splitKey=='certificates'){
            this.dataPosts.upload_certificate=this.fileCertName;
          }
        }
      });
    }
    if(this.transactionflag == 'Asset'){
      delete dataPosts.upload_file                           
      delete dataPosts.upload_certificate 
    } 
      this.loaderService.show();
      this.subscriptions.push(this.apiService.post_transactions(url, dataPosts)
      .subscribe((response: any) => {   
          if (response.data) {
            if (response.success == true) {
              
              if(this.create!=undefined){
                this.snackbarService.openSuccessBar('Your Record is added successfully.', "Transaction");
                this.getTransactionData();
              }else{

                if(this.assetType == 'Receive Asset' && this.nftFlag == true){
                  this.snackbarService.openSuccessBar('The process of NFT transfer has been initiated.', "Transfer");
               
                  console.log("in receive asset condition");
                  this.orderItemList=dataPosts.orderDetails[0].orderItems;
                  console.log('this.orderItemList',this.orderItemList);
                  this.orderItemList.forEach( (itm, ind) => {
                    this.orderItemList[ind].ordered_assetId
                    // console.log("asset name", this.orderItemList[ind].ordered_assetId);
                    // console.log("nft_status",this.orderItemList[ind].nft_status);
                    if(this.orderItemList[ind].nft_status =="OnSale" || this.orderItemList[ind].nft_status =="Sold"){
                      this.transferNFT=this.transferNftService.loadWeb3(this.orderItemList[ind].ordered_assetId,this.orderItemList[ind].accepted_quantity,this.orderItemList[ind].entity_asset,dataPosts.trans_from_address); 
                      // this.contractService.updateAsset(this.orderItemList[ind].entity_asset,"Sold",null);
                    }else{
                      this.snackbarService.openSuccessBar('NFT is not on sale, so can not be transferred.', "NFT");
                    }
                  });                    
                }

                if(this.assetType == 'Consume Asset' && this.nftFlag == true){
                  this.snackbarService.openSuccessBar('NFT will be put on sale.', "Put on sale");
               
                  // console.log("in consume asset condition, ship order");
                  this.orderItemList=dataPosts.orderDetails[0].orderItems;
                  this.orderItemList.forEach( (itm, ind) => {
                    this.orderItemList[ind].ordered_assetId
                    // console.log("asset name", this.orderItemList[ind].ordered_assetId);
                    // console.log("nft_status",this.orderItemList[ind].nft_status);
                    if(this.orderItemList[ind].nft_status =="Created" || this.orderItemList[ind].nft_status =="Sold" || this.orderItemList[ind].nft_status =="OnSale" ){
                      this.transferNFT=this.putonsaleNftService.loadWeb3(this.orderItemList[ind].ordered_assetId,this.orderItemList[ind].entity_asset,response.data.transactionid, this.orderItemList[ind].line_number, this.orderItemList[ind].order_quantity); 
                      // this.contractService.updateAsset(this.orderItemList[ind].entity_asset,"OnSale",null);
                    }else{
                      this.snackbarService.openSuccessBar('NFT not found.', "NFT");
                    }
                  }); 
                }

                this.snackbarService.openSuccessBar('Your Record is added successfully.', "Transaction");
                this.router.navigate(['/transactions/transactions?dashboard=1']);
              }
              
            }
          }
      }))
  }

  getTransactionData(){
    this.urlUserAccess = "/useraccess/getPartnersByUserId";
    var params = new HttpParams();
    params = params.append('partnerId', this.loggedInUser._id);
    params = params.append('pagesize', '0');
    params = params.append('page', '50');
    this.subscriptions.push(this.apiService.get(this.urlUserAccess, params)
      .subscribe((response) => {
        if (response.success == true) {
          this.transcationTypeList = response.data.partners.partners
          let index = this.transcationTypeList.findIndex(x=>x._id == this.transactionDetailsId)
          if(index > -1){
            var transDetailId = this.transcationTypeList[index]
            sessionStorage.setItem('transcationType', JSON.stringify(transDetailId));
            this.router.navigate(['/transactions/transactions?dashboard=1']);
          }
        }
      }));
  }
  clearPurchaseOrderFields(){
    this.filter.searchorderID = ''
    this.readonlyOrderId='';
    if(this.orderReference == 'Internal'){
      this.refEntityName = '';
      this.orderTransactionID = '';
      if(this.assetType == 'Receive Asset'){
          this.assetName = '';
          this.quantity = '';
      }else{
      }
      this.uom = '';
    }else if(this.orderReference == 'Partner'){
      this.uom = '';
      this.transactionEntityName = '';
      this.orderTransactionID = '';
      if(this.assetType == 'Receive Asset'){
          this.assetName = '';
          this.quantity = '';
      }else{
      }
    }else{
    }
    this.readonlyLine='';
    this.getOrdersByTransType()
}

clearLineFields(){
  this.isReadOnlyLineNo = false;
  this.readonlyLine='';
}

onChangeAutoDetectLocation(event) {
  if (event.checked) {
    this.enableAutoAssetLocation= true;   
    this.chkLocationChosen_flag=true;    
    this.chkLocation_lbl=false;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          this.autoAssetLocationlat = position.coords.latitude;
          this.autoAssetLocationlang = position.coords.longitude;
          this.url = environment.bingMapBaseURL + "REST/v1/Locations/"+this.autoAssetLocationlat+","+this.autoAssetLocationlang;
          var params = new HttpParams();
          params = params.append('o', 'json');
          params = params.append('key', environment.bingMapAPIKey);
          this.subscriptions.push(this.apiService.getExternalURL(this.url, params)
            .subscribe((response: any) => {
              this.autolocation = response.resourceSets[0].resources[0].address;
              this.pdfTransactionForm.patchValue({ assetLocationAuto: this.autolocation.formattedAddress });

              // to set values to this.geolocation
              this.geolocation.address=this.autolocation.addressLine;
              this.geolocation.formattedAddress=this.autolocation.formattedAddress;
              this.geolocation.city=this.autolocation.locality;
              this.geolocation.state=this.autolocation.adminDistrict;
              this.geolocation.postalcode=this.autolocation.postalCode;
              this.geolocation.latitude=this.autoAssetLocationlat;
              this.geolocation.longitude=this.autoAssetLocationlang;
              this.geolocation.country=this.autolocation.countryRegion;
            }));
        }
      },
        (error) => console.log(error));
    } else {
    }


  } else {
    this.enableAutoAssetLocation= false;    
    this.chkLocationChosen_flag=false;
    this.chkLocation_lbl=true;
    this.pdfTransactionForm.patchValue({ assetLocationAuto: "" });
    this.autolocation='';
    
    // to delete values from this.geolocation
    this.geolocation.address="";
    this.geolocation.formattedAddress="";
    this.geolocation.city="";
    this.geolocation.state="";
    this.geolocation.postalcode="";
    this.geolocation.latitude="";
    this.geolocation.longitude="";
    this.geolocation.country="";
  }
}
ngOnDestroy() {
  this.subscriptions.forEach(subscription => subscription.unsubscribe());
}
@ViewChild("autoInputAssetID") autocompleteInputAssetID: MatAutocomplete;
@ViewChild("autoLocation") autocompleteLocation: MatAutocomplete;
@ViewChild("autoPurchaseOrder") autocompletePurchaseOrder: MatAutocomplete;
@ViewChild("autolineNo") autocompletelineNo: MatAutocomplete;
@ViewChild("id_Container") divs: ElementRef;
opened_AutoComplete = (elementID)=> {
  let inputWidth = this.divs.nativeElement.getBoundingClientRect().width
  setTimeout(()=>{
    
    var screen_width = window.innerWidth;
    if(screen_width < 960){	
      if(elementID=="autoLocation"){
        let panel = this.autocompleteLocation.panel?.nativeElement;
        if (!panel ) return		
        panel.style.maxWidth = (inputWidth - 50) + "px";
      }else if(elementID=="autoInputAssetID"){
        let panel = this.autocompleteInputAssetID.panel?.nativeElement;
        if (!panel ) return		
        panel.style.maxWidth = (inputWidth - 50) + "px";
      }else if(elementID=="autoPurchaseOrder"){
        let panel = this.autocompletePurchaseOrder.panel?.nativeElement;
        if (!panel ) return		
        panel.style.maxWidth = (inputWidth - 50) + "px";
      }else if(elementID=="autolineNo"){
        let panel = this.autocompletelineNo.panel?.nativeElement;
        if (!panel ) return		
        panel.style.maxWidth = (inputWidth - 50) + "px";
      }
    }
    
    })
} 

validateNo(e){
  this.validateNumber.validateNo(e);
  var theEvent = e || window.event;

    if (theEvent.type === 'paste') {
        key = e.clipboardData.getData('text/plain');
    } else {
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
      var regex = /[0-9]|\./;
      if( !regex.test(key) ) {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) theEvent.preventDefault();
      }
}

}

export const DataDynamicTable = [
  
];
