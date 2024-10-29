import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddCommentComponent } from './add-comment.component';

@Injectable({
    providedIn: 'root'
})
export class AddCommentService {

    constructor(public dialog: MatDialog,
				private dialogRef: MatDialogRef<AddCommentComponent>) { }
    openDialog(obj): Observable<AddCommentComponent> {
		var dialogConfig = new MatDialogConfig();
		dialogConfig.width = '415px';
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.data = {
			url: obj.url,
			message: obj.message,
			status: obj.status,
			data: ''
		};
		const dialogRef = this.dialog.open(AddCommentComponent, dialogConfig);
		dialogRef.afterClosed()
			.pipe(
				map(result => !result ? 'Default data' : result)
			).subscribe(result => {
				dialogConfig.data.data = result;
			});		
		return dialogConfig.data;		
    };    
}