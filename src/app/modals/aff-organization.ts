export interface AffOrganization {
    organizationId: String;
    department: {
        code: String,
        name: String
    }
    departmentId: String;
    name: String;
    status: String;
    isActive: Boolean;
    address: String;
    code: String;
    _id: Number;
}