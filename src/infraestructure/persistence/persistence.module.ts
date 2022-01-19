import { Module } from '@nestjs/common';
import { UserGateway } from './gateways/user.gateway';
import { RequestGateway } from './gateways/request.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Request, RequestSchema } from './schemas/request.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: User.name,
				schema: UserSchema,
			},
			{
				name: Request.name,
				schema: RequestSchema,
			},
		]),
	],
	providers: [UserGateway, RequestGateway],
	exports: [UserGateway, RequestGateway],
})
export class PersistenceModule {}
