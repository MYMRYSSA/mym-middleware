import { Injectable, Logger } from '@nestjs/common';
import { IDebtInquiresRequest } from 'src/infraestructure/service-clients/interface/mym.inquire.interface';
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
} from '../dto/bbva/bbva.responses.dto';
import { IBankfactory } from '../interfaces/bank.interface';
import { IPaymentRequest } from 'src/infraestructure/service-clients/interface/mym.payment.interface';
import {
	generateAnnulmentRequestMyMAPI,
	generateAnnulmentResponse,
	generatedInquiryResponse,
	generateInquiryRequestMyMAPI,
	generatePaymentRequestMyMAPI,
	generatePaymentResponse,
} from '../helpers/bbva/bbva.helper';
import { IAnnulmentRequest } from 'src/infraestructure/service-clients/interface/mym.annulment.interface';
import { ConfigService } from '@nestjs/config';
import { RequestGateway } from 'src/infraestructure/persistence/gateways/request.gateway';
@Injectable()
export class BankBbvaUseCase implements IBankfactory {
	private logger = new Logger(BankBbvaUseCase.name);
	private agreementCodeUSD: string;
	private agreementCodePEN: string;

	constructor(
		private readonly mymRestClient: MyMRestClient,
		private readonly configService: ConfigService,
		private readonly requestGateway: RequestGateway,
	) {
		this.agreementCodeUSD = configService.get<string>('AGREEMENT_CODE_USD');
		this.agreementCodePEN = configService.get<string>('AGREEMENT_CODE_PEN');
	}

	async consultDebt(payloadRequest: BBVAConsultDebtRequestDTO): Promise<IBBVAConsultDebtResponseDTO> {
		const {
			ConsultarDeuda: {
				recaudosRq: { cabecera, detalle },
			},
		} = payloadRequest;
		let payloadMyMRequest: IDebtInquiresRequest = null;
		try {
			payloadMyMRequest = generateInquiryRequestMyMAPI(cabecera.operacion, detalle.transaccion.numeroReferenciaDeuda, {
				[this.agreementCodePEN]: 'PEN',
				[this.agreementCodeUSD]: 'USD',
			});
			this.logger.log(`Body de la consulta ${JSON.stringify(payloadMyMRequest)}`);
			const responseGateway = await this.requestGateway.create({
				bank: payloadMyMRequest.bankCode,
				currency: payloadMyMRequest.currencyCode,
				customerId: detalle.transaccion.numeroReferenciaDeuda,
				requestId: payloadMyMRequest.requestId,
				type: 'INQUIRY',
				request: payloadRequest,
			});

			const response = await this.mymRestClient.debtInquires(payloadMyMRequest);
			this.logger.log(`resultado de la consulta ${JSON.stringify(response)}`);

			const resultContent = generatedInquiryResponse(
				response,
				cabecera.operacion,
				detalle.transaccion.numeroReferenciaDeuda,
				null,
			);
			await this.requestGateway.update(responseGateway._id, { response: resultContent });
			return resultContent;
		} catch (error) {
			this.logger.error(`Error consulta deuda ${error.response?.data || error}`);
			const resultContent = generatedInquiryResponse(
				null,
				cabecera.operacion,
				payloadMyMRequest.customerIdentificationCode,
				{ message: error.response?.data },
			);
			return resultContent;
		}
	}
	async payment(payloadRequest: BBVAPaymentRequestDTO): Promise<IBBVAPaymentResponseDTO> {
		const {
			NotificarPago: {
				recaudosRq: {
					cabecera: { operacion },
					detalle: { transaccion },
				},
			},
		} = payloadRequest;
		let payloadPaymentMyM: IPaymentRequest = null;
		try {
			payloadPaymentMyM = generatePaymentRequestMyMAPI(operacion, transaccion);
			const responseGateway = await this.requestGateway.create({
				bank: payloadPaymentMyM.bankCode,
				currency: payloadPaymentMyM.currencyCode,
				customerId: transaccion.numeroReferenciaDeuda,
				requestId: payloadPaymentMyM.requestId,
				requestPaymentId: payloadPaymentMyM.requestId,
				documentIds: payloadPaymentMyM.paidDocuments.map(document => document.documentId),
				paymentMethod: payloadPaymentMyM.paymentType,
				type: 'PAYMENT',
				request: payloadRequest,
				processId: payloadPaymentMyM.processId,
				serviceId: payloadPaymentMyM.serviceId,
			});
			this.logger.log(`body de la consulta a MyM API ${JSON.stringify(payloadPaymentMyM)}`);

			const responseClientMyM = await this.mymRestClient.payment(payloadPaymentMyM);
			this.logger.log(`respuesta de MyM API ${JSON.stringify(responseClientMyM)}`);

			const response = generatePaymentResponse(operacion, responseClientMyM, transaccion, null);
			await this.requestGateway.update(responseGateway._id, { response });

			return response;
		} catch (error) {
			this.logger.error(`Error al pagar deuda ${error.response?.data}`);
			const resultContent = generatePaymentResponse(operacion, null, transaccion, {
				message: error.response?.data,
			});
			return resultContent;
		}
	}
	async annulmentPayment(payloadRequest: BBVAAnnulmentRequestDTO): Promise<IBBVAAnnulmentResponseDTO> {
		const {
			ExtornarPago: {
				recaudosRq: {
					cabecera: { operacion },
					detalle: { transaccion },
				},
			},
		} = payloadRequest;
		let annulmentPayloadPaymentMyM: IAnnulmentRequest = null;
		try {
			annulmentPayloadPaymentMyM = generateAnnulmentRequestMyMAPI(operacion, transaccion);
			this.logger.log(`body de la consulta a MyM API ${JSON.stringify(annulmentPayloadPaymentMyM)}`);

			const responseGateway = await this.requestGateway.create({
				bank: annulmentPayloadPaymentMyM.bankCode,
				currency: annulmentPayloadPaymentMyM.currencyCode,
				customerId: transaccion.numeroReferenciaDeuda,
				requestId: annulmentPayloadPaymentMyM.requestId,
				requestPaymentId: annulmentPayloadPaymentMyM.operationNumberAnnulment,
				documentIds: [transaccion.numeroDocumento],
				type: 'ANNULMENT',
				request: payloadRequest,
				processId: annulmentPayloadPaymentMyM.processId,
				serviceId: annulmentPayloadPaymentMyM.serviceId,
			});
			const responseClientMyM = await this.mymRestClient.annulmentPayment(annulmentPayloadPaymentMyM);
			this.logger.log(`respuesta de MyM API ${JSON.stringify(responseClientMyM)}`);

			const response = generateAnnulmentResponse(operacion, responseClientMyM, transaccion, null);
			await this.requestGateway.update(responseGateway._id, { response });

			return response;
		} catch (error) {
			this.logger.error(`Error al pagar deuda ${error.response.data}`);
			const resultContent = generateAnnulmentResponse(operacion, null, transaccion, { message: error.response.data });
			return resultContent;
		}
	}
}
