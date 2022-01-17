import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { IDebtInquiresRequest, IDebtInquiresResponse } from '../interface/mym.client.interface';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class MyMRestClient {
	private logger = new Logger('MyMRestClient');

	constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {}

	debtInquires(requestDTO: IDebtInquiresRequest): Observable<AxiosResponse<IDebtInquiresResponse>> {
		if (!this.configService.get<string>('MYM_API_URL')) throw new Error('Error en la configuracion');
		const URI = `${this.configService.get<string>('MYM_API_URL')}/api/CustomerDebtInquiries`;
		this.logger.log(URI);
		const response = this.httpService.post<IDebtInquiresResponse>(URI, requestDTO);
		this.logger.log(response);

		return response;
	}
}
