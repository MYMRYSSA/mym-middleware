import { Body, Controller, HttpException, InternalServerErrorException, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConsultDebtService } from 'src/core/services/consultDebt.service';
import { PaymentService } from 'src/core/services/payment.service';
import { ReturnPaymentService } from 'src/core/services/returnPayment.service';

@Controller()
@ApiTags('BCPController')
export class BCPController {
	constructor(
		private readonly consultDebtService: ConsultDebtService,
		private readonly paymentService: PaymentService,
		private readonly returnPaymentService: ReturnPaymentService
	) {}

	@Post('v1/')
	async consultDebt(@Body() consultDebtRequestDTO: any) {
		const response = await this.consultDebtService.execute(consultDebtRequestDTO, '');
		if (response.error) {
			throw new HttpException(response.error, response.error.httpStatus);
		}
		return response;
	}

	@Post('v1/')
	async payment(@Body() paymentRequestDTO: any) {
		const response = await this.paymentService.execute(paymentRequestDTO, '');
		if (response.error) {
			throw new InternalServerErrorException(response.error);
		}
		return response;
	}

	@Post('v1/')
	async returnPayment(@Body() returnPaymentRequestDTO: any) {
		const response = await this.returnPaymentService.execute(returnPaymentRequestDTO, '');
		if (response.error) {
			throw new InternalServerErrorException(response.error);
		}
		return response;
	}
}
