import { Injectable, Logger } from '@nestjs/common';
import { IBankfactory, IXmlJson } from '../interfaces/bank.interface';
import { convert } from 'xmlbuilder2';
import { getInputValues, InputEnum } from '../dto/scotiabank/helpers';

@Injectable()
export class BankScotiabankUseCase implements IBankfactory {
	private logger = new Logger(BankScotiabankUseCase.name);

	consultDebt(XML: string): any {
		const jsonRes = convert(XML, { format: 'json' });
		const objRes: IXmlJson = JSON.parse(jsonRes);
		const valueJson = getInputValues(
			objRes['soapenv:Envelope']['soapenv:Body'].ejecutarTransaccionScotiabank.Input,
			InputEnum.INQUIRE,
		);
		return valueJson;
	}
	payment(XML: string): any {
		throw new Error('Method not implemented.');
	}
<<<<<<< Updated upstream
	annulmentPayment(payloadRequest: any): any {
=======
	returnPayment(XML: string): any {
>>>>>>> Stashed changes
		throw new Error('Method not implemented.');
	}
}
