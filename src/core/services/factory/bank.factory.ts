import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { BankBbvaUseCase } from "../banks/use-cases/bank-bbva.usecase";
import { BankBcpUseCase } from "../banks/use-cases/bank-bcp.usecase";
import { BankScotiabankUseCase } from "../banks/use-cases/bank-scotiabank.usecase";

@Injectable()
export class BankFactory {
	constructor(private moduleRef: ModuleRef) {}

  getBankInstance(bankCode: string) {
		switch (bankCode) {
			case '002':
				return this.moduleRef.get(BankBcpUseCase);

			case '011':
				return this.moduleRef.get(BankBbvaUseCase);

			case '009':
				return this.moduleRef.get(BankScotiabankUseCase);

			default:
				throw new Error('Bank is not defined');
		}
	}

}

