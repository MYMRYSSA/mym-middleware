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
	if (response.documents) return responseConstants.SUCCESS;
	if (response.message === 'CLIENTE SIN DEUDAS') return responseConstants.NOT_INQUIRE;
	return responseConstants.TRANSACTION_INCOMPLETE;
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
			documentReference: document.documentReference || '', // TODO al consultar la deuda no lo enviamos
			expirationDate: document.expirationDate,
			amounts: document.amounts,
		};
	});
};

/** inquiry */
export const generateInquiryRequestMyMAPI = (payloadRequest: BCPConsultDebtRequestDTO): IDebtInquiresRequest => {
	const { rqUUID, channel, serviceId, operationDate, customerId, financialEntity, operationNumber } = payloadRequest;
	const transactionDate = processTransactionDate(operationDate);
	return {
		processId: operationNumber,
		requestId: rqUUID,
		bankCode: financialEntity,
		channel,
		customerIdentificationCode: customerId,
		transactionDate,
		serviceId,
		currencyCode: EnumCurrency.USD, // TODO validar que mandamos
	};
};

export const generatedInquiryResponse = (
	responseMyM: IDebtInquiresResponse,
	payloadRequest: BCPConsultDebtRequestDTO,
): IBCPConsultDebtResponseDTO => {
	const operationStatus = getOperationStatusInquiry(responseMyM);
	const { rqUUID } = payloadRequest;
	const dateProcessed = processTransactionDateToResponseBank(responseMyM?.transactionDate); // TODO la fecha llega con ese - suelto al final
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
export const generatePaymentRequestMyMAPI = (payloadRequest: BCPPaymentRequestDTO): IPaymentRequest => {
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
	} = payloadRequest;
	const transactionDate = processTransactionDate(operationDate);
	const paidDocuments = generateBodyPaymentRequest(documents);

	return {
		bankCode: financialEntity,
		currencyCode: EnumCurrency.USD, // TODO consultar
		requestId: rqUUID,
		channel,
		customerIdentificationCode: customerId,
		serviceId,
		processId: operationNumber,
		transactionDate,
		paymentType: EnumPaymentType[paymentType],
		paidDocuments,
		transactionCurrencyCode: EnumCurrency.USD,
		currencyExchange: 0,
		totalAmount: Number(amountTotal),
	};
};

export const generatePaymentResponse = (
	responseMyMAPI: IPaymentResponse,
	payloadRequest: BCPPaymentRequestDTO,
): IBCPPaymentResponseDTO => {
	const operationStatus = getOperationStatusInquiry(responseMyMAPI);
	return {
		rqUUID: payloadRequest.rqUUID,
		operationDate: processTransactionDateToResponseBank(responseMyMAPI.transactionDate),
		operationNumberCompany: responseMyMAPI.operationNumberCompany,
		resultCode: operationStatus.code,
		resultDescription: operationStatus.description,
		endorsement: responseMyMAPI.description,
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
		requestId: rqUUID,
		transactionDate,
		currencyCode: '', // TODO validar que se envia
		operationId: '', // TODO validar
		processId: operationNumber,
		serviceId: '', // TODO validar que s env[ia]
	};
};

export const generateAnnulmentResponse = (
	responseMyMAPI: IPaymentResponse,
	payloadRequest: BCPAnnulmentRequestDTO,
): IBCPAnnulmentResponseDTO => {
	const operationStatus = getOperationStatusInquiry(responseMyMAPI);
	return {
		rqUUID: payloadRequest.rqUUID,
		operationDate: processTransactionDateToResponseBank(responseMyMAPI.transactionDate),
		resultCode: operationStatus.code,
		resultDescription: operationStatus.description,
	};
};
