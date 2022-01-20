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

		let payloadMyMRequest: IDebtInquiresRequest = null;
		try {
			payloadMyMRequest = generateInquiryRequestMyMAPI(cabecera.operacion, detalle.transaccion.numeroReferenciaDeuda);

			this.logger.log(`Body de la consulta ${JSON.stringify(payloadMyMRequest)}`);

			const response = await this.mymRestClient.debtInquires(payloadMyMRequest);
			this.logger.log(`resultado de la consulta ${JSON.stringify(response)}`);
			const resultContent = generatedInquiryResponse(
				response,
				cabecera.operacion,
				payloadMyMRequest.customerIdentificationCode,
			);
			return resultContent;
		} catch (error) {
			this.logger.error(`Error consulta deuda ${error.response.data}`);
			const resultContent = generatedInquiryResponse(
				error.response?.data,
				cabecera.operacion,
				payloadMyMRequest.customerIdentificationCode,
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
			this.logger.log(`body de la consulta a MyM API ${JSON.stringify(payloadRequest)}`);

			const responseClientMyM = await this.mymRestClient.payment(payloadPaymentMyM);
			this.logger.log(`respuesta de MyM API ${JSON.stringify(responseClientMyM)}`);

			const response = generatePaymentResponse(operacion, responseClientMyM, transaccion);
			return response;
		} catch (error) {
			this.logger.error(`Error al pagar deuda ${error.response.data}`);
			const resultContent = generatePaymentResponse(operacion, error.response.data, transaccion);
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
			this.logger.log(`body de la consulta a MyM API ${JSON.stringify(payloadRequest)}`);

			const responseClientMyM = await this.mymRestClient.annulmentPayment(annulmentPayloadPaymentMyM);
			this.logger.log(`respuesta de MyM API ${JSON.stringify(responseClientMyM)}`);

			const response = generateAnnulmentResponse(operacion, responseClientMyM, transaccion);
			return response;
		} catch (error) {
			this.logger.error(`Error al pagar deuda ${error.response.data}`);
			const resultContent = generateAnnulmentResponse(operacion, error.response.data, transaccion);
			return resultContent;
		}
	}
}
