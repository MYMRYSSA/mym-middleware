import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BankBcpUseCase } from 'src/core/services/banks';
import {
	BCPAnnulmentRequestDTO,
	BCPConsultDebtRequestDTO,
	BCPPaymentRequestDTO,
} from 'src/core/services/banks/dto/bcp/bcp.requests.dto';

@Controller('/api/bcp')
@ApiTags('BCPController')
export class BCPController {
	constructor(private readonly bankBcpUseCase: BankBcpUseCase) {}

	@Post('v1/inquire')
	@HttpCode(200)
	async consultDebt(@Body() consultDebtRequestDTO: BCPConsultDebtRequestDTO) {
		const response = await this.bankBcpUseCase.consultDebt(consultDebtRequestDTO);
		return response;
	}

	@Post('v1/payment')
	@HttpCode(200)
	async payment(@Body() paymentRequestDTO: BCPPaymentRequestDTO) {
		const response = await this.bankBcpUseCase.payment(paymentRequestDTO);
		return response;
	}

	@Post('v1/annulment')
	@HttpCode(200)
	async annulmentPayment(@Body() annulmentPaymentRequestDTO: BCPAnnulmentRequestDTO) {
		const response = await this.bankBcpUseCase.annulmentPayment(annulmentPaymentRequestDTO);
		return response;
	}
}
