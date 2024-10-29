export interface OrganizationModule {
    organizationId: string;
    organization: {
        name: String
        code: String
    };
    departmentId: string;
    department: {
        name: String
        code: String
    };
    affiliate: {
        name: String
        code: String
    };
    modules: {
        type: String;
        code: string;
        name: string;
        specialization: string;
        duration: string;
        durationUnit: string;
        termType: string;
        noOfTerms: string;

    };
    type: string;
    code: string;
    name: string;
    specialization: string;
    transactionGenerate: string;
    transactionPrint: string;
    gpaCalculated: string;
    subjectCredits: string;
    duration: string;
    durationUnit: string;
    termType: string;
    noOfTerms: string;
    status: string;
    isActive: Boolean;
    _id: Number;
}