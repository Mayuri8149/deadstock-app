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
  selector: 'app-sub-category-add',
  templateUrl: './sub-category-add.component.html',
  styleUrls: ['./sub-category-add.component.css']
})
export class SubCategoryAddComponent implements OnInit, OnDestroy {
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
  categoryTitle: any;
  invalidCategoriesArr = []
  numberofSubCategories;
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
  errThrow = false  
  ngOnInit() {
          this.categoryForm = this._formBuilder.group({
                name: ['', [Validators.required]], 
                category: ['', [Validators.required]],     
          });
    this.subCatId = this.route.snapshot.params['id'];
    this.categoryTitle = this.route.snapshot.params['name'];
    this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.recPerPage = this.route.snapshot.queryParams['recordPerPage'];
    this.fcurPage = this.route.snapshot.queryParams['fcurrentPage'];
		this.frecPerPage = this.route.snapshot.queryParams['frecordPerPage'];
    if(this.fcurPage && this.frecPerPage){
			this.pageIndex = this.fcurPage - 1
			this.recordPerPage = this.frecPerPage
			this.getSubCategories(this.frecPerPage, this.fcurPage);
		}else{
      this.getSubCategories(this.recordPerPage,this.currentPage);
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
    this.subCatId = element._id;
    if(this.curPage && this.recPerPage){
			this.router.navigate(['/categorylayout/categoryAdd/subCategoryAdd/'+"/"+ element.category+ "/" + this.categoryTitle+'/subSubCategoryAdd/'+ element.category+"/"+ element._id + "/" + this.categoryTitle+"/"+ element.name],{ queryParams: { currentPage: this.curPage, recordPerPage: this.recPerPage,fcurrentPage: this.currentPage, frecordPerPage: this.recordPerPage }} );
		}else{
      this.router.navigate(['/categorylayout/categoryAdd/subCategoryAdd/'+"/"+ element.category+ "/" + this.categoryTitle+'/subSubCategoryAdd/'+ element.category+"/"+ element._id + "/" + this.categoryTitle+"/"+ element.name],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.recordPerPage }});
    }
  }

  goBack() {
    if(this.curPage && this.recPerPage){
			this.router.navigate(['/categorylayout/categoryAdd'],{ queryParams: { currentPage: this.curPage, recordPerPage: this.recPerPage }} );
    }else 
    if(this.fcurPage && this.frecPerPage){
        this.router.navigate(['/categorylayout/categoryAdd'],{ queryParams: { fcurrentPage: this.fcurPage, frecordPerPage: this.frecPerPage }} );    
    }else{
      this.router.navigate(['/categorylayout/categoryAdd'],{ queryParams: { currentPage: this.currentPage, recordPerPage: this.recordPerPage }});
    }
  }

  addMoreCategory() {
      if(this.categoryDetails.name ===undefined || this.categoryDetails.name === null || this.categoryDetails.name ==''){
        this.flagDisabledAddCat= true;
        var errordata = {
          reason: "Please add Category name!",
          status: ''
        };
        this.errorDialogService.openDialog(errordata);
        return true;
      }else{  
        let name = this.categoryDetails.name.trim()
        let index = this.subCategories.findIndex(x=>x == name)
        if (index == -1) {
          this.subCategories.push(name)
        } else {
          this.categoryDetails.name = ''
          var errordata = {
            reason: "Duplicate Category!",
            status: ''
          };
          this.errorDialogService.openDialog(errordata);
        }      
        this.selectedCategories = this.subCategories
        this.flagDisabledAddCat= false;        
      }
      this.categoryDetails.name = ''
  }
  selectedCat(template: TemplateRef<any>, row){
    this.modalRef = this.modalService.show(template, { class: 'modal-md measurable-modal-popup' });
    this.idToBeDeleted = row._id;
    this.numberofSubCategories = row.numberofCat
  }
	onKeyPress(event: any) {
		this.trackflag = true;
	};
  decline(): void {
    this.modalRef.hide();
  }

   //following function used to delete category 
  confirm(): void {
    this.modalRef.hide();
    this.deleteSubCategories()    
  }

  removeSelectedCategory(index) {
    this.selectedCategories.splice(index, 1)
  }

  //following function used to add sub category
  addSubCategory() {
    if(this.categoryDetails.name === undefined ){
      var errordata = {
        reason: "Please add Category name!",
        status: ''
      };
      this.errorDialogService.openDialog(errordata);
      return true;    
    }
    
    if(this.categoryDetails.name !==''){
      let name = this.categoryDetails.name.trim()
      let index = this.subCategories.findIndex(x=>x == name)
      if (index == -1) {
        this.subCategories.push(name)
      } else {
        this.errThrow = true
        this.categoryDetails.name = ''
        var errordata = {
          reason: "Duplicate Category!",
          status: ''
        };
        this.errorDialogService.openDialog(errordata);
      }
    }else{
      var errordata = {
        reason: "Please add Category name!",
        status: ''
      };
      this.errorDialogService.openDialog(errordata);
      return true;
    }

    let arrsubCategories = this.subCategories.filter(item => item);
    if(this.errThrow == false){
    this.url = '/subcategories/add_sub_categories';
    let reqObj = {
      "category": this.subCatId,
      "sub_categories": arrsubCategories
    }
    this.subscriptions.push(this.categoryService.addSubCategories(this.url, reqObj)
      .subscribe((response: any) => {
        if (response.success == true) {
          if(typeof response.data.invalidCategoriesArr === 'undefined'){
            response.data.invalidCategoriesArr = []
          }
          if(response.data.invalidCategoriesArr.length>0){
            for(var i=0;i<response.data.invalidCategoriesArr.length;i++){
              this.invalidCategoriesArr = response.data.invalidCategoriesArr[i].name
              this.categoryDetails.name ='';
              this.subCategories = []
              this.selectedCategories[i] = this.invalidCategoriesArr
            }
             var errordata = {
              reason: "Duplicate Category!",
              status: ''
            };
            this.errorDialogService.openDialog(errordata);
            //this.modalRef = this.modalService.show(this.errtemplate, { class: 'modal-md measurable-modal-popup' });
          }else{
          this.categoryDetails.name ='';
          this.categoryForm.reset();
          this.snackbarService.openSuccessBar("Category added successfully", "Category");
          this.showCategory = false
          this.subCategories = []
          this.selectedCategories = []
          this.getSubCategories(this.recordPerPage, this.currentPage)          }
        }
      },
        error => {
          //error message
        }));
      }
  }

  //following function used to get sub categories
  getSubCategories(recordPerPage, currentPage) {
    this.subscriptions.push(this.categoryService.getSubCategories(this.subCatId,recordPerPage, currentPage,this.filter.searchString)
      .subscribe((response) => {
        if (response.success == true) {
          if (response.data) {
             // Loop for array1
            for(let i = 0; i < response.data[0].sub_categories.length; i++) {          
              // Loop for array2
              for(let j = 0; j < response.data[1].length; j++) {  
                if(response.data[0].sub_categories[i]._id === response.data[1][j]._id.sub_category) {                  
                  response.data[0].sub_categories[i].numberofCat =  response.data[1][j].numberofCat;           
                }
              }
            }  
            this.subCategoryList = response.data[0].sub_categories;
            this.totalCount = response.data[0].total_count;            
            this.dataSource = this.subCategoryList
          }
        }
      }, error => {
        //error message
      }));
  };

  //following function used to delete sub categories
  deleteSubCategories() {
    if(this.numberofSubCategories > 0){
      var errordata = {
        reason: "Category linked to the Modules so cannot delete!",
        status: ''
      };
      this.errorDialogService.openDialog(errordata);
      return true;
    }else{
    this.subscriptions.push(this.categoryService.deleteSubCategories(this.idToBeDeleted)
      .subscribe((response: any) => {
        if (response.success == true) {
          this.snackbarService.openSuccessBar("category deleted successfully", "Category");
          if(this.fcurPage && this.frecPerPage){
            this.getSubCategories(this.fcurPage, this.frecPerPage)
          }else{
            this.getSubCategories(this.recordPerPage, this.currentPage)
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
    if(this.fcurPage && this.frecPerPage){
        this.fcurPage = pageData.pageIndex + 1
        this.frecPerPage = pageData.pageSize;
        this.getSubCategories(this.frecPerPage, this.fcurPage);
		}else{
      this.currentPage = pageData.pageIndex + 1;
      this.recordPerPage = pageData.pageSize;
      this.getSubCategories(this.recordPerPage, this.currentPage)
    }    
  }

   //search category function
  onSearch(event){
    this.filter.searchString = event
    this.getSubCategories(this.recordPerPage, this.currentPage)
    
  }
  clearFilter(){
		this.filter.searchString = '';
		this.getSubCategories(this.recordPerPage, this.currentPage)
	 }
  ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}