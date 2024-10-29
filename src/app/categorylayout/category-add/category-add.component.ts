//Start Mahalaxmi(SCI-I830) 06/05/2021
import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { faHandPointLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { ErrorDialogService } from 'src/app/services/error-dialog.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

interface PeriodicElement {
  name: string;
  link: string;
}

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css']
})
export class CategoryAddComponent implements OnInit, OnDestroy {
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
  subCategories = []
  subCategoryList = []
  subSubCategories = []
  subSubCategoryList = []
  recordPerPage = 5;
  pageSizeOptions = [5,10, 20, 50, 100];
  currentPage = 1;
  subCatId = null
  subSubCatId = null
  selectedCategories = []
  placeHolder = 'Industry'
  filter = {searchString:''}
  totalCount = 0
  idToBeDeleted=null
  modalRef: BsModalRef;
  message: string;
  selectedsubCategories;
  selectedsubsubCategories;
  categoryForm: FormGroup;
  trackflag: Boolean = false;
  flagDisabledAddCat: boolean =true;
  categoryList1: any;
  categoryList: any;
  errThrow = false
  showNew = true
  numberofCategories;
  invalidCategoriesArr = []
  curPage= 1;
	recPerPage=5;
	pageIndex=0;
	pageSize=5
  constructor(
    private _formBuilder: FormBuilder, 
    private snackbarService: SnackbarService,
    public errorDialogService: ErrorDialogService,
    public router: Router,
    public route: ActivatedRoute,
    private location: Location,
    private categoryService: CategoryService,private modalService: BsModalService) { }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('errtemplate', { static: false }) private errtemplate;
  displayedColumn: string[] =  [
    'actions',
    'name',
    'link'
  ];
  dataSource = [];
  selection = new SelectionModel<any>(true, []);
  organizationIdFilter = new FormControl();
	departmentIdFilter = new FormControl();
  
  ngOnInit() {
    this.categoryForm = this._formBuilder.group({
          name: ['', [Validators.required]], 
          category: ['', [Validators.required]],     
    });
    this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.recPerPage = this.route.snapshot.queryParams['recordPerPage'];
		if(this.curPage && this.recPerPage){
			this.pageIndex = this.curPage - 1
			this.recordPerPage = this.recPerPage
			this.getCategories(this.recPerPage, this.curPage);
		}else{
			this.getCategories(this.recordPerPage,this.currentPage);
		}
  }

  isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.length;
		return numSelected === numRows;
	}

	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() : this.dataSource.forEach(row => this.selection.select(row));
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
  addNewCategory(element) {
    if(this.curPage && this.recPerPage){
			this.router.navigate(['/categorylayout/categoryAdd/subCategoryAdd/'+ element._id + '/' + element.name],{ queryParams: { currentPage: this.curPage, recordPerPage: this.recPerPage }} );
		}else{
      this.router.navigate(['/categorylayout/categoryAdd/subCategoryAdd/'+ element._id + '/' + element.name],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.recordPerPage }});
    }
  }

  addMoreCategory() {
      if(this.categoryDetails.name===undefined || this.categoryDetails.name =='' || this.categoryDetails.name ==null){
        this.flagDisabledAddCat= true;
        var errordata = {
          reason: "Please add Industry name!",
          status: ''
        };
        this.errorDialogService.openDialog(errordata);
        return true;
      }else{
        let name = this.categoryDetails.name.trim()
        let index = this.categories.findIndex(x=>x == name)
        if(index == -1){
          this.categories.push(name)
          }else{
            this.categoryDetails.name =''
            var errordata = {
              reason: "Duplicate Category!",
              status: ''
            };
            this.errorDialogService.openDialog(errordata);
          }   
        this.selectedCategories = this.categories
        this.flagDisabledAddCat= false;
      }      
    this.categoryDetails.name = ''
  }
  selectedCat(template: TemplateRef<any>, row){
    this.modalRef = this.modalService.show(template, { class: 'modal-md measurable-modal-popup' });
    this.numberofCategories = row.numberofCat
    this.idToBeDeleted = row._id;
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
     this.deleteCategories()
  }
  removeSelectedCategory(index) {
    this.selectedCategories.splice(index, 1)
  }

  //following function used to add category
  addCategory() {
    if(this.categoryDetails.name === undefined){
      var errordata = {
        reason: "Please add Industry name!",
        status: ''
      };
      this.errorDialogService.openDialog(errordata);
      return true;      
    }

    if(this.categoryDetails.name !==''){
      let name = this.categoryDetails.name.trim()
      let index = this.categories.findIndex(x=>x == name)
      if (index == -1) {
        this.categories.push(name)
      } else {
        this.errThrow = true
        this.categoryDetails.name =''
        var errordata = {
          reason: "Duplicate Industry!",
          status: ''
        };
        this.errorDialogService.openDialog(errordata);
      } 
    }else{
      var errordata = {
        reason: "Please add Industry name!",
        status: ''
      };
      this.errorDialogService.openDialog(errordata);
      return true;
    }
    let arr = this.categories.filter(item => item);

   if(this.errThrow == false){
    this.url = '/categories/add_categories';
    this.subscriptions.push(this.categoryService.addCategories(this.url, arr)
      .subscribe((response: any) => {
        if (response.success == true) {
          if(typeof response.data.invalidCategoriesArr === 'undefined'){
            response.data.invalidCategoriesArr = []
          }
          if(response.data.invalidCategoriesArr.length>0){

            for(var i=0;i<response.data.invalidCategoriesArr.length;i++){
              this.invalidCategoriesArr = response.data.invalidCategoriesArr[i].name
              this.categoryDetails.name ='';
              this.categories = []
              this.selectedCategories[i] = this.invalidCategoriesArr
            }
             var errordata = {
              reason: "Duplicate Industry!",
              status: ''
            };
            this.errorDialogService.openDialog(errordata);
            //this.modalRef = this.modalService.show(this.errtemplate, { class: 'modal-md measurable-modal-popup' });
          }else{
            this.categoryDetails.name =''
            this.categoryForm.reset();
            this.snackbarService.openSuccessBar("Industry added successfully", "Industry");
            this.showCategory = false
            this.categories = []
            this.selectedCategories = []
            this.getCategories(this.recordPerPage, this.currentPage)
          }
         
        }
      },
        error => {
          //error message
        }));
      }
  }

  //following function used to get categories
  getCategories(recordPerPage, currentPage) { 
     if(this.curPage && this.recPerPage){
      recordPerPage = this.recPerPage
      currentPage = this.curPage
    }else{
      recordPerPage = this.recordPerPage
      currentPage = this.currentPage
    }   
    this.subscriptions.push(this.categoryService.getCategories(recordPerPage, currentPage,this.filter.searchString)
      .subscribe((response) => {
        if (response.success == true) {
          if (response.data) {
            // Loop for array1
            for(let i = 0; i < response.data[0].categories.length; i++) {   
              for(let j = 0; j < response.data[1].length; j++) { 
                if(response.data[0].categories[i]._id === response.data[1][j]._id.category) {
                  response.data[0].categories[i].numberofCat =  response.data[1][j].numberofCat;           
                }
              }
            }  
            this.categoryList = response.data[0].categories;
            this.totalCount = response.data[0].total_count;
            this.dataSource = this.categoryList
          }
        }
      }, error => {
        //error message
      }));
  };
//following function used to delete categories
  deleteCategories() {
    if(this.numberofCategories > 0){
      var errordata = {
        reason: "Industry linked to the categories so cannot delete!",
        status: ''
      };
      this.errorDialogService.openDialog(errordata);
      return true;
    }else{
    this.subscriptions.push(this.categoryService.deleteCategories(this.idToBeDeleted)
      .subscribe((response: any) => {
        if (response.success == true) {
          this.snackbarService.openSuccessBar("Industry deleted successfully", "Industry");
          if(this.curPage && this.recPerPage){
            this.getCategories(this.curPage, this.recPerPage)
          }else{
            this.getCategories(this.recordPerPage, this.currentPage)
          }
        }
      },
        error => {
          //error message
        }));
  }
  }
  
  //pagination change function
  onChangedPage(pageData: PageEvent) {
    if(this.curPage && this.recPerPage){
			this.curPage = pageData.pageIndex + 1
			this.recPerPage = pageData.pageSize;
			this.getCategories(this.recPerPage, this.curPage);
		}else{
      this.currentPage = pageData.pageIndex + 1;
      this.recordPerPage = pageData.pageSize;
      this.getCategories(this.recordPerPage, this.currentPage)   
    } 
  }

   //search category function
  onSearch(event){
    this.filter.searchString = event
    this.getCategories(this.recordPerPage, this.currentPage)    
  }
  clearFilter(){
		this.filter.searchString = '';
		this.getCategories(this.recordPerPage, this.currentPage)	
	 }
  ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}