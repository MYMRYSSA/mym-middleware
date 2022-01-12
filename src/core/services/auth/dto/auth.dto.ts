import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class LoginRequestDTO {
	@ApiProperty({ required: true })
	@IsString()
	user: string;

	@ApiProperty()
	@IsOptional()
	role: string;

	@ApiProperty({ required: true })
	@IsString()
	@MinLength(6)
	password: string;
}

export type RegisterRequestDTO = Partial<LoginRequestDTO>;
