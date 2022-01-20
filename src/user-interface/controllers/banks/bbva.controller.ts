import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BankBbvaUseCase } from 'src/core/services/banks';
import {
	BBVAAnnulmentRequestDTO,
	BBVAConsultDebtRequestDTO,
	BBVAPaymentRequestDTO,
} from 'src/core/services/banks/dto/bbva/bbva.requests.dto';

@Controller('/api/bbva')
@ApiTags('BBVAController')
export class BBVAController {
	constructor(private readonly bankBBVAUseCase: BankBbvaUseCase) {}

	@Post('v1/inquire')
	async consultDebt(@Body() consultDebtRequestDTO: BBVAConsultDebtRequestDTO) {
		const response = await this.bankBBVAUseCase.consultDebt(consultDebtRequestDTO);
		return response;
	}

	@Post('v1/payment')
	async payment(@Body() paymentRequestDTO: BBVAPaymentRequestDTO) {
		const response = await this.bankBBVAUseCase.payment(paymentRequestDTO);
		return response;
	}

	@Post('v1/annulment')
	async annulmentPayment(@Body() annulmentPaymentRequestDTO: BBVAAnnulmentRequestDTO) {
		const response = await this.bankBBVAUseCase.annulmentPayment(annulmentPaymentRequestDTO);
		return response;
	}
}
