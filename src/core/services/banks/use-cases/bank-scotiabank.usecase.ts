import { Injectable, Logger } from '@nestjs/common';
import { IBankfactory, IXmlJson } from '../interfaces/bank.interface';
import { convert } from 'xmlbuilder2';
import { getInputValues, InputEnum, setConsultDebtResponse, setOutputValues } from '../dto/scotiabank/helpers';
import { IDebtInquiresRequest } from 'src/infraestructure/service-clients/interface/mym.inquire.interface';
import { MyMRestClient } from 'src/infraestructure/service-clients/rest/mym.client';
import { CurrencyDTO, ScotiabankConsultDebtRequestDTO } from '../dto/scotiabank/scotiabank.requests.dto';
import { IScotiabankConsultDebtResponseDTO } from '../dto/scotiabank/scotiabank.responses.dto';

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
			const result = setConsultDebtResponse(valueJson, response);
			const stringResult = setOutputValues(result, InputEnum.INQUIRE);
			return stringResult;
		} catch (error) {
			return null;
		}
	}
	payment(XML: string): any {
		try {
			const jsonRes = convert(XML, { format: 'json' });
			const objRes: IXmlJson = JSON.parse(jsonRes);
			const valueJson = getInputValues(
				objRes['soapenv:Envelope']['soapenv:Body'].ejecutarTransaccionScotiabank.Input,
				InputEnum.PAYMENT,
			);
			return valueJson;
		} catch (error) {
			return { error: error.message };
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
}
