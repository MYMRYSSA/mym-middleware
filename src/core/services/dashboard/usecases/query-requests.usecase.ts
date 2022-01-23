import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RequestGateway } from 'src/infraestructure/persistence/gateways/request.gateway';
import { IResponseDTO, QueryRequestDTO } from '../dto/request.dto';

@Injectable()
export class QueryRequestUseCase {
	private logger = new Logger(QueryRequestUseCase.name);

	constructor(private readonly requestGateway: RequestGateway) {}

	async execute(request: QueryRequestDTO): Promise<IResponseDTO> {
		try {
			const payload = { ...request };
			const { dateFilter } = request.params;
			delete request.params.dateFilter;

			if (dateFilter) {
				payload.params.createdAt = this.cleanDateFilter(dateFilter);
			}
			const response = await this.requestGateway.query(payload.params, request.page, request.itemsPerPage);
			return {
				success: true,
				response,
				httpStatus: HttpStatus.OK,
				message: 'Requests',
			};
		} catch (e) {
			this.logger.error(e);
			return {
				success: false,
				response: e?.response?.data || e,
				httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
				message: e.message,
			};
		}
	}

	cleanDateFilter(dateFilter: any) {
		const first_element = 0;
		const second_element = 1;
		const third_element = 2;
		const one = 1;
		const end_hours = 23;
		const end_minutes = 59;
		const temp_startDate = dateFilter.startDate.split('-');
		const temp_endDate = dateFilter.endDate.split('-');
		const createdAt = {
			$gte: new Date(
				temp_startDate[first_element],
				temp_startDate[second_element] - one,
				temp_startDate[third_element],
			),
			$lte: new Date(temp_endDate[first_element], temp_endDate[second_element] - one, temp_endDate[third_element]),
		};
		createdAt.$lte.setHours(end_hours);
		createdAt.$lte.setMinutes(end_minutes);
		createdAt.$lte.setSeconds(end_minutes);

		return createdAt;
	}
}
