import * as bcrypt from 'bcrypt';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDTO } from '../dto/auth.dto';
import { UserGateway } from '../../../../infraestructure/persistence/gateways/user.gateway';

@Injectable()
export class LoginUseCase {
	private logger = new Logger(LoginUseCase.name);
	constructor(private readonly userGateway: UserGateway, private jwtService: JwtService) {}

	async execute(loginRequestDTO: LoginRequestDTO): Promise<any> {
		try {
			const userFound = await this.userGateway.getUserByUser(loginRequestDTO.user);

			if (!userFound) throw new Error('Credenciales no válidas');

			if (!bcrypt.compareSync(loginRequestDTO.password, userFound.password)) throw new Error('Credenciales no válidas');

			const { user, role } = userFound;
			return {
				data: { user: { user, role }, access_token: this.jwtService.sign({ userFound, role }) },
			};
		} catch (error) {
			this.logger.error(error);
			return {
				error: {
					code: 'ERRORCODE',
					message: error,
				},
			};
		}
	}
}
