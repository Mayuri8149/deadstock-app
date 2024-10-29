import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faHandPointLeft, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'app-partner-details',
  templateUrl: './partner-details.component.html',
  styleUrls: ['./partner-details.component.css']
})
export class PartnerDetailsComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	faPlusCircle = faPlusCircle;
	faHandPointLeft = faHandPointLeft;

  corporateData:any = {}
  user;
  corporateId:any;
  url:string;
  fromAdmin = false
  curPage:any=1;
  orgPerPage:any=5;
  partner;
	constructor(private apiService: ApiService,private location: Location,
		public router: Router,
		public route: ActivatedRoute) { }

	ngOnInit() {
		this.user = JSON.parse(sessionStorage.getItem('user'));
		this.corporateId =  this.route.snapshot.queryParams['id'];
		this.fromAdmin =  this.route.snapshot.queryParams['fromAdmin'];
		this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['recordPerPage'];
		this.partner = this.route.snapshot.queryParams['partner'];
		if(typeof this.fromAdmin === 'undefined'){
			this.fromAdmin  = false
		}
		if(typeof this.partner === 'undefined'){
			this.partner  = false
		}
		if(typeof this.corporateId === 'undefined'){
		if(typeof this.user.reference.corporateId === 'undefined'){
			this.corporateId = this.user.corpData._id;
		 }else{
		  this.corporateId = this.user.reference.corporateId
		 }
		}
		this.getCorporateData();
	}

	getCorporateData() {
    this.url = '/corporate/' + this.corporateId ;
		var params = new HttpParams();
		params = params.append('id', this.corporateId);
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response: any) => {
			if(response.success == true){
				if(response.data){
          this.corporateData = response.data;
        }
      }
    }));
  }

goBack() {
	if(this.partner==true || this.partner=="true"){
		this.router.navigate(['/partners/partnerList'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
	}else if(this.curPage && this.orgPerPage){
		this.router.navigate(['/partner/partnersList'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
	}else{
		this.location.back()
	}
};

	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}