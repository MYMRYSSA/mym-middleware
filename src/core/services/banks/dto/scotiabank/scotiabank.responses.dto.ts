export interface IScotiabankConsultDebtResponseDTO {
	'MESSAGE TYPE IDENTIFICATION': string;
	'PRIMARY BIT MAP': string;
	'SECONDARY BIT MAP': string;
	'CODIGO DE PROCESO': string;
	MONTO: string;
	'FECHA Y HORA DE TRANSACCION': string;
	TRACE: string;
	'FECHA DE CAPTURA': string;
	'BIN ADQUIRIENTE': string;
	'RETRIEVAL REFERENCE - NUMBER': string;
	'AUTHORIZATION ID RESPONSE': string;
	'RESPONSE CODE': string;
	'TERMINAL ID': string;
	'TRANSACTION CURRENCY CODE': string;
	'DATOS RESERVADOS': string;
	'LONGITUD DEL CAMPO': string;
	'CODIGO DE FORMATO': string;
	'BIN PROCESADOR': string;
	'BIN ACREEDOR': string;
	'CODIGO PRODUCTO / SERVICIO': string;
	AGENCIA: string;
	'TIPO DE IDENTIFICACION': string;
	'NUMERO DE IDENTIFICACION': string;
	'NOMBRE DEL DEUDOR': string;
	'NUMERO DE SERVICIOS DEVUELTOS': string;
	'NUMERO DE OPERACIÓN DE COBRANZA': string;
	'INDICADOR SI HAY MAS DOCUMENTOS': string;
	'TAMAÑO MAXIMO DE BLOQUE': string;
	'POSICION DEL ULTIMO DOCUMENTO': string;
	'PUNTERO DE LA BASE DE DATOS': string;
	'ORIGEN DE RESPUESTA': string;
	'CODIGO DE RESPUESTA': string;
	'FILLER 1': string;
	'CODIGO DE PRODUCTO/SERVICIO': string;
	MONEDA: string;
	'ESTADO DEL DEUDOR': string;
	'MENSAJE 1 AL DEUDOR': string;
	'MENSAJE 2 AL DEUDOR': string;
	'INDICADOR DE CRONOLOGIA': string;
	'INDICADOR DE PAGOS VENCIDOS': string;
	'RESTRICCION DE PAGO': string;
	'DOCUMENTOS POR SERVICIO': string;
	'FILLER 2': string;
	'TIPO DE SERVICIO 1': string;
	'NUMERO DE DOCUMENTO 1': string;
	'REFERENCIA DE LA DEUDA 1': string;
	'FECHA DE VENCIMIENTO 1': string;
	'IMPORTE MINIMO 1': string;
	'IMPORTE A TOTAL 1': string;
}

/** Payment */
// export interface IScotiabankPaymentResponseDTO {}

/** Annulment */
// export interface IScotiabankAnnulmentResponseDTO {}
