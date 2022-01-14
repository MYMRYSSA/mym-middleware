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
	async consultDebt(@Body() XML: any) {
		const xmlStr = Buffer.from(XML).toString();
		const response = await this.bankScotiabankUseCase.consultDebt(xmlStr);
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
	async annulmentPayment(@Body() annulmentPaymentRequestDTO: any) {
		const response = await this.bankScotiabankUseCase.annulmentPayment(annulmentPaymentRequestDTO);
		if (response.error) {
			throw new InternalServerErrorException(response.error);
		}
		return response;
	}
}
