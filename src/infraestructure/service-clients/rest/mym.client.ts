import { HttpException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { IDebtInquiresRequest, IDebtInquiresResponse } from '../interface/mym.client.interface';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class MyMRestClient {
	private logger = new Logger('MyMRestClient');

	constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {}

	async debtInquires(requestDTO: IDebtInquiresRequest): Promise<Observable<AxiosResponse<IDebtInquiresResponse>>> {
		if (!this.configService.get<string>('MYM_API_URL')) throw new Error('Error en la configuracion');
		const token = this.configService.get<string>('TOKEN');
		const URI = `${this.configService.get<string>('MYM_API_URL')}/api/CustomerDebtInquiries`;
		this.logger.log(URI);
		const config: AxiosRequestConfig = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
		return this.httpService.post(URI, requestDTO, config).pipe(
			map(response => response.data),
			catchError(error => {
				throw new Error(error.message);
			}),
		);
	}
}
