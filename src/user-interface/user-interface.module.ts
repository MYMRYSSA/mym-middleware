import { Module } from '@nestjs/common';
import { ApplicationCoreModule } from '../core/core.module';
import { AuthController } from './controllers/auth.controller';

@Module({
	imports: [ApplicationCoreModule],
	controllers: [AuthController],
	providers: [],
})
export class UserInterfaceModule {}
