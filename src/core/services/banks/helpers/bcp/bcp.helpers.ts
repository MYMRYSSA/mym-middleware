import { IAnnulmentRequest } from 'src/infraestructure/service-clients/interface/mym.annulment.interface';
import {
	IDebtInquiresRequest,
	IDebtInquiresResponse,
	IDocumentMyMContent,
} from 'src/infraestructure/service-clients/interface/mym.inquire.interface';
import {
	IDocumentPaymentMyMContent,
	IPaymentRequest,
	IPaymentResponse,
} from 'src/infraestructure/service-clients/interface/mym.payment.interface';
import { responseConstants } from '../../constants/bcp/response-values.constants';
import { EnumCurrency } from '../../dto/bbva/bbva.requests.dto';
import {
	BCPAnnulmentRequestDTO,
	BCPConsultDebtRequestDTO,
	BCPPaymentRequestDTO,
	DocumentContent,
} from '../../dto/bcp/bcp.requests.dto';
import {
	EnumAmountType,
	EnumPaymentType,
	IBCPAnnulmentResponseDTO,
	IBCPConsultDebtResponseDTO,
	IBCPPaymentResponseDTO,
	IDocumentResponse,
} from '../../dto/bcp/bcp.responses.dto';

const getOperationStatusInquiry = (response: any) => {
	if (response.documents || response.operationNumberCompany || response === 'EXTORNO REALIZADO') return responseConstants.SUCCESS;
	return responseConstants[response.message] || responseConstants.TRANSACTION_INCOMPLETE;
};

const getAgreementCode = (code: string, agreementCodes: string[]) => {
	return agreementCodes[code] || EnumCurrency.PEN;
};

const processTransactionDate = (requestDate: string) => {
	const [date, hour] = requestDate.split('T');
	return `${date} ${hour}`;
};

const processDateDocumentToResponse = (date: string): string => {
	const yyyy = date.slice(0, 4);
	const MM = date.slice(4, 6);
	const dd = date.slice(6, 8);
	return `${yyyy}-${MM}-${dd}`;
};

const processTransactionDateToResponseBank = (requestDate: string) => {
	if (!requestDate) return new Date().toISOString();
	const [date, hour] = requestDate.split(' ');
	return `${date.slice(0, 10)}T${hour}`;
};

const generateDocumentsInquiryBody = (documents: IDocumentMyMContent[]): IDocumentResponse[] => {
	return (
		documents?.map((document: IDocumentMyMContent): IDocumentResponse => {
			return {
				documentId: document.documentId,
				expirationDate: processDateDocumentToResponse(document.expirationDate.toString()),
				paymentDetail: document.description,
				amounts: [
					{
						amountType: EnumAmountType.minimumAmount,
						amount: document.minimumAmount,
					},
					{
						amountType: EnumAmountType.totalAmount,
						amount: document.totalAmount,
					},
				],
			};
		}) || []
	);
};

const generateBodyPaymentRequest = (documents: DocumentContent[]): IDocumentPaymentMyMContent[] => {
	return documents.map((document: DocumentContent): IDocumentPaymentMyMContent => {
		return {
			documentId: document.documentId,
			documentReference: document.documentReference || '',
			amounts: document.amounts,
		};
	});
};

/** inquiry */
export const generateInquiryRequestMyMAPI = (
	payloadRequest: BCPConsultDebtRequestDTO,
	agreementCodes: any,
): IDebtInquiresRequest => {
	const { rqUUID, channel, serviceId, operationDate, customerId, financialEntity, operationNumber } = payloadRequest;
	const transactionDate = processTransactionDate(operationDate);
	const currencyCode = getAgreementCode(serviceId, agreementCodes);

	return {
		bankCode: financialEntity,
		currencyCode,
		requestId: rqUUID,
		channel,
		customerIdentificationCode: customerId,
		serviceId,
		processId: operationNumber,
		transactionDate,
	};
};

export const generatedInquiryResponse = (
	responseMyM: IDebtInquiresResponse,
	payloadRequest: BCPConsultDebtRequestDTO,
	errorResponse: { message: string },
): IBCPConsultDebtResponseDTO => {
	const operationStatus = getOperationStatusInquiry(errorResponse || responseMyM);
	const { rqUUID } = payloadRequest;
	const dateProcessed = processTransactionDateToResponseBank(responseMyM?.transactionDate);
	return {
		rqUUID,
		resultCode: operationStatus.code,
		resultDescription: operationStatus.description,
		operationDate: dateProcessed,
		customerName: responseMyM?.customerName || '',
		operationNumberCompany: responseMyM?.operationId || '',
		documents: generateDocumentsInquiryBody(responseMyM?.documents?.slice(0, 4)),
	};
};

/** payment */
export const generatePaymentRequestMyMAPI = (
	payloadRequest: BCPPaymentRequestDTO,
	agreementCodes: any,
): IPaymentRequest => {
	const {
		financialEntity,
		rqUUID,
		operationDate,
		channel,
		documents,
		customerId,
		paymentType,
		serviceId,
		operationNumber,
		amountTotal,
		check,
	} = payloadRequest;
	const transactionDate = processTransactionDate(operationDate);
	const currencyCode = getAgreementCode(serviceId, agreementCodes);
	const paidDocuments = generateBodyPaymentRequest(documents);

	return {
		bankCode: financialEntity,
		currencyCode,
		requestId: operationNumber,
		channel,
		customerIdentificationCode: customerId,
		serviceId,
		processId: rqUUID,
		operationId: check?.checkNumber,
		transactionDate,
		paymentType: EnumPaymentType[paymentType] || 'EF',
		paidDocuments,
		transactionCurrencyCode: currencyCode,
		currencyExchange: 0,
		totalAmount: Number(amountTotal),
	};
};

export const generatePaymentResponse = (
	responseMyMAPI: IPaymentResponse,
	payloadRequest: BCPPaymentRequestDTO,
	errorResponse: { message: string },
): IBCPPaymentResponseDTO => {
	const operationStatus = getOperationStatusInquiry(errorResponse || responseMyMAPI);
	return {
		rqUUID: payloadRequest.rqUUID,
		operationDate: processTransactionDateToResponseBank(responseMyMAPI?.transactionDate),
		operationNumberCompany: responseMyMAPI?.operationNumberCompany || '',
		resultCode: operationStatus.code,
		resultDescription: operationStatus.description,
		endorsement: responseMyMAPI?.description || '',
	};
};

/**Annulment */
export const generateAnnulmentRequestMyMAPI = (payloadRquest: BCPAnnulmentRequestDTO): IAnnulmentRequest => {
	const { channel, rqUUID, operationDate, financialEntity, customerId, operationNumber, operationNumberAnnulment } =
		payloadRquest;
	const transactionDate = processTransactionDate(operationDate);
	return {
		bankCode: financialEntity,
		channel,
		customerIdentificationCode: customerId,
		operationNumberAnnulment,
		requestId: operationNumber,
		transactionDate,
		processId: rqUUID,
	};
};

export const generateAnnulmentResponse = (
	responseMyMAPI: IPaymentResponse,
	payloadRequest: BCPAnnulmentRequestDTO,
	errorResponse: { message: string },
): IBCPAnnulmentResponseDTO => {
	const operationStatus = getOperationStatusInquiry(errorResponse || responseMyMAPI);
	return {
		rqUUID: payloadRequest.rqUUID,
		operationDate: processTransactionDateToResponseBank(responseMyMAPI?.transactionDate),
		resultCode: operationStatus.code,
		resultDescription: operationStatus.description,
	};
};
