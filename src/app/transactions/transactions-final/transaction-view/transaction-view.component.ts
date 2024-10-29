import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe, Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { NativeDateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { DataService } from 'src/app/services/data.service';
import { DatetimeConvertor } from 'src/app/services/datetime-convertor';
import { ErrorDialogService } from 'src/app/services/error-dialog.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UploadService } from 'src/app/services/upload.service';
import { CompressImageService } from 'src/app/trans-type-list/dynamic-add-trans-integrated/compress-image.service';
import { PurchaseOrderModalComponent } from 'src/app/trans-type-list/dynamic-add-trans-integrated/purchase-order-modal/purchase-order-modal.component';
import { environment } from 'src/environments/environment';
import { sortArrayOfObjects } from 'src/sortArrayOfObjects';
import { ValidateNumber } from '../../../validators/number.validator';

const moment = _moment;
export class AppDateAdapter extends NativeDateAdapter {

	format(date: Date, displayFormat: Object): string {
		if (displayFormat == "input") {
			let day = date.getDay();
			let month = date.getMonth() + 1;
			let year = date.getFullYear();
			return this._to2digit(month) + '/' + year;
		} else {
			return date.toDateString();
		}
	}

	private _to2digit(n: number) {
		return ('00' + n).slice(-2);
	}
}
export const APP_DATE_FORMATS = {
	parse: {
		dateInput: 'DD/MM/YYYY',
	},
	display: {
		dateInput: 'DD/MM/YYYY',
		monthYearLabel: 'MMM YYYY',
		dateA11yLabel: 'LL',
		monthYearA11yLabel: 'MMMM YYYY',
	},
}
@Component({
	selector: 'app-transaction-view',
	templateUrl: './transaction-view.component.html',
	styleUrls: ['./transaction-view.component.css']
})
export class TransactionViewComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	searchTransactionForms: FormGroup;
	transactionidFieldForms: FormGroup;
	pdfTransactionForm: FormGroup;
	loggedInUser;
	faEye = faEye;
	faTrash = faTrash;
	role;
	entity;
	transactionId;
	affiliateId;
	corporateId;
	branchId;
	batchId;
	comment: "";
	branchName;
	isUniversity: Boolean = false;
	effectiveDateFlag: Boolean = false;
	expiryDateFlag: Boolean = false;
	lineArr = [];
	orderWithoutReference: boolean = false;
	transaction = {
		assQuantity: '',
		assUom: '',
		entityAsset: '',
		enteredAssetName: '',
		organizationName: '',
		moduleName: '',
		moduleId: '',
		branchName: '',
		branchLocation: '',
		transactionTypeName: '',
		transtypeCode: '',
		assetId: '',
		assetName: '',
		assetOrderId: '',
		refbranchName: '',
		effectiveDate: '',
		expiryPeriod: '',
		expiryDate: '',
		period: '',
		location: '',
		enteredquantity: '',
		entereduom: '',
		transactionid: '',
		status: '',
		updatedAt: '',
		organizationId: '',
		partnerId: '',
		partnerName: '',
		refAsset: '',
		assetCategory: '',
		transcationDateTime: '',
		assetQuantity: '',
		assetUom: '',
		created_on: '',
		upload_file: '',
		uploadedCertificate: '',
		organization: {
			isPayModStatus: null,
			type: '',
			organizationId: '',
			code: '',
			name: '',
			location: "",
			website: '',
			expiryType: '',
			expiryDate: null,
			affiliateOrganization: {
				approvedBy: '',
				type: '',
				name: '',
			}
		},
		transactionId: '',
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
		partner: {
			code: '',
			firstName: ''
		},
		code: '',
		comments: [],
		usersHistory: {},
		eprAssetId: '',
		eprOrderId: '',
		eprAssetQuantity: '',
		eprAssetUom: '',
		eprAssetName: '',
		eprTransactionid: ''
	};
	url;
	module = {};
	reviewers;
	afterDialog: boolean = false;
	uploadFile: boolean = false;
	users;
	orderurl: String;
	eprOrderurl: String;
	eprAsseturl: String;
	isCertification: boolean = false;
	isImg: boolean = false;

	key: any
	dialogChangeEvent;
	isAsset: any;
	isRefOrder: any;
	ordersList = [];
	displayedColumns = [];
	collength: any;
	displayedColumnk = [];
	displayedColumnsArr = { assetCategoryName: 'Asset category', orderId: 'Order ID', lineNo: 'Line No.', assetId: 'Asset ID', assetName: 'Asset Name', enteredquantity: 'Asset Quantity', entereduom: 'Asset UOM', acceptedQuantity: 'Accepted Quantity', rejectedQuantity: 'Rejected Quantity', comment: 'Rejected Notes', month: 'Month', year: 'Year' };
	ordersListLimited = [];
	orderItemLineList: any[];
	autoValue: any;
	prefix: any;
	length: any;
	startingnumber: any;
	lastnumber: any;
	autofieldvalue: any;
	autoFlag: any;
	modaleFlag: boolean;
	indField: any;
	urlSrc = [];
	isPdf: boolean = false;
	isImage: boolean = false;
	staticFolderName: any;
	dynamicFolderName: any;
	curPage: any = 1;
	orgPerPage: any = 5;
	partnerOrder;
	uomListUom;
	Quantity_decimal:any;
	entereQuantity: any;
	old_entereQuantity;
	@ViewChild('myModel', { static: false }) myModel: ModalDirective;
	selection = new SelectionModel<any>(true, []);
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	keyAll: string[];
	valueAll: {}[];
	fieldObject: any = {};
	transTypeId: any
	rateCardDetails: any = {}
	walletBalance = 0
	orderDetails: any = {}
	packagedetails: any = {}
	data: any
	order: boolean = false;
	refbranch: Boolean = false;
	asset: Boolean = false; tableLength: number;
	lineLevelArr = [];
	actionFlag: any;
	orderItemArray: any;
	orderItems = [];
	showImg = [];
	selectedFiles: FileList;
	imageError = [];
	fileUploaded = [];
	resultSrc = [];
	fileNative = [];
	filenameArr = [];
	imageArr = [];
	fileUploadArr = [];
	fileUploadNameArr = [];
	readOnlyFlag: boolean = true;
	deleteDbFlag = [];
	chkAddRecordItems: boolean = false;
	locationbranch: string;
	locationlist: any[];
	assetsType: Boolean;
	assetType: any;
	inputAsset: any;
	inputAssets: any;
	transactionDetails: any;
	fields = [];
	object: {};
	datatype: any;
	companyName;
	organization;
	partnerdetails: boolean;
	isProvenance: boolean;
	isShownAddRecord: boolean = false;
	sessionTransType: any;
	orderDetailsData = [];
	orderDetailsDatas = [];
	dataSourceOption = [
		{ value: DataDynamicTable }
	];
	datasControl = new FormControl();
	dataSource = [];
	transactionType;
	Trxlocation: Boolean = false;
	assetCategory: Boolean = false;
	assetWithoutReference: any;
	traceChainUrl;
	partnerId: Boolean = false;
	partnerName: Boolean = false;
	previewViewSrc = [];
	fields1 = [];
	isImageStatic: boolean;
	isPdfStatic: boolean;
	urlSrcStatic: any;
	staticCertificateFolderName: any;
	fileCertName: boolean = false;
	refAssetCheckFlag: boolean = false;
	addressLine: any;
	adminDistrict: any;
	countryRegion: any;
	locality: any;
	postalCode: any;
	autolocation: any;
	geolocation = {
		address: '',
		neighborhood: '',
		formattedAddress: '',
		city: '',
		state: '',
		postalcode: '',
		latitude: '',
		longitude: '',
		country: ''
	}
	uomLists = [];
	orderDetailsArray = [];
	lineArrLevel = [];
	deleteOrderItem = [];	
	assetLocationAutoSuggest: any='';
	constructor(private apiService: ApiService,
		public datepipe: DatePipe,
		private _formBuilder: FormBuilder,
		private route: ActivatedRoute,
		public router: Router,
		private location: Location,
		public dataService: DataService,
		public errorDialogService: ErrorDialogService,
		private uploadService: UploadService,
		public snackbarService: SnackbarService,
		public confirmDialogService: ConfirmDialogService,
		private dialog: MatDialog,
		public loaderService: LoaderService,
		private compressImage: CompressImageService,
		public validateNumber: ValidateNumber,
		public datetimeConvertor: DatetimeConvertor) {
	}

	ngOnInit() {
		this.loggedInUser = JSON.parse(sessionStorage.getItem('user'));
		this.transactionDetails = JSON.parse(sessionStorage.getItem('transcationType'));
		this.role = this.loggedInUser.reference.role;
		this.entity = this.loggedInUser.reference.entity;
		this.transactionId = this.route.snapshot.params['transactionId'];
		this.transactionType = this.route.snapshot.params['transactionType'];
		if ('corpData' in this.loggedInUser) {
			this.companyName = this.loggedInUser.corpData.companyName;
			this.organization = this.loggedInUser.corpData.code;
			this.branchName = this.loggedInUser.corpData.location;
		} else {
			this.companyName = this.loggedInUser.organizationName;
			this.organization = this.loggedInUser.organizationCode;
			this.branchName = this.loggedInUser.departmentLocation;
		}

		this.searchTransactionForms = this._formBuilder.group({
			enteredAssetName: [{ value: '', disabled: true },],
			moduleName: [{ value: '', disabled: true },],
			branchName: [{ value: '', disabled: true },],
			branchLocation: [{ value: '', disabled: true },],
			organizationName: [{ value: '', disabled: true },],
			transactionTypeName: [{ value: '', disabled: true },],
			assetId: [{ value: '', disabled: true },],
			assetOrderId: [{ value: '', disabled: true },],
			effectiveDate: [{ value: '', disabled: true },],
			expiryPeriod: [{ value: '', disabled: true },],
			expiryDate: [{ value: '', disabled: true },],
			period: [{ value: '', disabled: true },],
			location: [{ value: '' },],
			enteredquantity: [{ value: '', disabled: true },],
			entereduom: [{ value: '', disabled: true },],
			assetName: [{ value: '', disabled: true },],
			transactionid: [{ value: '', disabled: true },],
			status: [{ value: '', disabled: true },],
			updatedAt: [{ value: '', disabled: true },],
			organizationId: [{ value: '', disabled: true },],
			moduleId: [{ value: '', disabled: true },],
			transtypeCode: [{ value: '', disabled: true },],
			partnerId: [{ value: '', disabled: true },],
			partnerName: [{ value: '', disabled: true },],
			refbranchName: [{ value: '', disabled: true },],
			transcationDateTime: [{ value: '', disabled: true },],
			branches: [{ value: '', disabled: true },],
			refAsset: [{ value: '', disabled: true },],
			purchaseOrder: [{ value: '', disabled: true },],
			upload_file: [{ value: '', disabled: true },],
			uploadedCertificate: [{ value: '', disabled: true },],
			fromToEntity: new FormControl(''),
			assetCategory: [{ value: '', disabled: true },],
			assetQuantity: [{ value: '', disabled: true },],
			assQuantity: [{ value: '' },],
			assetUom: [{ value: '', disabled: true },],
			assUom: [{ value: '' },],
			branch: [{ value: '', disabled: true },],
			readonlyOrderId: [{ disabled: true },],
			readonlyAssetId: [{ disabled: true },],
			shipOrderClosed: [{ value: '', disabled: true },],
		});

		this.transactionidFieldForms = this._formBuilder.group({});
		if (this.transactionDetails?.transactionType.transaction == 'Asset' && this.transactionDetails?.transactionType.inputAsset == false) {
			this.isShownAddRecord = true
		}
		this.sessionTransType = this.transactionDetails?.transactionType;
		this.getTransaction();

		this.datasControl.setValue(this.dataSourceOption[0].value);
		this.dataSource = [];
		this.assetWithoutReference = this.transactionDetails?.transactionType.assetWithoutReference;
		this.traceChainUrl = environment.awsImgPath
		this.curPage = this.route.snapshot.queryParams['currentPage'];
		this.orgPerPage = this.route.snapshot.queryParams['recordPerPage'];
		this.partnerOrder = this.route.snapshot.queryParams['partnerOrder'];
		this.actionFlag = this.route.snapshot.queryParams['actionFlag'];
		if (this.actionFlag == 'update') {
			this.readOnlyFlag = false;
			this.getUom();
		}
	}

	chosenYearHandler(normalizedYear: Moment, controlName: string) {
		const ctrlValue = this.transactionidFieldForms.controls[controlName].value;
		ctrlValue.year(normalizedYear.year());
		this.transactionidFieldForms.controls[controlName].setValue(ctrlValue)
	}

	chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>, controlName: string) {
		const ctrlValue = this.transactionidFieldForms.controls[controlName].value;
		ctrlValue.month(normalizedMonth.month());
		this.transactionidFieldForms.controls[controlName].setValue(ctrlValue);
	}
	chosenDayHandler(normalizedDay: Moment, datepicker: MatDatepicker<Moment>, controlName: string) {
		const ctrlValue = this.transactionidFieldForms.controls[controlName].value;
		ctrlValue.day(normalizedDay.day());
		this.transactionidFieldForms.controls[controlName].setValue(ctrlValue);
		datepicker.close();
	}

	ngOnChange() {
	}

	extend(obj, src) {
		for (var key in src) {
			if (src.hasOwnProperty(key)) obj[key] = src[key];
		}
		return obj;
	}

	async getByRefTransType() {
		this.url = "/order/getTransTypeData";
		var params = new HttpParams();
		params = params.append('organizationId', this.transactionDetails?.organizationId);
		params = params.append('moduleId', this.transactionDetails?.module?._id);
		params = params.append('transactionTypeCode', this.transactionDetails?.transactionType?.transactionTypeCode);
		this.subscriptions.push(this.apiService.getAsset(this.url, params)
			.subscribe((response: any) => {
				if (response.success) {
					if (response.data.assetWithoutReference && response.data.assetWithoutReference != undefined) {
						this.refAssetCheckFlag = response.data.assetWithoutReference;
					}
				}
			}))
	}

	getTransaction() {
		this.url = "/asset/" + this.transactionId;

		var params = new HttpParams();
		if (this.transactionDetails?.transactionType.transaction == "Order" && this.transactionDetails?.transactionType.transRole != 'Digital' || this.transactionType == "Order" && this.transactionDetails?.transactionType.transRole != 'Digital') {
			this.orderurl = "/order/" + this.transactionId;

			this.subscriptions.push(this.apiService.getAsset(this.orderurl, params)
				.subscribe((response: any) => {
					if (response.success == true) {
						this.transaction = response.data._id;
						if (response.data._id?.transactionEntityType == "Partner") {
							this.transaction.organizationName = response.data._id?.transactionEntityDetails?.companyName
						} else if (response.data._id?.transactionEntityType == "Organization") {
							this.transaction.organizationName = response.data._id?.transactionEntityDetails?.name
						}
						this.transaction.organizationId = response.data._id.transactionEntity
						this.transaction.moduleName = response.data._id.modules.name;
						this.transaction.moduleId = response.data._id.moduleCode;

						if (response.data._id.branch) {
							this.transaction.branchName = response.data._id.branch?.branch_location
						} else if (response.data._id?.transactionEntityDetails) {
							this.transaction.branchName = response.data._id?.transactionEntityDetails?.location
						} else {
							this.transaction.branchName = this.branchName
						}
						this.transaction.transactionTypeName = response.data._id?.transtype?.transactionTypeName;
						this.transaction.transtypeCode = response.data._id?.transtypeCode;
						if (response.data._id.assetId) {
							this.asset = true
							this.transaction.assetId = response.data._id.assetId;
						}
						if (response.data._id.orderId) {
							this.order = true
							this.transaction.assetOrderId = response.data._id.orderId;
						}
						this.transaction.expiryPeriod = response.data._id.expiryPeriod;
						this.transaction.updatedAt = response.data._id.updatedAt;
						this.transaction.period = response.data._id.period;

						this.transaction.assetQuantity = response.data._id?.assets?.assetQuantity.toFixed(response.data._id?.uom?.decimal);
						this.transaction.assQuantity = response.data._id?.assets?.assetQuantity;
						this.transaction.assetUom = response.data._id?.assets?.assetUom;
						this.transaction.assetName = response.data._id?.assets?.assetName;
						this.transaction.transactionid = response?.data?._id?.transactionid;
						if (response.data._id.transactionEntity !== response.data._id.refEntity) {
							this.partnerId = true
							this.transaction.partnerId = response.data._id.refEntity;
							if (response.data._id.organizationName !== response.data._id.partnerName) {
								this.partnerName = true
								if (response.data._id?.refEntityDetails?.name) {
									this.transaction.partnerName = response.data._id?.refEntityDetails?.name
								} else {
									this.transaction.partnerName = response.data._id?.refEntityDetails?.companyName
								}
							}
						}

						if (response.data._id?.refbranch?.name) {
							this.transaction.refbranchName = response.data._id?.refbranch?.name
						}

						this.transaction.transcationDateTime = this.datetimeConvertor.convertDateTimeZone(response.data._id.created_on, "datetime");

						if (response.data._id.effectiveDate && response.data._id.effectiveDate != 'Invalid Date') {
							this.transaction.effectiveDate = this.datetimeConvertor.convertDateTimeZone(response.data._id.effectiveDate, "date");
						}

						if (response.data._id.expiryDate && response.data._id.expiryDate != 'Invalid Date') {
							this.transaction.expiryDate = this.datetimeConvertor.convertDateTimeZone(response.data._id.expiryDate, "date");
						}

						if (response.data._id?.location) {
							this.Trxlocation = true
							this.transaction.location = response.data._id.location;
						}

						if (response.data._id?.refbranch) {
							this.refbranch = true
							this.order = true
						}
						if (response.data._id.upload_file) {
							this.uploadFile = true
							this.transaction.upload_file = response.data._id.upload_file;
						}
						if (response.data._id.upload_certificate) {
							this.fileCertName = true
							this.transaction.uploadedCertificate = response.data._id.upload_certificate;
						}
						this.isProvenance = response.data._id.provenance
						if (response.data._id?.transtype?.inputAsset) {
							this.inputAsset = response.data._id.transtype.inputAsset
						}
						if (response.data._id?.transtype?._id) {
							this.transTypeId = response.data._id.transtype._id;
						}
						if (response.data._id?.inputAssets) {
							this.inputAssets = response.data._id.inputAssets
						}

						if (response.data._id.status == "New") {
							this.transaction.status = "Open";
						} else {
							this.transaction.status = "Closed";
						}
						this.fields1 = response?.data?._id?.transtype?.fields
						var transtypes = '';
						if (!response?.data?._id?.transtype?.fields) {
							transtypes = '';
						} else {
							transtypes = response?.data?._id?.transtype?.fields
						}

						for (var i = 0; i < this.fields1.length; i++) {
							if (this.fields1[i][0]?.is_line_level == true) {
								this.lineLevelArr[i] = this.fields1[i][0];
								this.lineArr[i] = this.fields1[i][0].key;
							} else {
								if (this.fields1[i][0]?.is_outside_level == true) {
								} else {
									this.fields[i] = this.fields1[i];
								}
							}
						}
						this.lineLevelArr = this.lineLevelArr.filter(item => item);
						this.fields = this.fields.filter(item => item);
						this.generateFieldsForm(response.data._id, this.fields);
						this.searchTransactionForms.patchValue(this.transaction);
						if ((this.transactionDetails?.transactionType.refModule == undefined || this.transactionDetails?.transactionType.refModule == '' || this.transactionDetails?.transactionType.refModule == null) && (this.transactionDetails?.transactionType.refTransType == undefined || this.transactionDetails?.transactionType.refTransType == '' || this.transactionDetails?.transactionType.refTransType == null)) {
							this.orderWithoutReference = true;
						}
						if (!this.orderWithoutReference && (this.transactionDetails?.transactionType.assetType == 'Receive Asset' || this.transactionDetails?.transactionType.assetType == 'Consume Asset')) {
							this.getByRefTransType();
						}
						this.orderItemArray = response.data.orderDetails;
						if (response.data.orderDetails != undefined) {

							for (var i = 0; i < response.data.orderDetails.length; i++) {
								this.lineArr = response.data.orderDetails[i].line_level_fields
								if (response.data?.orderDetails[i]?.accepted_quantity) {
									var accepQuantity = response.data?.orderDetails[i]?.accepted_quantity.toFixed(response.data?.orderDetails[i]?.assetUom_details[0]?.decimal)
								}
								if (response.data?.orderDetails[i]?.rejected_quantity) {
									var rejQuantity = response.data?.orderDetails[i]?.rejected_quantity.toFixed(response.data?.orderDetails[i]?.assetUom_details[0]?.decimal)
								}
								if (response.data?.orderDetails[i]?.order_quantity) {
									var enterQuantity = response.data?.orderDetails[i]?.order_quantity.toFixed(response.data?.orderDetails[i]?.assetUom_details[0]?.decimal)
								}
								const ordData = {
									assetCategoryName: response.data.orderDetails[i]?.assetcat_details[0]?.assetCategory != undefined ? response.data.orderDetails[i].assetcat_details[0].assetCategory : "",
									assetName: response.data.orderDetails[i].order_item,
									enteredquantity: enterQuantity,
									entereduom: response.data.orderDetails[i].order_uom,
									assetId: response.data.orderDetails[i].ordered_assetId != undefined ? response.data.orderDetails[i].ordered_assetId : "",
									entity_asset: response.data.orderDetails[i].entity_asset != undefined ? response.data.orderDetails[i].entity_asset : "",
									orderId: response.data.orderDetails[i].ref_order != undefined ? response.data.orderDetails[i].ref_order : "",
									lineNo: response.data.orderDetails[i].line_number != undefined ? response.data.orderDetails[i].line_number : "",
									refOrderTransactionid: response.data.orderDetails[i].refOrderTransactionid != undefined ? response.data.orderDetails[i].refOrderTransactionid : "",
									acceptedQuantity: accepQuantity,
									rejectedQuantity: rejQuantity,
									comment: response.data.orderDetails[i].rejection_note != undefined ? response.data.orderDetails[i].rejection_note : "",
									id: i
								}
							}
							if (this.lineArr != undefined) {
								const keysValue = Object.keys(this.lineArr);
								for (var i = 0; i < keysValue.length; i++) {
									this.displayedColumnsArr[keysValue[i]] = keysValue[i];
								}
							}

							if (this.transactionDetails?.transactionType.fromToEntity == "reference" && (this.transactionDetails?.transactionType.assetType == 'Consume Asset' || this.transactionDetails?.transactionType.assetType == 'Receive Asset')) {
								if (this.transactionDetails?.transactionType.assetType == 'Receive Asset') {

									this.displayedColumnsArr.orderId = "Ship Order";
									if (this.refAssetCheckFlag == true) {
										this.displayedColumns = ['assetCategoryName', 'orderId', 'lineNo', 'assetId', 'assetName', 'enteredquantity', 'entereduom', 'acceptedQuantity', 'rejectedQuantity', 'comment'];
									} else {
										this.displayedColumns = ['assetCategoryName', 'orderId', 'lineNo', 'assetId', 'assetName', 'enteredquantity', 'entereduom', 'acceptedQuantity', 'rejectedQuantity', 'comment'];
									}
									if (this.lineArr != undefined) {
										const keysValue = Object.keys(this.lineArr);
										this.displayedColumns = this.displayedColumns.concat(keysValue);
									}
								} else {
									if (this.transactionDetails?.transactionType.fromToEntity == "reference" && this.transactionDetails?.transactionType.assetType == 'Consume Asset') {
										if (this.sessionTransType.refModule != 'SAL') {
											this.displayedColumnsArr.orderId = "Purchase Order";
										} else {
											this.displayedColumnsArr.orderId = "Sales Order";
										}
										if (this.assetWithoutReference) {
											if (this.actionFlag == 'update') {
												this.displayedColumns = ['actions', 'assetCategoryName', 'orderId', 'lineNo', 'assetName', 'enteredquantity', 'entereduom'];
											} else {
												this.displayedColumns = ['assetCategoryName', 'orderId', 'lineNo', 'assetName', 'enteredquantity', 'entereduom'];
											}
										} else {
											if (this.actionFlag == 'update') {
												this.displayedColumns = ['actions', 'assetCategoryName', 'orderId', 'lineNo', 'assetId', 'assetName', 'enteredquantity', 'entereduom'];
											} else {
												this.displayedColumns = ['assetCategoryName', 'orderId', 'lineNo', 'assetId', 'assetName', 'enteredquantity', 'entereduom'];
											}
										}
									} else {
										this.displayedColumnsArr.orderId = "Purchase Order";

										if (this.actionFlag == 'update') {
											this.displayedColumns = ['actions', 'lineNo', 'orderId', 'assetId', 'assetName', 'enteredquantity', 'entereduom'];
										} else {
											this.displayedColumns = ['lineNo', 'orderId', 'assetId', 'assetName', 'enteredquantity', 'entereduom'];
										}
									}

									if (this.lineArr != undefined) {
										const keysValue = Object.keys(this.lineArr);
										this.displayedColumns = this.displayedColumns.concat(keysValue);
									}
								}
							} else {

								if (this.actionFlag == 'update') {
									this.displayedColumns = ['actions', 'lineNo', 'assetCategoryName', 'assetName', 'enteredquantity', 'entereduom'];
								} else {
									this.displayedColumns = ['lineNo', 'assetCategoryName', 'assetName', 'enteredquantity', 'entereduom'];
								}
								var lineLevelisArray = Array.isArray(this.lineArr)
								if (this.lineArr != undefined && lineLevelisArray == false) {
									const keysValue = Object.keys(this.lineArr);
									this.displayedColumns = this.displayedColumns.concat(keysValue);
								}
							}
							this.collength = this.displayedColumns.length
							for (var i = 0; i < response.data.orderDetails.length; i++) {
								this.lineArrLevel[i] = response.data.orderDetails[i].line_level_fields

								this.lineArr = response.data.orderDetails[i].line_level_fields
								if (response.data?.orderDetails[i]?.accepted_quantity) {
									var accepQuantity = response.data?.orderDetails[i]?.accepted_quantity.toFixed(response.data?.orderDetails[i]?.assetUom_details[0]?.decimal)
								}
								if (response.data?.orderDetails[i]?.rejected_quantity) {
									var rejQuantity = response.data?.orderDetails[i]?.rejected_quantity.toFixed(response.data?.orderDetails[i]?.assetUom_details[0]?.decimal)
								}
								if (response.data?.orderDetails[i]?.order_quantity) {
									var enterQuantity = response.data?.orderDetails[i]?.order_quantity.toFixed(response.data?.orderDetails[i]?.assetUom_details[0]?.decimal)
								}
								const ordData = {
									assetCategory: response.data.orderDetails[i]?.asset_category != undefined ? response.data.orderDetails[i].asset_category : "",
									assetCategoryName: response.data.orderDetails[i]?.assetcat_details[0]?.assetCategory != undefined ? response.data.orderDetails[i].assetcat_details[0].assetCategory : "",
									assetName: response.data.orderDetails[i].order_item,
									enteredquantity: enterQuantity,
									entereduom: response.data.orderDetails[i].order_uom,
									assetId: response.data.orderDetails[i].ordered_assetId != undefined ? response.data.orderDetails[i].ordered_assetId : "",
									entity_asset: response.data.orderDetails[i].entity_asset != undefined ? response.data.orderDetails[i].entity_asset : "",
									orderId: response.data.orderDetails[i].ref_order != undefined ? response.data.orderDetails[i].ref_order : "",
									lineNo: response.data.orderDetails[i].line_number != undefined ? response.data.orderDetails[i].line_number : "",
									refOrderTransactionid: response.data.orderDetails[i].refOrderTransactionid != undefined ? response.data.orderDetails[i].refOrderTransactionid : "",
									acceptedQuantity: accepQuantity,
									rejectedQuantity: rejQuantity,
									comment: response.data.orderDetails[i].rejection_note != undefined ? response.data.orderDetails[i].rejection_note : "",
									id: i
								}

								const OrderDetailData = this.lineArrLevel[i]
								const merged = Object.assign(ordData, OrderDetailData);
								this.orderDetailsDatas[i] = merged;
							}

							this.orderDetailsDatas = sortArrayOfObjects(this.orderDetailsDatas, "lineNo", "ascending")
							this.dataSource = this.orderDetailsDatas;
							if (this.lineArr) {
								let previewArr = []
								this.previewViewSrc = [];
								this.lineArrLevel.map(async (value, i) => {
									const keysValue = Object.keys(value);
									keysValue.map(async (valueKey, j) => {
										this.lineLevelArr.map(async (valueLine, k) => {
											if (valueLine.value == 'File' && valueKey == valueLine.key && value[valueKey] != '') { //i==Math.abs(value.lineNo-1) && 
												previewArr[valueKey] = value[valueKey];
												this.previewViewSrc[i] = previewArr;
											}
										});
									});
								});
							}
						}
						this.old_entereQuantity = this.transaction.assQuantity
					}
				}));
		} else if (this.transactionDetails?.transactionType.transaction == "Asset" && this.transactionDetails?.transactionType.transRole != 'Digital' || this.transactionType == "Asset" && this.transactionDetails?.transactionType.transRole != 'Digital') {

			this.subscriptions.push(this.apiService.getAsset(this.url, params)
				.subscribe((response: any) => {
					if (response.success == true) {
						this.transaction = response.data._id;
						this.transaction.entityAsset = response?.data?._id?.entityAsset;
						if (response.data._id?.transactionEntityType == "Partner") {
							this.transaction.organizationName = response.data._id?.transactionEntityDetails?.companyName
						} else if (response.data._id?.transactionEntityType == "Organization") {
							this.transaction.organizationName = response.data._id?.transactionEntityDetails?.name
						}
						this.transaction.organizationId = response.data._id.transactionEntity

						this.transaction.moduleName = response.data._id.modules.name;
						this.transaction.moduleId = response.data._id.moduleCode;
						if (response.data._id?.assetcategory) {
							this.assetCategory = true
							this.transaction.assetCategory = response.data._id.assetcategory?.assetCategory;
						}
						if (response.data._id.branch) {
							this.transaction.branchName = response.data._id.branch?.branch_location
						} else if (response.data._id?.transactionEntityDetails) {
							this.transaction.branchName = response.data._id?.transactionEntityDetails?.location
						} else {
							this.transaction.branchName = this.branchName
						}
						this.transaction.transactionTypeName = response.data._id?.transtype?.transactionTypeName;
						this.transaction.transtypeCode = response.data._id.transtypeCode;
						if (response.data._id.assetId) {
							this.asset = true
							this.transaction.assetId = response.data._id.assetId;
						}
						if (response.data._id.orderId) {
							this.order = true
							this.transaction.assetOrderId = response.data._id.orderId;
						}
						this.transaction.expiryPeriod = response.data._id.expiryPeriod;
						this.transaction.updatedAt = response.data._id.updatedAt;
						this.transaction.period = response.data._id.period;
						this.transaction.assetQuantity = response.data._id.assetQuantity.toFixed(response.data._id?.uom?.decimal);
						this.transaction.assQuantity = response.data._id.assetQuantity;
						this.transaction.assetUom = response.data._id.assetUom;
						this.transaction.assUom = response.data._id.assetUom;
						this.transaction.assetName = response.data._id.assetName;
						this.transaction.transactionid = response.data._id.transactionid;
						if (response.data._id.transactionEntity !== response.data._id.refEntity) {
							this.partnerId = true
							this.transaction.partnerId = response.data._id.refEntity;
							if (response.data._id.organizationName !== response.data._id.partnerName) {
								this.partnerName = true
								if (response.data._id?.refEntityDetails?.name) {
									this.transaction.partnerName = response.data._id?.refEntityDetails?.name
								} else {
									this.transaction.partnerName = response.data._id?.refEntityDetails?.companyName
								}
							}
						}
						this.transaction.transcationDateTime = this.datetimeConvertor.convertDateTimeZone(response.data._id.created_on, "datetime");

						if (response.data._id.effectiveDate && response.data._id.effectiveDate != 'Invalid Date') {
							this.effectiveDateFlag = true
							this.transaction.effectiveDate = this.datetimeConvertor.convertDateTimeZone(response.data._id.effectiveDate, "date");
						}

						if (response.data._id.expiryDate && response.data._id.expiryDate != 'Invalid Date') {
							this.expiryDateFlag = true
							this.transaction.expiryDate = this.datetimeConvertor.convertDateTimeZone(response.data._id.expiryDate, "date");
						}

						if (response.data._id?.location) {
							this.Trxlocation = true
							this.transaction.location = response.data._id.location;
						}
						if (response.data._id?.assetcategory) {
							this.assetCategory = true
							this.transaction.assetCategory = response.data._id.assetcategory?.assetCategory;
						}

						if (response.data._id.upload_file) {
							this.uploadFile = true
							this.transaction.upload_file = response.data._id.upload_file;
						}
						if (response.data._id.upload_certificate) {
							this.fileCertName = true
							this.transaction.uploadedCertificate = response.data._id.upload_certificate;
						}
						this.isProvenance = response.data._id.provenance

						this.assetType = response.data._id?.transtype?.assetType
						if (response.data?.inputAsset) {
							this.inputAsset = response.data?.inputAsset
						}
						if (response.data?.inputAssets) {
							this.inputAssets = response.data?.inputAssets
						}
						this.transTypeId = response.data._id?.transtype?._id;

						if (response.data._id.status == "New") {
							this.transaction.status = "Open";
						} else {
							this.transaction.status = "Closed";
						}

						this.fields1 = response.data._id?.transtype?.fields;
						var transtypes = '';
						if (!response.data._id?.transtype?.fields) {
							transtypes = '';
						} else {
							transtypes = response.data._id?.transtype?.fields
						}

						for (var i = 0; i < this.fields1.length; i++) {
							if (this.fields1[i][0]?.is_line_level == true) {
								this.lineLevelArr[i] = this.fields1[i][0];
								this.lineArr[i] = this.fields1[i][0].key;
							} else {
								if (this.fields1[i][0]?.is_outside_level == true) {
								} else {
									this.fields[i] = this.fields1[i];
								}
							}
						}
						this.lineLevelArr = this.lineLevelArr.filter(item => item);
						this.fields = this.fields.filter(item => item);
						this.generateFieldsForm(response.data._id, this.fields);
						for (var i = 0; i < response.data.inputAssets.length; i++) {
							this.lineArr = response.data?.inputAssets[i]?.line_level_fields
						}
						if (this.lineArr != undefined) {
							const keysValue = Object.keys(this.lineArr);
							for (var i = 0; i < keysValue.length; i++) {
								this.displayedColumnsArr[keysValue[i]] = keysValue[i];
							}
						}

						if (response.data?.inputAssets[0].inputAssets_details?.length != 0) {
							const keysValue = Object.keys(response.data.inputAssets);
							for (var i = 0; i < keysValue.length; i++) {
								this.displayedColumnsArr[keysValue[i]] = keysValue[i];
							}
							this.displayedColumns = Object.keys(response.data.inputAssets);
							if (this.sessionTransType == "Purchase" || this.sessionTransType == "Sales") {
								this.displayedColumns = ['assetName', 'enteredquantity', 'entereduom'];
							} else if (this.transactionDetails?.transactionType.fromToEntity == "reference" && (this.transactionDetails?.transactionType.assetType == 'Consume Asset' || this.transactionDetails?.transactionType.assetType == 'Receive Asset')) {
								if (this.transactionDetails?.transactionType.assetType == 'Receive Asset') {
									this.displayedColumns = ['orderId', 'lineNo', 'assetId', 'assetName', 'enteredquantity', 'entereduom', 'acceptedQuantity', 'rejectedQuantity', 'comment'];
								} else {
									this.displayedColumns = ['orderId', 'lineNo', 'assetId', 'assetName', 'enteredquantity', 'entereduom'];
								}
							} else {
								if (this.actionFlag == 'update') {
									this.displayedColumns = ['actions', 'assetCategoryName', 'assetId', 'assetName', 'enteredquantity', 'entereduom'];
								} else {
									this.displayedColumns = ['assetCategoryName', 'assetId', 'assetName', 'enteredquantity', 'entereduom'];
								}
							}


							for (var i = 0; i < response.data.inputAssets.length; i++) {
								this.lineArrLevel[i] = response.data?.inputAssets[i]?.line_level_fields
								this.lineArr = response.data?.inputAssets[i]?.line_level_fields
								if (response.data?.inputAssets[i]?.accepted_quantity) {
									var accepQuantity = response.data?.inputAssets[i]?.accepted_quantity.toFixed(response.data?.inputAssets[i]?.assetUom_details[0]?.decimal)
								}
								if (response.data?.inputAssets[i]?.rejected_quantity) {
									var rejQuantity = response.data?.inputAssets[i]?.rejected_quantity.toFixed(response.data?.inputAssets[i]?.assetUom_details[0]?.decimal)
								}
								if (response.data?.inputAssets[i]?.inputAssetQuantity) {
									var enterQuantity = response.data?.inputAssets[i]?.inputAssetQuantity.toFixed(response.data?.inputAssets[i]?.assetUom_details[0]?.decimal)
								}
								const ordData = {
									assetCategory: response.data?.inputAssets[i]?.inputAssets_details[0]?.assetCategory != undefined ? response.data?.inputAssets[i]?.inputAssets_details[0]?.assetCategory : "",
									assetName: response.data?.inputAssets[i]?.inputAssets_details[0]?.assetName,
									assetCategoryName: response.data?.inputAssets[i]?.inputAssets_details[0]?.assetCategoryDetails[0]?.assetCategory,
									enteredquantity: enterQuantity,
									entereduom: response.data.inputAssets[i].inputAssetUom,
									assetId: response.data.inputAssets[i]?.inputAssets_details[0]?.assetId != undefined ? response.data.inputAssets[i]?.inputAssets_details[0]?.assetId : "",
									entity_asset: response.data.inputAssets[i].entity_asset != undefined ? response.data.inputAssets[i].entity_asset : "",
									orderId: response.data.inputAssets[i].ref_order != undefined ? response.data.inputAssets[i].ref_order : "",
									lineNo: i + 1,
									refOrderTransactionid: response.data.inputAssets[i].refOrderTransactionid != undefined ? response.data.inputAssets[i].refOrderTransactionid : "",
									acceptedQuantity: accepQuantity,
									rejectedQuantity: rejQuantity,
									comment: response.data.inputAssets[i].rejection_note != undefined ? response.data.inputAssets[i].rejection_note : "",
									id: i
								}
								this.orderDetailsData[i] = ordData;
								const OrderDetailData = this.lineArrLevel[i]
								const merged = Object.assign(ordData, OrderDetailData);
								this.orderDetailsDatas[i] = merged;


							}
							this.dataSource = this.orderDetailsDatas;
						}
						if (this.lineArr != undefined) {
							const keysValue = Object.keys(this.lineArr);
							this.displayedColumns = this.displayedColumns.concat(keysValue);
						}
						if (this.lineArr) {
							let previewArr = []
							this.previewViewSrc = [];
							this.lineArrLevel.map(async (value, i) => {
								const keysValue = Object.keys(value);
								keysValue.map(async (valueKey, j) => {
									this.lineLevelArr.map(async (valueLine, k) => {
										if (valueLine.value == 'File' && valueKey == valueLine.key && value[valueKey] != '') { //i==Math.abs(value.lineNo-1) && 
											previewArr[valueKey] = value[valueKey];
											this.previewViewSrc[i] = previewArr;
										}
									});
								});
							});
						}
						this.searchTransactionForms.patchValue(this.transaction);
						this.old_entereQuantity = this.transaction.assQuantity
					}
				}));
		} else if (this.transactionDetails?.transactionType.transaction == "Order" && this.transactionDetails?.transactionType.transRole == 'Digital' || this.transactionType == "Order" && this.transactionDetails?.transactionType.transRole == 'Digital') {
			this.eprOrderurl = "/eprOrder/" + this.transactionId
			this.subscriptions.push(this.apiService.getAsset(this.eprOrderurl, params).subscribe((response: any) => {
				if (response.success == true) {
					this.transaction = response.data._id;
					if (response.data._id?.transactionEntityType == "Partner") {
						this.transaction.organizationName = response.data._id?.transactionEntityDetails?.companyName
					} else if (response.data._id?.transactionEntityType == "Organization") {
						this.transaction.organizationName = response.data._id?.transactionEntityDetails?.name
					}
					this.transaction.organizationId = response.data._id.transactionEntity
					this.transaction.moduleName = response.data._id.modules.name;
					this.transaction.moduleId = response.data._id.moduleCode;

					if (response.data._id.branch) {
						this.transaction.branchName = response.data._id.branch?.name
					} else if (this.branchName) {
						this.transaction.branchName = this.branchName
					}
					this.transaction.transactionTypeName = response.data._id?.transtype?.transactionTypeName;
					this.transaction.transtypeCode = response.data._id?.transtypeCode;
					if (response.data._id.eprAssetId) {
						this.asset = true
						this.transaction.assetId = response.data._id.eprAssetId;
					}
					if (response.data._id.eprOrderId) {
						this.order = true
						this.transaction.assetOrderId = response.data._id.eprOrderId;
					}
					this.transaction.expiryPeriod = response.data._id.expiryPeriod;
					this.transaction.updatedAt = response.data._id.updatedAt;
					this.transaction.period = response.data._id.period;

					this.transaction.assetQuantity = response.data._id?.assets?.eprAssetQuantity.toFixed(response.data._id?.uom?.decimal);
					this.transaction.assetUom = response.data._id?.assets?.eprAssetUom;
					this.transaction.assetName = response.data._id?.assets?.eprAssetName;
					this.transaction.transactionid = response.data._id.eprTransactionid;
					if (response.data._id.transactionEntity !== response.data._id.refEntity) {
						this.partnerId = true
						this.transaction.partnerId = response.data._id.refEntity;
						if (response.data._id.organizationName !== response.data._id.partnerName) {
							this.partnerName = true
							if (response.data._id?.refEntityDetails?.name) {
								this.transaction.partnerName = response.data._id?.refEntityDetails?.name
							} else {
								this.transaction.partnerName = response.data._id?.refEntityDetails?.companyName
							}
						}
					}

					if (response.data._id?.refbranch?.name) {
						this.transaction.refbranchName = response.data._id?.refbranch?.name
					}

					this.transaction.transcationDateTime = this.datetimeConvertor.convertDateTimeZone(response.data._id.created_on, "datetime");

					if (response.data._id.effectiveDate && response.data._id.effectiveDate != 'Invalid Date') {
						this.transaction.effectiveDate = this.datetimeConvertor.convertDateTimeZone(response.data._id.effectiveDate, "date");
					}

					if (response.data._id.expiryDate && response.data._id.expiryDate != 'Invalid Date') {
						this.transaction.expiryDate = this.datetimeConvertor.convertDateTimeZone(response.data._id.expiryDate, "date");
					}

					if (response.data._id?.location) {
						this.Trxlocation = true
						this.transaction.location = response.data._id.location;
					}

					if (response.data._id?.refbranch) {
						this.refbranch = true
						this.order = true
					}
					if (response.data._id.upload_file) {
						this.uploadFile = true
						this.transaction.upload_file = response.data._id.upload_file;
					}
					if (response.data._id.upload_certificate) {
						this.fileCertName = true
						this.transaction.uploadedCertificate = response.data._id.upload_certificate;
					}
					this.isProvenance = response.data._id.provenance
					if (response.data._id?.transtype?.inputAsset) {
						this.inputAsset = response.data._id.transtype.inputAsset
					}
					if (response.data._id?.transtype?._id) {
						this.transTypeId = response.data._id.transtype._id;
					}
					if (response.data._id?.inputEprAssets) {
						this.inputAssets = response.data._id.inputEprAssets
					}

					if (response.data._id.status == "New") {
						this.transaction.status = "Open";
					} else {
						this.transaction.status = "Closed";
					}
					this.fields = response.data._id.transtype.fields;
					var transtypes = '';
					if (!response.data._id.transtype.fields) {
						transtypes = '';
					} else {
						transtypes = response.data._id.transtype.fields
					}

					this.generateFieldsForm(response.data._id, transtypes);

					this.searchTransactionForms.patchValue(this.transaction);
					if ((this.transactionDetails?.transactionType.refModule == undefined || this.transactionDetails?.transactionType.refModule == '' || this.transactionDetails?.transactionType.refModule == null) && (this.transactionDetails?.transactionType.refTransType == undefined || this.transactionDetails?.transactionType.refTransType == '' || this.transactionDetails?.transactionType.refTransType == null)) {
						this.orderWithoutReference = true;
					}
					if (!this.orderWithoutReference && (this.transactionDetails?.transactionType.assetType == 'Receive Asset' || this.transactionDetails?.transactionType.assetType == 'Consume Asset')) {
						this.getByRefTransType();
					}
					if (response.data.eprOrderDetails != undefined) {

						for (var i = 0; i < response.data.eprOrderDetails.length; i++) {
							this.lineArr = response.data.eprOrderDetails[i].epr_line_level_fields
							if (response.data?.eprOrderDetails[i]?.accepted_quantity) {
								var accepQuantity = response.data?.eprOrderDetails[i]?.accepted_quantity.toFixed(response.data?.eprOrderDetails[i]?.assetUom_details[0]?.decimal)
							}
							if (response.data?.eprOrderDetails[i]?.rejected_quantity) {
								var rejQuantity = response.data?.eprOrderDetails[i]?.rejected_quantity.toFixed(response.data?.eprOrderDetails[i]?.assetUom_details[0]?.decimal)
							}
							if (response.data?.eprOrderDetails[i]?.order_quantity) {
								var enterQuantity = response.data?.eprOrderDetails[i]?.order_quantity.toFixed(response.data?.eprOrderDetails[i]?.assetUom_details[0]?.decimal)
							}
							const ordData = {
								assetCategoryName: response.data.eprOrderDetails[i]?.assetcat_details[0]?.assetCategory != undefined ? response.data.eprOrderDetails[i].assetcat_details[0].assetCategory : "",
								assetName: response.data.eprOrderDetails[i].order_item,
								enteredquantity: enterQuantity,
								entereduom: response.data.eprOrderDetails[i].order_uom,
								assetId: response.data.eprOrderDetails[i].ordered_assetId != undefined ? response.data.eprOrderDetails[i].ordered_assetId : "",
								entity_asset: response.data.eprOrderDetails[i].entity_asset != undefined ? response.data.eprOrderDetails[i].entity_asset : "",
								orderId: response.data.eprOrderDetails[i].ref_order != undefined ? response.data.eprOrderDetails[i].ref_order : "",
								lineNo: i + 1,
								refOrderTransactionid: response.data.eprOrderDetails[i].refOrderTransactionid != undefined ? response.data.eprOrderDetails[i].refOrderTransactionid : "",
								acceptedQuantity: accepQuantity,
								rejectedQuantity: rejQuantity,
								comment: response.data.eprOrderDetails[i].rejection_note != undefined ? response.data.eprOrderDetails[i].rejection_note : "",
							}

							const OrderDetailData = this.lineArr
							var merged = Object.assign(ordData, OrderDetailData);
							this.orderDetailsDatas[i] = merged;

						}
						if (this.lineArr != undefined) {
							const keysValue = Object.keys(this.lineArr);
							for (var i = 0; i < keysValue.length; i++) {
								this.displayedColumnsArr[keysValue[i]] = keysValue[i];
							}
						}

						if (this.transactionDetails?.transactionType.fromToEntity == "reference" && (this.transactionDetails?.transactionType.assetType == 'Consume Asset' || this.transactionDetails?.transactionType.assetType == 'Receive Asset')) {
							if (this.transactionDetails?.transactionType.assetType == 'Receive Asset') {
								this.displayedColumnsArr.orderId = "Ship Order";
								if (this.refAssetCheckFlag == true) {
									this.displayedColumns = ['assetCategoryName', 'orderId', 'lineNo', 'assetId', 'assetName', 'enteredquantity', 'entereduom', 'acceptedQuantity', 'rejectedQuantity', 'comment'];
								} else {
									this.displayedColumns = ['assetCategoryName', 'orderId', 'lineNo', 'assetId', 'assetName', 'enteredquantity', 'entereduom', 'acceptedQuantity', 'rejectedQuantity', 'comment'];
								}
								if (this.lineArr != undefined) {
									const keysValue = Object.keys(this.lineArr);
									this.displayedColumns = this.displayedColumns.concat(keysValue);
								}
							} else {
								if (this.transactionDetails?.transactionType.fromToEntity == "reference" && this.transactionDetails?.transactionType.assetType == 'Consume Asset') {
									this.displayedColumnsArr.orderId = "Sales Order";
									if (this.assetWithoutReference) {
										this.displayedColumns = ['assetCategoryName', 'orderId', 'lineNo', 'assetName', 'enteredquantity', 'entereduom'];
									} else {
										this.displayedColumns = ['assetCategoryName', 'orderId', 'lineNo', 'assetId', 'assetName', 'enteredquantity', 'entereduom'];
									}
								} else {
									this.displayedColumnsArr.orderId = "Purchase Order";
									this.displayedColumns = ['lineNo', 'orderId', 'assetId', 'assetName', 'enteredquantity', 'entereduom'];
								}

								if (this.lineArr != undefined) {
									const keysValue = Object.keys(this.lineArr);
									this.displayedColumns = this.displayedColumns.concat(keysValue);
								}
							}
						} else {
							this.displayedColumns = ['lineNo', 'assetCategoryName', 'assetName', 'enteredquantity', 'entereduom'];
							var lineLevelisArray = Array.isArray(this.lineArr)
							if (this.lineArr != undefined && lineLevelisArray == false) {
								const keysValue = Object.keys(this.lineArr);
								this.displayedColumns = this.displayedColumns.concat(keysValue);
							}
						}
						this.collength = this.displayedColumns.length
						for (var i = 0; i < response.data.eprOrderDetails.length; i++) {
							this.lineArr = response.data.eprOrderDetails[i].epr_line_level_fields
							if (response.data?.eprOrderDetails[i]?.accepted_quantity) {
								var accepQuantity = response.data?.eprOrderDetails[i]?.accepted_quantity.toFixed(response.data?.eprOrderDetails[i]?.assetUom_details[0]?.decimal)
							}
							if (response.data?.eprOrderDetails[i]?.rejected_quantity) {
								var rejQuantity = response.data?.eprOrderDetails[i]?.rejected_quantity.toFixed(response.data?.eprOrderDetails[i]?.assetUom_details[0]?.decimal)
							}
							if (response.data?.eprOrderDetails[i]?.epr_order_quantity) {
								var enterQuantity = response.data?.eprOrderDetails[i]?.epr_order_quantity.toFixed(response.data?.eprOrderDetails[i]?.assetUom_details[0]?.decimal)
							}
							const ordData = {
								assetCategoryName: response.data.eprOrderDetails[i]?.assetcat_details[0]?.assetCategory != undefined ? response.data.eprOrderDetails[i].assetcat_details[0].assetCategory : "",
								assetName: response.data.eprOrderDetails[i].epr_order_item,
								enteredquantity: enterQuantity,
								entereduom: response.data.eprOrderDetails[i].epr_order_uom,
								assetId: response.data.eprOrderDetails[i].epr_ordered_assetId != undefined ? response.data.eprOrderDetails[i].epr_ordered_assetId : "",
								entity_asset: response.data.eprOrderDetails[i].epr_entity_asset != undefined ? response.data.eprOrderDetails[i].epr_entity_asset : "",
								orderId: response.data.eprOrderDetails[i].epr_ref_order != undefined ? response.data.eprOrderDetails[i].epr_ref_order : "",
								lineNo: i + 1,
								refOrderTransactionid: response.data.eprOrderDetails[i].epr_ref_order_transactionid != undefined ? response.data.eprOrderDetails[i].epr_ref_order_transactionid : "",
								acceptedQuantity: accepQuantity,
								rejectedQuantity: rejQuantity,
								comment: response.data.eprOrderDetails[i].epr_rejection_note != undefined ? response.data.eprOrderDetails[i].epr_rejection_note : "",
							}

							const OrderDetailData = this.lineArr
							var arrMerged = Object.assign(ordData, OrderDetailData);
							this.orderDetailsDatas[i] = arrMerged;
							if (this.lineArr) {
								const keysValue = Object.keys(this.lineArr);
								const valueObj = Object.values(this.lineArr);

								for (var j = 0; j < this.collength; j++) {
									for (var k = 0; k < keysValue.length; k++) {
										this.lineArr[keysValue[k]] = valueObj[k];
										const exte = valueObj[k].toString().split('.').pop();
										if (exte == 'pdf' || exte == 'PDF' || exte == 'PNG' || exte == 'png' || exte == 'JPG'
											|| exte == 'jpg' || exte == 'JPEG' || exte == 'jpeg' || exte == 'jfif' || exte == 'GIF' || exte == 'gif') {
											this.previewViewSrc[keysValue[k] + "_view" + (this.orderDetailsDatas[i].lineNo - 1) + "_" + j] = this.lineArr[keysValue[k]]
										}
									}
								}
							}
							var mergeded = Object.assign(ordData, this.previewViewSrc);
							this.orderDetailsData[i] = mergeded;
						}
						this.dataSource = this.orderDetailsData;
					}
				}
			}))
		} else if (this.transactionDetails?.transactionType.transaction == "Asset" && this.transactionDetails?.transactionType.transRole == 'Digital' || this.transactionType == "Asset" && this.transactionDetails?.transactionType.transRole == 'Digital') {
			this.eprAsseturl = "/eprAsset/" + this.transactionId
			this.subscriptions.push(this.apiService.getAsset(this.eprAsseturl, params).subscribe((response: any) => {
				if (response.success == true) {
					this.transaction = response.data._id;
					if (response.data._id?.transactionEntityType == "Partner") {
						this.transaction.organizationName = response.data._id?.transactionEntityDetails?.companyName
					} else if (response.data._id?.transactionEntityType == "Organization") {
						this.transaction.organizationName = response.data._id?.transactionEntityDetails?.name
					}
					this.transaction.organizationId = response.data._id.transactionEntity
					this.transaction.moduleName = response.data._id.modules.name;
					this.transaction.moduleId = response.data._id.moduleCode;
					if (response.data._id?.eprAssetCategory) {
						this.assetCategory = true
						this.transaction.assetCategory = response.data._id.eprAssetCategory?.assetCategory;
					}
					if (this.branchName) {
						this.transaction.branchName = this.branchName
					} else if (response.data._id.branch) {
						this.transaction.branchName = response.data._id.branch?.name
					}
					this.transaction.transactionTypeName = response.data._id?.transtype?.transactionTypeName;
					this.transaction.transtypeCode = response.data._id.transtypeCode;
					if (response.data._id.eprAssetId) {
						this.asset = true
						this.transaction.assetId = response.data._id.eprAssetId;
					}
					if (response.data._id.eprOrderId) {
						this.order = true
						this.transaction.assetOrderId = response.data._id.eprOrderId;
					}
					this.transaction.expiryPeriod = response.data._id.expiryPeriod;
					this.transaction.updatedAt = response.data._id.updatedAt;
					this.transaction.period = response.data._id.period;
					this.transaction.assetUom = response.data._id.eprAssetUom;
					this.transaction.assetName = response.data._id.eprAssetName;
					this.transaction.transactionid = response.data._id.eprTransactionid;
					if (response.data._id.transactionEntity !== response.data._id.refEntity) {
						this.partnerId = true
						this.transaction.partnerId = response.data._id.refEntity;
						if (response.data._id.organizationName !== response.data._id.partnerName) {
							this.partnerName = true
							if (response.data._id?.refEntityDetails?.name) {
								this.transaction.partnerName = response.data._id?.refEntityDetails?.name
							} else {
								this.transaction.partnerName = response.data._id?.refEntityDetails?.companyName
							}
						}
					}
					this.transaction.transcationDateTime = this.datetimeConvertor.convertDateTimeZone(response.data._id.created_on, "datetime");

					if (response.data._id.effectiveDate && response.data._id.effectiveDate != 'Invalid Date') {
						this.effectiveDateFlag = true
						this.transaction.effectiveDate = this.datetimeConvertor.convertDateTimeZone(response.data._id.effectiveDate, "date");
					}

					if (response.data._id.expiryDate && response.data._id.expiryDate != 'Invalid Date') {
						this.expiryDateFlag = true
						this.transaction.expiryDate = this.datetimeConvertor.convertDateTimeZone(response.data._id.expiryDate, "date");
					}

					if (response.data._id?.location) {
						this.Trxlocation = true
						this.transaction.location = response.data._id.location;
					}
					if (response.data._id?.eprAssetCategory) {
						this.assetCategory = true
						this.transaction.assetCategory = response.data._id.eprAssetCategory?.assetCategory;
					}

					if (response.data._id.upload_file) {
						this.uploadFile = true
						this.transaction.upload_file = response.data._id.upload_file;
					}
					if (response.data._id.upload_certificate) {
						this.fileCertName = true
						this.transaction.uploadedCertificate = response.data._id.upload_certificate;
					}
					this.isProvenance = response.data._id.provenance

					this.assetType = response.data._id?.transtype?.assetType
					if (response.data?.inputEprAsset) {
						this.inputAsset = response.data?.inputEprAsset
					}
					if (response.data?.inputEprAssets) {
						this.inputAssets = response.data?.inputEprAssets
					}
					this.transTypeId = response.data._id?.transtype?._id;

					if (response.data._id.status == "New") {
						this.transaction.status = "Open";
					} else {
						this.transaction.status = "Closed";
					}

					this.fields = response.data._id?.transtype?.fields;
					var transtypes = '';
					if (!response.data._id?.transtype?.fields) {
						transtypes = '';
					} else {
						transtypes = response.data._id?.transtype?.fields
					}
					this.generateFieldsForm(response.data._id, transtypes);
					if (response.data?.inputEprAssets[0].inputEprAssets_details?.length != 0) {
						const keysValue = Object.keys(response.data.inputEprAssets);
						for (var i = 0; i < keysValue.length; i++) {
							this.displayedColumnsArr[keysValue[i]] = keysValue[i];
						}
						this.displayedColumns = Object.keys(response.data.inputEprAssets);
						if (this.sessionTransType == "Purchase" || this.sessionTransType == "Sales") {
							this.displayedColumns = ['assetName', 'enteredquantity', 'entereduom', 'month', 'year'];
						} else if (this.transactionDetails?.transactionType.fromToEntity == "reference" && (this.transactionDetails?.transactionType.assetType == 'Consume Asset' || this.transactionDetails?.transactionType.assetType == 'Receive Asset')) {
							if (this.transactionDetails?.transactionType.assetType == 'Receive Asset') {
								this.displayedColumns = ['orderId', 'lineNo', 'assetId', 'assetName', 'enteredquantity', 'entereduom', 'acceptedQuantity', 'rejectedQuantity', 'comment', 'month', 'year'];
							} else {
								this.displayedColumns = ['orderId', 'lineNo', 'assetId', 'assetName', 'enteredquantity', 'entereduom', 'month', 'year'];
							}
						} else {
							this.displayedColumns = ['assetName', 'assetCategoryName', 'enteredquantity', 'entereduom', 'month', 'year'];
						}

						for (var i = 0; i < response.data.inputEprAssets.length; i++) {
							if (response.data?.inputEprAssets[i]?.accepted_quantity) {
								var accepQuantity = response.data?.inputEprAssets[i]?.accepted_quantity.toFixed(response.data?.inputEprAssets[i]?.assetUom_details[0]?.decimal)
							}
							if (response.data?.inputEprAssets[i]?.rejected_quantity) {
								var rejQuantity = response.data?.inputEprAssets[i]?.rejected_quantity.toFixed(response.data?.inputEprAssets[i]?.assetUom_details[0]?.decimal)
							}
							if (response.data?.inputEprAssets[i]?.inputEprAssetQuantity) {
								var enterQuantity = response.data?.inputEprAssets[i]?.inputEprAssetQuantity.toFixed(response.data?.inputEprAssets[i]?.assetUom_details[0]?.decimal)
							}
							const ordData = {
								assetName: response.data?.inputEprAssets[i]?.inputEprAssets_details[0]?.assetName,
								year: this.datepipe.transform(response.data?.inputEprAssets[i]?.inputEprAssets_details[0]?.created_on, 'yyyy'),
								month: this.datepipe.transform(response.data?.inputEprAssets[i]?.inputEprAssets_details[0]?.created_on, 'MMMM'),
								assetCategoryName: response.data?.inputEprAssets[i]?.inputEprAssets_details[0]?.assetCategoryDetails[0]?.assetCategory,
								enteredquantity: enterQuantity,
								entereduom: response.data.inputEprAssets[i].inputEprAssetUom,
								assetId: response.data.inputEprAssets[i].inputEprAssetId != undefined ? response.data.inputEprAssets[i].inputEprAssetId : "",
								entity_asset: response.data.inputEprAssets[i].entity_epr_asset != undefined ? response.data.inputEprAssets[i].entity_epr_asset : "",
								orderId: response.data.inputEprAssets[i].eprRefOrder != undefined ? response.data.inputEprAssets[i].eprRefOrder : "",
								lineNo: i + 1,
								refOrderTransactionid: response.data.inputEprAssets[i].refOrderTransactionid != undefined ? response.data.inputEprAssets[i].refOrderTransactionid : "",
								acceptedQuantity: accepQuantity,
								rejectedQuantity: rejQuantity,
								comment: response.data.inputEprAssets[i].rejection_note != undefined ? response.data.inputEprAssets[i].rejection_note : ""

							}
							this.orderDetailsData[i] = ordData;
						}
						this.dataSource = this.orderDetailsData;
					}
					this.searchTransactionForms.patchValue(this.transaction);
				}
			}))
		} else {
			this.orderurl = "/order/" + this.transactionId;
			this.subscriptions.push(this.apiService.getAsset(this.orderurl, params)
				.subscribe((response: any) => {
					if (response.success == true) {
						this.transaction = response.data._id;
						if (response.data._id?.transactionEntityType == "Partner") {
							this.transaction.organizationName = response.data._id?.transactionEntityDetails?.companyName
						} else if (response.data._id?.transactionEntityType == "Organization") {
							this.transaction.organizationName = response.data._id?.transactionEntityDetails?.name
						}
						this.transaction.organizationId = response.data._id.transactionEntity
						this.transaction.moduleName = response.data._id.modules.name;
						this.transaction.moduleId = response.data._id.moduleCode;

						if (response.data._id.branch) {
							this.transaction.branchName = response.data._id.branch?.branch_location
						} else if (response.data._id?.transactionEntityDetails) {
							this.transaction.branchName = response.data._id?.transactionEntityDetails?.location
						} else {
							this.transaction.branchName = this.branchName
						}
						this.transaction.transactionTypeName = response.data._id?.transtype?.transactionTypeName;
						this.transaction.transtypeCode = response.data._id?.transtypeCode;
						if (response.data._id.assetId) {
							this.asset = true
							this.transaction.assetId = response.data._id.assetId;
						}
						if (response.data._id.orderId) {
							this.order = true
							this.transaction.assetOrderId = response.data._id.orderId;
						}
						this.transaction.expiryPeriod = response.data._id.expiryPeriod;
						this.transaction.updatedAt = response.data._id.updatedAt;
						this.transaction.period = response.data._id.period;
						this.transaction.assetQuantity = response.data._id?.assets?.assetQuantity.toFixed(response.data._id?.uom?.decimal);
						this.transaction.assetUom = response.data._id?.assets?.assetUom;
						this.transaction.assetName = response.data._id?.assets?.assetName;
						this.transaction.transactionid = response.data._id.transactionid;
						if (response.data._id.transactionEntity !== response.data._id.refEntity) {
							this.partnerId = true
							this.transaction.partnerId = response.data._id.refEntity;
							if (response.data._id.organizationName !== response.data._id.partnerName) {
								this.partnerName = true
								if (response.data._id?.refEntityDetails?.name) {
									this.transaction.partnerName = response.data._id?.refEntityDetails?.name
								} else {
									this.transaction.partnerName = response.data._id?.refEntityDetails?.companyName
								}
							}
						}

						if (response.data._id?.refbranch?.name) {
							this.transaction.refbranchName = response.data._id?.refbranch?.name
						}
						this.transaction.transcationDateTime = this.datetimeConvertor.convertDateTimeZone(response.data._id.created_on, "datetime");

						if (response.data._id.effectiveDate && response.data._id.effectiveDate != 'Invalid Date') {
							this.transaction.effectiveDate = this.datetimeConvertor.convertDateTimeZone(response.data._id.effectiveDate, "date");
						}

						if (response.data._id.expiryDate && response.data._id.expiryDate != 'Invalid Date') {
							this.transaction.expiryDate = this.datetimeConvertor.convertDateTimeZone(response.data._id.expiryDate, "date");
						}

						if (response.data._id?.location) {
							this.Trxlocation = true
							this.transaction.location = response.data._id.location;
						}

						if (response.data._id?.refbranch) {
							this.refbranch = true
							this.order = true
						}
						if (response.data._id.upload_file) {
							this.uploadFile = true
							this.transaction.upload_file = response.data._id.upload_file;
						}
						if (response.data._id.upload_certificate) {
							this.fileCertName = true
							this.transaction.uploadedCertificate = response.data._id.upload_certificate;
						}
						this.isProvenance = response.data._id.provenance
						if (response.data._id?.transtype?.inputAsset) {
							this.inputAsset = response.data._id.transtype.inputAsset
						}
						if (response.data._id?.transtype?._id) {
							this.transTypeId = response.data._id.transtype._id;
						}
						if (response.data._id?.inputAssets) {
							this.inputAssets = response.data._id.inputAssets
						}

						if (response.data._id.status == "New") {
							this.transaction.status = "Open";
						} else {
							this.transaction.status = "Closed";
						}
						this.fields = response.data._id.transtype.fields;
						var transtypes = '';
						if (!response.data._id.transtype.fields) {
							transtypes = '';
						} else {
							transtypes = response.data._id.transtype.fields
						}

						this.generateFieldsForm(response.data._id, transtypes);

						this.searchTransactionForms.patchValue(this.transaction);
						if ((this.transactionDetails?.transactionType.refModule == undefined || this.transactionDetails?.transactionType.refModule == '' || this.transactionDetails?.transactionType.refModule == null) && (this.transactionDetails?.transactionType.refTransType == undefined || this.transactionDetails?.transactionType.refTransType == '' || this.transactionDetails?.transactionType.refTransType == null)) {
							this.orderWithoutReference = true;
						}
						if (!this.orderWithoutReference && (this.transactionDetails?.transactionType.assetType == 'Receive Asset' || this.transactionDetails?.transactionType.assetType == 'Consume Asset')) {
							this.getByRefTransType();
						}
						if (response.data.orderDetails != undefined) {
							for (var i = 0; i < response.data.orderDetails.length; i++) {
								this.lineArr = response.data.orderDetails[i].line_level_fields
								if (response.data?.orderDetails[i]?.accepted_quantity) {
									var accepQuantity = response.data?.orderDetails[i]?.accepted_quantity.toFixed(response.data?.orderDetails[i]?.assetUom_details[0]?.decimal)
								}
								if (response.data?.orderDetails[i]?.rejected_quantity) {
									var rejQuantity = response.data?.orderDetails[i]?.rejected_quantity.toFixed(response.data?.orderDetails[i]?.assetUom_details[0]?.decimal)
								}
								if (response.data?.orderDetails[i]?.order_quantity) {
									var enterQuantity = response.data?.orderDetails[i]?.order_quantity.toFixed(response.data?.orderDetails[i]?.assetUom_details[0]?.decimal)
								}
								const ordData = {
									assetCategoryName: response.data.orderDetails[i]?.assetcat_details[0]?.assetCategory != undefined ? response.data.orderDetails[i].assetcat_details[0].assetCategory : "",
									assetName: response.data.orderDetails[i].order_item,
									enteredquantity: enterQuantity,
									entereduom: response.data.orderDetails[i].order_uom,
									assetId: response.data.orderDetails[i].ordered_assetId != undefined ? response.data.orderDetails[i].ordered_assetId : "",
									entity_asset: response.data.orderDetails[i].entity_asset != undefined ? response.data.orderDetails[i].entity_asset : "",
									orderId: response.data.orderDetails[i].ref_order != undefined ? response.data.orderDetails[i].ref_order : "",
									lineNo: response.data.orderDetails[i].line_number != undefined ? response.data.orderDetails[i].line_number : "",
									refOrderTransactionid: response.data.orderDetails[i].refOrderTransactionid != undefined ? response.data.orderDetails[i].refOrderTransactionid : "",
									acceptedQuantity: accepQuantity,
									rejectedQuantity: rejQuantity,
									comment: response.data.orderDetails[i].rejection_note != undefined ? response.data.orderDetails[i].rejection_note : "",
								}
								const OrderDetailData = this.lineArr
								var merged = Object.assign(ordData, OrderDetailData);
								this.orderDetailsDatas[i] = merged;
							}
							if (this.lineArr != undefined) {
								const keysValue = Object.keys(this.lineArr);
								for (var i = 0; i < keysValue.length; i++) {
									this.displayedColumnsArr[keysValue[i]] = keysValue[i];
								}
							}
							if (this.transactionDetails?.transactionType.fromToEntity == "reference" && (this.transactionDetails?.transactionType.assetType == 'Consume Asset' || this.transactionDetails?.transactionType.assetType == 'Receive Asset')) {
								if (this.transactionDetails?.transactionType.assetType == 'Receive Asset') {
									this.displayedColumnsArr.orderId = "Ship Order";
									if (this.refAssetCheckFlag == true) {
										this.displayedColumns = ['assetCategoryName', 'orderId', 'lineNo', 'assetId', 'assetName', 'enteredquantity', 'entereduom', 'acceptedQuantity', 'rejectedQuantity', 'comment'];
									} else {
										this.displayedColumns = ['assetCategoryName', 'orderId', 'lineNo', 'assetId', 'assetName', 'enteredquantity', 'entereduom', 'acceptedQuantity', 'rejectedQuantity', 'comment'];
									}
									if (this.lineArr != undefined) {
										const keysValue = Object.keys(this.lineArr);
										this.displayedColumns = this.displayedColumns.concat(keysValue);
									}
								} else {
									if (this.transactionDetails?.transactionType.fromToEntity == "reference" && this.transactionDetails?.transactionType.assetType == 'Consume Asset') {
										if (this.sessionTransType.refModule != 'SAL') {
											this.displayedColumnsArr.orderId = "Purchase Order";
										} else {
											this.displayedColumnsArr.orderId = "Sales Order";
										}
										if (this.assetWithoutReference) {
											this.displayedColumns = ['assetCategoryName', 'orderId', 'lineNo', 'assetName', 'enteredquantity', 'entereduom'];
										} else {
											this.displayedColumns = ['assetCategoryName', 'orderId', 'lineNo', 'assetId', 'assetName', 'enteredquantity', 'entereduom'];
										}
									} else {
										this.displayedColumnsArr.orderId = "Purchase Order";
										this.displayedColumns = ['lineNo', 'orderId', 'assetId', 'assetName', 'enteredquantity', 'entereduom'];
									}

									if (this.lineArr != undefined) {
										const keysValue = Object.keys(this.lineArr);
										this.displayedColumns = this.displayedColumns.concat(keysValue);
									}
								}
							} else {
								this.displayedColumns = ['lineNo', 'assetCategoryName', 'assetName', 'enteredquantity', 'entereduom'];
								var lineLevelisArray = Array.isArray(this.lineArr)
								if (this.lineArr != undefined && lineLevelisArray == false) {
									const keysValue = Object.keys(this.lineArr);
									this.displayedColumns = this.displayedColumns.concat(keysValue);
								}
							}
							this.collength = this.displayedColumns.length
							for (var i = 0; i < response.data.orderDetails.length; i++) {
								this.lineArr = response.data.orderDetails[i].line_level_fields
								if (response.data?.orderDetails[i]?.accepted_quantity) {
									var accepQuantity = response.data?.orderDetails[i]?.accepted_quantity.toFixed(response.data?.orderDetails[i]?.assetUom_details[0]?.decimal)
								}
								if (response.data?.orderDetails[i]?.rejected_quantity) {
									var rejQuantity = response.data?.orderDetails[i]?.rejected_quantity.toFixed(response.data?.orderDetails[i]?.assetUom_details[0]?.decimal)
								}
								if (response.data?.orderDetails[i]?.order_quantity) {
									var enterQuantity = response.data?.orderDetails[i]?.order_quantity.toFixed(response.data?.orderDetails[i]?.assetUom_details[0]?.decimal)
								}
								const ordData = {
									assetCategoryName: response.data.orderDetails[i]?.assetcat_details[0]?.assetCategory != undefined ? response.data.orderDetails[i].assetcat_details[0].assetCategory : "",
									assetName: response.data.orderDetails[i].order_item,
									enteredquantity: enterQuantity,
									entereduom: response.data.orderDetails[i].order_uom,
									assetId: response.data.orderDetails[i].ordered_assetId != undefined ? response.data.orderDetails[i].ordered_assetId : "",
									entity_asset: response.data.orderDetails[i].entity_asset != undefined ? response.data.orderDetails[i].entity_asset : "",
									orderId: response.data.orderDetails[i].ref_order != undefined ? response.data.orderDetails[i].ref_order : "",
									lineNo: response.data.orderDetails[i].line_number != undefined ? response.data.orderDetails[i].line_number : "",
									refOrderTransactionid: response.data.orderDetails[i].refOrderTransactionid != undefined ? response.data.orderDetails[i].refOrderTransactionid : "",
									acceptedQuantity: accepQuantity,
									rejectedQuantity: rejQuantity,
									comment: response.data.orderDetails[i].rejection_note != undefined ? response.data.orderDetails[i].rejection_note : "",
								}

								const OrderDetailData = this.lineArr
								var merged = Object.assign(ordData, OrderDetailData);
								this.orderDetailsDatas[i] = merged;
								if (this.lineArr) {
									const keysValue = Object.keys(this.lineArr);
									const valueObj = Object.values(this.lineArr);

									for (var j = 0; j < this.collength; j++) {
										for (var k = 0; k < keysValue.length; k++) {
											this.lineArr[keysValue[k]] = valueObj[k];
											const exte = valueObj[k].toString().split('.').pop();
											if (exte == 'pdf' || exte == 'PDF' || exte == 'PNG' || exte == 'png' || exte == 'JPG'
												|| exte == 'jpg' || exte == 'JPEG' || exte == 'jpeg' || exte == 'jfif' || exte == 'GIF' || exte == 'gif') {
												this.previewViewSrc[keysValue[k] + "_view" + (this.orderDetailsDatas[i].lineNo - 1) + "_" + j] = this.lineArr[keysValue[k]]
											}
										}
									}
								}
								var mergeded = Object.assign(ordData, this.previewViewSrc);
								this.orderDetailsData[i] = mergeded;

							}
							this.dataSource = this.orderDetailsData;
						}
					}
				}));
		}
	};

	generateFieldsForm(transaction, transtypes) {
		var formDataObj = {};
		var allKeys = [];
		var allValues = [];
		const obj = {};
		if (transaction.fields != undefined) {
			allKeys = Object.keys(transaction.fields);
			allValues = Object.values(transaction.fields);
		}

		for (var iLoop = 0; iLoop < transtypes?.length; iLoop++) {
			for (var jLoop = 0; jLoop < allKeys?.length; jLoop++) {
				for (var kLoop = 0; kLoop < this.fields?.length; kLoop++) {

					if (transtypes[iLoop][0]?.key == allKeys[jLoop]) {
						if (allKeys[jLoop] == this.fields[kLoop][0]?.key) {
							if (this.fields[kLoop][0]?.is_line_level == true) {
							} else {
								if (this.fields[kLoop][0]?.is_outside_level == true) {
								} else {
									if (allValues[jLoop] != 'undefined' && allValues[jLoop] != '' && this.fields[kLoop][0].value == 'File') {
										this.showImg[kLoop] = true
									} else {
										this.showImg[kLoop] = false
									}
									let formDataKey = this.fields[kLoop][0].key;
									formDataObj[formDataKey] = new FormControl();
									this.transactionidFieldForms = new FormGroup(formDataObj);
									if (allValues[jLoop] != '') {
										this.transactionidFieldForms.controls[this.fields[kLoop][0].key].setValue(allValues[jLoop]);
									} else {
										this.transactionidFieldForms.controls[this.fields[kLoop][0].key].setValue('');
									}

									this.fields[kLoop][0]['fieldValue'] = allValues[jLoop]
									obj[transtypes[iLoop]] = allValues[jLoop];

								}
							}

						}
					}
				}
			}
		}
		this.object = this.fields;
	}

	previewFile() {
		this.myModel.show();
	}
	hide() {
		this.myModel.hide();
	}

	async previewFiles(files, index, flagLevel) {
		this.loaderService.show();
		if (this.deleteDbFlag[index]) {
			this.modaleFlag = false;
			this.indField = "";
			this.myModel.show();
			this.indField = index;
			if (flagLevel) {
				if (files) {

					const splitExt = files.split(";base64")[0];
					const ext = splitExt.split(".")[1];
					if (ext == "pdf") {
						this.isImage = false;
						this.isPdf = true;      // required, going forward
					} else {
						this.isPdf = false;
						this.isImage = true;    // required, going forward
					}
					this.urlSrc[index] = this.resultSrc[index];
				}
			} else {
				const splitExt = files.split(";base64")[0];
				const ext = splitExt.split("/")[1];
				if (ext == "pdf") {
					this.isImage = false;
					this.isPdf = true;      // required, going forward
				} else {
					this.isPdf = false;
					this.isImage = true;    // required, going forward
				}
				this.urlSrc[index] = files;
			}
		} else {
			if (this.fileUploaded[index] != undefined) {
				this.deleteDbFlag[index] = true
				if (this.fileUploaded[index] && this.fileUploaded[index][0]) {
					if (this.fileUploaded[index][0].type == "application/pdf") {
						this.isImage = false;
						this.isPdf = true;      // required, going forward
					}
					else {
						this.isPdf = false;
						this.isImage = true;    // required, going forward
					}
					this.urlSrc[index] = this.resultSrc[index];
				}
			} else {
				this.deleteDbFlag[index] = false;
				this.indField = "";
				this.indField = index;
				if (flagLevel) {
					const exte = files.split('.').pop();
					if (exte == "pdf") {
						this.isImage = false;
						this.isPdf = true;
					}
					else {
						this.isPdf = false;
						this.isImage = true;
					}
					this.dynamicFolderName = "transactions/dynamic-media/"
					const bucketName = environment.Bucket
					const fileName = this.dynamicFolderName + files
					const returnRes = await this.uploadService.fileExist(bucketName, fileName)
					if (returnRes == true) {
						this.modaleFlag = false;
						this.myModel.show();
						this.urlSrc[index] = this.dynamicFolderName + files;
					} else {
						this.snackbarService.openSuccessBar("File not found", "File");
					}
				} else {
					const ext = files.split('.').pop();
					if (ext == "pdf") {
						this.isImage = false;
						this.isPdf = true;
					} else {
						this.isPdf = false;
						this.isImage = true;
					}
					this.dynamicFolderName = "transactions/dynamic-media/"
					const bucketName = environment.Bucket
					const fileName = this.dynamicFolderName + files
					const returnRes = await this.uploadService.fileExist(bucketName, fileName)

					if (returnRes == true) {
						this.modaleFlag = false;
						this.myModel.show();
						this.urlSrc[index] = this.dynamicFolderName + files;
					} else {
						const keyObj = Object.keys(this.dataSource[index].lineList);
						keyObj.map(async (value, ind) => {
							if (this.dataSource[index].lineList[value] == files) {
								this.resultSrc[ind] = this.dataSource[index].srcarr[ind];
								index = ind
							}
						});
						if (this.fileUploadArr[index] != undefined) {
							this.deleteDbFlag[index] = true
							if (this.fileUploadArr[index]) {
								if (this.fileUploadArr[index].type == "application/pdf") {
									this.isImage = false;
									this.isPdf = true;      // required, going forward
								}
								else {
									this.isPdf = false;
									this.isImage = true;    // required, going forward
								}
								this.urlSrc[index] = this.resultSrc[index];
								this.indField = index;
								this.modaleFlag = false;
								this.myModel.show();
							}
						}
					}

				}
			}
		}
		this.loaderService.hide();
	}

	async previewFileStatic(files) {
		this.loaderService.show();
		const ext = files.split('.').pop();
		if (ext == "pdf") {
			this.isImageStatic = false;
			this.isPdfStatic = true;
		} else {
			this.isPdfStatic = false;
			this.isImageStatic = true;
		}
		this.staticFolderName = "transactions/static-media/"
		const bucketName = environment.Bucket
		const fileName = this.staticFolderName + this.transaction.upload_file
		const returnRes = await this.uploadService.fileExist(bucketName, fileName)
		if (returnRes == true) {
			this.modaleFlag = true;
			await this.myModel.show();
			this.urlSrcStatic = await this.staticFolderName + this.transaction.upload_file;
			this.loaderService.hide();
		} else {
			this.snackbarService.openSuccessBar("File not found", "File");
		}

	}

	async previewCertificateFile(files) {
		this.loaderService.show();
		const ext = files.split('.').pop();
		if (ext == "pdf") {
			this.isImageStatic = false;
			this.isPdfStatic = true;
		} else {
			this.isPdfStatic = false;
			this.isImageStatic = true;
		}
		this.staticCertificateFolderName = "transactions/certificates/"
		const bucketName = environment.Bucket
		const fileName = this.staticCertificateFolderName + this.transaction.uploadedCertificate
		const returnRes = await this.uploadService.fileExist(bucketName, fileName)

		if (returnRes == true) {
			this.modaleFlag = true;
			await this.myModel.show();
			this.urlSrcStatic = await this.staticCertificateFolderName + this.transaction.uploadedCertificate;
			this.loaderService.hide();
		} else {
			this.snackbarService.openSuccessBar("File not found", "File");
		}

	}

	openConfirmationPopup(role, status) {
		let data = {
			transaction: this.transaction,
			status: status,
			role: role,
			action: 'cert',
			updatedBy: this.loggedInUser._id
		};
		this.confirmDialogService.open(data);
	}

	setStatusListener() {
		this.dialogChangeEvent = this.confirmDialogService.change.subscribe((data: any) => {
			if (data.doAction === true ) {
				this.changeStatus(data);
			}
		})

	}

	ngAfterViewInit() {
		this.setStatusListener();
	}

	openDialog(status) {
		if (this.role == 'reviewer') {
			this.url = "/transaction/" + this.transactionId + "/reviewer/status";
		} else if (this.role == 'certifier') {
			this.url = "/transaction/" + this.transactionId + "/certifier/status";
		}

		var data = {
			url: this.url,
			status: status,
			message: '',
			transactionId: this.transactionId
		};
		if (status == 'reviewed') {
			data.message = "Confirm Review?";
		} else if (status == 'certified') {
			data.message = "Confirm Certify?";
		} else if (status == 'rejected') {
			data.message = "Confirm Reject?";
		}

		this.confirmDialogService.openDialog(data);
	};

	changeStatus(data) {
		if (data.role == 'reviewer') {
			this.url = "/transaction/" + this.transactionId + "/reviewer/status";
		} else if (data.role == 'certifier') {
			this.url = "/transaction/" + this.transactionId + "/certifier/status";
		}
		var value = 0
		if (this.transaction.organization.expiryType != undefined && this.transaction.organization.isPayModStatus != undefined && this.transaction.organization.isPayModStatus == true) {
			// End - Priyanka Patil (SCI-I832) 05-05-2021
			let validity = this.transaction.organization.expiryType.split(" ")
			let number = parseInt(validity[0])
			let type = validity[1]
			var currentDate = 0
			if (type == 'Year') {
				let date = +new Date(this.transaction.organization.expiryDate).setFullYear(new Date().getFullYear() + (number - 1));
				value = +new Date(date)
				currentDate = new Date().setFullYear(new Date().getFullYear())
			} else {
				let date = +new Date(this.transaction.organization.expiryDate).setMonth(new Date().getMonth() + (number - 1));
				value = +new Date(date)
				currentDate = new Date().setMonth(new Date().getMonth())
			}
			let amount = this.walletBalance - parseInt(this.rateCardDetails.rate)
			if (amount < 0 && data.role == 'certifier') {
				var data1 = {
					reason: "You can not certify this transaction..You have insufficient wallet balance!",
					status: ''
				};
				this.errorDialogService.openDialog(data1);
			} else if (value >= currentDate && data.role == 'certifier') {
				this.data = {
					reason: "Validity is expired."
				}
				this.errorDialogService.openDialog(this.data);
			} else {
				var params = {
					status: data.status,
					transactionId: this.transactionId,
					comment: '',
					updatedBy: data.updatedBy,
					timeZone: this.loggedInUser.timeZone,
					departmentId: this.loggedInUser.reference.departmentId
				};

				if (data.status == 'rejected' && data.comment) {
					params.comment = data.comment;
				}
				this.apiService.put(this.url, params)
					.subscribe((response: any) => {
						if (response.success == true) {
							if (data.role == 'certifier') {
								var updatedObj = {
									transTypeId: this.transTypeId,
									transactionId: this.transactionId,
									organizationId: this.loggedInUser.reference.organizationId
								}
								this.url = "/transaction/updateOrganizationWallet";
								this.apiService.post(this.url, updatedObj)
									.subscribe((response: any) => {

									})
							}
							this.getTransaction();
						}
					});
			}
		}
		else {
			var params = {
				status: data.status,
				transactionId: this.transactionId,
				comment: '',
				updatedBy: data.updatedBy,
				timeZone: this.loggedInUser.timeZone,
				departmentId: this.loggedInUser.reference.departmentId
			};

			if (data.status == 'rejected' && data.comment) {
				params.comment = data.comment;
			}
			this.subscriptions.push(this.apiService.put(this.url, params)
				.subscribe((response: any) => {
					if (response.success == true) {
						if (data.role == 'certifier' && this.transaction.organization.isPayModStatus != undefined && this.transaction.organization.isPayModStatus == true) {
							var updatedObj = {
								transTypeId: this.transTypeId,
								transactionId: this.transactionId,
								organizationId: this.loggedInUser.reference.organizationId
							}
							this.url = "/transaction/updateOrganizationWallet";
							this.apiService.post(this.url, updatedObj)
								.subscribe((response: any) => {
								})
						}
						this.getTransaction();
					}
				}));
		}
	}

	reviewed(status) {
		this.url = "/transaction/" + this.transactionId + "/reviewer/status";
		var data = {
			status: status
		}

		this.subscriptions.push(this.apiService.put(this.url, data)
			.subscribe((response: any) => {
				if (response.success == true) {
					this.getTransaction();
				}
			}))
	}

	certify(status) {
		this.url = "/transaction/" + this.transactionId + "/certifier/status";
		var data = {
			status: status,
			departmentId: this.loggedInUser.reference.departmentId
		}

		this.subscriptions.push(this.apiService.put(this.url, data)
			.subscribe((response: any) => {
				if (response.success == true) {
					this.getTransaction();
				}
			}))
	};

	addComment() {
		this.url = "/transaction/" + this.transactionId + "/comment";
		var data = {
			"text": this.comment
		}

		this.subscriptions.push(this.apiService.post(this.url, data)
			.subscribe((response: any) => {
				if (response.success == true) {
					this.transaction.comments.push(response.data.comment);
				}
			}))
	};

	openDialogPopUp(action, obj) {
		if (action == 'Delete' && this.actionFlag == 'update') {
			if (this.dataSource.length == 1) {
				this.chkAddRecordItems = true
				return false
			} else {
				this.chkAddRecordItems = false
			}
		}
		if (action != 'Delete') {
			obj.lineList = this.lineLevelArr;
		}

		obj.action = action;
		let widthDialog;
		let heightDialog;
		widthDialog = '60%';
		heightDialog = 'auto';
		obj.actionFlag = this.actionFlag;
		const dialogRef = this.dialog.open(PurchaseOrderModalComponent, {
			width: widthDialog,
			height: heightDialog,
			data: obj,
			disableClose: true
		});
		this.subscriptions.push(dialogRef.afterClosed().subscribe(result => {
			if (result.event == 'Update') {
				this.updateRowData(result.data);
			} else if (result.event == 'Delete') {
				this.revokeTransaction(result.data);
			}
		}));
	}

	revokeTransaction(row) {
		let params = {}
		if (this.asset) {
			params = {
				entityAsset: row?.entity_asset,
				transactionid: this.transaction?.transactionid,
				status: 'Revoked'
			};
			this.url = "/asset/revokeAsset";
		} else if (this.order == true) {
			params = {
				orderId: this.transaction?.assetOrderId,
				transactionid: this.transaction?.transactionid,
				status: 'Cancelled',
				orderItems: [
					{
						order_item: row?.assetName,
						line_number: row?.lineNo,
						asset_category: row?.assetCategory,
						order_quantity: row?.enteredquantity
					}
				]
			};

			this.url = "/order/revokeOrder";
		}

		this.getOrderItem(row, "Delete");
	}

	updateRowData(row_obj) {
		this.fileUploadArr = this.fileUploadArr.concat(row_obj.fileNative);
		this.fileUploadNameArr = this.fileUploadNameArr.concat(row_obj.filenameArr);

		let keysValue;
		let valueObj;
		if (row_obj?.lineList) {
			valueObj = Object.values(row_obj?.lineList);
		}

		this.dataSource = this.dataSource.filter((value, key) => {
			if (value?.lineNo == row_obj?.lineNo) {
				value.enteredquantity = row_obj.enteredquantity;
				value.entereduom = row_obj.entereduom;
				if (row_obj.acceptedQuantity) {
					value.acceptedQuantity = row_obj.acceptedQuantity;
				}
				if (row_obj.rejectedQuantity) {
					value.rejectedQuantity = row_obj.rejectedQuantity;
				}
				if (row_obj.comment) {
					value.comment = row_obj.comment;
				}
				if (row_obj.lineList) {
					value.lineList = row_obj.lineList;
				}
				if (row_obj.srcarr) {
					value.srcarr = row_obj.srcarr;
				}
				if (row_obj.fileNative) {
					value.fileNative = row_obj.fileNative;
				}
				let previewArr = []
				keysValue = Object.keys(row_obj?.lineList);
				for (var j = 0; j < this.displayedColumns.length; j++) {
					for (var i = 0; i < keysValue?.length; i++) {
						value[keysValue[i]] = valueObj[i];
						if (value[keysValue[i]] != "" && row_obj.srcarr[i] != undefined && keysValue[i] == this.displayedColumns[j]) {
							previewArr[keysValue[i]] = row_obj.srcarr[i];
							this.previewViewSrc[key] = previewArr;
							value.srcarr[i] = row_obj.srcarr[i];
						} else {
							this.lineLevelArr.map(async (valueLine, indexLine) => {
								if (value[keysValue[i]] != "" && row_obj?.lineList[keysValue[i]] != "" && keysValue[i] == this.displayedColumns[j] && valueLine.value == "File" && valueLine.key == keysValue[i] && key == Math.abs(row_obj?.lineNo - 1)) {
									previewArr[keysValue[i]] = row_obj?.lineList[keysValue[i]];
									this.previewViewSrc[key] = previewArr;
									value.srcarr[i] = row_obj.srcarr[i];
								} else if (this.previewViewSrc[key] != undefined && keysValue[i] == this.displayedColumns[j] && row_obj?.lineList[keysValue[i]] == "") {
									delete this.previewViewSrc[key][keysValue[i]];
								}
							});
						}
					}
				}
			}
			return true;
		});
		this.getOrderItem('', 'Update');
	}

	getOrderItem(rowData, flagAction) {
		let ordData;
		this.dataSource.map(async (value, index) => {
			const tableKeys = Object.keys(value);
			let lineLevelField: any;
			if (value.lineList != undefined) {
				const keysValue = Object.keys(value.lineList);
				lineLevelField = {};
				tableKeys.forEach(async (eleTbl, indexTbl) => {
					keysValue.map(async (ele, index) => {
						if (eleTbl == ele) {
							if (value.lineList[ele] != undefined) {
								lineLevelField[ele] = value.lineList[ele];
							} else {
								lineLevelField[ele] = '';
							}
						}
					});
				});
			} else {
				if (this.lineArr != undefined) {
					const keysValue = Object.keys(this.lineArr);
					lineLevelField = {};
					tableKeys.forEach(async (eleTbl, indexTbl) => {
						keysValue.map(async (ele, index) => {
							if (eleTbl == ele) {
								if (value[eleTbl] != undefined) {
									lineLevelField[ele] = value[eleTbl];
								} else {
									lineLevelField[ele] = '';
								}
							}
						});
					});
				}
			}
			let inputAssData;
			if (this.isProvenance == true) {
				inputAssData = {
					inputAssetId: value.entity_asset,
					inputAssetQuantity: value.enteredquantity,
					inputAssetUom: value.entereduom,
					entity_asset: value.entity_asset,
					line_level_fields: lineLevelField != undefined ? lineLevelField : "",
					id: value.id
				}
				if (flagAction == "Delete" && rowData.id == value.id) {
					inputAssData.inputAssetStatus = 'Revoked';
					this.deleteOrderItem.push(inputAssData)
				} else {
					inputAssData.inputAssetStatus = 'New';
				}
				this.orderItems[index] = inputAssData;
			} else {

				ordData = {
					order_item: value.assetName,
					line_number: value.lineNo != undefined ? value.lineNo : "",
					order_quantity: value.enteredquantity,
					order_uom: value.entereduom,
					ordered_assetId: value.assetId != undefined ? value.assetId : "",
					ref_order: value.ref_order != undefined ? value.ref_order : "",
					ref_order_transactionid: value.refOrderTransactionid != undefined ? value.refOrderTransactionid : "",
					entity_asset: value.entity_asset != undefined ? value.entity_asset : "",
					asset_category: value.assetCategory != undefined ? value.assetCategory : "",
					line_level_fields: lineLevelField != undefined ? lineLevelField : "",
					accepted_quantity: value.acceptedQuantity != undefined ? value.acceptedQuantity : "",
					rejected_quantity: value.rejectedQuantity != undefined ? value.rejectedQuantity : "",
					rejection_note: value.comment != undefined ? value.comment : "",
					id: value.id
				}
				if (flagAction == "Delete" && rowData.id == value.id) {
					ordData.status = 'Cancelled';
					this.deleteOrderItem.push(ordData)
				} else {
					ordData.status = 'New';
				}
				this.orderItems[index] = ordData;
			}

		});
		if (flagAction == "Delete") {
			this.dataSource = this.dataSource.filter((value, key) => {
				return value.id != rowData.id;
			});
		}
	}

	async updateTransaction(data, data1) {
		if (data.invalid) {
			return;
		}
		let orderItemList = []
		if (this.order == true || this.isProvenance == true) {
			this.getOrderItem('', 'Update');
			this.orderItems = this.orderItems.concat(this.deleteOrderItem);
			this.orderItems = this.orderItems.filter((value, index, self) => self.findIndex((m) => m.id === value.id) === index);
			this.orderItems.map(async (value, index) => {
				delete value.id;
				orderItemList.push(value);
			});
		}

		var allKeys = [];
		var allValues = [];
		var fields = {};
		allKeys = Object.keys(JSON.parse(JSON.stringify(data1?.form?.value)));
		allValues = Object.values(JSON.parse(JSON.stringify(data1?.form?.value)));

		for (var iLoop = 0; iLoop < allKeys.length; iLoop++) {
			fields[allKeys[iLoop]] = allValues[iLoop];
		}
		let params;
		if (this.order == true) {
			params = {
				orderId: this.transaction?.assetOrderId,
				transactionid: this.transaction?.transactionid,
				fields: fields,
				orderItems: orderItemList,
			};
			if (data?.form?.value?.location != "") {
				params.location = data?.form?.value?.location
				params.geolocation = this.geolocation
			}
			this.url = "/order/updateOrder";
		} else if (this.asset == true) {
			params = {
				entityAsset: this.transaction?.entityAsset,
				transactionid: this.transaction?.transactionid,
				fields: fields,
				location: data?.form?.value?.location,
				geolocation: this.geolocation,
				assetQuantity: data?.form?.value?.assQuantity,
				assetUom: data?.form?.value?.assUom,
			};
			if (this.isProvenance == true) {
				params.inputAssets = orderItemList
			}
			this.url = "/asset/updateAsset";
		}
		this.uploadFileS3(this.url, params);
	}

	async editTransaction(url, params) {
		this.subscriptions.push(this.apiService.put_transactions(url, params)
			.subscribe((response: any) => {
				if (response.success == true) {
					this.snackbarService.openSuccessBar(response?.data?.message, "Transaction");
					this.router.navigate(['/transactions/transactions?dashboard=1']);
				} else {
					this.snackbarService.openSuccessBar(response?.data?.message, "Transaction");
				}
			},
				(error) => {
					this.snackbarService.openSuccessBar('Not Found.', "");
				}));
	}

	deletePreviewFile(keys, index, flagLevel) {
		this.deleteDbFlag[index] = true;
		this.fileNative.splice(index, 1);
		this.filenameArr.splice(index, 1);
		if (flagLevel) {
			this.transactionidFieldForms.controls[keys].setValue('');
			this.showImg[index] = false
		}
	}

	chooseFile(event, keys, index) {
		this.selectedFiles = event.target.files;
		//const max_size =  10485760 //20971520;    
		const allowed_types = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
		this.imageError[index] = "";

		if (this.selectedFiles[0]?.size > environment.imgSize && this.selectedFiles[0]?.type != 'application/pdf') {
			this.showImg[index] = false;
			this.imageError[index] =
				'Maximum size allowed is 10MB';
			return false;
		}
		if (this.selectedFiles[0]?.size > environment.pdfSize && this.selectedFiles[0]?.type == 'application/pdf') {
			this.showImg[index] = false;
			this.imageError[index] =
				'Maximum size allowed is 2MB';
			return false;
		}
		const fExt = this.selectedFiles[0]?.name.split(".");
		if (!_.includes(allowed_types, this.selectedFiles[0]?.type) || fExt[1] == 'jfif') {
			this.showImg[index] = false;
			this.imageError[index] = 'Only Files are allowed ( JPG | PNG | JPEG | PDF)';
			return false;
		}

		this.fileUploaded[index] = event.target.files;
		const filename = this.uploadService.findFileName(this.selectedFiles[0].name);
		const uploadedFilesType = this.selectedFiles[0].type;
		this.showImg[index] = true;

		if (uploadedFilesType == 'image/jpeg' || uploadedFilesType == 'image/jpg' || uploadedFilesType == 'image/png') {
			this.loaderService.show();
			let image: File = this.selectedFiles.item(0);
			this.subscriptions.push(this.compressImage.compress(image)
				.pipe(take(1))
				.subscribe(compressedImage => {
					var reader = new FileReader();
					reader.readAsDataURL(compressedImage);
					reader.onload = (event: any) => {
						this.resultSrc[index] = event.target.result;
						this.fileNative[index] = compressedImage;
						this.loaderService.hide();
					}
				}))
		} else {
			var reader = new FileReader();
			reader.readAsDataURL(event.target.files[0]);
			reader.onload = (event: any) => {
				this.resultSrc[index] = event.target.result;
				this.fileNative[index] = this.selectedFiles.item(0);
			}
		}
		this.fields[index][0]['fieldValue'] = filename;
		this.filenameArr[index] = filename;
		this.transactionidFieldForms.controls[keys].setValue(filename);
		this.imageArr["filename_" + index] = filename;
	};

	async uploadFileS3(url, params) {
		let fileKeyArr = [];
		if (this.fileNative != undefined) {
			this.fileNative = this.fileNative.filter(function (e) { return e != null; });
			this.filenameArr = this.filenameArr.filter(function (e) { return e != null; });
		}
		if (this.fileUploadArr != undefined) {
			this.fileUploadArr = this.fileUploadArr.filter(function (e) { return e != null; });
			this.fileUploadNameArr = this.fileUploadNameArr.filter(function (e) { return e != null; });
		}
		const concatFileUploadArr = this.fileNative.concat(this.fileUploadArr)
		const concatFileUploadNameArr = this.filenameArr.concat(this.fileUploadNameArr)
		if (concatFileUploadArr != undefined) {
			concatFileUploadArr.forEach((value, ind) => {
				if (value !== undefined) {
					const fileKeyDyn = "transactions/dynamic-media/" + concatFileUploadNameArr[ind];
					fileKeyArr.push(fileKeyDyn);
				}
			});
			if (concatFileUploadArr != undefined) {
				this.loaderService.show();
				await this.uploadService.uploadFileSync(concatFileUploadArr, fileKeyArr)
					.then((dataReturn: any) => {
						if (dataReturn.length > 0) {
						} else {
						}
						this.editTransaction(url, params);
						this.loaderService.hide();
					})
					.catch((error) => {
					});
			}
		}
	}

	getCitySuggestion(searchValue: string): void {
		this.locationbranch = "";
		this.url = environment.bingMapBaseURL + "REST/v1/Autosuggest";
		var params = new HttpParams();
		params = params.append('query', searchValue);
		params = params.append('key', environment.bingMapAPIKey);
		if (searchValue != "") {
			this.subscriptions.push(this.apiService.getExternalURL(this.url, params)
				.subscribe((response: any) => {
					if (response != null) {
						this.locationlist = response.resourceSets[0].resources[0].value;
					}
				}));
		} else {
			this.locationlist = [];
		}
	}

	onSellocation(locationData) {
		let locationArr = (locationData != '') ? locationData.split("|") : [];
		if (locationArr.length) {
			this.addressLine = locationArr[1];
			this.adminDistrict = locationArr[2];
			this.countryRegion = locationArr[3];
			this.locality = locationArr[4];
			this.postalCode = locationArr[5];
			this.locationbranch = locationArr[0];
			this.searchTransactionForms.patchValue({ location: locationArr[0] });
			this.url = environment.bingMapBaseURL + "REST/v1/Locations";
			var params = new HttpParams();
			params = params.append('q', this.locationbranch);
			params = params.append('maxResults', '10');
			params = params.append('key', environment.bingMapAPIKey);
			this.subscriptions.push(this.apiService.getExternalURL(this.url, params)
				.subscribe((response: any) => {
					// to set values to this.geolocation
					this.autolocation = response.resourceSets[0].resources[0].address;
					this.geolocation.address = this.addressLine;
					this.geolocation.formattedAddress = this.locationbranch;
					this.geolocation.city = this.locality;
					this.geolocation.state = this.adminDistrict;
					this.geolocation.postalcode = this.postalCode;
					this.geolocation.latitude = response.resourceSets[0].resources[0].geocodePoints[0].coordinates[0];
					this.geolocation.longitude = response.resourceSets[0].resources[0].geocodePoints[0].coordinates[1];
					this.geolocation.country = this.countryRegion;
				}));
		} else {
		}
	}

	getUom() {
		this.url = "/uom";
		var params = new HttpParams();
		params = params.append('startIndex', "0");
		params = params.append('limit', "2000");
		params = params.append('organizationId', this.transactionDetails?.organizationId);
		this.subscriptions.push(this.apiService.getAsset(this.url, params)
			.subscribe((response: any) => {
				if (response.data && response.data.result) {
					var uomList = [];
					var assetCatArray = response.data.result;
					for (var i = 0; i < assetCatArray.length; i++) {
						uomList.push(assetCatArray[i]);
					}
					this.uomLists = uomList;
				}
			}));
	}
	onChangeUOM(event: any){
		this.uomLists.forEach((value,ind) => { 
		  if(event==value.uom){
			this.uomListUom=value;
		  } 
		}); 
		this.searchTransactionForms.patchValue({assQuantity:''});
		if(this.uomListUom != undefined){
		  this.Quantity_decimal = this.uomListUom.decimal - 1
		}
	  }
	  getDecimal(){
		if(this.transaction.assUom != undefined){
		  this.uomLists.forEach((value,ind) => { 
			if(this.transaction.assUom==value.uom){
			  this.uomListUom=value;
			} 
		  }); 
		  if(this.uomListUom != undefined){
			this.Quantity_decimal = this.uomListUom.decimal
		  }
		}
		let pattern = new RegExp('^$|^[0-9]+(\.[0-9]{0,'+this.Quantity_decimal+'})?$')
		let result = pattern.test(this.entereQuantity);
		if(!result){
			if(this.entereQuantity == null){
				this.entereQuantity = ''
			  }else{
				this.entereQuantity = this.old_entereQuantity;
			  }
		}else{
		  this.old_entereQuantity = this.entereQuantity;
	  
		  if(this.entereQuantity.toString().split('.')[1] != undefined){
			var decimalPlaces = this.entereQuantity.toString().split('.')[1].length;
			var decimals = Number(this.entereQuantity).toFixed(decimalPlaces);
			this.entereQuantity = decimals
		  }else{
			this.entereQuantity = parseFloat(this.old_entereQuantity)
		  }
		}
		this.validateNumber.validateNo(this.entereQuantity);
	  }
	validateNo(e){
		this.validateNumber.validateNo(e);
		var theEvent = e || window.event;

		if (theEvent.type === 'paste') {
			key = e.clipboardData.getData('text/plain');
		} else {
			var key = theEvent.keyCode || theEvent.which;
			key = String.fromCharCode(key);
		}
		var regex = /[0-9]|\./;
		if( !regex.test(key) ) {
		theEvent.returnValue = false;
		if(theEvent.preventDefault) theEvent.preventDefault();
		}
	}
	goBack() {
		if (this.curPage == undefined) {
			this.router.navigate(['/eprDashboard']);
		} else if (this.partnerOrder == true || this.partnerOrder == "true") {
			this.router.navigate(['/transactions/partnersOrder'], { queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage } });
		} else {
			this.router.navigate(['/transactions/transactions?dashboard=1'], { queryParams: { currentPage: this.curPage, recordPerPage: this.orgPerPage } });
		}
	}

	ngOnDestroy() {
		this.dialogChangeEvent.unsubscribe();
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	}
	@ViewChild("autoInputAssetID") autocompleteInputAssetID: MatAutocomplete;
	@ViewChild("autoLocation") autocompleteLocation: MatAutocomplete;
	@ViewChild("autoPurchaseOrder") autocompletePurchaseOrder: MatAutocomplete;
	@ViewChild("autolineNo") autocompletelineNo: MatAutocomplete;
	@ViewChild("id_Container") divs: ElementRef;

	opened_AutoComplete = (elementID) => {
		let inputWidth = this.divs.nativeElement.getBoundingClientRect().width
		setTimeout(() => {
			var screen_width = window.innerWidth;
			if (screen_width < 960) {
				if (elementID == "autoLocation") {
					let panel = this.autocompleteLocation.panel?.nativeElement;
					if (!panel) return
					panel.style.maxWidth = (inputWidth - 50) + "px";
				} else if (elementID == "autoInputAssetID") {
					let panel = this.autocompleteInputAssetID.panel?.nativeElement;
					if (!panel) return
					panel.style.maxWidth = (inputWidth - 50) + "px";
				} else if (elementID == "autoPurchaseOrder") {
					let panel = this.autocompletePurchaseOrder.panel?.nativeElement;
					if (!panel) return
					panel.style.maxWidth = (inputWidth - 50) + "px";
				} else if (elementID == "autolineNo") {
					let panel = this.autocompletelineNo.panel?.nativeElement;
					if (!panel) return
					panel.style.maxWidth = (inputWidth - 50) + "px";
				}
			}
		})
	}
}

const user_data: any[] = [
	{
		date: '1 July, 2019',
		time: '15:00',
		by: 'Sushmita Pundir',
		status: 'Reviewed',
		role: 'Reviewer',
		comment: 'This is first comment'
	}
];
export const DataDynamicTable = [
];