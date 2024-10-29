import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ErrorDialogComponent } from 'src/app/dialogs/error-dialog/error-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { Constants } from 'src/app/helper/constants';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { UploadService } from 'src/app/services/upload.service';
import * as _ from 'lodash';
import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-users-detail',
  templateUrl: './users-detail.component.html',
  styleUrls: ['./users-detail.component.css']
})
export class UsersDetailComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	faEye=faEye;
	url;
	id;
	inst_id;
	affInst_Id
	loginUser;
	user;
	users;
	role;
	fileData: File = null;
  	filename: any;
	departments:[]=[];
	UserData = {
		id:'',
		role: '',
	department_ID:'',
	firstName: '',
	email: '',
	phoneNumber: '',
	newEmail: '',
	profileImg:'',
	timeZone:'',
	updatedBy:{}
	};
	editUserForm: FormGroup;
	entity: any; 
	timeZoneList = [] 
	selectedstaticFiles: any;
    showImgStatic: boolean;
    imageErrorStatic: string;
    fileUploadedStatic: any;
    resultSrcStatic: any;
	imagePreview: string;
    fileStaticName: any;
    fileValueStatic: any;
	@ViewChild('myModel',{static: false}) myModel: ModalDirective;
	isImageStatic: boolean;
    isPdfStatic: boolean;
    urlSrcStatic: any;
	constructor(private formBuilder: FormBuilder,
				private apiService: ApiService,
				private route: ActivatedRoute,
				public router: Router,
				private location: Location,
				public dialog: MatDialog,
				public snackbarService: SnackbarService,
				private dataSharingService: DataSharingService,
				private uploadService: UploadService
				) { 
				}

	ngOnInit() {
		this.timeZoneList = Constants.timeZoneList
		this.id = this.route.snapshot.params['userId'];
		this.loginUser = JSON.parse(sessionStorage.getItem('user'));
		this.role = this.loginUser.reference.role;
		this.entity = this.loginUser.reference.entity;
		this.inst_id = this.loginUser.organizationID;
	
		this.editUserForm = this.formBuilder.group({
			role: [{value: '', disabled: true}, Validators.required],
			department_ID: [{value: '', disabled: true},],
			firstName: [{value: '', disabled: true}, Validators.required],
			email: [{value: '', disabled: true}, Validators.required],
      profileImg : [''],
	  newEmail: [''],
	  timeZone: [''],
	 		phoneNumber: [undefined, [Validators.required]],
		});
		this.getUser(this.id);
	}

	getUser(id) {
		this.url = "/user/"+ id;
		var params = new HttpParams();
		params = params.append('organizationId', this.loginUser.reference.organizationId);
		params = params.append('departmentId', this.loginUser.reference.departmentId);
		params = params.append('affiliateId', this.loginUser.reference.affiliateId);
	
		this.subscriptions.push(this.apiService.get(this.url, params)
			.subscribe((response) => {
				if(response.success == true ) {
						this.users = response.data;
						for(var i=0;i<this.users.length;i++) {
							if(typeof this.users[i].timeZone === 'undefined' ||  this.users[i].timeZone == null ||  this.users[i].timeZone == ''){
								this.users[i].timeZone = 'Asia/Kolkata'
							}
							if(this.users[i].isActive == true) {
								this.users[i].status = "Active";
							} else {
								this.users[i].status = "Inactive";
							}
						}
						this.editUserForm.patchValue(this.users);
				} 
			}));
	};

	editUser(data) {
    if(this.fileStaticName){
			data.value.profileImg = this.fileStaticName;
		}
		if(data.invalid) {
			return ;
		}
		this.url = "/user/" + this.id;
		this.UserData.id = this.id;
		this.UserData.role = data.value.role;
		this.UserData.firstName = data.value.firstName;
		this.UserData.email = data.value.email;
		this.UserData.timeZone = data.value.timeZone;
		if(data.value.phoneNumber){
		this.UserData.phoneNumber = data.value.phoneNumber;
		}else{
		this.UserData.phoneNumber = '+91'
		}
		this.UserData.newEmail = data.value.newEmail;
		this.UserData.profileImg = data.value.profileImg;
		this.UserData.updatedBy = {
			firstName:this.loginUser.firstName,
			lastName:this.loginUser.lastName,
			email:this.loginUser.email
		};		
		this.apiService.put(this.url, this.UserData)
			.subscribe((response) => {
				if (response.success == true) {
					this.loginUser.timeZone = this.UserData.timeZone
					sessionStorage.setItem('user', JSON. stringify(this.loginUser)); 
					this.snackbarService.openSuccessBar("User updated successfully", "User");
					
					if(this.fileStaticName!=undefined){
						const fileN= "Profile_Images/" +this.fileStaticName;
						this.uploadService.uploadFile(this.fileValueStatic,fileN);
						if(this.imagePreview)
							this.dataSharingService.setImagePreviewData(this.imagePreview);
					}

					this.router.navigate(['/users/myProfile']);
				} else {
					alert("Update phone number is failed!!!");
				}
			});
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
	 
		 if (!_.includes(allowed_types, this.selectedstaticFiles[0].type)) {
			 this.showImgStatic =false;
			 this.imageErrorStatic = 'Only Files are allowed ( JPG | PNG | JPEG)';
			 return false;
		 }
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
      
	hide(){
		this.myModel.hide();
		}

	goBack() {
		this.location.back();
	}
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}