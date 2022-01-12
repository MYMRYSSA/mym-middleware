import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { LoginUseCase, RegisterUserUseCase, ValidateUseCase } from './services/auth';
import { BankBbvaUseCase, BankBcpUseCase, BankScotiabankUseCase } from './services/banks';
import { InfraestructureModule } from '../infraestructure/infraestructure.module';

const services = [
	LoginUseCase,
	RegisterUserUseCase,
	ValidateUseCase,
	BankBbvaUseCase,
	BankBcpUseCase,
	BankScotiabankUseCase,
];

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => ({
				secret: config.get<string>('JWT_SECRET'),
				signOptions: { expiresIn: '3600s' },
			}),
			inject: [ConfigService],
		}),
		InfraestructureModule,
	],
	providers: services,
	exports: services,
})
export class ApplicationCoreModule {}
