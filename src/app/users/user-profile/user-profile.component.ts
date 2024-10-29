import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { faHandPointLeft } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ErrorDialogComponent } from 'src/app/dialogs/error-dialog/error-dialog.component';
import { Constants } from 'src/app/helper/constants';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UploadService } from 'src/app/services/upload.service';
import { environment } from 'src/environments/environment';
import { DataService } from '../../services/data.service';
import { UserDataService } from '../user-data.service';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
  faHandPointLeft = faHandPointLeft;
  url;
  userData;
  isActive;
  loginUser;
  editField: string;
  fileData: File = null;
  filename: any;
  transTypeForm: FormGroup;
  imgUrl: any;
  role;
  entity;
  imagePreview ;
  result = {
	transType : {
		profileImg: ''
	}
}
timeZoneList = []
timeZone = ''
DateTime=''
  constructor(public dialogRef: MatDialogRef<UserProfileComponent>,public dialog: MatDialog,private authService: AuthService,
		private location: Location,
		private apiService: ApiService,
		public snackbarService: SnackbarService,
		private route: ActivatedRoute,
		private router: Router,
		private formBuilder: FormBuilder,
		public dataService: DataService,
		private userDataService: UserDataService,
		private uploadService: UploadService) {
	}

	ngOnInit() {
		this.timeZoneList = Constants.timeZoneList
		this.userData = JSON.parse(sessionStorage.getItem('user'));
		if(typeof this.userData.timeZone === 'undefined' ||  this.userData.timeZone == null ||  this.userData.timeZone == ''){
			this.userData.timeZone = 'Asia/Kolkata'
			sessionStorage.setItem('user', JSON.stringify(this.userData));
			this.userData = JSON.parse(sessionStorage.getItem('user'));
		}
		this.DateTime = new Date(this.userData.createdAt).toLocaleString("en-US", {timeZone: this.userData.timeZone});
		for(let i = 0;i<this.timeZoneList.length;i++){
			if(this.timeZoneList[i].value == this.userData.timeZone){
				this.timeZone = this.timeZoneList[i].name
				break;
			}
		}
	
		if(!(typeof this.userData.reference.roleName === 'undefined')){
			this.role = this.userData.reference.roleName
		}else{
		this.role = this.userData.reference.role;
		}
		this.entity = this.userData.reference.entity;
		this.transTypeForm = this.formBuilder.group({
			profileImg : [''],
		});

		this.roleName(this.userData.reference.role,this.userData.reference.roleName);
		this.getProfileImage(this.userData._id);
	}

	roleName(role,name) {
		if(role == 'Corporate Admin') {
				this.role = "Partner"  + " " + 'Admin';
		}	
	}
	updateList(property: string, event: any) {
		const editField = event.target.textContent;
		this.userData[property] = editField;
	}

	changeValue( property: string, event) {
		this.editField = event.target.textContent;
	}

	editUser(property: string, event) {
		this.url = "/user/chageContactNum";
		const editField = event.target.textContent;
		this.userData[property] = editField;
		var phoneNumber = this.userData.phoneNumber;
		this.apiService.put(this.url, this.userData)
			.subscribe((response) => {
				if (response.success == true) {
					this.snackbarService.openSuccessBar("User PhoneNumber updated successfully", "PhoneNumber")
					this.router.navigate(['/users/myProfile']);
				} else {
					alert("Update phone number is failed!!!");
				}
			});
	}

	ChooseFile(files) {
		const form = new FormData();
		form.append('file', files[0], files[0].name);
		this.fileData = files[0];
	   this.filename = files[0].name;
	   var FileSize = 1024 * 1024 * 1 ;
	   var FileType = files[0].name.split(".").pop();
	   if (files[0].size > FileSize) {
		var data = {
				reason: "Profile Image Should be less than 1MB !",
				status: ''
		};
		const dialogRef = this.dialog.open(ErrorDialogComponent, {
			width: '335px',
			data: data,
		});
		form.append('file', files[0], '');
		this.filename = '';	
	}else if (FileType != 'png' && FileType != 'jpeg'  && FileType !=  'jpg') {
		var datas = {
				reason: "Invalid Profile Image Type!",
				status: ''
			};
		const dialogRef = this.dialog.open(ErrorDialogComponent, {
			width: '335px',
			data: datas,
		});
		form.append('file', files[0], '');
		this.filename = '';

	}else{
		this.url = "/user/upload"
		this.subscriptions.push(this.apiService.upload(this.url,form)
		.subscribe((response: any) => {
				if(response.success == true) {
				this.snackbarService.openSuccessBar("Profile Image uploaded successfully", "Profile Image");
					this.imagePreview = window.URL.createObjectURL(this.fileData);
					}
				}))
			}
		};

	updateProfileImage(form: NgForm) {
		this.url = "/user/"+this.userData._id;
		this.userData = form.value;
		this.userData.profileImg = this.filename;
		this.apiService.put(this.url,this.userData)
			.subscribe((response) => {
				if(response.success == true) {
					this.snackbarService.openSuccessBar('Profile Image Updated successfully. Please Logout and Login.', "Profile Image");
					this.imagePreview = window.URL.createObjectURL(this.fileData);
					this.router.navigate(['/users/myProfile']);
				}
			});
	}
	
	async getProfileImage(UserId) {
	
		this.subscriptions.push(this.userDataService.getUserById(UserId)
			.subscribe(async(response: any) => {
			if(response.success == true){
			
				if(response.data.profileImg == undefined || response.data.profileImg == null || response.data.profileImg == "") {
					this.imgUrl = environment.awsImgPath + "/Profile_Images/avatar.png";
				}else{
					const bucketName= environment.Bucket;
					const fileName= "Profile_Images/"+response.data.profileImg;
					const returnRes= await this.uploadService.fileExist(bucketName,fileName)
					if(returnRes==true){
						this.imgUrl = environment.awsImgPath +"/Profile_Images/"+response.data.profileImg;
					 }else{
						this.imgUrl = environment.awsImgPath+"/Profile_Images/avatar.png";
					 }
				}
			}
		}))
	}

	editUsers() {		
		this.router.navigate(['/users/myProfile/userDetail/'+ this.userData._id]);
		
	};

	goBack() {
		this.location.back();
	}

	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};	
}