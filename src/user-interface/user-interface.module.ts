import { Module } from '@nestjs/common';
import { ApplicationCoreModule } from '../core/core.module';
import { AuthController } from './controllers/auth/auth.controller';
import { BBVAController, BCPController, ScotiabankController } from './controllers/banks';

@Module({
	imports: [ApplicationCoreModule],
	controllers: [AuthController, BBVAController, BCPController, ScotiabankController],
	providers: [],
})
export class UserInterfaceModule {}
