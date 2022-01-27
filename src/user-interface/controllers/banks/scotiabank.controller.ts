import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BankScotiabankUseCase } from 'src/core/services/banks';
import { prepareXml } from 'src/core/services/banks/helpers/scotiabank';

@Controller('/api/scotiabank')
@ApiTags('ScotiabankController')
export class ScotiabankController {
	constructor(private readonly bankScotiabankUseCase: BankScotiabankUseCase) {}

	@Post('v1/inquire')
	async consultDebt(@Body() XML: any) {
		const xmlStr = Buffer.from(XML).toString();
		const result = await this.bankScotiabankUseCase.consultDebt(xmlStr);
		return prepareXml(result);
	}

	@Post('v1/payment')
	async payment(@Body() XML: any) {
		const xmlStr = Buffer.from(XML).toString();
		const result = await this.bankScotiabankUseCase.payment(xmlStr);
		return prepareXml(result);
	}

	@Post('v1/return')
	async annulmentPayment(@Body() XML: any) {
		const xmlStr = Buffer.from(XML).toString();
		const result = await this.bankScotiabankUseCase.annulmentPayment(xmlStr);
		return prepareXml(result);
	}
}
