import { Injectable } from '@angular/core';
import Web3 from "web3";
import { ApiService } from './api.service';
import { SnackbarService } from './snackbar.service';
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
export class TransferNftService {
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
  previous_owner: any;

  constructor(private metamaskModalComponent: MetamaskModalComponent,
    public loaderService: LoaderService,
    public snackbarService: SnackbarService,
    public contractService:ContractService,
    private apiService: ApiService){
  }

  async loadBlockchainData(assetID, qty, transactionID,trans_from_address) {
    console.log("in func");
    const web3 = window.web3;
    const localAddress = await web3.eth.getAccounts(); //load accounts
    this.PUBLIC_KEY=localAddress[0];
    console.log("accounts:",localAddress[0]);

    this.signTransactions(assetID, qty, transactionID, trans_from_address);

    return true;
  }

  async loadWeb3(assetID,qty, transactionID,trans_from_address) {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        console.log("if:", window.web3);
        this.loadBlockchainData(assetID, qty, transactionID,trans_from_address);
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

  async signTransactions(assetID, qty, transactionID, trans_from_address){   
    console.log("asset name:", assetID);
    console.log("trans_from_address:", trans_from_address);
    this.assetID=assetID;
    this.assetQty=qty;
    this.previous_owner=trans_from_address;
    // const contract = require("./../artifacts/contracts/MyNFT.sol/MyNFT.json");
    const contractAddress = environment.contractAddress;
    const nftContract = new window.web3.eth.Contract(contract.abi, contractAddress);

    const nonce = await window.web3.eth.getTransactionCount(this.PUBLIC_KEY, "latest");
    console.log("nonce:",nonce);  
    this.snackbarService.openSuccessBar("The process of NFT transfering is started", "Transfer NFT");
    this.loaderService.show();
    const transferResponse= await nftContract.methods
        .transfer(assetID, trans_from_address, this.PUBLIC_KEY, qty)
        .send({ from: this.PUBLIC_KEY })
        .on('error', function(error){ 
          console.log("error", error);
          return error;        
         })        
        .then(function(receipt){
          // will be fired once the receipt is mined
          console.log("in then func", receipt);
          console.log("receipt",receipt.transactionHash);
          return receipt;
      })
      console.log("transferResponse:",transferResponse);
      if(transferResponse.status){
        this.contractService.updateAsset(transactionID,"Sold",null);        
        // this.contractService.updateOrder(orderTransactionID,"OnSale",lineno);
        this.updateTransferNFTDetails();
        this.loaderService.hide();
        this.snackbarService.openSuccessBar("NFT transferred succeessfully", "NFT Transfer");
          
      }else{
        this.snackbarService.openSuccessBar("NFT transfer failed", "NFT Transfer");
       
      }
      this.loaderService.hide();     
  }
  updateTransferNFTDetails(){
    var nftDetailsData ={
      assetId: this.assetID,
      material_received:"true",
      nft_sale:[{        
         owner: this.PUBLIC_KEY,
         ownedCopies: this.assetQty,
         previous_owner:this.previous_owner
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