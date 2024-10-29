import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-add-comment',
	templateUrl: './add-comment.component.html',
	styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent implements OnInit {
	private subscriptions: Subscription[] = [];
	addComment: FormGroup;
	comment: "";
	url;
	constructor(private formBuilder: FormBuilder,
		public dialogRef: MatDialogRef<AddCommentComponent>,
		public apiService: ApiService,
		) { }

	ngOnInit() {
		this.addComment = this.formBuilder.group({
			comment: (['', Validators.required])
		});
	}

	public hasError = (controlName: string, errorName: string) =>{		
		return  this.addComment.controls[controlName].hasError(errorName);		
	}

	add1() {
		var dialogData = this.dialogRef._containerInstance._config.data;
		var partnerId = dialogData.url.split('/')[2];
		this.url = "/partner/"+ partnerId + "/comment"; 
		var obj = {
			status: dialogData.status
		};
		var comment = {
			text: this.comment
		};
		this.subscriptions.push(this.apiService.post(this.url, comment)
		.subscribe((response: any) => {
			if(response.success == true) {
				this.dialogRef.close();
			}
		}));
	}

	add() {
		if(this.comment != undefined){
			this.dialogRef.close(this.comment);
		}
	}

	close() {
		this.dialogRef.close(false);
	}
	ngOnDestroy() {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	};
}