import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type RequestDocument = Request & mongoose.Document;

@Schema({ timestamps: true })
export class Request {
	_id?: string;

	@Prop()
	requestId: string;

	@Prop()
	requestPaymentId: string;

	@Prop()
	processId: string;

	@Prop()
	operationId?: string;

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
