import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('/api')
@ApiTags('HomeController')
export class HomeController {
	@Get('')
	@HttpCode(200)
	async getHelloWorld() {
		return 'Hello world';
	}
}
