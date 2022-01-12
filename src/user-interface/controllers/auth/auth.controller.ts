import { BadRequestException, Body, Controller, HttpException, InternalServerErrorException, Post } from '@nestjs/common';
import { LoginRequestDTO, RegisterRequestDTO } from '../../../core/services/auth/dto/auth.dto';
import { LoginUseCase, RegisterUserUseCase } from '../../../core/services/auth';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('AuthController')
export class AuthController {
	constructor(
		private readonly loginUseCase: LoginUseCase,
		private readonly registerUseCase: RegisterUserUseCase,
	) {}

	@Post('v1/auth/login')
	async login(@Body() loginRequestDTO: LoginRequestDTO) {
		const response = await this.loginUseCase.execute(loginRequestDTO);
		if (response.error) {
			throw new HttpException(response.error, response.error.httpStatus);
		}
		return response;
	}

	@Post('v1/auth/register')
	async register(@Body() registerRequestDTO: RegisterRequestDTO) {
		const response = await this.registerUseCase.execute(registerRequestDTO);
		if (response.error) {
			throw new InternalServerErrorException(response.error);
		}
		return response;
	}
}
