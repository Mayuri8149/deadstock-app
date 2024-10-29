export interface Assetcategories {
	assetCategoryName: String;
    layoutPath: string;
	organization: {
		name: String
	};
    module: {
		name: String;
		code: String;
	};
    transtypes: {
        transactionTypeName: String,
        transactionTypeCode: String
    };
    category: {
		name: string
	};
	subcategory: {
		name: string
	};
}