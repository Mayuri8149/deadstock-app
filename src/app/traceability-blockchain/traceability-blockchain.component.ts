import { Component, OnInit,  ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SnackbarService } from '../services/snackbar.service';
// import 'rxjs';
import { HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UploadService } from '../services/upload.service';
import { faEye, faHandPointLeft, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Location } from '@angular/common';
import { DatetimeConvertor } from 'src/app/services/datetime-convertor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-traceability-blockchain',
  templateUrl: './traceability-blockchain.component.html',
  styleUrls: ['./traceability-blockchain.component.css']
})
export class TraceabilityBlockchainComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  faHandPointLeft = faHandPointLeft;
  faEye=faEye
  traceabilityFrm: FormGroup;
  url: string;
  seData = {
    organizationId: '',
    transactionCode:[],
    inputAssetArr:[],
    fabricOrgId:'',
    orderId:''
	};
  loggedInUser: any = {}
  orgData: any;
  selectedArr = [];
  transTypeData: any;
  transactionData: any;
  filtered: any;
  selectedTransactArr = [];
  assetData: any;
  readonlyOrderId;
  transactionId: any;
  transactionEntity: any;
  transactionCode = [];
  inputAssetArr = [];
  assetDataList = [];
  inputAssetIdArr = [];
  assetId: any;
  combineInputAssetIDArr = [];
  organizationId: any;
  assetCategoryList = [];
  assetCategory: any;
  entityAsset:any;
  assetListByAssetID = [];
  inputAssArr = [];
  inputAssetShowArr: any =[];
  inputAssNameArr: any =[];
  tracebilityQty = [];
  tracebilityLoc = [];
  displayMediaArr = [];
  extrafieldArr = [];
  finalSqArr =[];
  backFlag: boolean = false;
  assetName: any;
  assetIdBack: any;
  obj: string;
  transactionDataBC = [];
  tracebilityCert =[];  
  countPlus =0;
  addFlag: boolean = false; 
  constructor(private _formBuilder: FormBuilder,
              private apiService: ApiService,
				      public router: Router,
				      public snackbarService: SnackbarService,
              private location: Location,
              private uploadService: UploadService,
              public datetimeConvertor: DatetimeConvertor) { }

  ngOnInit(): void {
    this.traceabilityFrm = this._formBuilder.group({
			transactionId: [''],
      readonlyOrderId : [{value: '', disabled: true}],
		});
    this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
		if (typeof this.loggedInUser.timeZone === 'undefined' || this.loggedInUser.timeZone == null || this.loggedInUser.timeZone == '') {
			this.loggedInUser.timeZone = 'Asia/Kolkata'
		}
    if ('corpData' in this.loggedInUser) {
      this.organizationId = this.loggedInUser.corpData.organizationId;
    } else {
      this.organizationId = this.loggedInUser.reference.organizationId;
    }
    this.getAssetData();
    this.getAssetCategoriesByTransType();
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
          var assetCatListArr = [];
          var assetCatArray = response.data.result;
          for (var i = 0; i < assetCatArray.length; i++) {
            if(assetCatArray[i].assetCategory!=undefined){
              assetCatListArr[assetCatArray[i]._id]=assetCatArray[i];
            }            
          }
          this.assetCategoryList = assetCatListArr;
        }        
      }));
  }
  getAssetData(){
    this.url = "/asset/get_assets_list";
    var params = new HttpParams();
    //this.transactionEntity = this.loggedInUser.organizationCode;
    params = params.append('organizationId', this.loggedInUser.reference.organizationId);
    this.subscriptions.push(this.apiService.getAsset(this.url, params)
      .subscribe((response) => {
        if(response.success == true) {          
          this.assetData = response.data; 
          for(var i = 0; i < this.assetData.length; i++) {
            if(this.assetData[i].inputAssets!=null){                       
              this.inputAssetArr[this.assetData[i].assetId]=this.assetData[i].inputAssets;
            }
            this.assetListByAssetID[this.assetData[i].entityAsset]=this.assetData[i];
            this.assetDataList.push(this.assetData[i]);
          } 
        }
      }));
  }

  clearInputBox(){
    this.readonlyOrderId='';
    this.traceabilityFrm.get('transactionId').setValue('');
    this.selectedTransactArr = [];
    this.transactionId = "";
    this.assetId = "";
    this.entityAsset = "";
    this.inputAssetIdArr=[];
    this.inputAssNameArr=[];
    this.inputAssetShowArr=[];
    this.assetIdBack="";
    this.finalSqArr=[];
    this.transactionData = [];
    this.selectedArr =[];
    this.inputAssetShowArr =[];
    this.tracebilityQty=[];
    this.inputAssArr =[];
    this.tracebilityLoc= [];
    this.displayMediaArr= [];
    this.extrafieldArr= [];
  }


  unsetArrEvent(e){
    // this.readonlyOrderId='';
    // this.traceabilityFrm.get('transactionId').setValue('');
    this.selectedTransactArr = [];
    this.transactionId = "";
    this.assetId = "";
    this.entityAsset = "";
    this.inputAssetIdArr=[];
    this.inputAssNameArr=[];
    this.inputAssetShowArr=[];
    this.finalSqArr=[];
    this.transactionData = [];
    this.selectedArr =[];
    this.inputAssetShowArr =[];
    this.tracebilityQty=[];
    this.inputAssArr =[];
    this.tracebilityLoc= [];
    this.displayMediaArr= [];
    this.extrafieldArr= [];
  }

