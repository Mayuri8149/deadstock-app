export interface UserModel { 
    reference: {
        role: String,
        entity:String,
        userId:String,
        roleName:String
    };
    organizationId: String;
    departmentId: String;
    affiliateId: String;
    Entity_Name: String;
    Entity_Id: String;
    organization: {
        code: String;
        name: String;
        type: String;
    };
    department: {
        code: String;
        name: String;
    };
    affiliate: {
        code: String;
        name: String;
    };
    firstName: String;
    lastName: String;
    email: String;
    companyName: String;
    phoneNumber: String;
    isActive: String;
    token?: string;
    status: String;
    _id: Number;
    referenceList:[];
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
    refresh_token: String;
    access_token :String;			
    corporate: {
        companyName: String;
        code: String;
    }
}