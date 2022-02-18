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
	ScotiabankErrorCodes,
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
import { RequestGateway } from 'src/infraestructure/persistence/gateways/request.gateway';

@Injectable()
export class BankScotiabankUseCase implements IBankfactory {
	private logger = new Logger(BankScotiabankUseCase.name);

	constructor(private readonly mymRestClient: MyMRestClient, private readonly requestGateway: RequestGateway) {}

	async consultDebt(input: string): Promise<string> {
		let valueJson: ScotiabankConsultDebtRequestDTO = null;
		try {
			valueJson = getInputValues(input, InputEnum.INQUIRE);
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
			this.logger.log(`Body de la consulta ${JSON.stringify(payloadMyMRequest)}`);
			const responseGateway = await this.requestGateway.create({
				bank: payloadMyMRequest.bankCode,
				currency: payloadMyMRequest.currencyCode,
				customerId: payloadMyMRequest.customerIdentificationCode,
				requestId: payloadMyMRequest.requestId,
				type: 'INQUIRY',
				request: payloadMyMRequest,
			});
			const responseMyMAPI = await this.mymRestClient.debtInquires(payloadMyMRequest);
			this.logger.log(`resultado de la consulta ${JSON.stringify(responseMyMAPI)}`);
			if (ScotiabankErrorCodes.includes(responseMyMAPI?.[0])) {
				throw new Error(responseMyMAPI?.[0]);
			}
			const result: IScotiabankConsultDebtResponseDTO = setConsultDebtResponse(valueJson, responseMyMAPI);
			this.logger.log(`Body para retornar al banco ${JSON.stringify(result)}`);
			await this.requestGateway.update(responseGateway._id, { response: result });
			const stringResult = setOutputValues(result, InputEnum.INQUIRE);
			return stringResult;
		} catch (error) {
			this.logger.error(`Error consulta deuda ${error.response?.data || error.message}`);
			const result: IScotiabankConsultDebtResponseDTO = setConsultDebtResponse(valueJson, null);
			const stringResult = setOutputValues(result, InputEnum.INQUIRE);
			return stringResult;
		}
	}

