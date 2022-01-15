import { Injectable, Logger } from '@nestjs/common';
import { IBankfactory, IXmlJson } from '../interfaces/bank.interface';
import { convert } from 'xmlbuilder2';
import { getInputValues, InputEnum } from '../dto/scotiabank/helpers';

@Injectable()
export class BankScotiabankUseCase implements IBankfactory {
	private logger = new Logger(BankScotiabankUseCase.name);

	consultDebt(XML: string): any {
		try {
			const jsonRes = convert(XML, { format: 'json' });
			const objRes: IXmlJson = JSON.parse(jsonRes);
			const valueJson = getInputValues(
				objRes['soapenv:Envelope']['soapenv:Body'].ejecutarTransaccionScotiabank.Input,
				InputEnum.INQUIRE,
			);
			return valueJson;
		} catch (err) {
			return { error: err.message };
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
		} catch (err) {
			return { error: err.message };
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
		} catch (err) {
			return { error: err.message };
		}
	}
}
