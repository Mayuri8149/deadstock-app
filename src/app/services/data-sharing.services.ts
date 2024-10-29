import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class  DataSharingServices {
    public corpLogoPreviews: BehaviorSubject<any> = new BehaviorSubject<any>('');
    public agencypLogoPreviews: BehaviorSubject<any> = new BehaviorSubject<any>('');
    setLogoPreviewData(payload) {
		this.corpLogoPreviews.next(payload);
	}
    setagencyLogoPreviewData(payload) {
		this.agencypLogoPreviews.next(payload);
	}
}