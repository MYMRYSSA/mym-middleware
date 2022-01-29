import { IAnnulmentRequest } from 'src/infraestructure/service-clients/interface/mym.annulment.interface';
import {
	IDebtInquiresRequest,
	IDebtInquiresResponse,
	IDocumentMyMContent,
} from 'src/infraestructure/service-clients/interface/mym.inquire.interface';
import { IPaymentRequest, IPaymentResponse } from 'src/infraestructure/service-clients/interface/mym.payment.interface';
import { responseConstants } from '../../constants/bbva/response-values.constants';
import { OperationContentDTO, TransactionContentDTO } from '../../dto/bbva/bbva.requests.dto';
import {
	IBBVAAnnulmentResponseDTO,
	IBBVAConsultDebtResponseDTO,
	IBBVAPaymentResponseDTO,
	IDocumentContentDTO,
} from '../../dto/bbva/bbva.responses.dto';

export const processDate = (date: string, hour: string): string => {
	const yyyy = date.slice(0, 4);
	const MM = date.slice(4, 6);
	const dd = date.slice(6, 8);
	const hh = hour.slice(0, 2);
	const mm = date.slice(2, 4);
	const ss = date.slice(4, 6);
	return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
};
const getOperationStatus = (response: any, origin = 'OTHERS') => {
	if (response.documents || response.operationNumberCompany || response === 'EXTORNO REALIZADO')
		return responseConstants.SUCCESS;
	if (origin === 'PAYMENT' && response?.message?.[0] === 'NUMERO DE REFERENCIA NO EXISTE')
		return responseConstants.TRANSACTION_INCOMPLETE;
	return responseConstants[response.message || response[0]] || responseConstants.TRANSACTION_INCOMPLETE;
};
const generateDocumentBody = (documentsResponse: IDocumentMyMContent[]): IDocumentContentDTO[] => {
	return documentsResponse.map((document: IDocumentMyMContent): IDocumentContentDTO => {
		return {
			descripcion: document.description,
			fechaEmision: document.issuanceDate,
			fechaVencimiento: document.expirationDate,
			importeDeuda: parseFloat(document.totalAmount),
			importeDeudaMinima: parseFloat(document.minimumAmount),
			numero: document.documentId,
		};
	});
};
const getAgreementCode = (code: number, agreementCodes: string[]) => {
	return agreementCodes[code] || 'PEN';
};

/**Inquiry */
export const generateInquiryRequestMyMAPI = (
	operation: OperationContentDTO,
	numeroReferenciaDeuda: string,
	agreementCodes: any,
): IDebtInquiresRequest => {
	const {
		codigoBanco,
		canalOperacion,
		numeroOperacion,
		codigoOperacion,
		fechaOperacion,
		horaOperacion,
		codigoConvenio,
	} = operation;
	const currencyCode = getAgreementCode(codigoConvenio, agreementCodes);
	return {
		bankCode: `0${codigoBanco.toString()}`,
		channel: canalOperacion,
		requestId: numeroOperacion.toString(),
		currencyCode,
		processId: codigoOperacion.toString(),
		transactionDate: processDate(fechaOperacion, horaOperacion),
		customerIdentificationCode: numeroReferenciaDeuda,
		serviceId: '1001', // TODO validar es opcional
	};
};
export const generatedInquiryResponse = (
	response: IDebtInquiresResponse,
	operacion: any,
	numeroReferenciaDeuda: string,
	errorResponse: { message: string },
) => {
	const operationStatus = getOperationStatus(errorResponse || response);
	const documentsContent = response?.documents?.slice(0, 8) || [];

	const resultBody: IBBVAConsultDebtResponseDTO = {
		ConsultarDeudaResponse: {
			recaudosRs: {
				cabecera: {
					operacion,
				},
				detalle: {
					respuesta: {
						codigo: operationStatus.code,
						descripcion: operationStatus.description,
					},
					transaccion: {
						numeroReferenciaDeuda,
						cantidadDocsDeuda: documentsContent.length,
						nombreCliente: response?.customerName || '',
						numeroOperacionEmpresa: Number(response?.operationId) || 0,
						listaDocumentos: { documento: generateDocumentBody(documentsContent) },
					},
				},
			},
		},
	};
	return resultBody;
};

