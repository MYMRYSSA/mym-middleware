import { Injectable, Logger } from '@nestjs/common';
import {
	IDebtInquiresRequest,
	IDebtInquiresResponse,
	IDocumentMyMContent,
} from 'src/infraestructure/service-clients/interface/mym.client.interface';
import { MyMRestClient } from 'src/infraestructure/service-clients/rest/mym.client';
import {
	BBVAAnnulmentRequestDTO,
	BBVAConsultDebtRequestDTO,
	BBVAPaymentRequestDTO,
} from '../dto/bbva/bbva.requests.dto';
import {
	IBBVAAnnulmentResponseDTO,
	IBBVAConsultDebtResponseDTO,
	IBBVAPaymentResponseDTO,
	IDocumentContentDTO,
} from '../dto/bbva/bbva.responses.dto';
import { IBankfactory } from '../interfaces/bank.interface';
import { responseConstants } from '../constants/bbva/response-values.constants';
@Injectable()
export class BankBbvaUseCase implements IBankfactory {
	private logger = new Logger(BankBbvaUseCase.name);

	constructor(private readonly mymRestClient: MyMRestClient) {}

	async consultDebt(payloadRequest: BBVAConsultDebtRequestDTO): Promise<IBBVAConsultDebtResponseDTO> {
		const {
			ConsultarDeuda: {
				recaudosRq: { cabecera, detalle },
			},
		} = payloadRequest;
		const { operacion } = cabecera;
		const { codigoBanco, canalOperacion, numeroOperacion, codigoOperacion, fechaOperacion, horaOperacion } = operacion;

		let payloadMyMRequest: IDebtInquiresRequest = null;
		try {
			payloadMyMRequest = {
				bankCode: codigoBanco.toString(),
				channel: canalOperacion,
				requestId: numeroOperacion.toString(),
				currencyCode: 'PEN',
				processId: codigoOperacion.toString(),
				transactionDate: this.processDate(fechaOperacion, horaOperacion),
				customerIdentificationCode: detalle.transaccion.numeroReferenciaDeuda,
				serviceId: '000',
			};
			this.logger.log(`Body de la consulta ${JSON.stringify(payloadMyMRequest)}`);

			const response = await this.mymRestClient.debtInquires(payloadMyMRequest);
			this.logger.log(`resultado de la consulta ${JSON.stringify(response)}`);
			const resultContent = this.generatedBodyResponse(
				response,
				operacion,
				payloadMyMRequest.customerIdentificationCode,
			);
			return resultContent;
		} catch (error) {
			const resultContent = this.generatedBodyResponse(
				error.response?.data,
				operacion,
				payloadMyMRequest.customerIdentificationCode,
			);
			return resultContent;
		}
	}
	payment(payloadRequest: BBVAPaymentRequestDTO): IBBVAPaymentResponseDTO {
		return payloadRequest as any;
	}
	annulmentPayment(payloadRequest: BBVAAnnulmentRequestDTO): IBBVAAnnulmentResponseDTO {
		return payloadRequest as any;
	}

	private processDate(date: string, hour: string): string {
		const yyyy = date.slice(0, 4);
		const MM = date.slice(4, 6);
		const dd = date.slice(6, 8);
		const hh = hour.slice(0, 2);
		const mm = date.slice(2, 4);
		const ss = date.slice(4, 6);
		return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
	}

	private generatedBodyResponse(response: IDebtInquiresResponse, operacion: any, numeroReferenciaDeuda: string) {
		const operationStatus = this.operationStatus(response);
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
							listaDocumentos: { documento: this.generateDocumentBody(documentsContent) },
						},
					},
				},
			},
		};
		return resultBody;
	}

	private generateDocumentBody(documentsResponse: IDocumentMyMContent[]): IDocumentContentDTO[] {
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
	}

	private operationStatus(response: any) {
		if (response.documents) return responseConstants.SUCCESS;
		if (response.message === 'CLIENTE SIN DEUDAS') return responseConstants.NOT_INQUIRE;
		return responseConstants.TRANSACTION_INCOMPLETE;
	}
}
