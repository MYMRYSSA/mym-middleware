import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PersistenceConfiguration } from './config/mongo/persistence.configuration';
import { PersistenceModule } from './persistence/persistence.module';

@Module({
	imports: [
		MongooseModule.forRootAsync({
			useClass: PersistenceConfiguration,
		}),
		PersistenceModule,
	],
	exports: [PersistenceModule],
})
export class InfraestructureModule {}
