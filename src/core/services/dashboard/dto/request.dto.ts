import { ApiProperty } from '@nestjs/swagger';

export class QueryRequestDTO {
	@ApiProperty()
	page?: number;

	@ApiProperty()
	itemsPerPage?: number;

	@ApiProperty()
	params: any;
}

export interface IResponseDTO {
	success: boolean;
	message: string;
	httpStatus: number;
	response: any;
}
