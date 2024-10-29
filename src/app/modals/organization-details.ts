export class OrganizationDetails {
    _id: Number;
    isActive: Boolean;
    status: String;
    type: String;
    code: String;
    name: String;
    doe: String;
    address: {
        address_line_1 : String,
        address_line_2 : String,
        state : String,
        city : String
    };
    requester : {
        name : String,
        email : String,
        phoneNumber : String
    };
    head  : {
        name : String,
        email : String,
        phoneNumber : String
    };
    administrator : {
        name : String,
        email : String,
        phoneNumber : String
        landineNumber : String
    };
    location : "Pune";
    website : "www.puneuniversity.com";
    affiliateOrganization : {
        name : String,
        type : String,
        approvedBy : String,
        requlatoryBody : String
    };
}