// eslint-disable-next-line @typescript-eslint/no-var-requires
const xml2js = require('xml2js');

export const prepareXml = (value: string) => {
	const obj = {
		's:Envelope': {
			$: {
				'xmlns:s': 'http://schemas.xmlsoap.org/soap/http',
			},
			's:Body': {
				$: {
					'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema',
				},
				ejecutarTransaccionScotiabankResponse: {
					ejecutarTransaccionScotiabankReturn: value,
				},
			},
		},
	};
	const builder = new xml2js.Builder();
	const xml = builder.buildObject(obj);
	return xml;
};
