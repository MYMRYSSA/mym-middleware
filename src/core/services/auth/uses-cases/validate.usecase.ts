import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ValidateUseCase {
	constructor(private readonly jwtService: JwtService) {}

	execute(jwt: string) {
		return this.jwtService.verify(jwt);
	}
}
