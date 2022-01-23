import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QueryRequestDTO } from 'src/core/services/dashboard/dto/request.dto';
import { QueryRequestUseCase } from 'src/core/services/dashboard/usecases/query-requests.usecase';
import { JwtAuthGuard } from 'src/user-interface/guards/jwt-auth.guard';

@Controller('/api/dashboard')
@ApiTags('RequestController')
export class RequestController {
	constructor(private readonly queryRequest: QueryRequestUseCase) {}

	@UseGuards(JwtAuthGuard)
	@Post('v1/query')
	@HttpCode(200)
	async getQueryRequest(@Body() queryRequestDTO: QueryRequestDTO) {
		const response = await this.queryRequest.execute(queryRequestDTO);
		return response;
	}
}
