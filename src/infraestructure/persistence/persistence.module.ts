import { Module } from '@nestjs/common';
import { UserGateway } from './gateways/user.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: User.name,
				schema: UserSchema,
			},
		]),
	],
	providers: [UserGateway],
	exports: [UserGateway],
})
export class PersistenceModule {}
