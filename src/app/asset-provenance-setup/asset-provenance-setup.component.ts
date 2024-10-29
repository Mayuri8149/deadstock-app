import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { faHandPointLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { trim } from 'jquery';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subscription } from 'rxjs';
import { Type } from 'src/app/modals/trans-typelist';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { DataService } from 'src/app/services/data.service';
import { ErrorDialogService } from 'src/app/services/error-dialog.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
	selector: 'app-asset-provenance-setup.Component',
	templateUrl: './asset-provenance-setup.component.html',
	styleUrls: ['./asset-provenance-setup.component.css']
})
export class AssetProvenanceSetupComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	faHandPointLeft = faHandPointLeft;
	faSearch = faSearch;
	loggedInUser: any = {}
	assetprovenanceDetailForm: FormGroup;
	finaltransactionForm: FormGroup;
	@ViewChild('template', { static: false }) private template;	

	displayedColumns = [
		'organization',
		'moduleId',
		'courseId',
		'TansactionCode',
		'certificateName',
		'label',
		'transactionType',
		'assetName',
		'assetCategory',
		'inputAsset',
		'branch',
		'location',
		'quantity',
		'uom',
		'effectiveDate',
		'expiryDate',
		'variableField',
	];
	filteredValues = {
		courseId: '',
		moduleId:'',
		TansactionCode:'',
		certificateName: '',
		label:'',
	};
	dataSource = new MatTableDataSource<any>();
	selection = new SelectionModel<any>(true, []);
	data: any;
	totalRecord = 0;
	recordPerPage= 50;
	pageSizeOptions = [100];
	currentPage = 1;
	courseIdFilter = new FormControl();
	nameFilter = new FormControl();
	codeFilter = new FormControl();
	moduleIdFilter = new FormControl();
	labelFilter = new FormControl();
	dialogChangeEvent;
	url = ''
	certtypes = []
	selectedCerttypes = []
	userId: any
	allorganization = []
	allorganizationData = []
	deptId = ''
	usersAcees = []
	removeAccess = false
	selectedUser:any={}
	isUpdate = false
	organization;
	selectedOrganization;
	allAutoValue;
	selectedTranstypeId;
	openModal: boolean = false;
	dragableRow: any;
	modalRef: BsModalRef;
	fields = [] ;
	object:any;
	checkedIDs = [];
	tempArray:any;
	dynamicArray = [];
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	finalArray = [];
	abc = [];
	fieldObject: {};
	fieldArr=[]
	transactioField: any;
	checkArray = [];
	transData = [];
	dynamicFields=[];
	checkvalue;
	dyanamicFieldArr=[];
	hashFields = [];
	addition = [];
	display = [];
	openFlag = [];
	concatArr:any;	
	timeoutHandler: any;
	filter:any={courseId:'',moduleId:'',TansactionCode:'',certificateName:'',searchKey:''}
	constructor(private _formBuilder: FormBuilder, private apiService: ApiService,
		private route: ActivatedRoute,
		public router: Router,
		public errorDialogService: ErrorDialogService,
		public confirmDialogService: ConfirmDialogService,
		public dataService: DataService,
		public snackbarService: SnackbarService,
		private location: Location,
		private modalService: BsModalService,
		) { }

	ngOnInit(): void {
		this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
		if (typeof this.loggedInUser.timeZone === 'undefined' || this.loggedInUser.timeZone == null || this.loggedInUser.timeZone == '') {
			this.loggedInUser.timeZone = 'Asia/Kolkata'
		}
		this.dataSource.sort = this.sort;
		this.userId = this.route.snapshot.params['id'];
		this.selectedUser = JSON.parse(sessionStorage.getItem('selectedUser'));
		this.assetprovenanceDetailForm = this._formBuilder.group({
           
        });
		this.finaltransactionForm = this._formBuilder.group({
			buttonList: [''],

		});
		this.getorganization();
		this.filterByColumn();
	}

	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
	}

	isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

	openConfirm($event,element) {
		this.dynamicArray = [];
		this.selectedTranstypeId = element._id;
		this.transactioField = element.fields;
		if(this.hashFields[element._id]!== undefined){
			this.hashFields[element._id].forEach((elemnt,index) => {
				this.transactioField.map((elm, ind) => {
					//this.dyanamicFieldArr[index] = true
					if(elemnt !==null && elm[0].key==elemnt.key){
						this.transactioField[ind].checked = true
						this.dynamicArray[ind] = elemnt;
					}
				});
			});
		}
		this.modalRef = this.modalService.show(this.template, { class: 'modal-dialog-centered' });
	}

		getDynamicValue(trantypeId){
			this.openFlag[trantypeId] = true;
			this.checkArray[trantypeId] = this.dynamicArray
			this.modalRef.hide();
	  	}

		getUserLinkCertificateType(recordPerPage, currentPage) {
			this.url = '/transactiontype/list';
			this.selection.clear();
			var params = new HttpParams();
			params = params.append('organizationId',this.selectedOrganization);
			params = params.append('showithCorpId', 'showithCorpId');
			params = params.append('pagesize', recordPerPage);
			params = params.append('page', currentPage);
			if(this.filter.searchKey){
				params = params.append('searchKey', this.filter.searchKey);
			}
			this.subscriptions.push(this.apiService.get(this.url, params)
				.subscribe((response: any) => {
					this.certtypes = response.data.result.transtypes.transtypes;
						let certData = this.certtypes;
						this.tempArray = certData
						this.totalRecord = response.data.result.totalCount;
						this.dataSource.data = certData;
						this.getassetProvenanceData(certData);
				}))
		}

	drop(event: CdkDragDrop<string[]>) {
		this.detectScreenSize();
		const previousIndex = this.dataSource.data.findIndex(row => row === event.item.data);
		moveItemInArray(this.tempArray,previousIndex, event.currentIndex);
		this.dataSource.data = this.tempArray.slice();
		this.tempArray = event.item.dropContainer.data.filteredData
	}

	selectRow($event, row,index) {
		this.selectedCerttypes = row
		if ($event.checked == false) {
			if(this.tempArray.indexOf(row) == -1) {
				this.tempArray.push(row);
			 }
		  } else if($event.checked == true){
			if (index !== -1) {
				this.tempArray.splice(index, 1);
			}  
		}
	}

	getorganization() {
		this.url = "/organization/list";
		var params = new HttpParams();
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response) => {
				if(response.success == true) {
					this.allorganization = response.data.organizations.result;
					var activeorganization = [];
                        for (var i = 0; i < this.allorganization.length; i++) {
                            if (this.allorganization[i].isActive == true) {
                                activeorganization.push(this.allorganization[i]);
                            }
                        }
                    this.organization = activeorganization;
				}
			}))
	}

	assetprovenance(data){
		
		for (var i = 0; i < this.tempArray.length; i++) {
			var draft = this.tempArray[i];			
			var datas = {
				_id: [],
				isTransactionType: [],
				isAssetName: [],
				isInputAsset: [],
				isBranch: [],
				isAssetLocation: [],
				isQuantity: [],
				isUom: [],
				isEffectiveDate: [],
				isExpiryDate: [],
				fields: [],
				label: [],
				isAssetCategory: [],
				transactionTypeCode: []
			};
			datas._id = draft._id,
			datas.transactionTypeCode = draft.transactionTypeCode
			datas.isTransactionType = draft.isTransactionType
			datas.isAssetName = draft.isAssetName
			datas.isInputAsset = draft.isInputAsset
			datas.isAssetLocation = draft.isAssetLocation
			datas.isQuantity = draft.isQuantity
			datas.isUom = draft.isUom
			datas.isEffectiveDate = draft.isEffectiveDate
			datas.isExpiryDate = draft.isExpiryDate
			datas.isBranch = draft.isBranch,
			datas.fields = this.checkArray[draft._id]
			datas.label = draft.label,
			datas.isAssetCategory = draft.isAssetCategory
			this.transData.push(datas);			
		}

		var obj = {
			assetProvenanceField: this.transData,
			organizationId: this.selectedOrganization
		};
		this.url = "/assetprovenance/create";
		this.subscriptions.push(this.apiService.post_transactions(this.url, obj)
		.subscribe((response: any) => {
			if(response.success == true){
				this.snackbarService.openSuccessBar('Record is added successfully.', "Asset Provenance");
				this.getorganization();
				this.getUserLinkCertificateType(this.recordPerPage, this.currentPage);
				this.router.navigate(['/assetProvenanceSetup']);
			}
		}))
	}

	changeRadioButtons(event, row,ind) {
		this.transactioField.forEach((ele,index) => {
			if(event.checked == true && ele[0].key == event.source.value){
				if(this.dynamicArray.indexOf(row) == -1) {
					this.dynamicArray[index] = row;
					this.transactioField[index].checked =true
				}
			}else if(event.checked == false && ele[0].key == event.source.value){
				if (index !== -1) {
					this.dynamicArray.splice(index, 1);
					this.transactioField[index].checked =false
				}   
			}
		});
		
	};

	changeRadioButton(row, event) {
		let index = this.dataSource.data.findIndex(x => x._id == row._id)
		if(event.checked == true){
		if (event.source.value == 'isAssetName') {
			this.dataSource.data[index].isAssetName = true
		} if (event.source.value == 'isTransactionType') {
			this.dataSource.data[index].isTransactionType = true
		} if (event.source.value == 'isBranch') {
			this.dataSource.data[index].isBranch = true
		} if (event.source.value == 'isAssetLocation') {
			this.dataSource.data[index].isAssetLocation = true
		} if (event.source.value == 'isInputAsset') {
			this.dataSource.data[index].isInputAsset = true
		} if (event.source.value == 'isQuantity') {
			this.dataSource.data[index].isQuantity = true
		} if (event.source.value == 'isUom') {
			this.dataSource.data[index].isUom = true
		} if (event.source.value == 'isEffectiveDate') {
			this.dataSource.data[index].isEffectiveDate = true
		} if (event.source.value == 'isExpiryDate') {
			this.dataSource.data[index].isExpiryDate = true
		} if (event.source.value == 'isVariableField') {
			this.dataSource.data[index].isVariableField = true
		} if (event.source.value == 'assetCategory') {
			this.dataSource.data[index].assetCategory = true
		}	
	}else{		
		if (event.source.value == 'isAssetName') {
			this.dataSource.data[index].isAssetName = false
		} if (event.source.value == 'isTransactionType') {
			this.dataSource.data[index].isTransactionType = false
		} if (event.source.value == 'isBranch') {
			this.dataSource.data[index].isBranch = false
		} if (event.source.value == 'isAssetLocation') {
			this.dataSource.data[index].isAssetLocation = false
		} if (event.source.value == 'isInputAsset') {
			this.dataSource.data[index].isInputAsset = false
		} if (event.source.value == 'isQuantity') {
			this.dataSource.data[index].isQuantity = false
		} if (event.source.value == 'isUom') {
			this.dataSource.data[index].isUom = false
		} if (event.source.value == 'isEffectiveDate') {
			this.dataSource.data[index].isEffectiveDate = false
		} if (event.source.value == 'isExpiryDate') {
			this.dataSource.data[index].isExpiryDate = false
		} if (event.source.value == 'isVariableField') {
			this.dataSource.data[index].isVariableField = false
		} if (event.source.value == 'assetCategory') {
			this.dataSource.data[index].assetCategory = false
		}
	}
		this.dataSource.data[index].showButton = true
	};
	
	openConfirmDialog(row) {
		var data = {
			item: row,
			isActive: true,
			status: 'provideAccess'
		};
		this.confirmDialogService.open(data);
	};

	ClearRecord(row){
		row.isTransactionType = false
		row.isAssetName = false
		row.isInputAsset = false
		row.isBranch = false
		row.isAssetLocation = false
		row.isQuantity = false
		row.isUom = false
		row.isEffectiveDate = false
		row.isExpiryDate = false
		row.isVariableField = false
		row.isAssetCategory = false
		this.selectedCerttypes = []
		this.getUserLinkCertificateType(this.recordPerPage, 1);
	}	

	buttonTypes(type) {
		this.selectedOrganization = type;
		this.getUserLinkCertificateType(this.recordPerPage, 1);
	}

	getassetProvenanceData(certData) {
		this.url = "/assetprovenance/" + this.selectedOrganization
		var params = new HttpParams();
		this.subscriptions.push(this.apiService.getAsset(this.url, params)
			.subscribe((response) => {
				if(response.success == true) {
					this.allorganizationData = response.data.assetProvenanceField;
					var activeorganization = [];
                        for (var i = 0; i < this.allorganizationData.length; i++) {
                            activeorganization.push(this.allorganizationData[i]);
							let index = certData.findIndex(x => x._id == this.allorganizationData[i]._id)
						 this.hashFields[this.allorganizationData[i]._id] = this.allorganizationData[i].fields;
							if(this.openFlag[this.allorganizationData[i]._id] != true){
								this.checkArray[this.allorganizationData[i]._id] = this.allorganizationData[i].fields
							}									
							if (index > -1) {								
								if (this.certtypes[i]?.transactionTypeName) {
									this.allorganizationData[i].transactionTypeName = this.certtypes[index]?.transactionTypeName
								}
								if (this.certtypes[i]?.module?.name) {
									this.allorganizationData[i].moduleName = this.certtypes[index]?.module?.name
								}
								if (this.certtypes[i]?.module?.code) {
									this.allorganizationData[i].moduleCode = this.certtypes[index]?.module?.code
								}
								if (this.certtypes[i]?.organization?.name) {
									this.allorganizationData[i].organizationName = this.certtypes[index]?.organization?.name
								}
								if (this.certtypes[i]?.fields) {
									this.allorganizationData[i].fields = this.certtypes[index]?.fields
								}
								if (this.allorganizationData[i].isTransactionType == true) {
									certData[index].isTransactionType = true
								}
								if (this.allorganizationData[i].isAssetName == true) {
									certData[index].isAssetName = true
								}
								if (this.allorganizationData[i].isAssetCategory == true) {
									certData[index].isAssetCategory = true
								}
								if (this.allorganizationData[i].isInputAsset == true) {
									certData[index].isInputAsset = true
								}
								if (this.allorganizationData[i].isBranch == true) {
									certData[index].isBranch = true
								}
								if (this.allorganizationData[i].isAssetLocation == true) {
									certData[index].isAssetLocation = true
								}
								if (this.allorganizationData[i].isQuantity == true) {
									certData[index].isQuantity = true
								}
								if (this.allorganizationData[i].isUom == true) {
									certData[index].isUom = true
								}
								if (this.allorganizationData[i].isEffectiveDate == true) {
									certData[index].isEffectiveDate = true
								}
								if (this.allorganizationData[i].isExpiryDate == true) {
									certData[index].isExpiryDate = true
								}
								if (this.allorganizationData[i].label) {
									certData[index].label = this.allorganizationData[i].label
								}
							}
                        }
					let result = certData.filter(o1 => !this.allorganizationData.some(o2 => o1._id === o2._id));
					var newArray = result.concat(this.allorganizationData);
					this.dataSource.data = newArray;
					this.tempArray = newArray;
				}
			},error => {
          //error message
        }));
	}

	goBack() {
		this.location.back();
	};

	closedModal() {
		this.modalRef.hide();
	  }

	filterByColumn() {
		this.subscriptions.push(this.moduleIdFilter.valueChanges.subscribe((moduleIdFilterValue) => {
			this.filteredValues['moduleId'] = moduleIdFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		}));

		this.subscriptions.push(this.courseIdFilter.valueChanges.subscribe((courseIdFilterValue) => {
			this.filteredValues['courseId'] = courseIdFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		}));

		this.subscriptions.push(this.nameFilter.valueChanges.subscribe((nameFilterValue) => {
			this.filteredValues['certificateName'] = nameFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		}));		

		this.subscriptions.push(this.labelFilter.valueChanges.subscribe((labelFilterValue) => {
			this.filteredValues['label'] = labelFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		}));

		this.subscriptions.push(this.codeFilter.valueChanges.subscribe((codeFilterValue) => {
			this.filteredValues['TansactionCode'] = codeFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		}));
		this.dataSource.filterPredicate = this.customFilterPredicate();
	}

	customFilterPredicate() {
		const myFilterPredicate = function (data: Type, filter: string): boolean {
			let searchString = JSON.parse(filter);
			if(data?.moduleCode){
				return (data.moduleName.toString().trim().toUpperCase().indexOf(trim(searchString.courseId)) !== -1 || data.moduleName.toString().trim().toLowerCase().indexOf(trim(searchString.courseId)) !== -1 || data.moduleName.toString().trim().indexOf(trim(searchString.courseId)) !== -1)
				&& (data.moduleCode.toString().trim().toUpperCase().indexOf(trim(searchString.moduleId)) !== -1 || data.moduleCode.toString().trim().toLowerCase().indexOf(trim(searchString.moduleId)) !== -1 || data.moduleCode.toString().trim().indexOf(trim(searchString.moduleId)) !== -1)
				&& (data.transactionTypeName.toString().trim().toUpperCase().indexOf(trim(searchString.certificateName)) !== -1 || data.transactionTypeName.toString().trim().toLowerCase().indexOf(trim(searchString.certificateName)) !== -1 || data.transactionTypeName.toString().trim().indexOf(trim(searchString.certificateName)) !== -1)
				&& (data.transactionTypeCode.toString().trim().toUpperCase().indexOf(trim(searchString.TansactionCode)) !== -1 || data.transactionTypeCode.toString().trim().toLowerCase().indexOf(trim(searchString.TansactionCode)) !== -1 || data.transactionTypeCode.toString().trim().indexOf(trim(searchString.TansactionCode)) !== -1)
			}else{
				return (data.module.name.toString().trim().toUpperCase().indexOf(trim(searchString.courseId)) !== -1 || data.module.name.toString().trim().toLowerCase().indexOf(trim(searchString.courseId)) !== -1 || data.module.name.toString().trim().indexOf(trim(searchString.courseId)) !== -1)
				&& (data.module.code.toString().trim().toUpperCase().indexOf(trim(searchString.moduleId)) !== -1 || data.module.code.toString().trim().toLowerCase().indexOf(trim(searchString.moduleId)) !== -1 || data.module.code.toString().trim().indexOf(trim(searchString.moduleId)) !== -1)
				&& (data.transactionTypeName.toString().trim().toUpperCase().indexOf(trim(searchString.certificateName)) !== -1 || data.transactionTypeName.toString().trim().toLowerCase().indexOf(trim(searchString.certificateName)) !== -1 || data.transactionTypeName.toString().trim().indexOf(trim(searchString.certificateName)) !== -1)
				&& (data.transactionTypeCode.toString().trim().toUpperCase().indexOf(trim(searchString.TansactionCode)) !== -1 || data.transactionTypeCode.toString().trim().toLowerCase().indexOf(trim(searchString.TansactionCode)) !== -1 || data.transactionTypeCode.toString().trim().indexOf(trim(searchString.TansactionCode)) !== -1)
			}
		}
		return myFilterPredicate;
	};
	clearFilter(event,value){
		value =''
		this.getUserLinkCertificateType(this.recordPerPage, this.currentPage);
	}
	onSearch(event){
		this.filter.searchKey = event
		this.getUserLinkCertificateType(this.recordPerPage, this.currentPage);
	}
	onChangedPage(pageData: PageEvent) {
		this.currentPage = pageData.pageIndex + 1;
		this.recordPerPage = pageData.pageSize;
		this.getUserLinkCertificateType(this.recordPerPage, this.currentPage);
	}
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	  };
	  
	  @HostListener("window:resize", [])
	  onResize() {
	  this.detectScreenSize();
	  }
  
	  private detectScreenSize() {
		const width = window.innerWidth;
		if(width<601){
			this.dragableRow=true;
		}else{
			this.dragableRow=false;
		}
	  }  
	  
	  dragableRowfalse(){		
		this.dragableRow=false;
	  }   

	ngAfterViewInit() {
		this.detectScreenSize();	
	}
}