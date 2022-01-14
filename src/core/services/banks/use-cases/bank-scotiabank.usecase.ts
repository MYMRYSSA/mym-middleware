import { Injectable, Logger } from '@nestjs/common';
import { IBankfactory } from '../interfaces/bank.interface';
import { convert } from 'xmlbuilder2';

@Injectable()
export class BankScotiabankUseCase implements IBankfactory {
	private logger = new Logger(BankScotiabankUseCase.name);

	consultDebt(XML: string): any {
		const jsonRes = convert(XML, { format: 'json' });
		const objRes = JSON.parse(jsonRes);
		return objRes;
	}
	payment(payloadRequest: any): any {
		throw new Error('Method not implemented.');
	}
	returnPayment(payloadRequest: any): any {
		throw new Error('Method not implemented.');
	}
}
