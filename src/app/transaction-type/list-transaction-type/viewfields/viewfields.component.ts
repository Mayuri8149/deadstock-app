import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { ErrorDialogService } from 'src/app/services/error-dialog.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { environment } from 'src/environments/environment';

declare var $: any;
var maxPDFx = 612;
var maxPDFy = 794;
var offsetY = 0;
 


@Component({
  selector: 'app-viewfields',
  templateUrl: './viewfields.component.html',
  styleUrls: ['./viewfields.component.css']
})

export class ViewfieldsComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];

	dragDroppables: any[];
  state = '';
  position = '';

  @Input() props: [{ [key: string]: object | any }];

  	imgUrl: any;
	url: string;
	loggedInUser;
	role;
	entity;
	transactionTypes: any[] = [];
  	selectedTransType: any = [];
	dataSource = new MatTableDataSource<any>();
	dashboard;
	organizationIdFilter = new FormControl();
	departmentIdFilter = new FormControl();
	transactionTypeNameFilter = new FormControl();
	typeFieldsFilter = new FormControl();
	datatypefieldFilter = new FormControl();
	transactionidFieldsFilter = new FormControl();
	transtypeFilter = new FormControl();
	displayedFields = [];
	collLast = ['xcordinate','ycordinate'];
	displayedColumns: string[];
	allColumns: string[];
	twoArrys: any[];
	dataArr;

	imgPath: any;
	filename: any;
	credData: any;
	transtypeId: any;
	transactionTypeName: string;
	transTypeId: any;
	id: any;
	sotservice: any;
    imgfile:any;
	fieldsObj:any;
	transTypeForm: FormGroup;
	selection = new SelectionModel<any>(true, []);
	imageToShow: any;
	isImageLoading: boolean;
	fileData: File = null;
	previewUrl:any = null;
	fileUploadProgress: string = null;
	uploadedFilePath: string = null;
	name: any;
	files: any;
	transactiontypeData = {
		credImg: '',
	}
	selected: any =null;
	x_elem: number = 0;
	y_elem: number =0;
	x_pos: number =0 ;
	y_pos: number = 0;	
	@ViewChild(MatSort) sort: MatSort;	
  	fieldObject: {};
	viewCredForm: FormGroup;
	myObjArray= [];
	keyname: any;	
	coordinates: { top: any; left: any; };
	certObj: string;
	keyvalue: any;
	keytransactionid: any;
	parameterArr: any = [];
	parameterArr1: any;
	xCordinateFinal: any;
	yCordinateFinal: any;
	corValueArr: { xcor: number; ycor: number; };
	cordinates: any[];
	displayedFields1: string[];
	pdfurl: string;
	dynamicURL: string;
	dynamicPDFURL: any;
	dynamicPDFFlag: boolean;
	dynamicPDF: any;
	credFileWidth: string;
	credFileHeight: string;
	credFileType: any;
	htmlFile:any;
	isActive: any;
	modules: any;
	modulesList: any[];
	transactionTypesList: any[];
	moduleName: any;
	result: any;
	refTransDesc: any;
	curPage:any=1;
  	orgPerPage:any=5;
	@HostListener('document:mousemove', ['$event']) 
	@HostListener('window:mouseup', ['$event'])	

  onMouseMove(e) {
    this.x_pos = document.all ? e.clientX : e.pageX;
    this.y_pos = document.all ? e.clientY : e.pageY;
    if (this.selected !== null) {
      this.selected.style.left = (this.x_pos - this.x_elem) + 'px';
			this.selected.style.top = (this.y_pos - this.y_elem) + 'px';			
    }
	}
	mouseUp(event) {
		var value = [];
		if (this.selected !== null) {
			if (this.myObjArray.length > 0) {
				for (var x = 0; x < this.myObjArray.length; x++) {
					if (this.myObjArray[x][0].key == this.keyname) {
						this.myObjArray[x][0].xcor = this.selected.style.top;
						this.myObjArray[x][0].ycor = this.selected.style.left;
						this.selected = null;
					} 
				}
			}
			else {
				var newarray = value.push({ key: this.keyname, transactionid: this.keytransactionid, value: this.keyvalue, xcor: this.selected.style.top, ycor: this.selected.style.left });
				this.myObjArray.push(value);
				this.selected = null;
			}
		}
		if (this.selected !== null) {
			var newarray = value.push({ key: this.keyname, transactionid: this.keytransactionid, value: this.keyvalue, xcor: this.selected.style.top, ycor: this.selected.style.left });
				this.myObjArray.push(value);
			this.selected = null;
		}
  }
 
  showDiv = {
    pdf : false,
  }

	constructor(private apiService: ApiService,
				private location: Location,
				private route: ActivatedRoute,
				public router: Router,
				public dataService: DataService,
				public errorDialogService: ErrorDialogService,
				private formBuilder: FormBuilder,
		public snackbarService: SnackbarService) { }

	
	ngOnInit() {
      this.filename = [];
		this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
		this.role = this.loggedInUser.reference.role;
		this.entity = this.loggedInUser.reference.entity;
		this.transtypeId = this.route.snapshot.params['transtypeId'];
		this.transactionTypeName = this.route.snapshot.params['transactionTypeName'];
		this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['recordPerPage'];
		this.dataSource.sort = this.sort;
		this.transTypeForm = this.formBuilder.group({
			credImg : [''],
		});

		 this.testMappingsFn()
		.then((data) => {
			this.getModules();
			if(data[4] == 'Transaction'){
				this.dynamicPDFURL = this.imgUrl = environment.baseUrl +"/transactions/dynamic/transaction_type-"+data[3] + '.pdf'; 
			}else{
				this.dynamicPDFURL = '';
			}
					
		  })
		  .catch((error) => {
		  });		
	}

	async getByRefTransType() {
		this.url = "/transactiontype/transByRefTransType";
		var params = new HttpParams();    
		params = params.append('organizationId', this.result.transType.organizationId);
		params = params.append('refTransType', this.result.transType.refTransType);
		await this.subscriptions.push(this.apiService.get(this.url, params)
		  .subscribe((response: any) => {
			if (response.success) {
				if(response.data?.result?.additionalDescription!=undefined){
				this.refTransDesc = response.data?.result?.additionalDescription
			  }
			}
		  }))
	  }

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	};

	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
	};

	testMappingsFn() {  
		var promise = new Promise(async (resolve, reject) => {
		try {
			this.url = '/transtype/' + this.transtypeId ;
			var params = new HttpParams();
			params = params.append('id', this.transtypeId);

			this.subscriptions.push(this.apiService.get(this.url, params)
				.subscribe((response: any) => {
				if(response.success == true){
					if(response.data){
						this.result = response.data;
						var credData:any = response.data.transType;
						if(this.result.transType.refTransType!=undefined || this.result.transType.refTransType!=null || this.result.transType.refTransType!=""){
							this.getByRefTransType();
						}
						let fieldArray: any | undefined = [];
						let dataArr: any | undefined = [];
						let dFields: any | undefined = [];
						let sFields: any | undefined = [];
						let sfieldArray: any | undefined = [];
						let staticData: any | undefined = [];
						let sdataArr: any | undefined = [];
				
						for (var i = 0; i < credData.fields.length; i++) {
							dFields[i] = credData.fields[i][0];
							if((dFields[i].is_line_level==false || dFields[i].is_line_level==undefined || dFields[i].is_line_level==null || dFields[i].is_line_level=='') && (dFields[i].is_outside_level==false || dFields[i].is_outside_level==undefined || dFields[i].is_outside_level==null || dFields[i].is_outside_level=='')){
								dFields[i].is_header_level=true
							}
							var noId2 = 480;
							this.parameterArr[i] = {
								"idParametro":noId2+i+1,
								"descrizione":dFields[i].key,
								"valore":dFields[i].key,
								"nota": null
							}
							fieldArray[i] = {	
								key:dFields[i].key,						
								value:dFields[i].value,					
								is_header_level: dFields[i].is_header_level,
								is_line_level: dFields[i].is_line_level,
								is_outside_level: dFields[i].is_outside_level,
							};
							dataArr.push(fieldArray[i]);
							this.displayedFields = Object.keys(dataArr[i]);							
						}

						for (var j = 0; j < credData.staticFields.length; j++) {
							sFields[j] = credData.staticFields[j][0];
							sfieldArray[j] = {	
								key:sFields[j].key,							
								value:sFields[j].value,						
								fontsize:sFields[j].fontsize,
								color:sFields[j].color,						
							};
							sdataArr.push(sfieldArray[j]);
							var noId1 = 480+credData.fields.length;

							this.parameterArr[j+credData.fields.length] = {
								"idParametro":noId1+j+1,
								"descrizione":sFields[j].key,
								"valore":sFields[j].key,
								"nota": null
							}
						}
						var returnArr = [this.parameterArr,this.result.transType.credImg,this.result.transType.transactionTypeName, this.result.transType._id, this.result.transType.transaction]
						resolve(returnArr);
						this.displayedColumns = this.displayedFields;	
						this.dataSource.data = dataArr;
					}
				}
			}))
			
			} catch (error) {
				reject(error);
			}
		});
		return promise;
	};

	getModules() {
		this.url = "/module/moduleList";
		this.isActive = true;
		var params = new HttpParams();
		params = params.append('organizationId', this.loggedInUser.reference.organizationId);
		params = params.append('departmentId', this.loggedInUser.reference.departmentId);
		params = params.append('isActive',this.isActive);

		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response: any) => {
				this.modules = response.data.modules;
				if (response.success) {
					var moduleList = [];
					var moduleArray = response.data;
					for (var i = 0; i < moduleArray.length; i++) {
						if ('organizationId' in moduleArray[i]){
						} else {
							moduleList[moduleArray[i].code]=moduleArray[i];
						}
					}
					this.modulesList = moduleList;					
				}
			}))
	}

	goBack() {
		this.router.navigate(['/transactionTypes/listTransactionType/'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage}});
	}
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}

export interface type {
	organizationId: string;
	departmentId: string;
	transactionTypeName: string;
	fields: Object;
}