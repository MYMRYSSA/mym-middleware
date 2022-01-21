/** ConsultDebt */
export enum EnumAmountType {
	minimumAmount = 'minimumAmount',
	totalAmount = 'totalAmount',
}
export enum EnumPaymentType {
	'01' = 'EF',
	'02' = 'CJ',
	'03' = 'TC',
	'04' = 'TD',
}
export interface IAmountContentResponse {
	amountType: EnumAmountType;
	amount: string;
}
export interface IDocumentResponse {
	documentId: string;
	expirationDate: string;
	documentReference?: string;
	paymentDetail?: string;
	amounts: IAmountContentResponse[];
}
export interface IBCPConsultDebtResponseDTO {
	rqUUID: string;
	resultCode: string;
	resultDescription: string;
	operationDate: string;
	operationNumberCompany: string;
	customerName: string;
	merchantId?: string;
	documents: IDocumentResponse[];
}

/** Payment */
export interface IBCPPaymentResponseDTO {
	rqUUID: string;
	resultCode: string;
	resultDescription: string;
	operationDate: string;
	operationNumberCompany: string;
	endorsement?: string;
}

/** Annulment */
export interface IBCPAnnulmentResponseDTO {
	rqUUID: string;
	resultCode: string;
	resultDescription: string;
	operationDate: string;
}
