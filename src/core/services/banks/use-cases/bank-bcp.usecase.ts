import { Injectable, Logger } from "@nestjs/common";
import { IBankfactory } from "../../factory/interfaces/bank.interface";

@Injectable()
export class BankBcpUseCase implements IBankfactory{
	private logger = new Logger(BankBcpUseCase.name)
	
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
