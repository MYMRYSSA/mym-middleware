import { Injectable, Logger } from "@nestjs/common";
import { BankFactory } from "./factory/bank.factory";

@Injectable()
export class PaymentService {
	private logger = new Logger(PaymentService.name)

	constructor(private readonly bankFactory: BankFactory) {}

	execute(requestDto: any, bankCode: string): any {
		const bankInstance = this.bankFactory.getBankInstance(bankCode);
		bankInstance.payment(requestDto);
	}
}
