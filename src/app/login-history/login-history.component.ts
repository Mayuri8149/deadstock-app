import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { faHandPointLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { Type } from 'src/app/modals/trans-typelist';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from '../services/data.service';

@Component({
	selector: 'app-login-history',
	templateUrl: './login-history.component.html',
	styleUrls: ['./login-history.component.css']
})
export class LoginHistoryComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	faHandPointLeft = faHandPointLeft;
	faSearch = faSearch;
	displayedColumns = [ 'date', 'time', 'ipAddress' ];

	url: string;
	loggedInUser;
	_id;
	history;
	ipAddress;
	role;
	entity;
	totalLogins = 0;
	loginsPerPage:any= 5;
	pageSizeOptions = [5,10,20,50,100];
	currentPage:any = 1;
	dateFilter = new FormControl();
	timeFilter = new FormControl();
	ipAddressFilter = new FormControl();
	startIndex
	filter:any={date:'',ipAddress:'',searchKey:''}
	filteredValues = {
		date: '',
		time: '',
		ipAddress:''
	};

	dataSource = new MatTableDataSource<any>();
	selection = new SelectionModel<any>(true, []);
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(public dataservice: DataService,private location: Location, private apiService: ApiService, private http:HttpClient,public route: ActivatedRoute,) { }
	ngOnInit() {
        this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
		if(typeof this.loggedInUser.timeZone === 'undefined'||  this.loggedInUser.timeZone == null ||  this.loggedInUser.timeZone == ''){
			this.loggedInUser.timeZone = 'Asia/Kolkata'
		}
		this.role = this.loggedInUser.reference.role;
		this.entity = this.loggedInUser.reference.entity;
		this.dataSource.sort = this.sort;
		this.getLoginHistory(this.loginsPerPage, this.currentPage);
		this.getIPAddress();
		this.filterByColumn();
	}

	getLoginHistory(transactionsPerPage,currentPage) {
		this.url = "/user/historylist";
		var params = new HttpParams();
		this.startIndex = ((currentPage * transactionsPerPage) - transactionsPerPage)
		params = params.append('startIndex', this.startIndex);
		params = params.append('limit', transactionsPerPage);
		params = params.append('userId', this.loggedInUser._id);
		if(this.filter.date){
			params = params.append('date', this.filter.date);
		}
		if(this.filter.ipAddress){
			params = params.append('ipAddress', this.filter.ipAddress);
		}
		if(this.filter.searchKey){
			params = params.append('searchKey', this.filter.searchKey);
		}
		this.subscriptions.push(this.dataservice.get(this.url, params)
			.subscribe((response) => {
				if(response.success == true) {
					response.data.result.loginhistory.email = this.loggedInUser.email;
					 response.data.result.loginhistory.Name = this.loggedInUser.firstName + " " + this.loggedInUser.lastName;
					this.history = response.data.result.loginhistory;
					 for(var i=0;i<this.history.length;i++) {
						if(this.history[i].isActive == true) {
							this.history[i].status = "Active";
						} else {
							this.history[i].status = "Inactive";
						}
						let DateTime = new Date(this.history[i].createdAt).toLocaleString("en-US", {timeZone: this.loggedInUser.timeZone});
						this.history[i].createdAt = DateTime
					 }
					this.totalLogins = response.data.result.total_count;
					this.dataSource.data = this.history;
				}

			}))
	}
	onChangedLogin(pageData: PageEvent){
		this.currentPage = pageData.pageIndex + 1;
		this.loginsPerPage = pageData.pageSize;
		this.getLoginHistory(this.loginsPerPage,  this.currentPage);
	}
	clearFilters(){
		this.dataSource.filter = '';
		this.filter.date = '';
		this.filter.ipAddress = '';
		this.getLoginHistory(this.loginsPerPage,this.currentPage);	
	 }
	 searchField(event,value){
		value=event
		this.getLoginHistory(this.loginsPerPage,this.currentPage);	
	}
	clearFilter(event,value){
		value =''
		this.getLoginHistory(this.loginsPerPage,this.currentPage);	
	}
	onSearch(event){
		this.filter.searchKey = event
		this.getLoginHistory(this.loginsPerPage,this.currentPage);	
	}
	getIPAddress(){
  	{
		this.subscriptions.push(this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
			this.ipAddress = res.ip;
		}));

  }
}

filterByColumn() {
	this.subscriptions.push(this.dateFilter.valueChanges.subscribe((dateFilterValue) => {
		this.filteredValues['date'] = dateFilterValue;
		this.dataSource.filter = JSON.stringify(this.filteredValues);
	}));

	this.subscriptions.push(this.timeFilter.valueChanges.subscribe((timeFilterValue) => {
	this.filteredValues['time'] = timeFilterValue;
		this.dataSource.filter = JSON.stringify(this.filteredValues);
	}));

	this.subscriptions.push(this.ipAddressFilter.valueChanges.subscribe((ipAddressFilterValue) => {
		this.filteredValues['ipAddress'] = ipAddressFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		}))
	this.dataSource.filterPredicate = this.customFilterPredicate();
}

customFilterPredicate() {
	const myFilterPredicate = function(data:Type, filter: string): boolean {
		function forDate(dateInfo) {
			const date = new Date(dateInfo);
			const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
			const mon = date.getMonth();
			const selectedMonthName = months[mon];
			function z(n){return (n<10?'0':'')+n}
			const strDate = `${selectedMonthName} ${date.getDate()}, ${date.getFullYear()}T${z(date.getHours())}:${z(date.getMinutes())}:${z(date.getSeconds())}`;
			return strDate; 
		}
		const dateInfo = data.createdAt;
		const dates = forDate(dateInfo);
		let searchString = JSON.parse(filter);
		return dates.toString().trim().indexOf(searchString.date) !== -1
		&& dates.toString().trim().indexOf(searchString.time) !== -1
		&& data.ipAddress.toString().trim().indexOf(searchString.ipAddress) !== -1
	}
	return myFilterPredicate;
};

goBack() {
  this.location.back();
};
ngOnDestroy() {
	this.subscriptions.forEach(subscription => subscription.unsubscribe());
};
}