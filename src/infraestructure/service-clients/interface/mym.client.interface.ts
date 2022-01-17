interface IDocumentMyMContent {
	documentId: string;
	description: string;
	issuanceDate: string;
	expirationDate: string;
	totalAmount: string;
	minimumAmount: string;
}

export interface IDebtInquiresRequest {
	bankCode: string;
	requestId: string;
	currencyCode?: string;
	customerIdentificationCode: string;
	transactionDate: string;
	channel: string;
	serviceId?: string;
	processId?: string;
}

export interface IDebtInquiresResponse {
	operationId: string;
	customerIdentificationCode: string;
	customerName: string;
	currencyCode?: string;
	transactionDate: Date;
	cronologicIndicator: number;
	statusIndicator: number;
	paymentRestriction?: string;
	documents: IDocumentMyMContent[];
}
