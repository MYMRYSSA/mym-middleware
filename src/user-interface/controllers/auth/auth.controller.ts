import {
	Body,
	Controller,
	Get,
	HttpException,
	InternalServerErrorException,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common';
import { LoginRequestDTO, RegisterRequestDTO } from '../../../core/services/auth/dto/auth.dto';
import { LoginUseCase, RegisterUserUseCase } from '../../../core/services/auth';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/user-interface/guards/jwt-auth.guard';

@Controller()
@ApiTags('AuthController')
export class AuthController {
	constructor(private readonly loginUseCase: LoginUseCase, private readonly registerUseCase: RegisterUserUseCase) {}

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

	@UseGuards(JwtAuthGuard)
	@Get('v1/account')
	async account(@Request() req) {
		return req.user;
	}
}
