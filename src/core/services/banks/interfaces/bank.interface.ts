export interface IBankfactory {
	consultDebt(payloadRequest: any): any;
	payment(payloadRequest: any): any;
	annulmentPayment(payloadRequest: any): any;
}
