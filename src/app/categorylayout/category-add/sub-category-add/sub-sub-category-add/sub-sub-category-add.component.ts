//Start Mahalaxmi(SCI-I830) 06/05/2021
import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { faHandPointLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { trim } from 'jquery';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { module } from 'src/app/modals/module';
import { ApiService } from 'src/app/services/api.service';
import { CategoryService } from 'src/app/services/category.service';
import { ErrorDialogService } from 'src/app/services/error-dialog.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Subscription } from 'rxjs';

interface PeriodicElement {
  name: string;
}

@Component({
  selector: 'app-sub-sub-category-add',
  templateUrl: './sub-sub-category-add.component.html',
  styleUrls: ['./sub-sub-category-add.component.css']
})
export class SubSubCategoryAddComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  faHandPointLeft = faHandPointLeft;
  faSearch = faSearch;
  showCategory: boolean = false
  categoryLable = ''
  categoryName = ''
  subCategoryName = ''
  categoryDetails: any = {}
  url: String
  categories = []
  categoryLists = []
  categoryList = []
  subCategories = []
  subCategoryList = []
  subSubCategories = []
  subSubCategoryList = []
  recordPerPage: any= 5;
  pageSizeOptions = [5,10, 20, 50, 100];
  currentPage: any = 1;
  subCatId = null
  subSubCatId = null
  selectedCategories = []
  placeHolder = 'Category'
  moduleCode=null;
  moduleName=null
  filter = {moduleName:'',moduleCode:'',search: ''}
  totalCount = 0
  idToBeDeleted=null
  modalRef: BsModalRef;
  message: string;
  selectedsubCategories;
  selectedsubsubCategories;
  categoryForm: FormGroup;
  trackflag: Boolean = false;
  flagDisabledAddCat: boolean =true;
  catName: any;
  subCatName: any;
  invalidCategoriesArr = []
  urls:string;
  baseURL: string = '/api/v1';
  curPage= 1;
	recPerPage=5;
	pageIndex=0;
	pageSize=5
  fcurPage= 1;
	frecPerPage=5;
  constructor(private route: ActivatedRoute,
    private _formBuilder: FormBuilder, 
    private snackbarService: SnackbarService,
    public errorDialogService: ErrorDialogService,
    public router: Router,
    private location: Location,
    private apiService: ApiService,
     private categoryService: CategoryService,private modalService: BsModalService) { }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('errtemplate', { static: false }) private errtemplate;

  displayedColumn: string[] =  [
    'actions',
    'moduleID',
    'name'    
  ];
	dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  organizationIdFilter = new FormControl();
	departmentIdFilter = new FormControl();
  moduleIdFilter = new FormControl();
  filteredValues = {
		name: '',
    code: ''
  }
  
  ngOnInit() {
    this.categoryForm = this._formBuilder.group({
          name: ['', [Validators.required]], 
          code: ['', [Validators.required, Validators.pattern('/^[ A-Za-z0-9]*$/'), this.noWhitespaceValidator]], 
          category: ['', [Validators.required]],     
    });
    this.subCatId = this.route.snapshot.params['subId'];
    this.subSubCatId = this.route.snapshot.params['subSubId'];
    this.catName = this.route.snapshot.params['catname'];
    this.subCatName = this.route.snapshot.params['subcatname'];
    this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.recPerPage = this.route.snapshot.queryParams['recordPerPage'];
    this.fcurPage = this.route.snapshot.queryParams['fcurrentPage'];
		this.frecPerPage = this.route.snapshot.queryParams['frecordPerPage'];
    this.getSubSubCategories(this.recordPerPage,this.currentPage);
    this.filterByColumn();
  }

  public noWhitespaceValidator(control: FormControl) {
		const isWhitespace = (control.value || '').trim().length === 0;
		const isValid = !isWhitespace;
		return isValid ? null : { 'whitespace': true };
	}

  isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
	}

	selectRow($event, row) {
		if ($event.checked == true) {
			var dashboard = window.localStorage.getItem('dashboard');
			if (dashboard != 'yes') {
				if (this.selection.selected.length > 0) {
					this.selection.clear();
				}

			} else {
				if (this.selection.selected.length > 0) {
					this.selection.clear();
				}

			}
		}
  }
  
  goBack() {
    if(this.curPage && this.recPerPage && this.fcurPage && this.frecPerPage){
      this.router.navigate(['/categorylayout/categoryAdd/subCategoryAdd/'+ this.subCatId+"/"+this.catName],{ queryParams: { currentPage: this.curPage, recordPerPage: this.recPerPage, fcurrentPage: this.fcurPage, frecordPerPage: this.frecPerPage }} );
   	}else{
      this.router.navigate(['/categorylayout/categoryAdd/subCategoryAdd/'+ this.subCatId+"/"+this.catName],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.recordPerPage }});
    }
  }

  addMoreCategory() {
    var pattern = new RegExp(/[~`._!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/); 
    var patternForSpace = new RegExp(/\s/g); 
   if(this.categoryDetails.name ===undefined || this.categoryDetails.name === null || this.categoryDetails.name ==''){
        this.flagDisabledAddCat= true;
        var errordata = {
          reason: "Please add Module name!",
          status: ''
        };
        this.errorDialogService.openDialog(errordata);
        return true;
      }else if(this.categoryDetails.code ===undefined || this.categoryDetails.code === null || this.categoryDetails.code ==''){
        this.flagDisabledAddCat= true;
        var errordata = {
          reason: "Please add Module code!",
          status: ''
        };
        this.errorDialogService.openDialog(errordata);
        return true;
      }else if(pattern.test(this.categoryDetails.code)){
        var errordata = {
          reason: "Please enter valid Module code!",
          status: ''
        };
        this.errorDialogService.openDialog(errordata);
        return true;
      }else if(patternForSpace.test(this.categoryDetails.code)){
        var errordata = {
          reason: "Blank Space not allowed",
          status: ''
        };
        this.errorDialogService.openDialog(errordata);
        return true;
      }
      else{
        let name = this.categoryDetails.name.trim()
        let code = this.categoryDetails.code.toUpperCase().trim()
        let index = this.subSubCategories.findIndex(x=>x.code == code)
        if(index == -1){
        this.subSubCategories.push({name:name,code:code})
        this.selectedCategories = this.subSubCategories    
        this.flagDisabledAddCat= false; 
        }else{
          var errordata = {
            reason: "Duplicate Module!",
            status: ''
          };
          this.errorDialogService.openDialog(errordata);
        }           
      }
    this.categoryDetails.name = ''
    this.categoryDetails.code = ''
  }

   //open confirmation modal
  selectedCat(template: TemplateRef<any>, id){
    this.modalRef = this.modalService.show(template, { class: 'modal-md measurable-modal-popup' });
    this.idToBeDeleted = id;
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

  removeSelectedCategory(index) {
    this.selectedCategories.splice(index, 1)
  }
 
  //following function used to add sub sub category
  addSubSubCategory() {
    var pattern = new RegExp(/[~`._!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/); 
    var patternForSpace = new RegExp(/\s/g); 
    if(this.categoryDetails.name ===undefined && this.categoryDetails.code ===undefined || this.categoryDetails.name ===null && this.categoryDetails.code ===null || this.categoryDetails.name ==="" && this.categoryDetails.code ==="" ){
      var errordata = {
        reason: "Please add Module Id and Module Name!",
        status: ''
      };
      this.errorDialogService.openDialog(errordata);
      return true;
    }
     if(this.categoryDetails.name ===undefined || this.categoryDetails.name ===null || this.categoryDetails.name === ""){
      var errordata = {
        reason: "Please add Module name!",
        status: ''
      };
      this.errorDialogService.openDialog(errordata);
      return true;
      
    }
     if(this.categoryDetails.code ===undefined || this.categoryDetails.code ===null || this.categoryDetails.code ===""){
      var errordata = {
        reason: "Please add Module code!",
        status: ''
      };
      this.errorDialogService.openDialog(errordata);
      return true;
      
    } if(pattern.test(this.categoryDetails.code)){
      var errordata = {
        reason: "Please enter valid Module code!",
        status: ''
      };
      this.errorDialogService.openDialog(errordata);
      return true;
    }
     if(patternForSpace.test(this.categoryDetails.code)){
      var errordata = {
        reason: "Blank Space not allowed",
        status: ''
      };
      this.errorDialogService.openDialog(errordata);
      return true;
    }
    if(this.categoryDetails.name !=='' && this.categoryDetails.code !==''){
      let name = this.categoryDetails.name.trim()
      let code = this.categoryDetails.code.toUpperCase().trim()
      let index = this.subSubCategories.findIndex(x=>x.code == code)
      if(index == -1){
        this.subSubCategories.push({name:name,code:code})
        }else{
          var errordata = {
            reason: "Duplicate Module!",
            status: ''
          };
          this.errorDialogService.openDialog(errordata);
        }           
    }else if(this.categoryDetails.name ===undefined){
      var errordata = {
        reason: "Please add Module name!",
        status: ''
      };
      this.errorDialogService.openDialog(errordata);
      return true;
    }else if(this.categoryDetails.code ===undefined){
      var errordata = {
        reason: "Please add Module code!",
        status: ''
      };
      this.errorDialogService.openDialog(errordata);
      return true;
    }else if(pattern.test(this.categoryDetails.code)){
      var errordata = {
        reason: "Please enter valid Module code!",
        status: ''
      };
      this.errorDialogService.openDialog(errordata);
      return true;
    }else if(patternForSpace.test(this.categoryDetails.code)){
      var errordata = {
        reason: "Blank Space not allowed",
        status: ''
      };
      this.errorDialogService.openDialog(errordata);
      return true;
    }
   
    let arrsubSubCategories = this.subSubCategories.filter(item => item);
    this.url = '/subsubcategories/add_sub_sub_categories';
    let reqObj = {
      "category": this.subCatId,
      "sub_category": this.subSubCatId,
      "sub_sub_categories": arrsubSubCategories
    }
    this.categoryService.addSubSubCategories(this.url, reqObj)
      .subscribe((response: any) => {
        if (response.success == true) {
          if(typeof response.data.invalidCategoriesArr === 'undefined'){
            response.data.invalidCategoriesArr = []
          }
          if(response.data.invalidCategoriesArr.length>0){
            this.invalidCategoriesArr = response.data.invalidCategoriesArr
            // this.categoryDetails.name ='';
            // this.categoryDetails.code ='';
            this.subSubCategories = []
            this.selectedCategories = response.data.invalidCategoriesArr
             var errordata = {
            reason: "Duplicate Module!",
            status: ''
          };
          this.errorDialogService.openDialog(errordata);
            //this.modalRef = this.modalService.show(this.errtemplate, { class: 'modal-dialog-centered' });
          }else{
            this.categoryDetails.name ='';
            this.categoryDetails.code ='';
            this.categoryForm.reset();
            this.snackbarService.openSuccessBar("Module added successfully", "Module");
            this.showCategory = false
            this.subSubCategories = []
            this.selectedCategories = []
            this.getSubSubCategories(this.recordPerPage,this.currentPage)
          }
         
        }
      },
        error => {
          //error message
        });
  }

  //following function used to get sub sub categories
  getSubSubCategories(recordPerPage,currentPage) {    
    this.url = '/subsubcategories' + '/' + 'list' + '/' + this.subSubCatId + '/' + currentPage + '/' + recordPerPage;
    var params = new HttpParams();		
    if(this.filter.moduleName){
			params = params.append('moduleName', this.filter.moduleName);
		}
    if(this.filter.moduleCode){
			params = params.append('moduleCode', this.filter.moduleCode);
		}
    if(this.filter.search){
			params = params.append('search', this.filter.search);
		}
    this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response) => {
				if(response.success == true) {
					this.subSubCategoryList = response.data.sub_sub_categories;
          this.totalCount = response.data.total_count;
          this.dataSource.data = this.subSubCategoryList
					
        }
      }));
  }

    //following function used to delete sub sub categories
  deleteSubSubCategories(){
    this.urls = '/transactiontype/changeModuleStatus/selectedModuleId/' + this.idToBeDeleted;
    var paramss = new HttpParams();
    this.subscriptions.push(this.apiService.get(this.urls, paramss)
    .subscribe((response: any) => {
        if(response.data.transType.length > 0){
          var errordata = {
            reason: "Module linked to the Transcation Type so cannot delete!",
            status: ''
          };
          this.errorDialogService.openDialog(errordata);
          return true;
        }else{
          this.subscriptions.push(this.categoryService.deleteSuSubCategories(this.idToBeDeleted)
          .subscribe((response: any) => {
            if (response.success == true) {
              this.snackbarService.openSuccessBar("Module deleted successfully", "Module");
              if(this.curPage && this.recPerPage){
                this.getSubSubCategories(this.recPerPage, this.curPage);
              }else{
                this.getSubSubCategories(this.recordPerPage,this.currentPage);
              }
            }
          },
            error => {
              //error message
            }));
        }
      }));
  }

  //pagination change function
  onChangedPage(pageData: PageEvent) {
    if(this.fcurPage && this.frecPerPage){
        this.fcurPage = pageData.pageIndex + 1
        this.frecPerPage = pageData.pageSize;
        this.getSubSubCategories(this.frecPerPage, this.fcurPage);
		}else{
      this.currentPage = pageData.pageIndex + 1;
      this.recordPerPage = pageData.pageSize;
      this.getSubSubCategories(this.recordPerPage, this.currentPage)
    }
  }

   //search category function
   selectmoduleName(event){
    this.filter.moduleName = event
    this.getSubSubCategories(this.recordPerPage, this.currentPage)
  }
  selectmoduleCode(event){
    this.filter.moduleCode = event
    this.getSubSubCategories(this.recordPerPage, this.currentPage)
  }
  clearFilter(){
		this.filter.moduleName = '';
    this.filter.moduleCode = '';
		this.getSubSubCategories(this.recordPerPage, this.currentPage)	
	 }
   onSearch(event){
		this.filter.search = event
		this.getSubSubCategories(this.recordPerPage, this.currentPage);	
	}

  filterByColumn() {		
		this.departmentIdFilter.valueChanges.subscribe((departmentIdFilterValue) => {
			this.filteredValues['name'] = departmentIdFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});
    this.moduleIdFilter.valueChanges.subscribe((moduleIdFilterFilterValue) => {
			this.filteredValues['code'] = moduleIdFilterFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});
		this.dataSource.filterPredicate = this.customFilterPredicate();
	}

	customFilterPredicate() {
		const myFilterPredicate = function (data: module, filter: string): boolean {
			let searchString = JSON.parse(filter);
			return (data.name.toString().trim().indexOf(trim(searchString.name)) !== -1 || data.name.toString().trim().toLowerCase().indexOf(trim(searchString.name)) !== -1 || data.name.toString().trim().indexOf(trim(searchString.name)) !== -1)
	      && (data.code.toString().trim().toUpperCase().indexOf(trim(searchString.code)) !== -1 || data.code.toString().trim().toLowerCase().indexOf(trim(searchString.code)) !== -1 || data.code.toString().trim().indexOf(trim(searchString.code)) !== -1)
      }
		return myFilterPredicate;
	};
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  };
}