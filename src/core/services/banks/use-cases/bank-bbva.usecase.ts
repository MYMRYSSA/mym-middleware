import { Injectable, Logger } from '@nestjs/common';
import { IDebtInquiresRequest } from 'src/infraestructure/service-clients/interface/mym.client.interface';
import { MyMRestClient } from 'src/infraestructure/service-clients/rest/mym.client';
import { DateTime } from 'luxon';
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

	async consultDebt(payloadRequest: BBVAConsultDebtRequestDTO): Promise<IBBVAConsultDebtResponseDTO> {
		const {
			ConsultarDeuda: {
				recaudosRq: { cabecera, detalle },
			},
		} = payloadRequest;
		const {
			operacion: { codigoBanco, canalOperacion, numeroOperacion, codigoOperacion, fechaOperacion, horaOperacion },
		} = cabecera;

		try {
			const payloadMyMRequest: IDebtInquiresRequest = {
				bankCode: codigoBanco.toString(),
				channel: canalOperacion,
				requestId: numeroOperacion.toString(),
				currencyCode: 'PEN',
				processId: codigoOperacion.toString(),
				transactionDate: this.processDate(fechaOperacion, horaOperacion),
				customerIdentificationCode: detalle.transaccion.numeroReferenciaDeuda,
			};
			const response = await this.mymRestClient.debtInquires(payloadMyMRequest);
			const result = response.subscribe(data => data);
			return result as any;
		} catch (error) {
      console.log("🚀 ~ file: bank-bbva.usecase.ts ~ line 46 ~ BankBbvaUseCase ~ consultDebt ~ error", error)
			
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
}