onSelectInput(searchData) {
  if(!this.addFlag){
    let getDataTrace=JSON.parse(localStorage.getItem('setForwardArr'));
    let setForwardArr:any = [];
    setForwardArr[this.countPlus]=searchData;
    if(getDataTrace!=null){
      setForwardArr = setForwardArr.concat(getDataTrace);
    }
    localStorage.setItem("setForwardArr", JSON.stringify(setForwardArr));
  }
  if(searchData!==undefined){
    let searchArr = (searchData!='') ? searchData?.split("|") :[];
      if(searchArr.length>0){
        this.assetId=searchArr[1];
        this.entityAsset=[searchArr[2]]; 
        this.assetCategory=searchArr[3];       
        const obj = searchArr[0]+'|'+searchArr[1]+'|'+searchArr[2]
        this.traceabilityFrm.patchValue({transactionId:obj}); 
        //if(!this.backFlag){
          // this.assetName =searchArr[0];
          // this.transactionId=searchArr[2];
          // this.assetIdBack=searchArr[1];        
        // }else{
        // }
        
        this.organizationData()
        .then((dataReturn: any) => {
          if(dataReturn.length>0){
            this.searchData();  
          }else{
            this.snackbarService.openSuccessBar('Please setup asset traceability first.', "");
          }            
        })
        .catch((error) => {
        }); 
      }
  }else{
    this.snackbarService.openSuccessBar('No asset available.', "Asset");
  }  
}


  organizationData() {  
		var promise = new Promise(async (resolve, reject) => {
		try {
        this.url = "/assettracebility/"+this.loggedInUser.reference.organizationId;
        var params = new HttpParams();			
        this.subscriptions.push(this.apiService.get(this.url, params)
          .subscribe((response: any) => {
          if(response.data.result.isError){
              var returnArr = []              
              resolve(returnArr);					
          }else{              
              this.orgData = response.data.result;
              if(this.orgData!=""){
                this.transTypeData = response.data.result.assetTraceabilityField;
                if(this.transTypeData!=undefined){
                  this.filtered = this.transTypeData.filter((e,i) => e.hasOwnProperty('label'))
                  for(var i = 0; i < this.transTypeData.length; i++) {
                    this.transactionCode[i]=this.transTypeData[i].transactionTypeCode;
                  }
                }
                var returnArr = [this.filtered]
            }
            resolve(returnArr);					
          }
        }));
			} catch (error) {
				reject(error);
			}
		});
		return promise;
	};
	
    searchData(){
        if(this.entityAsset!=""){
          this.url = "/order/assetTraceabilitySearch" ;
          this.inputAssetIdArr=[];
          if(this.inputAssetArr[this.assetId]!=undefined){
            for(var i = 0; i < this.inputAssetArr[this.assetId].length; i++) {   
              if(this.inputAssetArr[this.assetId][i]!=undefined)        
                this.inputAssetIdArr[i] = this.inputAssetArr[this.assetId][i].inputAssetId;
            }
          }
          
          this.combineInputAssetIDArr = this.entityAsset.concat(this.inputAssetIdArr);
          this.seData.inputAssetArr =this.combineInputAssetIDArr;    
          const orderId = this.assetId.split(".")[0]   
          this.seData.orderId =orderId;                   
          this.seData.organizationId = this.loggedInUser.reference.organizationId;
          this.seData.transactionCode = this.transactionCode;
          this.seData.fabricOrgId = this.loggedInUser.fabricOrgId;
          this.subscriptions.push(this.apiService.post_transactions(this.url, this.seData)
            .subscribe((response: any) => {
              if(response.success == true && response.data.length>0) {
                this.transactionData = response.data[0];
                this.transactionDataBC = response.data[1];
                if(this.transactionData?.length>0){
                this.inputAssNameArr=[];
                this.inputAssetShowArr=[];
                let traceabilityResultFinalBc= []
                this.transactionDataBC.map( async (elmBc, indexBc) => {   
                    traceabilityResultFinalBc[elmBc?.TransactionType]=elmBc
                });
                    this.transactionData?.map(async(eleTrans, indexTrans) => { 
                        if(eleTrans.extrainfo_fields!=undefined){
                          const keysValue = Object.keys(eleTrans.extrainfo_fields);
                          const valueObj = Object.values(eleTrans.extrainfo_fields);
                          let dynField= [];
                          let dynFieldText= [];
                          for(var i = 0; i < keysValue?.length; i++) {
                            if(valueObj[i]!=undefined){
                            let fileNameDb = valueObj[i];
                            if(fileNameDb!=undefined){
                              dynFieldText[keysValue[i]]=valueObj[i];
                              this.extrafieldArr[eleTrans.transtypeCode]=dynFieldText;
                              const fileNameDbSplits=fileNameDb.toString().split('___')[1];
                              if(fileNameDbSplits!=undefined){
                                const fileNameDbSplit= fileNameDbSplits.toString().split(".")[1];
                                  if(fileNameDbSplit=='pdf' || fileNameDbSplit=='png' || fileNameDbSplit=='jpg' || fileNameDbSplit=='jpeg'){
                                    dynField[keysValue[i]]=valueObj[i];
                                    this.displayMediaArr[eleTrans.transtypeCode]=dynField;
                                  }else{
                                  }
                              }else{
                                dynFieldText[keysValue[i]]=valueObj[i];
                                this.extrafieldArr[eleTrans.transtypeCode]=dynFieldText;
                              }
                            }
                          
                            }
                          }
                        }
                        if(eleTrans.location!=''){
                          this.tracebilityLoc[eleTrans.transtypeCode]=eleTrans.location
                        }
                        if(eleTrans.upload_cert!=''){
                          this.tracebilityCert[eleTrans.transtypeCode]=eleTrans.upload_cert
                        }
    
                        if(eleTrans.inputAssets!==undefined && eleTrans.inputAssets?.length>0){
                          eleTrans.inputAssets.transtypeCode=eleTrans.transtypeCode;
                          this.inputAssetShowArr[eleTrans.transtypeCode]=eleTrans.inputAssets;
                          this.tracebilityQty[eleTrans.transtypeCode]=eleTrans.quantity
                        }else if(eleTrans.assetType=="Produce Asset"){
                          this.tracebilityQty[eleTrans.transtypeCode]=eleTrans.quantity
                        }
                      
                    });
                  
                   
                  // if(this.inputAssetShowArr!==undefined){ 
                  //   this.inputAssetShowArr.forEach(async (inputEle,indexInput) => { 
                  //       if(this.assetListByAssetID[inputEle.inputAssetId]!=undefined){
                  //         inputEle.inputAssetId=this.assetListByAssetID[inputEle.inputAssetId].assetName;
                  //       } 
                  //       this.inputAssArr[this.inputAssetShowArr.transtypeCode]=inputEle;
                  //       this.inputAssNameArr.push(inputEle);
                  //   });
                  // }

                  if(this.inputAssetShowArr!==undefined){ 
                    const keysTrasactionCode = Object.keys(this.inputAssetShowArr);
                    keysTrasactionCode.forEach(async (transactionCode,index) => { 
                      this.inputAssetShowArr[transactionCode].forEach(async (inputEle,indexInput) => { 
                          if(this.assetListByAssetID[inputEle.inputAssetId]!=undefined){
                            inputEle.inputAssetId=this.assetListByAssetID[inputEle.inputAssetId].assetName;
                          } 
                          this.inputAssArr[this.inputAssetShowArr[transactionCode].transtypeCode]=inputEle;
                          this.inputAssNameArr[transactionCode]=inputEle
                          //this.inputAssNameArr.push(inputElement);
                      });
                    });
                   
                  }
                  this.selectedTransactArr = [];
                  this.finalSqArr = [];
                  this.selectedArr =[];
                  let newArr=[];
                      this.filtered.map(async (element,ind) => {  
                        if(this.transactionData!==undefined){
                        this.transactionData?.map( async (elm, index) => {    
                            if(elm.transtypeCode===element.transactionTypeCode){
                              if(traceabilityResultFinalBc[element.transactionTypeCode]?.AssetName){
                                elm.assetName=traceabilityResultFinalBc[element.transactionTypeCode]?.AssetName
                              }

                              if(traceabilityResultFinalBc[element.transactionTypeCode]?.UOM){
                                elm.uom=traceabilityResultFinalBc[element.transactionTypeCode]?.UOM
                              }
                              
                              if(traceabilityResultFinalBc[element.transactionTypeCode]?.AssetLocation){
                                elm.location=traceabilityResultFinalBc[element.transactionTypeCode]?.AssetLocation
                              }

                              if(traceabilityResultFinalBc[element.transactionTypeCode]?.TimeStamp){
                                elm.created_on=traceabilityResultFinalBc[element.transactionTypeCode]?.TimeStamp
                              }

                              if(this.extrafieldArr[elm.transtypeCode]!=undefined){
                                elm.extrainfo_fields=this.extrafieldArr[elm.transtypeCode]
                              }

                              //added by Abhi to convert datetime 
                              if(elm.expiryDate!=undefined)
                                elm.expiryDate=this.datetimeConvertor.convertDateTimeZone(elm.expiryDate,"date");
                              if(elm.effectiveDate!=undefined)
                                elm.effectiveDate=this.datetimeConvertor.convertDateTimeZone(elm.effectiveDate,"date");
                              if(elm.created_on!=undefined)
                                elm.created_on=this.datetimeConvertor.convertDateTimeZone(elm.created_on,"datetime");

                              

                              let index1 = this.transactionData.findIndex(x => x.transtypeCode === element.transactionTypeCode);
                               if(index1!=-1){
                                newArr.push(index1);
                                this.selectedTransactArr[index1] = elm;
                              }
                              //this.selectedTransactArr[ind] = elm;                             

                              this.selectedArr[elm.transtypeCode] = {
                                transactionTypeCode:element.transactionTypeCode,
                                label :element.label===undefined?"":element.label,
                                isAssetCategory :element.isAssetCategory===undefined?false:element.isAssetCategory,
                                isAssetName :element.isAssetName===undefined?false:element.isAssetName,
                                isAssetLocation:element.isAssetLocation===undefined?false:element.isAssetLocation,
                                isEffectiveDate: element.isEffectiveDate===undefined?false:element.isEffectiveDate,
                                isExpiryDate: element.isExpiryDate===undefined?false:element.isExpiryDate,
                                isBranch: element.isBranch===undefined?false:element.isBranch,
                                isQuantity: element.isQuantity===undefined?false:element.isQuantity,
                                isUom: element.isUom===undefined?false:element.isUom,
                                fields:element.fields,
                                isTransactionType:element.isTransactionType===undefined?false:element.isTransactionType,
                                isInputAsset:element.isInputAsset===undefined?false:element.isInputAsset,
                                isVerifiable:element.isVerifiable===undefined?false:element.isVerifiable
                              };             
                            }               
                          });
                        }
                      });
                        newArr = newArr.filter((el, i, a) => i === a.indexOf(el))
                        newArr.map(async(elmA, indexA)=>{
                          if(this.selectedTransactArr[elmA]!=undefined){
                            this.finalSqArr[indexA]=this.selectedTransactArr[elmA]
                          }
                        });
                       // this.selectedTransactArr = this.selectedTransactArr.filter(item => item);
                        if(this.selectedTransactArr.length>0){
                          this.snackbarService.openSuccessBar('Data search successfully.', "Traceability");                     
                        }else{
                          this.snackbarService.openSuccessBar('Please setup asset traceability with proper Transaction Type as per transaction.', "Traceability Setup");
                        }                        
                }else{
                  this.selectedTransactArr = [];
                  this.snackbarService.openSuccessBar('Not transaction available.', "");
                }
              }
            },
            (error) => {
              this.selectedTransactArr = [];
              this.snackbarService.openSuccessBar('Not Found.', "");
          }));
          }else{
            this.snackbarService.openSuccessBar('Not valid data.', "");
          }
    }

    openRefTRace(data){
      this.countPlus++;
      this.selectedTransactArr = [];
      this.assetId = "";
      this.inputAssetIdArr=[];
      this.inputAssNameArr=[];
      this.inputAssetShowArr=[];
      this.finalSqArr=[];
      this.transactionData = [];
      this.selectedArr =[];
      this.inputAssetShowArr =[];
      this.tracebilityQty=[];
      this.inputAssArr =[];
      this.tracebilityLoc= [];
      this.displayMediaArr= [];
      this.extrafieldArr= [];
      this.backFlag=true;
      const assetID = data?.entity_asset.split(".")[1];
      const obj = data.inputAssetId+"|"+assetID+"|"+data.entity_asset;
      this.traceabilityFrm.patchValue({transactionId:obj});
      this.onSelectInput(obj);      
    }

    goBack() {
      this.addFlag=true;
      let getData=JSON.parse(localStorage.getItem('setForwardArr'));
      console.log("getData back button11111111111",getData)
      getData = getData.filter(n => n)
      console.log("getData back button22222222",getData)
      getData.splice(0,1);
      console.log("getData back button33333333333",getData)
      localStorage.setItem("setForwardArr", JSON.stringify(getData));
      if(getData.length==0){
        this.location.back()
      }
      //if(this.backFlag){
        this.backFlag=false;
        this.inputAssArr = [];
        this.finalSqArr=[];
        this.selectedArr =[];
        this.selectedTransactArr=[];
        //const obj = this.assetName+"|"+this.assetIdBack+"|"+this.transactionId;
        this.traceabilityFrm.patchValue({transactionId:getData[0]});
        this.onSelectInput(getData[0]);
    //  }
    }


    goBackComplete() {
      this.location.back()
    }
    async openFile(fileNameDb){
      if(fileNameDb!=undefined){
        const filePath = environment.awsImgPath+"/transactions/dynamic-media/"+fileNameDb;
        const bucketName= environment.Bucket;
        const fileName= "transactions/dynamic-media/"+fileNameDb;
        const returnRes= await this.uploadService.fileExist(bucketName,fileName)
         if(returnRes==true){
          window.open(filePath, "_blank");	
         }else{
          this.snackbarService.openSuccessBar("File is not exists on S3!", "Provenance");
         }
      }else{
        const msgStr="File is not exists!";
        this.snackbarService.openSuccessBar(msgStr, "Provenance");
      }
    }

    @ViewChild("autoPurchaseOrder") autocompletePurchaseOrder: MatAutocomplete;
    @ViewChild("Id_Container") divs: ElementRef;
    opened_AutoComplete = ()=> {
      let inputWidth = this.divs.nativeElement.getBoundingClientRect().width
      setTimeout(()=>{
      
      var screen_width = window.innerWidth;
      if(screen_width < 960){	
        let panel = this.autocompletePurchaseOrder.panel?.nativeElement;
        if (!panel ) return		
        panel.style.maxWidth = (inputWidth - 70) + "px";
      }      
      })
    }
    ngOnDestroy() {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    };
}