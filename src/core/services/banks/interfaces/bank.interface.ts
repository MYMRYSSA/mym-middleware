export interface IBankfactory {
	consultDebt(payloadRequest: any): any;
	payment(payloadRequest: any): any;
	returnPayment(payloadRequest: any): any;
}
