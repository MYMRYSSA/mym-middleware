import * as inquireStructure from './inquire-structure.json';
import * as paymentStructure from './payment-structure.json';
import * as returnStructure from './return-structure.json';

export enum InputEnum {
	INQUIRE = 'inquire',
	PAYMENT = 'payment',
	RETURN = 'return',
}

export const getInputValues = (input: string, type: InputEnum) => {
	const obj = {};
	let structure: Array<{ id: string; start: number; end: number }> = [];
	switch (type) {
		case InputEnum.INQUIRE:
			structure = inquireStructure;
			console.log('🚀 ~ file: helpers.ts ~ line 17 ~ getInputValues ~ inquireStructure', inquireStructure);
			break;
		case InputEnum.PAYMENT:
			structure = paymentStructure;
			break;
		case InputEnum.RETURN:
			structure = returnStructure;
			break;
	}
	structure.forEach(item => {
		obj[item.id] = input.slice(item.start, item.end + 1);
	});
	return obj;
};