/**Payment */
export const generatePaymentRequestMyMAPI = (
	operation: OperationContentDTO,
	transaction: TransactionContentDTO,
): IPaymentRequest => {
	const { codigoBanco, canalOperacion, numeroOperacion, codigoOperacion, fechaOperacion, horaOperacion } = operation;
	const transactionDate = processDate(fechaOperacion, horaOperacion);
	return {
		bankCode: `0${codigoBanco.toString()}`,
		currencyCode: transaction.codigoMoneda,
		requestId: numeroOperacion.toString(),
		channel: canalOperacion,
		customerIdentificationCode: transaction.numeroReferenciaDeuda,
		serviceId: '1001', // TODO validar que mandamos
		processId: codigoOperacion.toString(),
		transactionDate,
		paymentType: transaction.formaPago,
		paidDocuments: [
			{
				documentId: transaction.numeroDocumento,
				amounts: [
					{
						amountType: 'totalAmount',
						amount: transaction.importeDeudaPagada.toString(),
					},
				],
			},
		],
		transactionCurrencyCode: transaction.codigoMoneda,
		currencyExchange: 0,
		totalAmount: transaction.importeDeudaPagada,
	};
};

export const generatePaymentResponse = (
	operation: OperationContentDTO,
	responseMyMAPI: IPaymentResponse,
	transaction: TransactionContentDTO,
	errorResponse: { message: string },
): IBBVAPaymentResponseDTO => {
	const operationStatus = getOperationStatus(errorResponse || responseMyMAPI, 'PAYMENT');

	return {
		NotificarPagoResponse: {
			recaudosRs: {
				cabecera: {
					operacion: operation,
				},
				detalle: {
					respuesta: {
						codigo: operationStatus.code,
						descripcion: operationStatus.description,
					},
					transaccion: {
						numeroReferenciaDeuda: transaction.numeroReferenciaDeuda,
						numeroOperacionEmpresa: Number(responseMyMAPI?.operationNumberCompany) || 0,
						datosEmpresa: responseMyMAPI?.clientName || '',
					},
				},
			},
		},
	};
};

/**Annulment */
export const generateAnnulmentRequestMyMAPI = (
	operation: OperationContentDTO,
	transaction: TransactionContentDTO,
): IAnnulmentRequest => {
	const { codigoBanco, canalOperacion, numeroOperacion, fechaOperacion, horaOperacion, codigoOperacion } = operation;
	const transactionDate = processDate(fechaOperacion, horaOperacion);
	return {
		bankCode: `0${codigoBanco.toString()}`,
		currencyCode: transaction.codigoMoneda,
		requestId: numeroOperacion.toString(),
		channel: canalOperacion,
		customerIdentificationCode: transaction.numeroReferenciaDeuda,
		processId: codigoOperacion.toString(),
		transactionDate,
		operationNumberAnnulment: transaction.numeroOperacionOriginal.toString(),
	};
};

export const generateAnnulmentResponse = (
	operation: OperationContentDTO,
	responseMyMAPI: IPaymentResponse,
	transaction: TransactionContentDTO,
	errorResponse: { message: string },
): IBBVAAnnulmentResponseDTO => {
	const operationStatus = getOperationStatus(errorResponse || responseMyMAPI);

	return {
		ExtornarPagoResponse: {
			recaudosRs: {
				cabecera: {
					operacion: operation,
				},
				detalle: {
					respuesta: {
						codigo: operationStatus.code,
						descripcion: operationStatus.description,
					},
					transaction: {
						numeroReferenciaDeuda: transaction.numeroReferenciaDeuda,
						numeroOperacionEmpresa: Number(responseMyMAPI?.operationNumberCompany) || 0,
					},
				},
			},
		},
	};
};
