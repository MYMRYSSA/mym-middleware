import { Injectable, Logger } from '@nestjs/common';
import { IBankfactory, IXmlJson } from '../interfaces/bank.interface';
import { convert } from 'xmlbuilder2';
import {
	getInputValues,
	InputEnum,
	setConsultDebtResponse,
	setOutputValues,
	setPaymentResponse,
} from '../dto/scotiabank/helpers';
import { IDebtInquiresRequest } from 'src/infraestructure/service-clients/interface/mym.inquire.interface';
import { MyMRestClient } from 'src/infraestructure/service-clients/rest/mym.client';
import {
	CurrencyDTO,
	PaymentTypeDTO,
	ScotiabankConsultDebtRequestDTO,
	ScotiabankPaymentRequestDTO,
} from '../dto/scotiabank/scotiabank.requests.dto';
import {
	IScotiabankConsultDebtResponseDTO,
	IScotiabankPaymentResponseDTO,
} from '../dto/scotiabank/scotiabank.responses.dto';
import { IPaymentRequest } from 'src/infraestructure/service-clients/interface/mym.payment.interface';

@Injectable()
export class BankScotiabankUseCase implements IBankfactory {
	private logger = new Logger(BankScotiabankUseCase.name);

	constructor(private readonly mymRestClient: MyMRestClient) {}

	async consultDebt(XML: string): Promise<string> {
		try {
			const jsonRes = convert(XML, { format: 'json' });
			const objRes: IXmlJson = JSON.parse(jsonRes);
			const valueJson: ScotiabankConsultDebtRequestDTO = getInputValues(
				objRes['soapenv:Envelope']['soapenv:Body'].ejecutarTransaccionScotiabank.Input,
				InputEnum.INQUIRE,
			);
			const payloadMyMRequest: IDebtInquiresRequest = {
				bankCode: '009',
				channel: valueJson.CANAL.trim(),
				requestId: valueJson['NUMERO DE OPERACIÓN'].trim(),
				currencyCode: CurrencyDTO[valueJson['TRANSACTION CURRENCY CODE']],
				processId: valueJson['CODIGO DE PROCESO'],
				transactionDate: this.processDate(valueJson['FECHA Y HORA DE TRANSACCION']),
				customerIdentificationCode: valueJson['DATO DE CONSULTA'].trim(),
				serviceId: valueJson['CODIGO DE PRODUCTO/SERVICIO'].trim(),
			};
			const response = await this.mymRestClient.debtInquires(payloadMyMRequest);
			const result: IScotiabankConsultDebtResponseDTO = setConsultDebtResponse(valueJson, response);
			const stringResult = setOutputValues(result, InputEnum.INQUIRE);
			return stringResult;
		} catch (error) {
			return null;
		}
	}

	async payment(XML: string): Promise<string> {
		try {
			const jsonRes = convert(XML, { format: 'json' });
			const objRes: IXmlJson = JSON.parse(jsonRes);
			const valueJson: ScotiabankPaymentRequestDTO = getInputValues(
				objRes['soapenv:Envelope']['soapenv:Body'].ejecutarTransaccionScotiabank.Input,
				InputEnum.PAYMENT,
			);
			const payloadMyMRequest: IPaymentRequest = {
				bankCode: '009',
				currencyCode: CurrencyDTO[valueJson['MONEDA DE PAGO']],
				requestId: valueJson['RETRIEVAL REFERENCE NUMBER'].trim(),
				channel: valueJson.CANAL.trim(),
				customerIdentificationCode: valueJson['DATO DE PAGO'].trim(),
				serviceId: valueJson['CODIGO DE PRODUCTO'],
				operationId: '000',
				processId: valueJson['CODIGO DE PRODUCTO'].trim(),
				transactionDate: this.processDate(valueJson['FECHA Y HORA DE TRANSACCION']),
				paymentType: PaymentTypeDTO[valueJson['MEDIO DE PAGO']],
				paidDocuments: [
					{
						documentId: valueJson['NUMERO DE DOCUMENTO DE PAG'],
						expirationDate: '',
						documentReference: valueJson['NRO DE REFERENCIA DEL ABONO'],
						amounts: [
							{
								amount: valueJson['IMPORTE PAGADO EFECTIVO'],
								amountType: 'totalAmont',
							},
						],
					},
				],
				transactionCurrencyCode: CurrencyDTO[valueJson['TRANSACTION CURRENCY CODE']],
				currencyExchange: this.formatCurrencyExchange(valueJson['TIPO DE CAMBIO APLICADO']),
				totalAmount: Number(valueJson['IMPORTE PAGADO EFECTIVO']),
			};
			const response = await this.mymRestClient.payment(payloadMyMRequest);
			const result: IScotiabankPaymentResponseDTO = setPaymentResponse(valueJson, response);
			const stringResult = setOutputValues(result, InputEnum.PAYMENT);
			return stringResult;
		} catch (error) {
			return null;
		}
	}
	annulmentPayment(XML: string): any {
		try {
			const jsonRes = convert(XML, { format: 'json' });
			const objRes: IXmlJson = JSON.parse(jsonRes);
			const valueJson = getInputValues(
				objRes['soapenv:Envelope']['soapenv:Body'].ejecutarTransaccionScotiabank.Input,
				InputEnum.RETURN,
			);
			return valueJson;
		} catch (error) {
			return { error: error.message };
		}
	}
	private processDate(date: string): string {
		const actual = new Date();
		const MM = date.slice(0, 2);
		const dd = date.slice(2, 4);
		const yyyy = actual.getFullYear();
		const hh = date.slice(4, 6);
		const mm = date.slice(6, 8);
		const ss = date.slice(8, 10);
		return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
	}

	private formatCurrencyExchange(myStringNumber: string): number {
		const entire = myStringNumber.slice(0, 7);
		const decimals = myStringNumber.slice(7, myStringNumber.length);
		return Number(`${Number(entire)}.${Number(decimals)}`);
	}
}
