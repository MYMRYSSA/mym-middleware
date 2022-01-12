import { Body, Controller, HttpException, InternalServerErrorException, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BankBbvaUseCase } from 'src/core/services/banks';

@Controller()
@ApiTags('BBVAController')
export class BBVAController {
	constructor(
		private readonly bankBBVAUseCase: BankBbvaUseCase,
	) {}

	@Post('v1/')
	async consultDebt(@Body() consultDebtRequestDTO: any) {
		const response = await this.bankBBVAUseCase.consultDebt(consultDebtRequestDTO);
		if (response.error) {
			throw new HttpException(response.error, response.error.httpStatus);
		}
		return response;
	}

	@Post('v1/')
	async payment(@Body() paymentRequestDTO: any) {
		const response = await this.bankBBVAUseCase.payment(paymentRequestDTO);
		if (response.error) {
			throw new InternalServerErrorException(response.error);
		}
		return response;
	}

	@Post('v1/')
	async returnPayment(@Body() returnPaymentRequestDTO: any) {
		const response = await this.bankBBVAUseCase.returnPayment(returnPaymentRequestDTO);
		if (response.error) {
			throw new InternalServerErrorException(response.error);
		}
		return response;
	}
}
