import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateRequestDTO, UpdateRequestDTO } from '../dto/request.dto';
import { Request, RequestDocument } from '../schemas/request.schema';

@Injectable()
export class RequestGateway {
	constructor(@InjectModel(Request.name) private requestModel: Model<RequestDocument>) {}

	async create(createRequestDTO: CreateRequestDTO): Promise<Request> {
		const model = new this.requestModel(createRequestDTO);
		return model.save();
	}

	async update(id: ObjectId, updateRequestDTO: UpdateRequestDTO): Promise<Request> {
		return this.requestModel.findByIdAndUpdate({ _id: id }, updateRequestDTO);
	}

	async find(filter): Promise<Request> {
		return this.requestModel.findOne(filter);
	}

	async query(query, page = 0, limit = 1000) {
		if (page > 0) page -= 1;
		const total = await this.requestModel.count(query);
		const requests = await this.requestModel
			.find(query)
			.sort({ createdAt: -1 })
			.limit(limit)
			.skip(page * limit)
			.lean();
		return {
			total,
			requests,
		};
	}
}
