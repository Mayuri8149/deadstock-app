import { SelectionModel } from '@angular/cdk/collections';
import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { faHandPointLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subscription } from 'rxjs';
import { OrganizationModule } from '../modals/organization-module';
import { ApiService } from '../services/api.service';
import { CategoryService } from '../services/category.service';
import { ConfirmDialogService } from '../services/confirm-dialog.service';
import { ErrorDialogService } from '../services/error-dialog.service';
import { SnackbarService } from '../services/snackbar.service';

interface PeriodicElement1 {
  category: string;
  subcategory: string;
  subsubcategory: string;
  code:string,
  transactiontype:string
}
@Component({
  selector: 'app-search-categories',
  templateUrl: './search-categories.component.html',
  styleUrls: ['./search-categories.component.css']
})
export class SearchCategoriesComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
  faHandPointLeft = faHandPointLeft;
	faSearch = faSearch;
  recordPerPage: any= 5;
  pageSizeOptions = [5,10, 20, 50, 100];
  currentPage: any = 1;
  url: string;
	urls: string;
	loggedInUser;
	
	role;
	entity;
	modules = [];
	module: any = {};
	selectedModules: any = [];
	transtypes;
	finalTransactionForm: any;
	selectedBatches;
	transType;
  transtypeData;
  subCatId = null
  subSubCatId = null
  idToBeDeleted=null
  trackflag: Boolean = false;
  disabledTransType: Boolean = true;
  categoryList = []
  subCategoryList = []
  subSubCategoryList = []
  additionalDescription=null;
  filter:any={category:'',sub_category: '',sub_sub_category: '',code:'',search: '',additionalDescription:''}
  totalCount = 0
  displayedColumns1: string[] = ['select','actions2','category', 'subcategory','moduleID','subsubcategory'];
  dataSource = []
  selection = new SelectionModel<OrganizationModule>(true, []);
  organizationIdFilter = new FormControl();
	departmentIdFilter = new FormControl();

  categories:any
  modalRef: BsModalRef;
  credData: any;
  credDatas: any;
  certype;
  createdBy: any = {}
  dialogChangeEvent: any;
  icon: any; 
  iconName:any;
  urlTransType:string
  readonlyOrderId;
  constructor(private categoryService:CategoryService,
    private _formBuilder: FormBuilder,
    public errorDialogService: ErrorDialogService,
    public confirmDialogService: ConfirmDialogService,
    private apiService: ApiService,
    public router: Router,
    private el: ElementRef,
		public snackbarService: SnackbarService,private modalService:BsModalService) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
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
  ngOnInit() {
      this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
      this.role = this.loggedInUser.reference.role;
      this.entity = this.loggedInUser.reference.entity;
      this.finalTransactionForm = this._formBuilder.group({
        buttonList: [''],
  
      });
      
      this.createdBy = {
        firstName: this.loggedInUser.firstName,
        lastName: this.loggedInUser.lastName,
        email: this.loggedInUser.email
        }
      this.getCategories()
      this.searchCategories()
  
  }
  isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.length;
		return numSelected === numRows;
	};

	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() : this.dataSource.forEach(row => this.selection.select(row));
	};

  selectRow($event, row) {
    this.selection.clear();
    this.finalTransactionForm.patchValue({buttonList:''});
    this.getTransType();
	}

    getTransType() {
  		this.url = "/transtype/Alllist";
  		var params = new HttpParams();
  		params = params.append('organizationId', this.loggedInUser.reference.organizationId);

      params = params.append('role', this.loggedInUser.reference.role);
      if(this.filter.additionalDescription){
        params = params.append('additionalDescription', this.filter.additionalDescription);
      }

  		this.subscriptions.push(this.apiService.get(this.url, params)
  			.subscribe((response: any) => {
  				if (response.success == true) {
            if(this.selection.selected.length>0){
              this.transtypeData = response.data.result.transtypes;
            }
  				}
  			}));
    }
    
  
