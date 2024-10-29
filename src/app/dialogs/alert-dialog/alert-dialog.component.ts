import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
	selector: 'app-alert-dialog',
	templateUrl: './alert-dialog.component.html',
	styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data,
				public router: Router,
				public dialogRef: MatDialogRef<AlertDialogComponent>) { }

	ngOnInit() {
	}

	close(){
		this.dialogRef.close();
	}
}
