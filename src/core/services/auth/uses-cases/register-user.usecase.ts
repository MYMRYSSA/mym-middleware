import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserGateway } from '../../../../infraestructure/persistence/gateways/user.gateway';
import { RegisterRequestDTO } from '../dto/auth.dto';

@Injectable()
export class RegisterUserUseCase {
	private logger = new Logger(RegisterUserUseCase.name);

	constructor(private readonly userGateway: UserGateway) {}

	async execute(registerRequestDTO: RegisterRequestDTO): Promise<any> {
		try {
			const user = await this.userGateway.getUserByUser(registerRequestDTO.user);
			if (user) throw new Error('Usuario existe');

			const password: string = bcrypt.hashSync(registerRequestDTO.password, 10);

			const newUser = await this.userGateway.create({
				...registerRequestDTO,
				password,
			});

			if (!newUser) {
				throw new Error('Error tal crear usuario');
			}
			return {
				data: { newUser, password: undefined },
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
