import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class  DataSharingService {
    public imagePreview: BehaviorSubject<any> = new BehaviorSubject<any>('');
    setImagePreviewData(payload) {
		this.imagePreview.next(payload);
	}
}