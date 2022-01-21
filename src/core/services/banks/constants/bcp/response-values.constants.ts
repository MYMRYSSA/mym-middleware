export const responseConstants = {
	SUCCESS: {
		code: 'CP0000',
		description: 'PROCESO CONFORME',
	},
	INVALID: {
		code: 'CP0010',
		description: 'DEUDA NO VALIDA',
	},
	TRANSACTION_INCOMPLETE: {
		code: 'CP0138',
		description: 'ERROR AL PROCESAR TRANSACCION',
	},
	ERROR_INQUIRE: {
		code: '3004',
		description: 'NO SE PUEDE REALIZAR EL REGISTRO DE EXTORNO',
	},
	NOT_INQUIRE: {
		code: 'CP0006',
		description: 'SIN DEUDA PENDIENTE',
	},
	ANNULMENT_NOT_PROCESS: {
		code: 'CP0139',
		description: 'NO PROCEDE EXTORNO POR INDIC. DE EMPRESA',
	},
	PAYMENT_NOT_PROCESS: {
		code: 'CP0140',
		description: 'NO PROCEDE PAGO POR INDIC. DE EMPRESA',
	},
	RESTRICTED_DEBT: {
		code: 'CP0141',
		description: 'DEUDA CON RESTRICCIONES',
	},
	PAYMENT_LIMIT_EXCEEDED: {
		code: 'CP0142',
		description: 'LIMITE DE PAGO SUPERADO',
	},
	WRONG_AMOUNT: {
		code: 'CP0144',
		description: 'MONTO A PAGAR ERRADO',
	},
};
