import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { IDebtInquiresRequest, IDebtInquiresResponse } from '../interface/mym.inquire.interface';
import { IPaymentRequest, IPaymentResponse } from '../interface/mym.payment.interface';
import { IAnnulmentRequest } from '../interface/mym.annulment.interface';
import * as https from 'https';

@Injectable()
export class MyMRestClient {
	private logger = new Logger('MyMRestClient');

	constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {}

	debtInquires(requestDTO: IDebtInquiresRequest): Promise<IDebtInquiresResponse> {
		if (!this.configService.get<string>('MYM_API_URL')) throw new Error('Error en la configuracion');
		const token = this.configService.get<string>('TOKEN');
		const URI = `${this.configService.get<string>('MYM_API_URL')}/api/CustomerDebtInquiries`;
		this.logger.log(URI);
		const agent = new https.Agent({
			rejectUnauthorized: false,
		});
		const config: AxiosRequestConfig = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			httpsAgent: agent,
			params: requestDTO,
		};
		return lastValueFrom(this.httpService.post(URI, null, config).pipe(map(response => response.data)));
	}

	payment(requestDTO: IPaymentRequest): Promise<IPaymentResponse> {
		if (!this.configService.get<string>('MYM_API_URL')) throw new Error('Error en la configuracion');
		const token = this.configService.get<string>('TOKEN');
		const URI = `${this.configService.get<string>('MYM_API_URL')}/api/CustomerPayments`;
		this.logger.log(URI);
		const agent = new https.Agent({
			rejectUnauthorized: false,
		});
		const config: AxiosRequestConfig = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			httpsAgent: agent,
			params: {
				...requestDTO,
				paidDocuments: JSON.stringify(requestDTO.paidDocuments),
			},
		};
		return lastValueFrom(this.httpService.post(URI, {}, config).pipe(map(response => response.data)));
	}

	annulmentPayment(requestDTO: IAnnulmentRequest): Promise<IPaymentResponse> {
		if (!this.configService.get<string>('MYM_API_URL')) throw new Error('Error en la configuracion');
		const token = this.configService.get<string>('TOKEN');
		const URI = `${this.configService.get<string>('MYM_API_URL')}/api/BankReturnRequest`;
		this.logger.log(URI);
		const agent = new https.Agent({
			rejectUnauthorized: false,
		});
		const config: AxiosRequestConfig = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			httpsAgent: agent,
			params: requestDTO,
		};
		return lastValueFrom(this.httpService.post(URI, null, config).pipe(map(response => response.data)));
	}
}
