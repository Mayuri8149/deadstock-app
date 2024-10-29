import { Injectable } from '@angular/core';
import Web3 from "web3";
import { ApiService } from './api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
declare let window:any;
import { MetamaskModalComponent } from '../metamask-modal/metamask-modal.component';
import { LoaderService } from '../services/loader.service';
import { HttpParams } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
const contract = require("./../asset-add/MyNFT.json");
@Injectable({
  providedIn: 'root'
})
export class ContractService {  
  private subscriptions: Subscription[] = [];
  web3: any;
  accounts: Array<String>;
  user
  url:String; 
  assetName: any;
  assetQuantity: any;
  assetUom: any;
  expiryDate: any;
  effectiveDate: any;
  Url: any;
  provinance_hash: any;
  PUBLIC_KEY: any;
  status: string;
  assetID: any;
  nft_sale: any;
  transactionid: any;
  provenanceTemplatePath: any;

  constructor(private metamaskModalComponent: MetamaskModalComponent,
    public loaderService: LoaderService,
    public snackbarService: SnackbarService,
    private apiService: ApiService){
  }

  async loadBlockchainData(data,transactionId,imgURL) {
    console.log("in func");
    const web3 = window.web3;
    const localAddress = await web3.eth.getAccounts(); //load accounts
    this.PUBLIC_KEY=localAddress[0];
    console.log("accounts:",localAddress[0]);

   const result= this.signTransactions(data,transactionId,imgURL);

    return result;
  }

