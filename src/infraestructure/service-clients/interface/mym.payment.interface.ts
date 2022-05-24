export interface IAmountsContent {
	amountType: string;
	amount: string;
}

export interface IDocumentPaymentMyMContent {
	documentId: string;
	expirationDate?: string;
	documentReference?: string;
	amounts: IAmountsContent[];
}

/** Payment interfaces */
export interface IPaymentRequest {
	bankCode: string;
	currencyCode?: string;
	requestId: string;
	channel: string;
	customerIdentificationCode: string;
	serviceId?: string;
	operationNumber?: string;
	operationId?: string;
	processId?: string;
	transactionDate: string;
	paymentType: string;
	paidDocuments: IDocumentPaymentMyMContent[];
	transactionCurrencyCode: string;
	currencyExchange: number;
	totalAmount: number;
	ReturnType?: 'M' | 'A';
}

export interface IPaymentResponse {
	operationNumberCompany: string;
	transactionDate: string;
	clientName: string;
	clientIdentificacion: string;
	description: string;
}