	async payment(input: string): Promise<string> {
		let valueJson: ScotiabankPaymentRequestDTO = null;
		try {
			valueJson = getInputValues(input, InputEnum.PAYMENT);
			const payloadMyMRequest: IPaymentRequest = {
				bankCode: '009',
				currencyCode: CurrencyDTO[valueJson['TRANSACTION CURRENCY CODE'].trim()],
				requestId: valueJson['RETRIEVAL REFERENCE NUMBER'].trim(),
				channel: valueJson.CANAL.trim(),
				customerIdentificationCode: valueJson['DATO DE PAGO'].trim(),
				serviceId: '1001', // TODO validar que mandamos
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
								amount: String(Number(valueJson['IMPORTE PAGADO EFECTIVO'].trim())),
								amountType: 'totalAmont',
							},
						],
					},
				],
				transactionCurrencyCode: CurrencyDTO[valueJson['TRANSACTION CURRENCY CODE'].trim()],
				currencyExchange: this.formatCurrencyExchange(valueJson['TIPO DE CAMBIO APLICADO'].trim()),
				totalAmount: Number(valueJson['IMPORTE PAGADO EFECTIVO'].trim()),
			};
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
				request: valueJson,
				processId: payloadMyMRequest.processId,
				serviceId: payloadMyMRequest.serviceId,
			});
			const responseMyMAPI = await this.mymRestClient.payment(payloadMyMRequest);
			this.logger.log(`resultado de la consulta ${JSON.stringify(responseMyMAPI)}`);
			if (ScotiabankErrorCodes.includes(responseMyMAPI?.[0])) {
				throw new Error(responseMyMAPI?.[0]);
			}
			const result: IScotiabankPaymentResponseDTO = setPaymentResponse(valueJson, responseMyMAPI);
			this.logger.log(`Body para retornar al banco ${JSON.stringify(result)}`);
			await this.requestGateway.update(responseGateway._id, { response: result });
			const stringResult = setOutputValues(result, InputEnum.PAYMENT);
			return stringResult;
		} catch (error) {
			this.logger.error(`Error notificar pago ${error.response?.data || error.message}`);
			const result: IScotiabankPaymentResponseDTO = setPaymentResponse(valueJson, null);
			const stringResult = setOutputValues(result, InputEnum.PAYMENT);
			return stringResult;
		}
	}

	async annulmentPayment(input: string): Promise<string> {
		let valueJson: ScotiabankAnnulmentRequestDTO = null;
		try {
			valueJson = getInputValues(input, InputEnum.RETURN);
			const payloadMyMRequest: IAnnulmentRequest = {
				bankCode: '009',
				currencyCode: CurrencyDTO[valueJson['TRANSACTION CURRENCY CODE']],
				requestId: valueJson['RETRIEVAL REFERENCE NUMBER'].trim(),
				channel: valueJson.CANAL.trim(),
				customerIdentificationCode: valueJson['DATO DE PAGO'].trim(),
				serviceId: '1001', // TODO validar que mandamos
				processId: valueJson['CODIGO DE PRODUCTO/SERVICIO'].trim(),
				transactionDate: this.processDate(valueJson['FECHA Y HORA DE TRANSACCION 1']),
				operationId: '000',
				operationNumberAnnulment: valueJson['NUMERO DE TRANS. DE COB.ORI'].trim(),
			};
			this.logger.log(`Body de la consulta ${JSON.stringify(payloadMyMRequest)}`);
			const responseGateway = await this.requestGateway.create({
				bank: payloadMyMRequest.bankCode,
				currency: payloadMyMRequest.currencyCode,
				customerId: payloadMyMRequest.customerIdentificationCode,
				requestId: payloadMyMRequest.requestId,
				requestPaymentId: payloadMyMRequest.operationNumberAnnulment,
				documentIds: [valueJson['NUMERO DE DOCUMENTO'].trim()],
				type: 'ANNULMENT',
				request: valueJson,
				processId: payloadMyMRequest.processId,
				serviceId: payloadMyMRequest.serviceId,
			});
			const responseMyMAPI = await this.mymRestClient.annulmentPayment(payloadMyMRequest);
			this.logger.log(`resultado de la consulta ${JSON.stringify(responseMyMAPI)}`);
			if (ScotiabankErrorCodes.includes(responseMyMAPI?.[0])) {
				throw new Error(responseMyMAPI?.[0]);
			}
			const result: IScotiabankAnnulmentResponseDTO = setAnullmentResponse(valueJson, responseMyMAPI);
			this.logger.log(`Body para retornar al banco ${JSON.stringify(result)}`);
			await this.requestGateway.update(responseGateway._id, { response: result });
			const stringResult = setOutputValues(result, InputEnum.RETURN);
			return stringResult;
		} catch (error) {
			this.logger.error(`Error extorno pago ${error.response?.data || error.message}`);
			const result: IScotiabankAnnulmentResponseDTO = setAnullmentResponse(valueJson, null);
			const stringResult = setOutputValues(result, InputEnum.RETURN);
			return stringResult;
		}
	}

	async redirector(XML: string): Promise<string> {
		const jsonRes = convert(XML, { format: 'json' });
		const objRes: IXmlJson = JSON.parse(jsonRes);
		const input = objRes['soapenv:Envelope']['soapenv:Body'].ejecutarTransaccionScotiabank.Input;
		const process = this.getProcess(objRes['soapenv:Envelope']['soapenv:Body'].ejecutarTransaccionScotiabank.Input);
		if (process === '355000') return await this.consultDebt(input);
		if (process === '945000') return await this.payment(input);
		if (process === '965000') return await this.annulmentPayment(input);
		return '';
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

	private getProcess(content: string) {
		return content.slice(54, 60);
	}
}
