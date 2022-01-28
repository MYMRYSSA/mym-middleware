import { Module } from '@nestjs/common';
import { ApplicationCoreModule } from '../core/core.module';
import { AuthController } from './controllers/auth/auth.controller';
import { BBVAController, BCPController, ScotiabankController } from './controllers/banks';
import { RequestController } from './controllers/dashboard/request.controller';
import { HomeController } from './controllers/home/home.controller';

@Module({
	imports: [ApplicationCoreModule],
	controllers: [AuthController, BBVAController, BCPController, ScotiabankController, RequestController, HomeController],
	providers: [],
})
export class UserInterfaceModule {}
