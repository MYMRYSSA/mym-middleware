import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type RequestDocument = Request & mongoose.Document;

@Schema()
export class Request {
	@Prop()
	requestId: string;

	@Prop()
	processId: string;

	@Prop()
	documentIds: string[];

	@Prop()
	customerId: string;

	@Prop()
	type: string;

	@Prop({ type: mongoose.Schema.Types.Mixed })
	request: any;

	@Prop({ type: mongoose.Schema.Types.Mixed })
	response: any;

	@Prop()
	bank: string;

	@Prop()
	currency: string;

	@Prop()
	paymentMethod: string;

	@Prop()
	serviceId?: string;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
