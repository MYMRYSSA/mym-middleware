import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PersistenceConfiguration } from './config/mongo/persistence.configuration';
import { PersistenceModule } from './persistence/persistence.module';
import { ServiceClientsModule } from './service-clients/microservice-clients.module';

@Module({
	imports: [
		MongooseModule.forRootAsync({
			useClass: PersistenceConfiguration,
		}),
		PersistenceModule,
		ServiceClientsModule,
	],
	exports: [PersistenceModule, ServiceClientsModule],
})
export class InfraestructureModule {}
