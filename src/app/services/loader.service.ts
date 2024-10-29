import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    showSpinner: Boolean =true;
    @Output() change: EventEmitter<object> = new EventEmitter();

    public spinnerSubject: BehaviorSubject<Boolean>;
    public spinner: Observable<Boolean>;
    constructor() { 
        this.spinnerSubject = new BehaviorSubject<Boolean>(false);
        this.spinner = this.spinnerSubject.asObservable();
    }

    getSpinnerValue(): Boolean {
        return this.spinnerSubject.value;
    }

    show() {
        this.showSpinner = true;
        this.spinnerSubject.next(this.showSpinner);  
    }
    
    hide() {
        this.showSpinner = false;
        this.spinnerSubject.next(this.showSpinner);
    }
}