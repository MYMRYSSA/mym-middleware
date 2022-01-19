import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RequestDocument = Request & Document;

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

	@Prop()
	request: any;

	@Prop()
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
