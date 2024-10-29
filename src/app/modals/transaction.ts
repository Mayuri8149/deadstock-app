export interface Transaction {
	imageID: any;
	transactionid: any;
	orderId: any;
	batchId: String;

	transtypes: {
		transactionTypeName: String
	};
	organization: {
		name: String
	};
	department: {
		name: String
	};
	affiliate: {
		name: String
	};
	module: {
		name: String
	};
	batch: {
		code: String
		year: String
	};
	code: String;
	partnerId: String;
	status: String;
	generateType: String;
	partner: {
		firstName: String,
		code: String;
		lastName: String;
	};
	isView: String,
	date: Date;
	createdBy:{
        firstName: String;
		lastName: String;
    };
    createdAt:Date;
    updatedBy:{
        firstName: String;
		lastName: String;
    };
    updatedAt:Date;
}