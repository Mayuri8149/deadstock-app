export interface Batch {
	
	organizationId: String;
	organization: {
    code: String
    name: String
	};
	affiliateId: String;
	affiliate: {
    code: String
    name: String
	}
	departmentId: String;
	department: {
		code: String
	},
	transtypeId: String;
	moduleId: String;
	module: {
    code: String
    name: String
	};
	code: String;
    year: String;
	start: String;
    end: String;
	minCredits: Number;
	minCgpa: Number;
	totalCgpa: Number;
	minScore: Number;
	totalScore: Number;
    isActive: Boolean;
    status: String;
    _id: Number;
	transactionTypeName: String;
}