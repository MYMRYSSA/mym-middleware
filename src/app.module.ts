import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserInterfaceModule } from './user-interface/user-interface.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		MongooseModule.forRoot(process.env.MONGO_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}),
		UserInterfaceModule,
	],
})
export class AppModule {}
