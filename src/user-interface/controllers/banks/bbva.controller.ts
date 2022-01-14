import { Body, Controller, HttpException, InternalServerErrorException, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BankBbvaUseCase } from 'src/core/services/banks';
import { BBVAConsultDebtRequestDTO } from 'src/core/services/banks/dto/bbva/bbva.requests.dto';

@Controller('/api')
@ApiTags('BBVAController')
export class BBVAController {
	constructor(private readonly bankBBVAUseCase: BankBbvaUseCase) {}

	@Post('v1/inquire')
	async consultDebt(@Body() consultDebtRequestDTO: BBVAConsultDebtRequestDTO) {
		const response = await this.bankBBVAUseCase.consultDebt(consultDebtRequestDTO);
		return response;
	}

	@Post('v1/payment')
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