saveTransactionType(val,element) {  
    this.selectedModules = this.selection.selected;
    this.url = '/transactiontype/create';
    this.urls = "/transtype/list";

    var paramss = new HttpParams();
    paramss = paramss.append('organizationId', this.loggedInUser.reference.organizationId);
    paramss = paramss.append('transTypeId', val);
    paramss = paramss.append('pagesize', '1');
    paramss = paramss.append('page', '1');
    
    this.subscriptions.push(this.apiService.get(this.urls, paramss)
      .subscribe((response: any) => {
        if (response.success == true) {
        
          this.credDatas = response.data.result.transtypes;
          var credDatas = response.data.result.transtypes;
  
          for(var i=0; i<this.credDatas.length; i++) {   
            var transactionidFields = credDatas[i].fields;
            var fields = {};
            transactionidFields.forEach((field) => {
  
              var formDataKey = Object.keys(field)[i];
              fields[formDataKey] = "";
  
            })
            credDatas[i].fields = fields;
          }
          this.certype = credDatas;
          var data = {
            transactionTypeId: val,
            moduleId: this.selectedModules[0].sub_sub_category._id,
            organizationId: this.certype[0].organizationId,
            departmentId: this.certype[0].departmentId,
            transactionTypeName: this.certype[0].transactionTypeName,
            transactionTypeCode: this.certype[0].transactionTypeCode,
            additionalDescription: this.certype[0].additionalDescription,
            transactionTypePrefix: this.certype[0].transactionTypePrefix,
            transactionTypeAutoNumber: this.certype[0].transactionTypeAutoNumber,
            assetWithoutReference: this.certype[0].assetWithoutReference,
            epr: this.certype[0].epr,
            eprReceive: this.certype[0].eprReceive,
            eprConsume: this.certype[0].eprConsume,
            eprPrint: this.certype[0].eprPrint,
            nft: this.certype[0].nft,
            transRole: this.certype[0].transRole,
            orderType: this.certype[0].orderType,
            pdffield: this.certype[0].pdffield,
            review: this.certype[0].review,
            certify: this.certype[0].certify,
            approve: this.certype[0].approve,
            asset: this.certype[0].asset,
            credImg: this.certype[0].credImg,
            transaction: this.certype[0].transaction,
            orderReference: this.certype[0].orderReference,
            serialized: this.certype[0].serialized,
            provenance:this.certype[0].provenance,
            verifiable:this.certype[0].verifiable,
            htmlFile: this.certype[0].htmlFile,
            assetType:this.certype[0].assetType,
            fromToEntity: this.certype[0].fromToEntity,
            fields: this.certype[0].fields,
            staticFields: this.certype[0].staticFields,
            isPublic: this.certype[0].isPublic,
            viewPDF: this.certype[0].viewPDF,
            createdBy: this.createdBy,
            updatedBy: this.createdBy,
            status: this.certype[0].status,
            refModule: this.certype[0].refModule,
            refTransType: this.certype[0].refTransType,
            isExpiry: this.certype[0].isExpiry,
            inputAsset: this.certype[0].inputAsset,
            referenceCreatedBy: this.loggedInUser._id,
          };
          this.subscriptions.push(this.apiService.post(this.url, data)
            .subscribe((response: any) => {
                if (response.success == true) {
                var moduleId = this.selectedModules[0].sub_sub_category._id
                this.urlTransType = "/subsubcategories/module/" + moduleId + "/changeDeleteStatus";
                var data1 = {
                  isActive: true,
                  moduleId: moduleId
                };

                this.apiService.put(this.urlTransType, data1)
                  .subscribe((response: any) => {
                  if (response.success == true) {
                      this.snackbarService.openSuccessBar('Transaction Type added successfully.', "Transaction Type");
                      this.getTransType();   
                      this.selection.clear();
                      this.transtypeData = [];
                      this.disabledTransType=false
                      this.router.navigate(['/searchCategories']);
                    }
                    }, error => {
                      this.selection.clear();
                      this.transtypeData = [];
                      this.disabledTransType=false
                      this.router.navigate(['/searchCategories']);
                    });
            }
        }, error => {
            this.selection.clear();
            this.transtypeData = [];
            this.disabledTransType=false
            this.router.navigate(['/searchCategories']);
        }))
        }
      }));
};

  //following function used to get categories
  getCategories() {
    this.subscriptions.push(this.categoryService.getCategories(this.recordPerPage, this.currentPage,this.filter.search)
      .subscribe((response) => {
        if (response.success == true) {
          if (response.data) {
            this.categoryList = response.data[0].categories;
          }
        }
      }, error => {
        //error message
      }));
  };

   //following function used to get sub categories
   getSubCategories() {
    this.subscriptions.push(this.categoryService.getSubCategories(this.subCatId,this.recordPerPage, this.currentPage,this.filter.search)
      .subscribe((response) => {
        if (response.success == true) {
          if (response.data) {
            this.subCategoryList = response.data[0].sub_categories;
          }
        }
      }, error => {
        //error message
      }));
  };

  //following function used to get sub sub categories
  getSubSubCategories() {
    this.subscriptions.push(this.categoryService.getSubSubCategories(this.subSubCatId,this.recordPerPage, this.currentPage,this.filter.search)
          .subscribe((response) => {
            if (response.success == true) {
              if (response.data) {
                this.subSubCategoryList = response.data.sub_sub_categories;
              }
            }
          }, error => {
            //error message
          }))
      }

      //following function used to change sub category
      selectSubCategory(event){
        this.subCatId = event
        this.searchCategories()
        this.getSubCategories()
      }

      //following function used to change sub sub category
      selectSubSubCategory(event){
        this.subSubCatId = event
        this.searchCategories()
        this.getSubSubCategories()
      }

        //following function used to change sub sub category       
        onSelectSubSubCategory(){
          this.searchCategories()
        }
        openConfirmDialog(row) {
          var data = {
            transType: row,
            isActive: row.sub_sub_category.isActive,
            status: 'Link'
          };
          if (row.sub_sub_category.isActive == false) {
             data.isActive = true;
           data.status = 'Link';
          } else{
            data.isActive = false;
            data.status = 'Unlink';
          }
          this.confirmDialogService.open(data);
          this.dialogChangeEvent = this.confirmDialogService.change.subscribe((data: any) => {
            if (data.doAction === true) {
              this.deleteModule(data);
              this.dialogChangeEvent.unsubscribe();
            } else {
              this.searchCategories()
              this.dialogChangeEvent.unsubscribe();
            }
          })
        };

        deleteModule(obj){    
          this.urls = '/transtype/selectedModuleId/' + obj.transType.sub_sub_category._id;
          var paramss = new HttpParams();
  
          this.subscriptions.push(this.apiService.get(this.urls, paramss)
            .subscribe((response: any) => {
              if(response.data.transType.length > 0){
                var data = {
                  reason: "Module is linked to the Organization so cannot unlink Module with Transaction Type!",
                  status: ''
                };
                this.errorDialogService.openDialog(data);
                this.searchCategories()
              }else{
                var moduleId = obj.transType.sub_sub_category._id
                this.url = "/subsubcategories/module/" + moduleId + "/changeDeleteStatus";

                var data1 = {
                  isActive: obj.isActive,
                  moduleId: obj.transType.sub_sub_category._id
                };

                this.apiService.put(this.url, data1)
                  .subscribe((response: any) => {
                  if (response.success == true) {
                    if(obj.isActive == false){
                      this.urlTransType = '/transactiontype/delete';
                      var statusData = {
                        moduleId: obj.transType.sub_sub_category._id
                      };
                
                      this.subscriptions.push(this.apiService.post(this.urlTransType, statusData)
                      .subscribe((response: any) => {
                        this.snackbarService.openSuccessBar("Module unlink successfully", "Module");
                        this.searchCategories()                      
                      }))
                    }else{
                      this.snackbarService.openSuccessBar("Module link successfully", "Module");
                      this.searchCategories()
                    }
                  }
                },
                  error => {
                    //error message
                  }
                  );
              }  
            }))
        }

      //following function used to get list of  categories
      searchCategories(){
        this.subscriptions.push(this.categoryService.searchCategories(this.filter,this.recordPerPage, this.currentPage)
          .subscribe((response:any) => {
            if (response.success == true) {
              if (response.data) {
            this.transtypes = response.data.list
            var data = this.transtypes
            for (var i = 0; i < data.length; i++) {
              if (data[i].sub_sub_category.isActive == false) {
                this.icon = '../../assets/icons/unlink.svg';
                this.iconName = 'Link';
                data[i].icon = this.icon
                data[i].iconName = this.iconName
              } else {
                this.icon = '../../assets/icons/link.svg';
                this.iconName = 'Unlink';
                data[i].icon = this.icon
                data[i].iconName = this.iconName
              }
            }
            this.totalCount = response.data.total_count
            this.dataSource = data;
              }
            }
          }, error => {
            //error message
          }))
      }

      uncheck(e){
        if (e.target.checked == true){
          this.selection.clear();
          this.transtypeData = [];
          this.transtypeData.length=0
          this.filter.additionalDescription = '';
        }
      }

    //pagination change function
      onChangedPage(pageData: PageEvent) {
        this.currentPage = pageData.pageIndex + 1;
        this.recordPerPage = pageData.pageSize;
        this.searchCategories()
      }
    
      //search category function
      onSearch(event){
        this.filter.search = event
      }
      selectadditionalDescription(event){	
        this.filter.additionalDescription = event;
        this.getTransType()
      }
      clearFilter(event,value){
        value =''
        this.getTransType()
      }

      //open confirmation modal
     selectedCat(template: TemplateRef<any>, id){
        this.modalRef = this.modalService.show(template, { class: 'modal-md measurable-modal-popup' });
        this.idToBeDeleted = id.sub_sub_category._id;
      }
      onKeyPress(event: any) {
        this.trackflag = true;
      };
       //close confirmation modal
      decline(): void {
        this.modalRef.hide();
      }

      //following function used to delete category 
      confirm(): void {
        this.modalRef.hide();
        this.deleteSubSubCategories()
      }

        deleteSubSubCategories(){
        this.urls = '/transtype/selectedModuleId/' + this.idToBeDeleted;
        var paramss = new HttpParams();
        this.subscriptions.push(this.apiService.get(this.urls, paramss)
          .subscribe((response: any) => {
            if(response.data.transType.length > 0){
              var data = {
                reason: "Module is linked to a Transcation Type so cannot delete Module!",
                status: ''
              };
              this.errorDialogService.openDialog(data);
              this.searchCategories()
            }else{
              this.subscriptions.push(this.categoryService.deleteSuSubCategories(this.idToBeDeleted)
              .subscribe((response: any) => {
                if (response.success == true) {
                  this.snackbarService.openSuccessBar("Module deleted successfully", "Module");
                  this.searchCategories()
                }
              },
                error => {
                  //error message
                }));
            }
          }))          
        }
        ngOnDestroy() {
          this.subscriptions.forEach(subscription => subscription.unsubscribe());
        };
}
export interface type {
	organizationId: string;
	transactionTypeName: string;
	fields: Object;
}