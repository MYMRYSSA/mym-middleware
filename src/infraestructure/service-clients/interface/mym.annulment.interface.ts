export interface IAnnulmentRequest {
	bankCode: string;
	currencyCode?: string;
	requestId: string;
	channel: string;
	customerIdentificationCode: string;
	serviceId?: string;
	processId?: string;
	transactionDate: string;
	operationId?: string;
	operationNumberAnnulment: string;
	returnType?: 'M' | 'A';
}

export interface IPaymentResponse {
	operationNumberCompany: string;
	transactionDate: string;
	clientName: string;
	clientIdentificacion: string;
	description: string;
}
