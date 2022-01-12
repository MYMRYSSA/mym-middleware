import { Injectable, Logger } from "@nestjs/common";
import { IBankfactory } from "../../factory/interfaces/bank.interface";

@Injectable()
export class BankScotiabankUseCase implements IBankfactory{
	private logger = new Logger(BankScotiabankUseCase.name)
	
	consultDebt(payloadRequest: any) {
		throw new Error("Method not implemented.");
	}
	payment(payloadRequest: any) {
		throw new Error("Method not implemented.");
	}
	returnPayment(payloadRequest: any) {
		throw new Error("Method not implemented.");
	}

}
