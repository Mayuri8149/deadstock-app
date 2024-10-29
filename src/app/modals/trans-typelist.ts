export interface Type {
	transactionTypeCode: any;
	organizationId: string;
	departmentId: string;
	moduleId: string;
	assetId: string;
	assetName: string;
	transactionTypeName: string;
	transactionid: string;
	branch: string;
	assetLocation: string;
	balanceQty: string;
	uom: string;
	refAsset: string;
	expiryDate: string;
	mfgDate: string;
	entity: string;
	produced: string;
	received: string;
	consume: string;
	balance: string;
	moduleCode:string;
	moduleName:string;
	organizationName:string;
	label:string;
	corporate: {
		companyName: string,
		code: string
	};
	category: {
		name: string
	};
	subcategory: {
		name: string
	};
	is_deleted: String;
	fields: Object;
	code: string;
	assetType: string,
	transaction: string,
	organization: {
		name: String
		code: String
	};
	department: {
		name: String
	};
	module: {
		name: String;
		code: String;
	};
	result: {
		loginhistory: {
			date: Date;
		}
	};
	ipAddress: string;
	date: Date;
	createdAt:Date;
	additionalDescription:any;
	userCreatedBy:{
		companyName:String,
		companyCode: String
	}
	organizationsCreatedBy:{
		name:String;
		code:String
	}
}
