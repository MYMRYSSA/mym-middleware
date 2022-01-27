import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestGateway } from 'src/infraestructure/persistence/gateways/request.gateway';
import { IAnnulmentRequest } from 'src/infraestructure/service-clients/interface/mym.annulment.interface';
import { IDebtInquiresRequest } from 'src/infraestructure/service-clients/interface/mym.inquire.interface';
import { IPaymentRequest } from 'src/infraestructure/service-clients/interface/mym.payment.interface';
import { MyMRestClient } from 'src/infraestructure/service-clients/rest/mym.client';
import { BCPAnnulmentRequestDTO, BCPConsultDebtRequestDTO, BCPPaymentRequestDTO } from '../dto/bcp/bcp.requests.dto';
import {
	IBCPAnnulmentResponseDTO,
	IBCPConsultDebtResponseDTO,
	IBCPPaymentResponseDTO,
} from '../dto/bcp/bcp.responses.dto';
import {
	generateAnnulmentRequestMyMAPI,
	generateAnnulmentResponse,
	generatedInquiryResponse,
	generateInquiryRequestMyMAPI,
	generatePaymentRequestMyMAPI,
	generatePaymentResponse,
} from '../helpers/bcp/bcp.helpers';
import { IBankfactory } from '../interfaces/bank.interface';

@Injectable()
export class BankBcpUseCase implements IBankfactory {
	private logger = new Logger(BankBcpUseCase.name);
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

	async consultDebt(payloadRequest: BCPConsultDebtRequestDTO): Promise<IBCPConsultDebtResponseDTO> {
		let payloadMyMRequest: IDebtInquiresRequest = null;
		try {
			payloadMyMRequest = generateInquiryRequestMyMAPI(payloadRequest, {
				[this.agreementCodePEN]: 'PEN',
				[this.agreementCodeUSD]: 'USD',
			});
			this.logger.log(`Body de la consulta ${JSON.stringify(payloadMyMRequest)}`);
			const responseGateway = await this.requestGateway.create({
				bank: payloadMyMRequest.bankCode,
				currency: payloadMyMRequest.currencyCode,
				customerId: payloadMyMRequest.customerIdentificationCode,
				requestId: payloadMyMRequest.requestId,
				type: 'INQUIRY',
				request: payloadRequest,
				serviceId: payloadMyMRequest.serviceId,
				processId: payloadMyMRequest.processId,
			});
			const responseMyMAPI = await this.mymRestClient.debtInquires(payloadMyMRequest);

			this.logger.log(`resultado de la consulta ${JSON.stringify(responseMyMAPI)}`);
			const result = generatedInquiryResponse(responseMyMAPI, payloadRequest, null);
			this.logger.log(`Body para retornar al banco ${JSON.stringify(result)}`);
			await this.requestGateway.update(responseGateway._id, { response: result });

			return result;
		} catch (error) {
			this.logger.error(`Error consulta deuda ${error.response?.data}`);
			const resultContent = generatedInquiryResponse(null, payloadRequest, { message: error.response?.data });
			return resultContent;
		}
	}
	async payment(payloadRequest: BCPPaymentRequestDTO): Promise<IBCPPaymentResponseDTO> {
		let payloadMyMRequest: IPaymentRequest = null;
		try {
			payloadMyMRequest = generatePaymentRequestMyMAPI(payloadRequest, {
				[this.agreementCodePEN]: 'PEN',
				[this.agreementCodeUSD]: 'USD',
			});
			this.logger.log(`Body de la consulta ${JSON.stringify(payloadMyMRequest)}`);
			const responseGateway = await this.requestGateway.create({
				bank: payloadMyMRequest.bankCode,
				currency: payloadMyMRequest.currencyCode,
				customerId: payloadMyMRequest.customerIdentificationCode,
				requestId: payloadMyMRequest.requestId,
				requestPaymentId: payloadMyMRequest.requestId,
				documentIds: payloadMyMRequest.paidDocuments.map(document => document.documentId),
				paymentMethod: payloadMyMRequest.paymentType,
				type: 'PAYMENT',
				request: payloadRequest,
				processId: payloadMyMRequest.processId,
				serviceId: payloadMyMRequest.serviceId,
				operationId: payloadMyMRequest.operationId, // check number
			});
			const responseMyMAPI = await this.mymRestClient.payment(payloadMyMRequest);

			this.logger.log(`resultado de la consulta ${JSON.stringify(responseMyMAPI)}`);
			const result = generatePaymentResponse(responseMyMAPI, payloadRequest, null);
			this.logger.log(`Body para retornar al banco ${JSON.stringify(result)}`);
			await this.requestGateway.update(responseGateway._id, { response: result });

			return result;
		} catch (error) {
			this.logger.error(`Error consulta deuda ${error.response.data}`);
			const resultContent = generatePaymentResponse(null, payloadRequest, { message: error.response?.data });
			return resultContent;
		}
	}
	async annulmentPayment(payloadRequest: BCPAnnulmentRequestDTO): Promise<IBCPAnnulmentResponseDTO> {
		let payloadMyMRequest: IAnnulmentRequest = null;
		try {
			payloadMyMRequest = generateAnnulmentRequestMyMAPI(payloadRequest);
			this.logger.log(`Body de la consulta ${JSON.stringify(payloadMyMRequest)}`);
			const responseGateway = await this.requestGateway.create({
				bank: payloadMyMRequest.bankCode,
				currency: payloadMyMRequest.currencyCode,
				customerId: payloadMyMRequest.customerIdentificationCode,
				requestId: payloadMyMRequest.requestId,
				requestPaymentId: payloadMyMRequest.operationNumberAnnulment,
				type: 'ANNULMENT',
				request: payloadRequest,
				processId: payloadMyMRequest.processId,
				serviceId: payloadMyMRequest.serviceId,
			});
			const responseMyMAPI = await this.mymRestClient.annulmentPayment(payloadMyMRequest);

			this.logger.log(`resultado de la consulta ${JSON.stringify(responseMyMAPI)}`);
			const result = generateAnnulmentResponse(responseMyMAPI, payloadRequest, null);
			this.logger.log(`Body para retornar al banco ${JSON.stringify(result)}`);
			await this.requestGateway.update(responseGateway._id, { response: result });

			return result;
		} catch (error) {
			this.logger.error(`Error consulta deuda ${error.response.data}`);
			const resultContent = generateAnnulmentResponse(null, payloadRequest, { message: error.response?.data });
			return resultContent;
		}
	}
}
