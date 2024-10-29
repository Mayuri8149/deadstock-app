export interface UploadedPartner {
	batchId: String;
	batch: {
		code: String 
	};
	module :{
		code: String 
	};
	did :{
		value: String,
	}
    code: {
		value: String,
		error: Boolean
	};
    firstName:{
		value: String,
		error: Boolean
	};
	lastName:{
		value: String,
		error: Boolean
	};
    father: {
		value: String,
		error: Boolean
	};
    dob: {
		value: String,
		error: Boolean
	};
	aadhar: {
		value: String,
		error: Boolean
	};
	email: {
		value: String,
		error: Boolean
	};
	phoneNumber: {
		value: String,
		error: Boolean
	};
	isActive: String;
	isEditing: Boolean;
	date: String;
	status: String;
	isErrors: Boolean;
	_id: Number;
	index: Number;
}