export interface OrganizationDepts {
    organizationId: String;
    code: String
    name: String;
    isActive: String;
    status: String;
    _id: Number;
    branch_location: string;
    branch_address: string;
    type: String;
    companyName: String;
	createdBy: {
        firstName:String;
        lastName:String;
    };
	createdAt: Date;
	updatedBy: {
    firstName:String;
    lastName:String;
    };
	updatedAt: Date;
    address:String;
    location:String;
    orgDetails:{
        name:String;
        code:String
    }
    Entity_Name: String;
    Entity_Id: String;
}  