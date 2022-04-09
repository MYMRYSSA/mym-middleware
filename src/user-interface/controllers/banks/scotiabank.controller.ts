import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BankScotiabankUseCase } from 'src/core/services/banks';
import { prepareXml } from 'src/core/services/banks/helpers/scotiabank';

@Controller('/api/scotiabank')
@ApiTags('ScotiabankController')
export class ScotiabankController {
	constructor(private readonly bankScotiabankUseCase: BankScotiabankUseCase) {}

	@Post('v1')
	async consultDebt(@Req() req, @Res() res) {
		const xmlStr = Buffer.from(req.rawBody).toString();
		const result = await this.bankScotiabankUseCase.redirector(xmlStr);
		res.set({ 'Content-Type': 'application/xml' });
		res.send(prepareXml(result));
	}
}
