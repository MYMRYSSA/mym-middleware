import { Injectable, Logger } from '@nestjs/common';
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
	constructor(private readonly mymRestClient: MyMRestClient) {}

	async consultDebt(payloadRequest: BCPConsultDebtRequestDTO): Promise<IBCPConsultDebtResponseDTO> {
		let payloadMyMRequest: IDebtInquiresRequest = null;
		try {
			payloadMyMRequest = generateInquiryRequestMyMAPI(payloadRequest);
			this.logger.log(`Body de la consulta ${JSON.stringify(payloadMyMRequest)}`);
			const responseMyMAPI = await this.mymRestClient.debtInquires(payloadMyMRequest);

			this.logger.log(`resultado de la consulta ${JSON.stringify(responseMyMAPI)}`);
			const result = generatedInquiryResponse(responseMyMAPI, payloadRequest);
			this.logger.log(`Body para retornar al banco ${JSON.stringify(result)}`);

			return result;
		} catch (error) {
			this.logger.error(`Error consulta deuda ${error.response.data}`);
			const resultContent = generatedInquiryResponse(error.response?.data, payloadRequest);
			return resultContent;
		}
	}
	async payment(payloadRequest: BCPPaymentRequestDTO): Promise<IBCPPaymentResponseDTO> {
		let payloadMyMRequest: IPaymentRequest = null;
		try {
			payloadMyMRequest = generatePaymentRequestMyMAPI(payloadRequest);
			this.logger.log(`Body de la consulta ${JSON.stringify(payloadMyMRequest)}`);
			const responseMyMAPI = await this.mymRestClient.payment(payloadMyMRequest);

			this.logger.log(`resultado de la consulta ${JSON.stringify(responseMyMAPI)}`);
			const result = generatePaymentResponse(responseMyMAPI, payloadRequest);
			this.logger.log(`Body para retornar al banco ${JSON.stringify(result)}`);

			return result;
		} catch (error) {
			this.logger.error(`Error consulta deuda ${error.response.data}`);
			const resultContent = generatePaymentResponse(error.response?.data, payloadRequest);
			return resultContent;
		}
	}
	async annulmentPayment(payloadRequest: BCPAnnulmentRequestDTO): Promise<IBCPAnnulmentResponseDTO> {
		let payloadMyMRequest: IAnnulmentRequest = null;
		try {
			payloadMyMRequest = generateAnnulmentRequestMyMAPI(payloadRequest);
			this.logger.log(`Body de la consulta ${JSON.stringify(payloadMyMRequest)}`);
			const responseMyMAPI = await this.mymRestClient.annulmentPayment(payloadMyMRequest);

			this.logger.log(`resultado de la consulta ${JSON.stringify(responseMyMAPI)}`);
			const result = generateAnnulmentResponse(responseMyMAPI, payloadRequest);
			this.logger.log(`Body para retornar al banco ${JSON.stringify(result)}`);

			return result;
		} catch (error) {
			this.logger.error(`Error consulta deuda ${error.response.data}`);
			const resultContent = generateAnnulmentResponse(error.response?.data, payloadRequest);
			return resultContent;
		}
	}
}
