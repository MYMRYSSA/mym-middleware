export const responseConstants = {
	SUCCESS: {
		code: 'CP0000',
		description: 'PROCESO CONFORME',
	},
	'DOCUMENTO SOLICITADO PARA EXTORNAR NO ENCONTRADO': {
		code: 'CP0010',
		description: 'DEUDA NO VALIDA',
	},
	TRANSACTION_INCOMPLETE: {
		code: 'CP0138',
		description: 'ERROR AL PROCESAR TRANSACCION',
	},
	'CLIENTE SIN DEUDAS': {
		code: 'CP0006',
		description: 'SIN DEUDA PENDIENTE',
	},
	'AGOTADO EL TIEMPO PARA SOLICITAR EXTORNO': {
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
	'MONTO TOTAL PAGADO NO COINCIDE CON MONTO PAGADO POR DOCUMENTO': {
		code: 'CP0144',
		description: 'MONTO A PAGAR ERRADO',
	},
	'ERROR EN MONTO': {
		code: 'CP0144',
		description: 'MONTO A PAGAR ERRADO',
	},
	'TOTAL AMOUNT ES MAYOR QUE LOS DOCUMENTOS PAGADOS': {
		code: 'CP0144',
		description: 'MONTO A PAGAR ERRADO',
	},
};