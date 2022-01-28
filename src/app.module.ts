import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserInterfaceModule } from './user-interface/user-interface.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		MongooseModule.forRoot(
			'mongodb+srv://admin:dvMNPVQU6L9IGQqG@cluster0.mwnzn.mongodb.net/mym_middleware_db?authSource=admin&replicaSet=atlas-som0en-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true',
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			},
		),
		UserInterfaceModule,
	],
})
export class AppModule {}