  async loadWeb3(data,transactionId,imgURL) {
    let result;
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        console.log("if:", window.web3);
        result=this.loadBlockchainData(data,transactionId,imgURL);
        this.status="Success";
        console.log(" this.status:", this.status);
        // return this.status;

    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        console.log("else if:", window.web3);
        this.status="Success";       
        // return this.status;
    } else {
        // window.alert('Non-Ethereum browser detected. You Should consider using MetaMask!');
        if (confirm("MetaMask is not installed on this browser! \n Click Ok to insatall Metamask.")) {
           window.open('https://metamask.io/download/', '_blank');
        } else {
          alert("NFT will not be created.");
        }
        this.status="False";
        console.log(" this.status:", this.status);
        // return this.status;
    }
    return result;
  }

  async updateAsset(transactionId, status, nftDetails){
		this.url = "/asset/updateAsset" ;
    let params = new HttpParams();
		params = params.append('transactionId', transactionId);
		params = params.append('nft_status', status);
    if(nftDetails!=null){
      params = params.append('nftDetails', nftDetails);
    }
		
    this.subscriptions.push(this.apiService.getAsset(this.url, params)
		.subscribe(async (response: any) => {
      if(response.success == true) {
			}
		},
		(error) => {           
			const msgStr="Template layout is not exists for this asset category.Please upload first From S3!";
			this.snackbarService.openSuccessBar(msgStr, "Provenance");
		}));
	}

  async updateOrder(transactionId, status, lineno){
		this.url = "/order/updateOrderNFT" ;
    let params = new HttpParams();
		params = params.append('transactionId', transactionId);
		params = params.append('nft_status', status);
		params = params.append('lineno', lineno);
    this.subscriptions.push(this.apiService.getAsset(this.url, params)
		.subscribe(async (response: any) => {
      if(response.success == true) {	   
			}
		},
		(error) => {           
			const msgStr="Template layout is not exists for this asset category.Please upload first From S3!";
			this.snackbarService.openSuccessBar(msgStr, "Provenance");
		}));
	}
  
  async updateTransferFromAdd(transactionId, TransFromAdd){
		this.url = "/order/updateTransferAdd" ;
    let params = new HttpParams();
		params = params.append('transactionId', transactionId);
		params = params.append('TransFrom_Address', TransFromAdd);
    this.subscriptions.push(this.apiService.getAsset(this.url, params)
		.subscribe(async (response: any) => {
      if(response.success == true) { 				   
			}
		},
		(error) => {           
			const msgStr="Template layout is not exists for this asset category.Please upload first From S3!";
			this.snackbarService.openSuccessBar(msgStr, "Provenance");
		}));
	}

  async updateNFTDetails(nftDetails){
		this.url = "/nftdetails/add_nftdetails" ;		
    this.subscriptions.push(this.apiService.post_transactions(this.url, nftDetails)
		.subscribe(async (response: any) => {
      if(response.success == true) {
			}
		},
		(error) => {           
			const msgStr="Template layout is not exists for this asset category.Please upload first From S3!";
			this.snackbarService.openSuccessBar(msgStr, "Provenance");
		}));
	}

  async signTransactions(data,transactionId,imgURL){   
    // console.log("data:",data);
    if(data.assetName != undefined || data.assetName != null){
      this.assetName=data.assetName;
    }else{
      this.assetName="";
    }

    if(data.assetQuantity != undefined || data.assetQuantity != null){
      this.assetQuantity=data.assetQuantity.toString();
    }else{
      this.assetQuantity="";
    }

    if(data.assetUom != undefined || data.assetUom != null){
      this.assetUom=data.assetUom;
    }else{
      this.assetUom="";
    }

    if(data.assetID != undefined || data.assetID != null){
      this.assetID=data.assetID;
    }else{
      this.assetID="";
    }

    if(data.transactionid != undefined || data.transactionid != null){
      this.transactionid=data.transactionid;
    }else{
      this.transactionid="";
    }    

    if(data.provenanceTemplatePath != undefined || data.provenanceTemplatePath != null){
      this.provenanceTemplatePath=data.provenanceTemplatePath;
    }else{
      this.provenanceTemplatePath="";
    }

    if(data.expiryDate != undefined || data.expiryDate != null){
      this.expiryDate=data.expiryDate;
    }else{
      this.expiryDate="";
    }
    if(data.effectiveDate != undefined || data.effectiveDate != null){
      this.effectiveDate=data.effectiveDate;
    }else{
      this.effectiveDate="";
    }
    if(data.Url != undefined || data.Url != null){
      this.Url=data.Url;
    }else{
      this.Url="";
    }
    if(data.hash != undefined || data.hash != null){
      this.provinance_hash=data.hash;
    }else{
      this.provinance_hash="";
    }   

    console.log("this.assetName",this.assetName);
    console.log("this.assetQuantity",this.assetQuantity);
    console.log("this.assetUom",this.assetUom);
    console.log("this.assetID",this.assetID);
    console.log("this.expiryDate",this.expiryDate);
    console.log("this.effectiveDate",this.effectiveDate);
    console.log("this.Url",this.Url);
    console.log("new Date()",new Date());
    console.log("this.PUBLIC_KEY",this.PUBLIC_KEY);
    console.log("this.provinance_hash",this.provinance_hash);
    
    // const contract = require("./../artifacts/contracts/MyNFT.sol/MyNFT.json");
    const contractAddress = environment.contractAddress;
    const nftContract = new window.web3.eth.Contract(contract.abi, contractAddress);

    const nonce = await window.web3.eth.getTransactionCount(this.PUBLIC_KEY, "latest");
    console.log("nonce:",nonce);
    this.snackbarService.openSuccessBar("The process of NFT minting is started", "Mint NFT");
    this.loaderService.show();
     const mintResponse= await nftContract.methods
        .mintNFT(
            this.assetName,
            this.assetQuantity,
            this.assetUom,
            this.assetID,
            // this.expiryDate,
            // this.effectiveDate,
            this.Url,
            imgURL,
            new Date().toLocaleString(),
            this.PUBLIC_KEY,
            this.provinance_hash          
        )
        .send({ from: this.PUBLIC_KEY, name:this.assetName }) //.send() - writing data to blockchain
        .on('error', function(error){ 
          this.snackbarService.openSuccessBar("NFT not created", "Mint NFT");         
         })
        .then(function(receipt){
          // will be fired once the receipt is mined
          console.log("in then func", receipt);
          console.log("receipt",receipt.transactionHash);
          return receipt;
      })
      // console.log("mint response:",mintResponse);
      // console.log("returnValues:",mintResponse.events.TransferSingle.returnValues);
      // console.log("NFT Id:",mintResponse.events.TransferSingle.returnValues.id);
      const nftDetails={
        id:mintResponse?.events?.TransferSingle?.returnValues?.id,
        from:mintResponse?.events?.TransferSingle?.returnValues?.from,
        operator:mintResponse?.events?.TransferSingle?.returnValues?.operator,
        to:mintResponse?.events?.TransferSingle?.returnValues?.to,
        value:mintResponse?.events?.TransferSingle?.returnValues?.value
      }

      this.nft_sale={
        owner:this.PUBLIC_KEY,
        ownerName:"bbb",
        ownedCopies:this.assetQuantity,
        sale_copies:0,
        fixedPrice:0,
        fixedFlag:"Y",
        previous_owner:"",
        trx_hash:mintResponse.transactionHash
      }
  
      var nftDetailsData ={
        tokenId: mintResponse?.events?.TransferSingle?.returnValues?.id,
        token_address: mintResponse?.events?.TransferSingle?.address,
        assetId: this.assetID,
        transactionid: this.transactionid,
        assetName: this.assetName,
        assetImg: imgURL,
        no_of_copies: this.assetQuantity,
        provenanceTemplatePath:this.provenanceTemplatePath,
        provenanceHash:this.provinance_hash,
        nft_sale:[
          this.nft_sale
        ]
      }

      console.log("NFT details:",nftDetails)
      if(mintResponse.status){
        this.updateAsset(transactionId, "Created", JSON.stringify(nftDetails));
        this.updateNFTDetails(nftDetailsData);
        // this.updateAsset(transactionId, "Created", null);
        this.loaderService.hide();

        this.snackbarService.openSuccessBar("NFT created succeessfully, Transaction Hash: "+ mintResponse.transactionHash, "receipt");
        
      }else{
        this.snackbarService.openSuccessBar("NFT not created", "Mint NFT");
       
      }

      this.loaderService.hide();
      return mintResponse;

  }
  ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};

}