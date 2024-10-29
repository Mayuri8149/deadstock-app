export interface Partner {
	batchId: String;
	batch: {
		code: String
	}
    code: String;
	firstName: String;
	lastName: String;
    father: String;
    dob: Boolean;
	aadhar: String;
	email: String;
	phoneNumber: String;
	isActive: String;
	isEditing: Boolean;
	status: String;
	date: Date;
	_id: Number;
	index: Number;
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
	comments:{
		text : String
	};
}