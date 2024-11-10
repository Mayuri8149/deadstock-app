import { Location } from '@angular/common';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators,FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UploadService } from 'src/app/services/upload.service';
import { CompressImageService } from 'src/app/trans-type-list/dynamic-add-trans-integrated/compress-image.service';

@Component({
	selector: 'app-user-add',
	templateUrl: './user-add.component.html',
	styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	url: String;
	user: any = {
		name: '',
		file:'',
    	submenu:''
	};
	loggedInUser;
	role;
	entity;
	admin: boolean = false;
	organization: boolean = false;
	superManager: boolean = false;
	affiliateManager: boolean = false;
	departmentError: boolean = true;
	subadmin: boolean = false;
	sysadmin: boolean = false;
	required: boolean = true;
	inst_id;
	departments=[];
	affiliates=[];
	selectedCertFiles: FileList;
	imageError = [];
	authUserForm: FormGroup;
  noWhitespaceValidator: any;
  
  fileCertName: string;
  fileValueCert: any;
  fileUploadedCert: any;
  resultSrcCert: any;
  fileStaticName: string;
	uploadImage: any;
	selectedFile: any;
	imgNme: any;
	selectedstaticFiles: any;
	showImgStatic: boolean;
	imageErrorStatic: string;
	fileUploadedStatic: any;
	resultSrcStatic: any;
	imagePreview: string;
	fileValueStatic: any;
	myModel: any;
	isImageStatic: boolean;
	isPdfStatic: boolean;
	urlSrcStatic: any;

	constructor(private _formBuilder: FormBuilder,
				private apiService: ApiService,
				public router: Router,
				private location: Location,
				public snackbarService: SnackbarService,
				private uploadService: UploadService,
    private compressImage: CompressImageService) { }

	ngOnInit() {
		this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
		this.role = this.loggedInUser.reference.role;
		this.entity = this.loggedInUser.reference.entity;
		if(this.role == 'manager' && this.entity == 'organization') {
			this.superManager = true;
		}
		if(this.role == 'manager' && this.entity == 'affiliate') {
			this.affiliateManager = true;
		}
		if ((this.role == 'sysadmin' && this.entity == 'system') || (this.role == 'subadmin' && this.entity == 'system')) {
			this.subadmin = true;
		}
		this.inst_id = this.loggedInUser.reference.organizationId;
		this.authUserForm = this._formBuilder.group({
			name: [''],
			file:[''],
			submenus: this._formBuilder.array([])
			});
	}

	get submenus(): FormArray {
		return this.authUserForm.get('submenus') as FormArray;
	  }
	
	  addSubmenu() {
		this.submenus.push(this.createSubmenu());
	  }
	
	  removeSubmenu(index: number) {
		this.submenus.removeAt(index);
	  }
	
	  createSubmenu(): FormGroup {
		return this._formBuilder.group({
		  name: ['', Validators.required],
		  url: ['', Validators.required] 
		});
	  }

	  
	  hasError(controlName: string, errorName: string) {
		return this.authUserForm.get(controlName)?.hasError(errorName);
	  }
	

	  goBack() {
		this.location.back();
	}
		addUser() {

			if (this.authUserForm.invalid) {
			  return false;
			}
			this.url = '/menu/create';
			const formData = new FormData();
			formData['name'] = this.authUserForm.value.name;

			const submenuArray = this.authUserForm.value.submenus.filter((submenu) => submenu.name || submenu.url);

			submenuArray.forEach((submenu, index) => {
				formData.append(`submenus[${index}][name]`, submenu.name);
				formData.append(`submenus[${index}][url]`, submenu.url);
			});
		
			const headers = new HttpHeaders();
			headers.append('Content-Type', 'multipart/form-data'); // Ensure the boundary is correctly set automatically

			this.url = '/menu/create';
			this.user.name = this.authUserForm.value.name;
      		this.user.submenu = submenuArray;
			this.user.file = this.uploadImage;

			this.subscriptions.push(this.apiService.post(this.url, this.user)
				.subscribe((response: any) => {
					if(response.success == true) {
						this.snackbarService.openSuccessBar("User added successfully", "User");
						this.router.navigate(['/users/userList']);
					}
			}));

		  }
		
		  chooseStaticUploadFile(event) {
			const image: File = event.target.files[0];
			this.uploadImage = image;
			this.imgNme = image.name;
		  }

		  ChooseFile(event) {

			this.selectedstaticFiles = event.target.files;
			 const max_size =  2097152 //20971520;    
			 const allowed_types = ['image/png', 'image/jpeg','image/jpg'];
			 if (this.selectedstaticFiles[0].size > max_size) {
				 this.showImgStatic =false;
				 this.imageErrorStatic ='Maximum size allowed is 2MB';
				 return false;
			 }
		 
			//  if (!_.includes(allowed_types, this.selectedstaticFiles[0].type)) {
			// 	 this.showImgStatic =false;
			// 	 this.imageErrorStatic = 'Only Files are allowed ( JPG | PNG | JPEG)';
			// 	 return false;
			//  }
			 this.showImgStatic =true;
			 this.fileUploadedStatic=event.target.files;
			 var reader = new FileReader();
			 reader.readAsDataURL(event.target.files[0]);
			 reader.onload = (event: any) => {
			   this.resultSrcStatic = event.target.result;
			 }
			 this.imagePreview = window.URL.createObjectURL(event.target.files[0]);
			 this.fileStaticName =this.uploadService.findFileName(this.selectedstaticFiles[0].name);
			 this.fileValueStatic =this.selectedstaticFiles.item(0); 
		 };

		 previewFileStatic(files){
			this.myModel.show();
			  if (files && files[0]) {
				if(files[0].type == "application/pdf") {
					this.isImageStatic = false;
					this.isPdfStatic = true;      // required, going forward
				}else {
					this.isPdfStatic = false;
					this.isImageStatic = true;    // required, going forward
				}
				this.urlSrcStatic =this.resultSrcStatic;
			  }
		  }	
		 	  
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}