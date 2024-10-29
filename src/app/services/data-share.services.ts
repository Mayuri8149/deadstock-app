import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class  DataShareServices {
    public logoPreviews: BehaviorSubject<any> = new BehaviorSubject<any>('');
    setInstLogoPreviewData(payload) {
		this.logoPreviews.next(payload);
	}
}