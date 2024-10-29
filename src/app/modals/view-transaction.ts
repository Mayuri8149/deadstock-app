export interface Type {
    transactionEntity:string,
    branch:string,
    transactionTypeCode: string,
    refEntityName:string,
    assetId:string,
    transactionid:string,
    provenance:string,
    assetLocation:string,
    quantity:string,
    uom:string,
    effectiveDate:string,
    expiryDate:string,
    refAsset:string,
    refOrder:string,
    transcationDateTime:string,
    assetName:string,
    refBranch:string,
    transactionEntityName: String;
    transactionCode: String;
    orderId: String;
    cetTypeData:{
        transactionTypeName:string,
        isAsset:string,
        assetType:string,
        inputAsset:string,
    }
	module:{
        code:string,
        name:string,
    };
}
