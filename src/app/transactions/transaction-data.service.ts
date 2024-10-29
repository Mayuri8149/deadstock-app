import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from '../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class TransactionDataService {
    private subscriptions: Subscription[] = [];
    constructor(public apiService: ApiService,) { }
    changeStatus(dialogData) {
        var data = {
            status: dialogData.status
        }
        this.apiService.put(dialogData.url, data)
            .subscribe((response: any) => {
                if(response.success == true) {
                    if(response.data.transaction && response.data.transaction._id) {
                        var transaction = response.data.transaction;
                        window.location.reload();
                    }
                }
            });
    }
    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    };
}