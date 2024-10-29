import { Injectable } from '@angular/core';
import Web3 from "web3";
import { ApiService } from './api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
declare let window:any;
import { MetamaskModalComponent } from '../metamask-modal/metamask-modal.component';
import { LoaderService } from '../services/loader.service';
import { ContractService } from '../services/wallet-connect.service';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';
const contract = require("./../asset-add/MyNFT.json");
@Injectable({
  providedIn: 'root'
})
export class PutonsaleNftService {
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
  assetID: any;
  assetQty: any;

  constructor(private metamaskModalComponent: MetamaskModalComponent,
    public loaderService: LoaderService,
    public snackbarService: SnackbarService,
    public contractService:ContractService,
    private apiService: ApiService){
  }

  async loadBlockchainData(assetID,transactionID,orderTransactionID,lineno,assetQty) {
    console.log("in func");
    const web3 = window.web3;
    const localAddress = await web3.eth.getAccounts(); //load accounts
    this.PUBLIC_KEY=localAddress[0];
    console.log("accounts:",localAddress[0]);

    this.signTransactions(assetID,transactionID,orderTransactionID,lineno,assetQty);
    return true;
  }

  async loadWeb3(assetID,transactionID,orderTransactionID,lineno, assetQty) {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        console.log("if:", window.web3);
        this.loadBlockchainData(assetID,transactionID, orderTransactionID,lineno,assetQty);
        return true;
    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        console.log("else if:", window.web3);
        return true;
    } else {
        window.alert('Non-Ethereum browser detected. You Should consider using MetaMask!');
        return false;
    }
  }

  async signTransactions(assetID,transactionID,orderTransactionID,lineno,assetQty){   
    console.log("asset name:", assetID);
     this.assetID=assetID;   
     this.assetQty=assetQty;   
    // const contract = require("./../artifacts/contracts/MyNFT.sol/MyNFT.json");
    const contractAddress = environment.contractAddress;
    const nftContract = new window.web3.eth.Contract(contract.abi, contractAddress);

    const nonce = await window.web3.eth.getTransactionCount(this.PUBLIC_KEY, "latest");
    console.log("nonce:",nonce);     
    
    this.snackbarService.openSuccessBar("Put on sale process has been started", "Put on sale");
    this.loaderService.show();
     const puonsaleResponse= await nftContract.methods
        .putOnSale(assetID)
        .send({ from: this.PUBLIC_KEY })
        
        .then(function(receipt){
          // will be fired once the receipt is mined
          console.log("in then func", receipt);
          console.log("receipt",receipt.transactionHash);
          return receipt;
      })

      

      console.log("putonsale response:",puonsaleResponse);
      if(puonsaleResponse.status){
        this.contractService.updateAsset(transactionID,"OnSale",null);
        this.contractService.updateOrder(orderTransactionID,"OnSale",lineno);
        this.contractService.updateTransferFromAdd(orderTransactionID,this.PUBLIC_KEY);
        this.updateOnsaleNFTDetails();
        this.loaderService.hide();
        this.snackbarService.openSuccessBar("Put on sale succeessfully", "Put on sale");
          
      }else{
        this.snackbarService.openSuccessBar("Put on sale failed", "Put on sale");
       
      }
      this.loaderService.hide();      
  } 

  updateOnsaleNFTDetails(){

    var nftDetailsData ={
      assetId: this.assetID,
      sale_copies:"true",
      nft_sale:[{        
         owner: this.PUBLIC_KEY,
         sale_copies: this.assetQty,
        }
      ]
    }
    this.url = "/nftdetails/update_nftdetails" ;	 
		
    this.subscriptions.push(this.apiService.put_transactions(this.url, nftDetailsData)
		.subscribe(async (response: any) => {
      if(response.success == true) {        
            
 				   
			}
		},
		(error) => {           
			const msgStr="Template layout is not exists for this asset category.Please upload first From S3!";
			this.snackbarService.openSuccessBar(msgStr, "Provenance");
		}));
  }

}