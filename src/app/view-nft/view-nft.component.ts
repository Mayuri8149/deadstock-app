import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { faHandPointLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ApiService } from '../services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-view-nft',
  templateUrl: './view-nft.component.html',
  styleUrls: ['./view-nft.component.css']
})
export class ViewNftComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  faHandPointLeft = faHandPointLeft;
  state: any;
  nftdetails: any;
  nftId: any;
  url: string;
  nft_grid_data: any;
  nftdetailsFromSummary: any;
  nftAssetName: any;
  nftAssetId: any;
  nftAssetImg: any;
  nftImgURL: string;
  nftMintedQuantity: any;
  nftProvenanceURL: any;
  nftViewURL: string;
  holdersRecord: any;
  constructor(
    private location: Location,
    private route: ActivatedRoute,
		private apiService: ApiService, 
		public loaderService: LoaderService) { }

  ngOnInit(): void {
    this.nftId = this.route.snapshot.params['nftId'];
    console.log("nft id:",this.nftId);
    
    // this.nftdetails=JSON.parse(history.state.navSettings);
    // console.log("eee:", this.nftdetails);
    // if(this.nftdetails){
      
    // }

   

    this.url = "/nftdetails";
		var params = new HttpParams();
		params = params.append('tokenId',  this.nftId);
		// params = params.append('allFields',  true);

    this.loaderService.show();
		this.subscriptions.push(this.apiService.getAsset(this.url, params)
			.subscribe((response: any) => {
        this.loaderService.hide();
        // this.nft_grid_data=response.data.result;
        this.nftdetails= response.data.result[0];
        if(this.nftdetails){
          this.nftAssetName=this.nftdetails?.assetName;
          this.nftAssetId=this.nftdetails?.assetId;
          this.nftAssetImg=this.nftdetails?.assetImg;
          this.nftMintedQuantity=this.nftdetails?.no_of_copies;
          this.nftProvenanceURL= environment.awsTemplatePath+"provenance/"+this.nftdetails?.provenanceTemplatePath+"/"+this.nftdetails.transactionid+".html"
          if(this.nftAssetImg != undefined){
            console.log("upload_file:"+environment.awsImgPath+'/transactions/static-media/'+this.nftAssetImg);
            this.nftImgURL= this.nftAssetImg;		
          }else{
            this.nftImgURL="";
          }
          if(this.nftProvenanceURL != undefined){
            console.log("upload_file:"+environment.awsImgPath+'/transactions/static-media/'+this.nftAssetImg);
            this.nftViewURL= this.nftProvenanceURL;
          }else{
            this.nftViewURL="";
          }
          console.log("nftMintedQuantity:", this.nftMintedQuantity);
          console.log("nftProvenanceURL:", this.nftViewURL);
        }
				console.log("response view nft:",response.data.result[0].nft_sale);
				console.log("result view nft:",response.data.result);
        this.holdersRecord=response.data.result[0].nft_sale;
				// this.router.navigate(['/viewnft'], { queryParams: { serviceId: JSON.stringify(response.data)} });
				// this.router.navigate(
				// 	['/viewnft'],
				// 	{ state: { navSettings: JSON.stringify(response.data) } });
			}))


    // this.nftdetails=history.state.navSettings;
    // console.log("eee:", JSON.parse(this.nftdetails));
    // // console.log("eee-result:", this.nftdetails.result);
    // console.log("eee-result-json:", JSON.parse(this.nftdetails.result));
    // this.state = this.route
    // .queryParams
    // .subscribe(params => {
    //   // Defaults to 0 if no query param provided.
    //   // this.page = +params['serviceId'] || 0;
    //   console.log("nftsend:",params['serviceId']);
    // });
   
  //   this.route.data.subscribe(data => {
  //     console.log(data);
  // });
  }

  goBack(){
    this.location.back();
  }

  loadNFTHistory(){
    this.url = "/asset/nft/viewNFT";
		var params = new HttpParams();
		params = params.append('token_id',  this.nftId);
    this.loaderService.show();
		this.subscriptions.push(this.apiService.getAsset(this.url, params)
			.subscribe((response: any) => {
        this.loaderService.hide();              
        this.nft_grid_data=response.data.result;
        console.log("response:::",this.nft_grid_data); 
      }))
  }

}
