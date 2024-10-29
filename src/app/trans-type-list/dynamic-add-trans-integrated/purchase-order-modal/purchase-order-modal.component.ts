import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { take } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UploadService } from 'src/app/services/upload.service';
import { environment } from 'src/environments/environment';
import { LoaderService } from '../../../services/loader.service';
import { ValidateNumber } from '../../../validators/number.validator';
import { CompressImageService } from '../compress-image.service';
import { Subscription } from 'rxjs';

export interface UsersData {
  id:number;
  lineNo:number;
  assetName: string;
  enteredquantity: number;
  entereduom: string;
  assetId:string;
  transactionEntity:string;
  orderId:string;
  organizationId:string;
  refOrderTransactionid:string;
  assetCategory:string;
  lineList:object;
  effectiveDate:Date;
  expiryPeriod:string;
  expiryDate:Date;
  period:string;
}

@Component({
  selector: 'app-purchase-order-modal',
  templateUrl: './purchase-order-modal.component.html',
  styleUrls: ['./purchase-order-modal.component.css']
})
export class PurchaseOrderModalComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  @ViewChild('myModel',{static: false}) myModel: ModalDirective;
  showImg=[];
  faEye = faEye;
  faTrash= faTrash;
  urlSrc = [];
  isPdf: boolean = false;
  isImage: boolean = false;
  errMsg = [];
  imageError = [];
  selectedFiles: FileList;
  action:string;
  local_data:any;
  frmPurchaseOrder: FormGroup;
  srNo: any;
  assetsListLimited: { orderId: number; assetName: string; }[];
  assetsList: any[];
  url: string;
  typeOrd: any;
  transactionEntity: any;
  term: string;
  beforeTitle: string;
  availableQuantity: any;
  maxValFlag: boolean = false;
  minMaxFlag: boolean = false;
  organizationId: any;
  fields = [];
  transactionidFieldForm: FormGroup;
  dataSrc: any;
  updateFlag: boolean = false;
  fileUploaded = [];
  updateIndexField: number;
  srcArr: {};
  resultSrc = [];
  fileNative =[];
  filenameArr =[];
  withoutRefship:boolean = false;
  purchaseSaleOrderFlag: boolean = false;
  isReadonly: boolean = false;
  assetWithoutRefship: any;
  isAssetWithoutRefReadonly: boolean = false;
  uomLists = [];
  loggedInUser: any;
  assetCategoryList =[];
  assetCatNameLists =[];
  enableAssetNameDrp: boolean = true;
  selectCategoryID: any;
  updateShowImg = [];
  assetCateroyLists =[];
  isReadOnlyAssetID:boolean;
  transactionType: any;
  eprFlag: boolean = false;
  transRoleFlag: any;
  transactionEntityBranch: any;
  inputAssetFlag:boolean = false;
  eprReceiveFlag:boolean = false;
  eprConsumeFlag:boolean = false;
  certFileName: any;
  pdfUrl: string="";
  certFlag: boolean =false;
  isReadonlyUom: boolean = false;
  stateList =[];
  showFromDb = [];
  dynamicFolderName: string;
  traceChainUrl: string;
  Quantity_decimal:any;
  uomListUom
  qty: any;
  uomListUoms
  assetUOMval
  entereQuantity: any;
  old_entereQuantity;
  dateDuration: any;
  expiryPeriod: any;
  planModel: { start_time: Date; };
  expiryDate: any;
  searchInputAssetID=null;
 filterInputAsset: any={searchInputAssetID: ''};

	constructor(public router: Router,
    private uploadService: UploadService,
    public apiService: ApiService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PurchaseOrderModalComponent>,
    private compressImage: CompressImageService, 
    public loaderService: LoaderService,
    public validateNumber: ValidateNumber,
    public snackbarService: SnackbarService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UsersData) {

      this.local_data = {...data};
      console.log("this.local_data",this.local_data);
      this.transactionType = JSON.parse(sessionStorage.getItem('transcationType'));
      this.eprFlag = this.transactionType?.transactionType?.epr;
      this.transRoleFlag = this.transactionType?.transactionType?.transRole;
      this.inputAssetFlag = this.transactionType?.transactionType?.inputAsset;
      this.eprReceiveFlag = this.transactionType?.transactionType?.eprReceive;
      this.eprConsumeFlag = this.transactionType?.transactionType?.eprConsume;
      
      if(this.local_data.srcarr!=undefined){
        this.resultSrc = this.local_data.srcarr;
      }
      if(this.local_data.fileNative!=undefined){
        this.fileNative = this.local_data.fileNative;
      }
      if(this.local_data.filenameArr!=undefined){
        this.filenameArr= this.local_data.filenameArr;
      }
      
      this.fields = this.local_data.lineList;
      if(this.local_data.acceptedQuantity==undefined){
        this.local_data.acceptedQuantity ="";
      }
      if(this.local_data.assetId==undefined){
        this.local_data.assetId ="";
      }
      if(this.local_data.assetName==undefined){
        this.local_data.assetName ="";
      }
      if(this.local_data.comment==undefined){
        this.local_data.comment ="";
      }
      if(this.local_data.enteredquantity==undefined){
        this.local_data.enteredquantity ="";
      }
      if(this.local_data.entereduom==undefined){
        this.local_data.entereduom ="";
      }
      if(this.local_data.rejectedQuantity==undefined){
        this.local_data.rejectedQuantity ="";
      }
      
      this.action = this.local_data.action;
      this.typeOrd = this.local_data.typeOrd;
      this.withoutRefship = this.local_data.withoutRefship;
      if(this.local_data.orderItemDetails!=undefined){
        this.assetWithoutRefship = this.local_data.orderItemDetails.referredAsset;
      }
      if(this.local_data.typeOrd=='Material Receipt' || this.local_data.independentRefOnlyOrder==true){
        this.isAssetWithoutRefReadonly = true
      }
      this.purchaseSaleOrderFlag = this.local_data.purchaseSaleOrderFlag;
      this.transactionEntity = this.local_data.transactionEntity;
      this.organizationId = this.local_data.organizationId;

      this.frmPurchaseOrder = this._formBuilder.group({
        lineNo:[],
        assetName: ['',[Validators.required]],
        enteredquantity: ['',[Validators.required,Validators.max(this.local_data?.availableQuantity),Validators.pattern('^0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*$')],],
        entereduom: ['',[Validators.required]],
        assetId:[''],
        readonlyAssetId:[''],
        orderId:[''],
        acceptedQuantity:[''],
        rejectedQuantity:[''],
        comment:[''],
        srno:[{ value: '', disabled: true }],
        assetCategory: ['',[Validators.required]],
        state: [''],
        effectiveDate:[''],
        expiryPeriod:[''],
        period:[''],
        expiryDate:['']
      });

      if(this.action=="Update"){
        this.old_entereQuantity = this.local_data.enteredquantity
        if(this.local_data?.srcarr!=undefined && this.local_data?.actionFlag!='update'){
          const keysValue = Object.keys(this.resultSrc);
          const keysValueFileN = Object.keys(this.fileNative);
          if(keysValue.length>0){
            for(var i = 0; i < keysValue.length; i++) {
              this.updateShowImg[keysValue[i]] = false;
              if(this.local_data.srcarr[i]){
                this.updateIndexField = i;
              }
              if(keysValue[i]==keysValueFileN[i]){
                this.showImg[keysValue[i]] = true;
              }else{
                this.showImg[keysValue[i]] = false;
              }
              if(this.resultSrc[keysValue[i]]==this.fileNative[keysValue[i]]){
                  this.updateShowImg[keysValue[i]] = true;
              }else{
                  this.updateShowImg[keysValue[i]] = false;
              }
            }
          }else{
            const keysValue = Object.keys(this.local_data.lineList);
            for(var i = 0; i < keysValue.length; i++) {
              if(this.local_data.lineList[i].value=="File"){
                this.updateShowImg[keysValue[i]] = false;
              }
            }
          }
          
          this.updateFlag = true;
          this.enableAssetNameDrp=false;
        }else if(this.local_data?.actionFlag=='update'){
          const keysValue = Object.keys(this.local_data);
          for(var i = 0; i < keysValue.length; i++) {
            this.local_data.lineList.map( async(value, index) => {               
              if(value.key==keysValue[i]){
                this.showImg[index] = false;
                if(value.value=='File' && (this.local_data[value.key]!='' && this.local_data[value.key]!=undefined)){
                  this.showFromDb[index] = this.local_data[value.key];
                  this.showImg[index] = true;
                }
              }
            });
          }
        }  
      }else{
        this.updateFlag = false;
      }      
    }	

  ngOnInit(): void {
    if(this.local_data.typeOrd=='asset'){
      if(this.action=='Add'){
        this.planModel = { start_time: new Date() };
      }else if(this.action=='Update'){
        this.planModel={ start_time:this.local_data?.effectiveDate };
      }
    }
    
    
    this.traceChainUrl = environment.awsImgPath;
    this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
    if ('corpData' in this.loggedInUser) {
      this.organizationId = this.loggedInUser.corpData.organizationId;
    } else {
      this.organizationId = this.loggedInUser.reference.organizationId;
      this.transactionEntityBranch=this.loggedInUser.branchCode
    }
    this.getAssetCategoriesByTransType();
    
    if(this.purchaseSaleOrderFlag || (this.local_data.typeOrd=='Ship Order' && this.local_data.assetWithoutReference && this.local_data.withoutRefship==true) || this.local_data.typeOrd=='asset'){ //actionFlag for update from API
      this.isReadonly = false;
      this.isReadonlyUom = false;
    }else{
        if(this.local_data.actionFlag=='update' ){
          this.isReadonlyUom = false;
        }else{
          this.isReadonlyUom = true;
        }
        this.isReadonly = true;
    }
    if(this.typeOrd=='Ship Order' && this.withoutRefship==false && this.action!="Delete"){
      this.beforeTitle= 'Purchase Order';
      this.getAssetsByTransType();
    }else if(this.typeOrd=='Material Receipt'){
      this.beforeTitle= 'Ship Order';
    }

    if(this.typeOrd=='Ship Order' && this.withoutRefship==false && this.action=='Add' && this.local_data.assetWithoutReference!=true){
      const controlAssetId = <FormControl>this.frmPurchaseOrder.get('readonlyAssetId');
      controlAssetId.setValidators([Validators.required]);
    }

    if(this.typeOrd=='Material Receipt'){
      const controlAcceptedQuantity = <FormControl>this.frmPurchaseOrder.get('acceptedQuantity');
      controlAcceptedQuantity.setValidators([Validators.required]);
      const controlRejectedQuantity = <FormControl>this.frmPurchaseOrder.get('rejectedQuantity');
      controlRejectedQuantity.setValidators([Validators.required]);
    }

    if(this.local_data.typeisExpiry==true){
      const controlEffectiveDate = <FormControl>this.frmPurchaseOrder.get('effectiveDate');
      controlEffectiveDate.setValidators([Validators.required]);
      const controlExpiryPeriod = <FormControl>this.frmPurchaseOrder.get('expiryPeriod');
      controlExpiryPeriod.setValidators([Validators.required, Validators.min(1)]);
      const controlPeriod = <FormControl>this.frmPurchaseOrder.get('period');
      controlPeriod.setValidators([Validators.required]);
      const controlExpiryDate = <FormControl>this.frmPurchaseOrder.get('expiryDate');
      controlExpiryDate.setValidators([Validators.required]);
    }
    if(this.fields?.length>0){
      this.generateFieldsForm();
    }   
    this.getUom();
    this.getState()    
    if(this.local_data.enteredquantity!=undefined){
      this.entereQuantity= this.local_data.enteredquantity;
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.frmPurchaseOrder.controls[controlName].hasError(errorName);
  }
  doAction(){
    const {value, valid} = this.frmPurchaseOrder;
    if(this.local_data.action=="Delete"){
      this.dialogRef.close({event:this.action,data:this.local_data});
    }else{
      if(valid){
        this.local_data.assetCategoryName = this.assetCateroyLists[this.frmPurchaseOrder?.value?.assetCategory]?.assetCategory;
        if(this.typeOrd=='asset'){
          if(this.planModel?.start_time!=undefined){
            this.local_data.effectiveDate=this.planModel?.start_time;
          }
          if(this.expiryDate!=undefined){
            this.local_data.expiryDate=this.expiryDate;
          }
        }
        
       if(this.transactionidFieldForm!=undefined){
        const {value, valid} = this.transactionidFieldForm;
        this.local_data.lineList=this.transactionidFieldForm.value;
        this.local_data.srcarr = this.resultSrc;
        this.local_data.fileNative = this.fileNative;
        this.local_data.filenameArr = this.filenameArr;
       }
        this.dialogRef.close({event:this.action,data:this.local_data});
      }      
    }   
  }

  callInputAssetAPI(event){
    this.filterInputAsset.searchInputAssetID=event;
    this.getAssetsByTransType();
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
          let assetCatList = [];
          let assetCatNameList = [];
          let assetCateroyList = [];
          let assetCatArray = response.data.result;
          for (var i = 0; i < assetCatArray.length; i++) {
            if(assetCatArray[i].assetCategory!=undefined){
              assetCatList.push(assetCatArray[i]);
              assetCatNameList[assetCatArray[i]._id]=assetCatArray[i].assetList;
              assetCateroyList[assetCatArray[i]._id]=assetCatArray[i];
            }            
          }
          this.assetCategoryList = assetCatList;
          this.assetCatNameLists = assetCatNameList;
          this.assetCateroyLists = assetCateroyList;
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
  getUom() {
    this.url = "/uom";
    var params = new HttpParams();
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

  async onSelCategory(assetCat) {
    this.enableAssetNameDrp=false;
    if(assetCat!==undefined){
      this.selectCategoryID= assetCat._id;
      this.local_data.assetCategory = assetCat._id;
    }
   } 

  getAssetsByTransType() {
    var params = new HttpParams();
    if(this.eprFlag && this.transRoleFlag=='Digital'){
      this.url = "/eprAsset/get_epr_entityAssets";
      params = params.append('eprAssetCategoryId', this.local_data.assetCategory);
      params = params.append('state', this.local_data.state);
      params = params.append('eprAssetType','Certificate');
    }else{
      this.url = "/asset/get_entity_assets"; 
      params = params.append('allFields', 'true'); 
      params = params.append('nftFlag', 'true');   
    }
    if(this.transactionEntityBranch!=undefined){
      params = params.append('transactionEntityBranch', this.transactionEntityBranch);
    }
      
    if(this.filterInputAsset.searchInputAssetID){
      params = params.append('inputAssetSearch_key', this.filterInputAsset.searchInputAssetID);  
    }
    params = params.append('organizationId', this.organizationId);
    params = params.append('transactionEntity', this.transactionEntity);
    if(this.local_data.assetCategoryName){
      params = params.append('assetCategory',this.local_data.assetCategoryName);
    }
    params = params.append('limit', '10');

    this.subscriptions.push(this.apiService.getAsset(this.url, params)
        .subscribe((response: any) => {
          if (response.data && response.data.result) {
            if(response.data.totalCount != 0){
              var assetList = [];
            var assetsSuggestArr=[];
              var assetArray = response.data.result;
              for (var i = 0; i < assetArray.length; i++) {
                if(assetArray[i].assetId != null){  
                    assetList.push(assetArray[i]);
                    this.assetsList = assetList; 
                }else{
                  this.assetsListLimited = [{ orderId: 0, assetName: 'No record found' }];
                }
              }
              
              if(this.eprFlag && this.transRoleFlag=='Digital'){
                assetArray.forEach(function (value) {
                    const addassetsList = {
                      assetId:value.eprAssetId,
                      assetUom:value.asset?.eprAssetUom,
                      transactionid:value.eprTransactionid,
                      assetCategory:value.asset?.eprAssetCategory,
                      assetName: value.asset?.eprAssetName,
                      assetQuantity:(value.balancedQuantity).toFixed(value.uom.decimal),
                      transactionEntity:value.asset?.transactionEntity,
                      entityAsset:value.asset.eprEntityAsset,
                      certificateNumber:value.asset?.certificateNumber,
                    };
                  assetsSuggestArr.push(addassetsList);   
               });
              }else{
                  if(this.assetsList!=undefined){
                    this.assetsList.forEach(function (value) {
                      let addassetsList = {
                        assetId:value.assetId,
                        assetUom:value.assetUom,
                        transactionid:value.asset?.transactionid,
                        assetCategory:value.asset?.assetCategory,
                        assetName: value.asset?.assetName,
                        assetQuantity:(value.balancedQuantity).toFixed(value.uom.decimal),
                        refAsset:value.refAsset,
                        entityAsset:value.entityAsset,
                        assetCategoryName:value.assetcategory?.assetCategory,
                        nft_status:value.asset?.nft_status
                      };
                      assetsSuggestArr.push(addassetsList);   
                  }); 
                }
              }
                this.assetsListLimited=assetsSuggestArr;
            }else{
              this.assetsListLimited = [{ orderId: 0, assetName: 'No record found' }];
            }            
            
          }else{
              this.assetsListLimited = [{ orderId: 0, assetName: 'No record found' }];
          }
        }));       
  }

  async onSelAssetID(assetData) {
    this.isReadOnlyAssetID=true;
    if(assetData!==undefined){
      let assetArr = (assetData!='') ? assetData.split("|") :[];
      const obj =assetArr[0]+"|"+assetArr[2]+"|"+assetArr[1]+"|"+assetArr[4]+"|"+assetArr[3]
      await this.frmPurchaseOrder.patchValue({readonlyAssetId:obj});
      if(this.transRoleFlag=='Digital' && this.eprFlag && this.eprConsumeFlag){
        this.local_data.assetId =assetArr[1];
        this.local_data.assetName =assetArr[2];
        this.local_data.entereduom =assetArr[3];
        this.local_data.entity_asset =assetArr[5];
        this.local_data.assetCategory =assetArr[6];
        this.local_data.enteredquantity =assetArr[4];
        this.entereQuantity=assetArr[4];
        this.certFileName=assetArr[7];
        const bucketName= environment.EPRCertBucket;
        const returnRes= await this.uploadService.fileExist(bucketName,this.certFileName)
        if(returnRes==true){
          this.pdfUrl = environment.awsEprCertPath +this.certFileName;
         }else{
         this.pdfUrl = "";
        }
      }else{
        this.local_data.assetId =assetArr[1];
        this.local_data.assetName =assetArr[2];
        this.local_data.entereduom =assetArr[3];
        this.local_data.entity_asset =assetArr[5];
        this.local_data.assetCategory =assetArr[6];
        this.qty =assetArr[4];
        this.entereQuantity=assetArr[4];
        this.local_data.nft_status =assetArr[8];
      }
    }
  }
  clearAssetIdFields(){
    this.isReadOnlyAssetID=false;
    this.filterInputAsset.searchInputAssetID='';    
    this.getAssetsByTransType();
  }
  availQtyValidation(event){
    if(this.local_data?.typeOrd=='Ship Order' && this.local_data?.withoutRefship==false && event!=undefined){
      const controlQty= <FormControl>this.frmPurchaseOrder.get('enteredquantity');
      controlQty.setValidators([Validators.required,Validators.max(this.qty),Validators.pattern('^0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*$')]);
    }
  }
  quantityValidation(){
    this.local_data.rejectedQuantity = "";
    if(this.local_data.rejectedQuantity==''){
      this.minMaxFlag = false;
      this.maxValFlag = true;
      const controlquantity= <FormControl>this.frmPurchaseOrder.get('acceptedQuantity');
      controlquantity.setValidators([Validators.required, Validators.min(0),Validators.max(this.local_data.enteredquantity)]);
    }else{
      this.maxValFlag = false;
      this.minMaxFlag = true;
      const sumValue =this.local_data.enteredquantity+this.local_data.rejectedQuantity;
      const diffValue =this.local_data.enteredquantity-this.local_data.rejectedQuantity;
      const controlquantity= <FormControl>this.frmPurchaseOrder.get('acceptedQuantity');
      if(sumValue!=this.local_data.enteredquantity && this.local_data.rejectedQuantity>0){
        controlquantity.setValidators([Validators.required, Validators.min(diffValue),Validators.max(diffValue)]);
      }else if(this.local_data.acceptedQuantity<0){
        controlquantity.setValidators([Validators.required, Validators.min(diffValue),Validators.max(diffValue)]);    
      }else{
        controlquantity.setValidators([Validators.required]);
      }
    } 
    const diffValueRej =this.local_data.enteredquantity-this.local_data.acceptedQuantity;
    if(diffValueRej>0){
      this.local_data.rejectedQuantity = diffValueRej.toFixed(this.uomListUom.decimal);
    }else{
      this.local_data.rejectedQuantity = 0;
    }
    
  }
 
  rejQuantityValidation(){
    this.local_data.acceptedQuantity = "";
    if(this.local_data.acceptedQuantity==''){
      this.minMaxFlag = false;
      this.maxValFlag = true;
      const controlquantity= <FormControl>this.frmPurchaseOrder.get('rejectedQuantity');
      controlquantity.setValidators([Validators.required, Validators.min(0),Validators.max(this.local_data.enteredquantity)]);
    }else{
      this.maxValFlag = false;
      this.minMaxFlag = true;
      const sumValue =this.local_data.enteredquantity+this.local_data.acceptedQuantity;
      const diffValue =this.local_data.enteredquantity-this.local_data.acceptedQuantity;
      const controlquantity= <FormControl>this.frmPurchaseOrder.get('rejectedQuantity');
      if(sumValue!=this.local_data.enteredquantity && this.local_data.acceptedQuantity>0){
         controlquantity.setValidators([Validators.required, Validators.min(diffValue),Validators.max(diffValue)]);
      }else if(this.local_data.rejectedQuantity<0){
       controlquantity.setValidators([Validators.required, Validators.min(diffValue),Validators.max(diffValue)]);    
      }else{
       controlquantity.setValidators([Validators.required]);
      }
    } 
    const diffValueRej =this.local_data.enteredquantity-this.local_data.rejectedQuantity;
    this.local_data.acceptedQuantity = diffValueRej.toFixed(this.uomListUom.decimal);
  }

  generateFieldsForm() {
    var formDataObj = {};
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
        this.transactionidFieldForm.controls[formDataKey].setValue('');
      } else if (this.fields[i].value == "String") {
        this.transactionidFieldForm.controls[formDataKey].setValue('');
      } else if (this.fields[i].value == "Number") {
        this.transactionidFieldForm.controls[formDataKey].setValue('');
      } else if (this.fields[i].value == "File") {
        this.transactionidFieldForm.controls[formDataKey].setValue('');
      } else if (this.fields[i].value == "JSON") {
        this.transactionidFieldForm.controls[formDataKey].setValue('');
      }
    }
  }

  chooseFile(event, keys,index) {
    this.selectedFiles = event.target.files;   
    //const max_size =  10485760 //20971520;    
    const allowed_types = ['image/png', 'image/jpeg','image/jpg','application/pdf'];
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
        this.imageError[index] = 'Only Files are allowed ( JPG | PNG | JPEG | PDF)';
        return false;
    }
    
    const srcKey = {};
    const keyTxt =keys+'_view'+(this.local_data.id-1)+'_'+index;
      
    this.fileUploaded[index]=event.target.files; 
    const filename =this.uploadService.findFileName(this.selectedFiles[0].name);
    const uploadedFilesType=this.selectedFiles[0].type;
    this.showImg[index] =true;
      
    if(uploadedFilesType=='image/jpeg' || uploadedFilesType=='image/jpg' || uploadedFilesType=='image/png')
    {
      this.loaderService.show();
      let image: File = this.selectedFiles.item(0);
     // this.subscriptions.push(
        this.compressImage.compress(image)
      .pipe(take(1))
      .subscribe(compressedImage => {
        var reader = new FileReader();
        reader.readAsDataURL(compressedImage);
        reader.onload = (event: any) => {
          this.resultSrc[index] = event.target.result;          
          //const file = compressedImage;
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
};


async previewFile(files, index, keys){
  this.loaderService.show();
  if(this.updateFlag){
    const splitExt =files.split(";base64")[0];
    const ext = splitExt.split("/")[1];
    if(ext == "pdf") {
      this.isImage = false;
      this.isPdf = true;      // required, going forward
    }else {
        this.isPdf = false;
        this.isImage = true;    // required, going forward
    }
    this.urlSrc[this.updateIndexField] = files;

  }else{
    if (files && files[0]) {
      if(files[0].type == "application/pdf") {
          this.isImage = false;
          this.isPdf = true;      // required, going forward
      }
      else {
          this.isPdf = false;
          this.isImage = true;    // required, going forward
      }
      
      this.urlSrc[index] = this.resultSrc[index];
      this.showFromDb[index] = undefined
      this.updateIndexField = index;
    }else if(this.local_data.actionFlag=='update'){
            this.updateIndexField = index;
            const ext = this.showFromDb[index]?.split('.').pop();
            if(ext == "pdf") {
              this.isImage = false;
              this.isPdf = true;      
            }else {
              this.isPdf = false;
              this.isImage = true;    
            }
            this.dynamicFolderName = "transactions/dynamic-media/"
            const bucketName= environment.Bucket
            const fileName= this.dynamicFolderName + this.showFromDb[index]
            const returnRes= await this.uploadService.fileExist(bucketName,fileName)
            
            if(returnRes==true){
              this.myModel.show();
              this.urlSrc[index] =this.dynamicFolderName + this.showFromDb[index];
            }else{
              this.snackbarService.openSuccessBar("File not found", "File");
            }
         }
  }
  this.myModel.show();
  this.loaderService.hide();
}

deletePreviewFile(keys, index){
  const keysValue = Object.keys(this.fileNative);
  for(var i = 0; i < keysValue.length; i++) {
    if(keysValue[i]==index){
       delete this.fileNative[index];
       delete this.filenameArr[index];
       delete this.resultSrc[index];
    }
  }
  this.transactionidFieldForm.controls[keys].setValue('');
  this.updateShowImg[index] = true;
  this.showImg[index]=false
}

previewCertFile(){
  this.certFlag=true;
  const filePath = environment.awsEprCertPath+this.certFileName;
  window.open(filePath, "_blank");  
}

onChangeUOM(event: any){
  this.uomLists.forEach((value,ind) => { 
    if(event==value.uom){
      this.uomListUom=value;
    } 
  }); 
  this.frmPurchaseOrder.patchValue({enteredquantity:''});
  if(this.uomListUom != undefined){
    this.isAssetWithoutRefReadonly = false
  }
  if(this.uomListUom != undefined){
    this.Quantity_decimal = this.uomListUom.decimal - 1
  }
}

getDecimal(){
  if(this.local_data.entereduom != undefined){
    this.uomLists.forEach((value,ind) => { 
      if(this.local_data.entereduom==value.uom){
        this.uomListUom=value;
      } 
    }); 
    if(this.uomListUom != undefined){
      this.Quantity_decimal = this.uomListUom.decimal
    }
  }
  let pattern = new RegExp('^$|^[0-9]+(\.[0-9]{0,'+this.Quantity_decimal+'})?$')
  let result = pattern.test(this.entereQuantity);
  if(!result){
    if(this.entereQuantity == null){
      this.entereQuantity =  this.local_data.enteredquantity;
      this.local_data.enteredquantity = this.local_data.enteredquantity;
    }else{
      this.entereQuantity = this.old_entereQuantity;
      // this.local_data.enteredquantity =this.old_entereQuantity;
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

changeEffectiveDate(value) {
  this.getExpiryDate(this.dateDuration)
}

getExpiryDate(event: any) {
  var period
  if(this.action=='Update' && this.expiryPeriod==undefined){
    period = this.local_data?.expiryPeriod;
  }else{
    period = this.expiryPeriod;
  }
  this.dateDuration = event
  if(this.dateDuration!=undefined){
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


  hide(){
    this.myModel.hide();
  }
  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }
  
  @ViewChild("autoAssetIdPopup") autocompleteAssetIdPopup: MatAutocomplete;
  @ViewChild("matDialogContainer") divs: ElementRef;
  opened_AutoComplete = ()=> {
    let inputWidth = this.divs.nativeElement.getBoundingClientRect().width
    setTimeout(()=>{    
    var screen_width = window.innerWidth;
    if(screen_width < 960){	
      let panel = this.autocompleteAssetIdPopup.panel?.nativeElement;
      if (!panel ) return		
      panel.style.maxWidth = (inputWidth - 50) + "px";
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
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  };
}