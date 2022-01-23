import { Injectable, Logger } from '@nestjs/common';
import { IBankfactory, IXmlJson } from '../interfaces/bank.interface';
import { convert } from 'xmlbuilder2';
import {
	getInputValues,
	InputEnum,
	setAnullmentResponse,
	setConsultDebtResponse,
	setOutputValues,
	setPaymentResponse,
} from '../dto/scotiabank/helpers';
import {
	CurrencyDTO,
	PaymentTypeDTO,
	ScotiabankAnnulmentRequestDTO,
	ScotiabankConsultDebtRequestDTO,
	ScotiabankPaymentRequestDTO,
} from '../dto/scotiabank/scotiabank.requests.dto';
import {
	IScotiabankAnnulmentResponseDTO,
	IScotiabankConsultDebtResponseDTO,
	IScotiabankPaymentResponseDTO,
} from '../dto/scotiabank/scotiabank.responses.dto';
import { MyMRestClient } from 'src/infraestructure/service-clients/rest/mym.client';
import { IDebtInquiresRequest } from 'src/infraestructure/service-clients/interface/mym.inquire.interface';
import { IPaymentRequest } from 'src/infraestructure/service-clients/interface/mym.payment.interface';
import { IAnnulmentRequest } from 'src/infraestructure/service-clients/interface/mym.annulment.interface';

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
				currencyCode: CurrencyDTO[valueJson['TRANSACTION CURRENCY CODE'].trim()],
				processId: valueJson['CODIGO DE PROCESO'].trim(),
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
				currencyCode: CurrencyDTO[valueJson['TRANSACTION CURRENCY CODE'].trim()],
				requestId: valueJson['RETRIEVAL REFERENCE NUMBER'].trim(),
				channel: valueJson.CANAL.trim(),
				customerIdentificationCode: valueJson['DATO DE PAGO'].trim(),
				serviceId: valueJson['CODIGO DE PRODUCTO'].trim(),
				operationId: '000',
				processId: valueJson['CODIGO DE PRODUCTO'].trim(),
				transactionDate: this.processDate(valueJson['FECHA Y HORA DE TRANSACCION']),
				paymentType: PaymentTypeDTO[valueJson['MEDIO DE PAGO'].trim()],
				paidDocuments: [
					{
						documentId: valueJson['NUMERO DE DOCUMENTO DE PAG'].trim(),
						expirationDate: '',
						documentReference: valueJson['NRO DE REFERENCIA DEL ABONO'].trim(),
						amounts: [
							{
								amount: valueJson['IMPORTE PAGADO EFECTIVO'].trim(),
								amountType: 'totalAmont',
							},
						],
					},
				],
				transactionCurrencyCode: CurrencyDTO[valueJson['TRANSACTION CURRENCY CODE'].trim()],
				currencyExchange: this.formatCurrencyExchange(valueJson['TIPO DE CAMBIO APLICADO'].trim()),
				totalAmount: Number(valueJson['IMPORTE PAGADO EFECTIVO'].trim()),
			};
			const response = await this.mymRestClient.payment(payloadMyMRequest);
			const result: IScotiabankPaymentResponseDTO = setPaymentResponse(valueJson, response);
			const stringResult = setOutputValues(result, InputEnum.PAYMENT);
			return stringResult;
		} catch (error) {
			return null;
		}
	}

	async annulmentPayment(XML: string): Promise<string> {
		try {
			const jsonRes = convert(XML, { format: 'json' });
			const objRes: IXmlJson = JSON.parse(jsonRes);
			const valueJson: ScotiabankAnnulmentRequestDTO = getInputValues(
				objRes['soapenv:Envelope']['soapenv:Body'].ejecutarTransaccionScotiabank.Input,
				InputEnum.RETURN,
			);
			const payloadMyMRequest: IAnnulmentRequest = {
				bankCode: '009',
				currencyCode: CurrencyDTO[valueJson['TRANSACTION CURRENCY CODE']],
				requestId: valueJson['RETRIEVAL REFERENCE NUMBER'].trim(),
				channel: valueJson.CANAL.trim(),
				customerIdentificationCode: valueJson['DATO DE PAGO'].trim(),
				serviceId: valueJson['CODIGO DE PRODUCTO'].trim(),
				processId: valueJson['CODIGO DE PRODUCTO'].trim(),
				transactionDate: this.processDate(valueJson['FECHA Y HORA DE TRANSACCION']),
				operationId: '000',
				operationNumberAnnulment: valueJson['NUMERO DE DOCUMENTO'].trim(),
			};
			const response = await this.mymRestClient.annulmentPayment(payloadMyMRequest);
			const result: IScotiabankAnnulmentResponseDTO = setAnullmentResponse(valueJson, response);
			const stringResult = setOutputValues(result, InputEnum.RETURN);
			return stringResult;
		} catch (error) {
			return null;
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
