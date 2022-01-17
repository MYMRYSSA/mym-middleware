import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class BankBbvaUseCase implements IBankfactory {
	private logger = new Logger(BankBbvaUseCase.name);

	constructor(private readonly mymRestClient: MyMRestClient) {}

	consultDebt(payloadRequest: BBVAConsultDebtRequestDTO): IBBVAConsultDebtResponseDTO {
		return payloadRequest as any;
	}
	payment(payloadRequest: BBVAPaymentRequestDTO): IBBVAPaymentResponseDTO {
		return payloadRequest as any;
	}
	annulmentPayment(payloadRequest: BBVAAnnulmentRequestDTO): IBBVAAnnulmentResponseDTO {
		return payloadRequest as any;
	}
}
