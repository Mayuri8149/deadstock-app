export interface Verifier {
  organization: {
		name: String
  };
  transtypes: {
		transactionTypeName: String
  };
  transtype: {
		transactionTypeName: String
  };
  module: {
    name: String;
    code: String;
  };
  userName: String;
  companyName: String;
  transactionid: String;
  status: String;
  date: String;
  time: String;
  corporate: String;
  verifierId: String;
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
  partner:{
    firstName: String;
    code: String;
    lastName: String;
  };
  reference: {
		entity: String
  };
  organizationName:String;
  moduleCode: String;
  transactiontypeName:String;
}