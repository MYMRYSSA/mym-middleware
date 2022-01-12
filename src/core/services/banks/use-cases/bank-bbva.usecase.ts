import { Injectable, Logger } from "@nestjs/common";
import { IBankfactory } from "../../factory/interfaces/bank.interface";

@Injectable()
export class BankBbvaUseCase implements IBankfactory {
	private logger = new Logger(BankBbvaUseCase.name)

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
