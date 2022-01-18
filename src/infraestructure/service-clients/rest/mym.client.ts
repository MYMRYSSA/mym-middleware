import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as https from 'https';
import { ConfigService } from '@nestjs/config';
import { IDebtInquiresRequest, IDebtInquiresResponse } from '../interface/mym.client.interface';
import { lastValueFrom, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class MyMRestClient {
	private logger = new Logger('MyMRestClient');

	constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {}

	debtInquires(requestDTO: IDebtInquiresRequest): Promise<AxiosResponse<IDebtInquiresResponse>> {
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
			params: {
				...requestDTO,
			},
		};
		return lastValueFrom(this.httpService.post(URI, null, config).pipe(map(response => response.data)));
	}
}
