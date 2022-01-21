import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

export class BCPConsultDebtRequestDTO {
	@ApiProperty({ required: true })
	@IsString()
	rqUUID: string;

	@ApiProperty({ required: true })
	@IsString()
	operationDate: string;

	@ApiProperty({ required: true })
	@IsString()
	operationNumber: string;

	@ApiProperty({ required: true })
	@IsString()
	financialEntity: string;

	@ApiProperty({ required: true })
	@IsString()
	channel: string;

	@ApiProperty({ required: true })
	@IsString()
	serviceId: string;

	@ApiProperty({ required: true })
	@IsString()
	customerId: string;
}

/** Payment */
export class CheckContent {
	@ApiProperty({ required: true })
	@IsOptional()
	@IsString()
	checkNumber?: string;

	@ApiProperty({ required: true })
	@IsOptional()
	@IsString()
	financialEntity?: string;
}

export class AmountContent {
	@ApiProperty({ required: true })
	@IsString()
	amountType: string;

	@ApiProperty({ required: true })
	@IsString()
	amount: string;
}

export class DocumentContent {
	@ApiProperty({ required: true })
	@IsString()
	documentId: string;

	@ApiProperty({ required: true })
	@IsString()
	expirationDate: string;

	@ApiProperty({ required: true })
	@IsString()
	documentReference: string;

	@ApiProperty({ required: true })
	@ValidateNested({ each: true })
	@Type(() => CheckContent)
	amounts: AmountContent[];
}
export class BCPPaymentRequestDTO {
	@ApiProperty({ required: true })
	@IsString()
	rqUUID: string;

	@ApiProperty({ required: true })
	@IsString()
	operationDate: string;

	@ApiProperty({ required: true })
	@IsString()
	operationNumber: string;

	@ApiProperty({ required: true })
	@IsString()
	financialEntity: string;

	@ApiProperty({ required: true })
	@IsString()
	channel: string;

	@ApiProperty({ required: true })
	@IsString()
	serviceId: string;

	@ApiProperty({ required: true })
	@IsString()
	customerId: string;

	@ApiProperty({ required: true })
	@IsString()
	paymentType: string;

	@ApiProperty({ required: true })
	@IsString()
	amountTotal: string;

	@ApiProperty({ required: true })
	@IsOptional()
	@ValidateNested()
	@Type(() => CheckContent)
	check?: CheckContent;

	@ApiProperty({ required: true })
	@ValidateNested({ each: true })
	@Type(() => DocumentContent)
	documents: DocumentContent[];
}

/** Annulment */
export class BCPAnnulmentRequestDTO {
	@ApiProperty({ required: true })
	@IsString()
	rqUUID: string;

	@ApiProperty({ required: true })
	@IsString()
	operationDate: string;

	@ApiProperty({ required: true })
	@IsString()
	operationNumber: string;

	@ApiProperty({ required: true })
	@IsString()
	operationNumberAnnulment: string;

	@ApiProperty({ required: true })
	@IsString()
	financialEntity: string;

	@ApiProperty({ required: true })
	@IsString()
	customerId: string;

	@ApiProperty({ required: true })
	@IsString()
	channel: string;
}
