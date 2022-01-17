import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MyMRestClient } from './rest/mym.client';

@Module({
	imports: [
		HttpModule.registerAsync({
			useFactory: () => ({
				timeout: 5000,
				maxRedirects: 5,
			}),
		}),
	],
	providers: [MyMRestClient],
	exports: [MyMRestClient],
})
export class ServiceClientsModule {}
