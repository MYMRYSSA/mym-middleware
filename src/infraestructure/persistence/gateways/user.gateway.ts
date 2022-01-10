import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDTO, UpdateUserDTO } from '../dto/user.dto';

@Injectable()
export class UserGateway {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async create(createUserDTO: CreateUserDTO): Promise<User> {
		const model = new this.userModel(createUserDTO);
		return model.save();
	}

	async getUserByUser(user: string): Promise<User> {
		return await this.userModel.findOne({ user });
	}
}
