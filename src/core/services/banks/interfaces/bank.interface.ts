export interface IBankfactory {
	consultDebt(payloadRequest: any): any;
	payment(payloadRequest: any): any;
	annulmentPayment(payloadRequest: any): any;
}

export interface IXmlJson {
	'soapenv:Envelope': {
		'@xmlns:soapenv': string;
		'@xmlns:xsd': string;
		'@xmlns:xsi': string;
		'soapenv:Body': {
			ejecutarTransaccionScotiabank: {
				'@xmlns': string;
				Input: string;
			};
		};
	};
}
