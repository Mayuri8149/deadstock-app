export class UploadedTransaction {
	columnName : {
		name:String;
		value: String;
	};
    organization : {
		name: String;
	};
	department : {
		name: String;
	};
	affiliate : {
		name: String;
	};
    batch : {
		year: String;
	};
	module: {
		name: String;
	}
    partnerCode: {
		value: String,
		error: Boolean
	};
    transactionId: String;
    specialization: {
		value: String,
		error: Boolean
	};
    scoreEarned: {
		value: String,
		error: Boolean
	};
	totalScore: {
		value: String,
		error: Boolean
	};
	cgpa: {
		value: String,
		error: Boolean
	};
	creditsEarned: {
		value: String,
		error: Boolean
	};
	completionDate: {
		value: String,
		error: Boolean
	};
    isEditing: Boolean;
    isErrors: Boolean;
	status: String;
	_id: Number;
	index: Number;
	createdBy: {};
	createdAt: Date;
	updatedBy: {};
	updatedAt: Date;
	emailId: {
		value: String
	}
}