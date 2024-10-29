export interface inviteModel {
	email:  String
    status: String;
	entityId: string;
	entity: string;
	entityName: string;
	user: {
		firstName: string,
		lastName: string,
		phoneNumber: string
	}
}