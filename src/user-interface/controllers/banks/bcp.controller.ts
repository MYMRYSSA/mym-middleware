import { Body, Controller, HttpException, InternalServerErrorException, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BankBcpUseCase } from 'src/core/services/banks';

@Controller()
@ApiTags('BCPController')
export class BCPController {
	constructor(private readonly bankBcpUseCase: BankBcpUseCase) {}

	@Post('v1/')
	async consultDebt(@Body() consultDebtRequestDTO: any) {
		const response = await this.bankBcpUseCase.consultDebt(consultDebtRequestDTO);
		if (response.error) {
			throw new HttpException(response.error, response.error.httpStatus);
		}
		return response;
	}

	@Post('v1/')
	async payment(@Body() paymentRequestDTO: any) {
		const response = await this.bankBcpUseCase.payment(paymentRequestDTO);
		if (response.error) {
			throw new InternalServerErrorException(response.error);
		}
		return response;
	}

	@Post('v1/')
	async annulmentPayment(@Body() annulmentPaymentRequestDTO: any) {
		const response = await this.bankBcpUseCase.annulmentPayment(annulmentPaymentRequestDTO);
		if (response.error) {
			throw new InternalServerErrorException(response.error);
		}
		return response;
	}
}
