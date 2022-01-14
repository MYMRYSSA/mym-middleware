import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();

	app.useGlobalPipes(new ValidationPipe());

	app.listen(3000).then(() => {
		console.log('Service start on 3000');
	});
}
bootstrap();
