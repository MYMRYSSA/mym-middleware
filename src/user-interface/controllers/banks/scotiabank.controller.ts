import { Body, Controller, HttpException, InternalServerErrorException, Post } from '@nestjs/common';
import { LoginRequestDTO, RegisterRequestDTO } from '../../../core/services/auth/dto/auth.dto';
import { LoginUseCase, RegisterUserUseCase } from '../../../core/services/auth';
import { ApiTags } from '@nestjs/swagger';
import { BankScotiabankUseCase } from 'src/core/services/banks';

@Controller('/api/scotiabank')
@ApiTags('ScotiabankController')
export class ScotiabankController {
	constructor(private readonly bankScotiabankUseCase: BankScotiabankUseCase) {}

	@Post('v1/inquire')
	async consultDebt(@Body() consultDebtRequestDTO: any) {
		const response = await this.bankScotiabankUseCase.consultDebt(consultDebtRequestDTO);
		if (response.error) {
			throw new HttpException(response.error, response.error.httpStatus);
		}
		return response;
	}

	@Post('v1/payment')
	async payment(@Body() paymentRequestDTO: any) {
		const response = await this.bankScotiabankUseCase.payment(paymentRequestDTO);
		if (response.error) {
			throw new InternalServerErrorException(response.error);
		}
		return response;
	}

	@Post('v1/return')
	async returnPayment(@Body() returnPaymentRequestDTO: any) {
		const response = await this.bankScotiabankUseCase.returnPayment(returnPaymentRequestDTO);
		if (response.error) {
			throw new InternalServerErrorException(response.error);
		}
		return response;
	}
}
