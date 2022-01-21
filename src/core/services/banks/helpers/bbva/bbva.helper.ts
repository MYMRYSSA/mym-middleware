import { IAnnulmentRequest } from 'src/infraestructure/service-clients/interface/mym.annulment.interface';
import {
	IDebtInquiresRequest,
	IDebtInquiresResponse,
	IDocumentMyMContent,
} from 'src/infraestructure/service-clients/interface/mym.inquire.interface';
import { IPaymentRequest, IPaymentResponse } from 'src/infraestructure/service-clients/interface/mym.payment.interface';
import { responseConstants } from '../../constants/bbva/response-values.constants';
import { EnumCurrency, OperationContentDTO, TransactionContentDTO } from '../../dto/bbva/bbva.requests.dto';
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
const getOperationStatusInquiry = (response: any) => {
	if (response.documents) return responseConstants.SUCCESS;
	if (response.message === 'CLIENTE SIN DEUDAS') return responseConstants.NOT_INQUIRE;
	return responseConstants.REFERENCE_NOT_EXIST;
};

const getOperationStatusPayment = (response: any) => {
	if (response.documents) return responseConstants.SUCCESS;
	if (response.message === 'CLIENTE SIN DEUDAS') return responseConstants.NOT_INQUIRE;
	return responseConstants.REFERENCE_NOT_EXIST;
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

/**Inquiry */
export const generateInquiryRequestMyMAPI = (
	operation: OperationContentDTO,
	numeroReferenciaDeuda: string,
): IDebtInquiresRequest => {
	const { codigoBanco, canalOperacion, numeroOperacion, codigoOperacion, fechaOperacion, horaOperacion } = operation;
	return {
		bankCode: codigoBanco.toString(),
		channel: canalOperacion,
		requestId: numeroOperacion.toString(),
		currencyCode: EnumCurrency.USD, // TODO validar que mandamos
		processId: codigoOperacion.toString(),
		transactionDate: processDate(fechaOperacion, horaOperacion),
		customerIdentificationCode: numeroReferenciaDeuda,
		serviceId: '000',
	};
};
export const generatedInquiryResponse = (
	response: IDebtInquiresResponse,
	operacion: any,
	numeroReferenciaDeuda: string,
) => {
	const operationStatus = getOperationStatusInquiry(response);
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
						nombreCliente: response.customerName || '',
						numeroOperacionEmpresa: response.operationId || '',
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
	const transactionDate = processDate(fechaOperacion, horaOperacion)?.slice(0, 10);
	return {
		bankCode: codigoBanco.toString(),
		currencyCode: transaction.codigoMoneda,
		requestId: numeroOperacion.toString(),
		channel: canalOperacion,
		customerIdentificationCode: transaction.numeroReferenciaDeuda,
		serviceId: '000', // TODO validar que mandamos
		operationId: '000', // TODO validar que mandamos
		processId: codigoOperacion.toString(),
		transactionDate,
		paymentType: transaction.formaPago,
		paidDocuments: [
			{
				documentId: transaction.numeroDocumento,
				expirationDate: transactionDate, // TODO validar que mandamos
				documentReference: '', // TODO validar que mandamos
				amounts: [
					{
						amount: transaction.importeDeudaPagada.toString(),
						amountType: 'totalAmont',
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
): IBBVAPaymentResponseDTO => {
	const operationStatus = getOperationStatusPayment(responseMyMAPI);

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
						numeroOperacionEmpresa: responseMyMAPI?.operationNumberCompany || '',
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
	const transactionDate = processDate(fechaOperacion, horaOperacion)?.slice(0, 10);
	return {
		bankCode: codigoBanco.toString(),
		currencyCode: transaction.codigoMoneda,
		requestId: numeroOperacion.toString(),
		channel: canalOperacion,
		customerIdentificationCode: transaction.numeroReferenciaDeuda,
		serviceId: '000', // TODO validar que mandamos
		processId: codigoOperacion.toString(),
		transactionDate,
		operationId: '000', // TODO validar que mandamos
		operationNumberAnnulment: transaction.numeroDocumento,
	};
};

export const generateAnnulmentResponse = (
	operation: OperationContentDTO,
	responseMyMAPI: IPaymentResponse,
	transaction: TransactionContentDTO,
): IBBVAAnnulmentResponseDTO => {
	const operationStatus = getOperationStatusPayment(responseMyMAPI);

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
						numeroOperacionEmpresa: responseMyMAPI.operationNumberCompany,
					},
				},
			},
		},
	};
};
