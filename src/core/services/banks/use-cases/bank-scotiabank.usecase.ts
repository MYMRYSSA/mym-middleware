import { Injectable, Logger } from '@nestjs/common';
import { IBankfactory } from '../interfaces/bank.interface';

@Injectable()
export class BankScotiabankUseCase implements IBankfactory {
	private logger = new Logger(BankScotiabankUseCase.name);

	consultDebt(payloadRequest: any): any {
    console.log("🚀 ~ file: bank-scotiabank.usecase.ts ~ line 9 ~ BankScotiabankUseCase ~ consultDebt ~ payloadRequest", payloadRequest);
		throw new Error('Method not implemented.');
	}
	payment(payloadRequest: any): any {
		throw new Error('Method not implemented.');
	}
	returnPayment(payloadRequest: any): any {
		throw new Error('Method not implemented.');
	}
}
