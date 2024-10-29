export interface Type {
	data:{
        assets_details:{
            assetId:string,
            assetName:string,
            uom: string,
            balanceQty:string,
        }
    };
    assets_details:{
        assetId:string,
        assetName:string,
        uom: string,
        balanceQty:string,
    }
    produce_quantity:string;
    receive_quantity:string;
    consume_quantity:string;
}
