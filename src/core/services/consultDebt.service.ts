import { Injectable, Logger } from "@nestjs/common";
import { BankFactory } from "./factory/bank.factory";

@Injectable()
export class ConsultDebtService {
	private logger = new Logger(ConsultDebtService.name)

	constructor(private readonly bankFactory: BankFactory) {}

	execute(requestDto: any, bankCode: string): any {
		const bankInstance = this.bankFactory.getBankInstance(bankCode);
		bankInstance.consultDebt(requestDto);
	}
}
