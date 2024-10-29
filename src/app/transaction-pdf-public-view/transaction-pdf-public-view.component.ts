import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { faHandPointLeft } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { ErrorDialogService } from 'src/app/services/error-dialog.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-transaction-pdf-public-view',
  templateUrl: './transaction-pdf-public-view.component.html',
  styleUrls: ['./transaction-pdf-public-view.component.css']
})
export class TransactionPdfPublicViewComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  faHandPointLeft = faHandPointLeft;
  transType = {
    transactionTypeName: '',
    moduleId: '',
    fields: ''
  };
  isDMS;
  shareFlag;
  pdffile;
  loggedInUser;
  role;
  entity;
  transactionId;
  blobdata;
  resultdata;
  url;
  newurl;
  _id
  transaction = {
    organization: {
      type: '',
      organizationId: '',
      code: '',
      name: '',
      location: "",
      website: '',
      affiliateOrganization: {
        approvedBy: '',
        type: '',
        name: '',
      }
    },
    transactionId: '',
    partnerId: '',
    partnerCode: '',
    specialization: '',
    completionDate: '',
    batch: {
      start: '',
      year: ''
    },
    module: {
      name: '',
      type: '',
      duration: '',
      durationUnit: ''
    },
    transactionid: '',

    code: '',
    status: '',
    comments: [],
    usersHistory: {},
    generateType: '',
    filePath: ''

  };
  transtypeId: any;
  fileUrl;
  transactionid;
  did;
  status;
  instname;
  modulename;
  partnerName;
  duration;
  durationUnit;
  studId;
  batchyear;
  transactionType;
  batchId;
  fields;
  fileUrlPDF;
  instLocation;
  dialogChangeEvent;
  fieldsObj: any;
  neBlob: any;
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  users: any;
  fieldObject: {};
  isCertification: boolean;
  IsFileHash: any;
  isShowPdf: boolean;
  orderId: any;
  constructor(private apiService: ApiService,
    private route: ActivatedRoute,
    public router: Router,
    public errorDialogService: ErrorDialogService,
    public confirmDialogService: ConfirmDialogService,
    private location: Location,
    public snackbarService: SnackbarService,
    private authService:AuthService
  ) { }

  ngOnInit() {
    this.transtypeId = this.route.snapshot.params['transtypeId'];
    this.transactionId = this.route.snapshot.params['id'];
    this.isDMS = this.route.snapshot.queryParams['isDMS'];
    this.orderId = this.route.snapshot.queryParams['OrderId'];
    this.getTransactionById(this.transactionId);
    
  }

  showDiv = {
    pdf: false,
  }

  searchTransaction(transactionId) {
    var params = new HttpParams();
    params = params.append('compName', (this.loggedInUser.corpData.name));
    params = params.append('userName', (this.loggedInUser.reference.userName));
    params = params.append('userId', (this.loggedInUser._id));
    this.url = "/transaction/bytransactionid?transactionid=" + transactionId;
    params = params.append('createdBy', JSON.stringify({
			firstName:this.loggedInUser.firstName,
			lastName:this.loggedInUser.lastName,
			email:this.loggedInUser.email
		}));
        params = params.append('updatedBy', JSON.stringify({
			firstName:this.loggedInUser.firstName,
			lastName:this.loggedInUser.lastName,
			email:this.loggedInUser.email
		}));
    this.subscriptions.push(this.apiService.get(this.url, params)
      .subscribe((response: any) => {
        if (response.success == true) {
          if (response.data && response.data.transaction) {
            this.url = response.data.transaction.FilePath;
            var transaction = this.transactionid;
            var id = response.data.transaction._id
            var DMS = response.data.transaction.isDMS;
            if (DMS == true) {
              const neBlob = 'data:application/pdf;base64,' + response.data.transaction.filePath;
              var pdffile = new Blob([neBlob], { type: 'application/pdf' });
            } else {
              const neBlob = 'data:application/pdf;base64,' + response.data.transaction.filePath;
              var transactionUrl = this.url.split('transactions/')
              var fileID = transactionUrl[1].split('.').slice(0, -1).join('.');
            }
          }
        }
      }));
  }

  getTransactionById(transactionId) {
    var params = new HttpParams();
    params = params.append('transactionid', transactionId);
    params = params.append('shareFlag', 'false');
    params = params.append('entity', 'organization');
    this.subscriptions.push(this.authService.getCredById(params)
      .subscribe((response: any) => {
        if (response.success) {
          this.transaction = response.data.transaction;
            this.neBlob = response.data.transaction.neBlob;
          this.transactionid = response.data.transaction.transactionid;
          this.did = response.data.transaction.code;
          this.status = response.data.transaction.status;
          this.instname = response.data.transaction.organization.name;
          this.instLocation = response.data.transaction.organization.location;
          this.modulename = response.data.transaction.module.name;
          this.batchId = response.data.transaction.batch.code;
          this.transactionType = response.data.transaction.transtypes.transactionTypeName;
          this.fields = response.data.transaction.fields;
          var transtypes = '';
          if (!response.data.transaction.transtypeFields) {
            transtypes = '';
          } else {
            transtypes = response.data.transaction.transtypeFields
          }
          const obj = {};
          var object = [];
          var allKeys = [];
          var allValues = [];

          allKeys = Object.keys(response.data.transaction);
          allValues = Object.values(response.data.transaction);

          for (var iLoop = 0; iLoop < transtypes.length; iLoop++) {
            for (var jLoop = 0; jLoop < allKeys.length; jLoop++) {
              if (transtypes[iLoop] == allKeys[jLoop]) {
                obj[transtypes[iLoop]] = allValues[jLoop];
                this.fieldObject = obj;
              }
            }
          }
          if (response.data.transaction.partner == undefined) {
            if (response.data.transaction.partnerFirstName != undefined) {
              this.partnerName = response.data.transaction.partnerFirstName;
            }
          } else {
            this.partnerName = response.data.transaction.partner.firstName + ' ' + response.data.transaction.partner.lastName
          }

          var viewPDF = response.data.transaction.transtypes.viewPDF;
          this.IsFileHash = response.data.transaction.transtypes.viewPDF;
          if(!response.data.transaction.transtypes.pdffield){
            this.IsFileHash = false
          }
          this.isShowPdf = (this.IsFileHash) ? true : false;
        }
      }))
  }

  onError(event) {
  }

  goBack() {
    this.location.back();
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  };
}