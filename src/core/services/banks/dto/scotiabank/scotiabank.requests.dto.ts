import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export enum EnumCurrency {
	USD = 'USD',
	PEN = 'PEN',
}

/** ConsultDebt */
export class ScotiabankConsultDebtRequestDTO {
	@ApiProperty({ required: true })
	@IsString()
	'TIPO IDENTIF. MENSAJE': string;

	@ApiProperty({ required: true })
	@IsString()
	'BIT PRIMARIO': string;

	@ApiProperty({ required: true })
	@IsString()
	'BIT SECUNDARIO': string;

	@ApiProperty({ required: true })
	@IsString()
	'NUMERO DE TARJETA': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE PROCESO': string;

	@ApiProperty({ required: true })
	@IsString()
	'MONTO': string;

	@ApiProperty({ required: true })
	@IsString()
	'FECHA Y HORA DE TRANSACCION': string;

	@ApiProperty({ required: true })
	@IsString()
	'TRACE': string;

	@ApiProperty({ required: true })
	@IsString()
	'FECHA DE CAPTURA': string;

	@ApiProperty({ required: true })
	@IsString()
	'MODO DE INGRESO DE DATOS': string;

	@ApiProperty({ required: true })
	@IsString()
	'CANAL': string;

	@ApiProperty({ required: true })
	@IsString()
	'BIN ADQUIRIENTE': string;

	@ApiProperty({ required: true })
	@IsString()
	'FORWARD INSTITUTION CODE': string;

	@ApiProperty({ required: true })
	@IsString()
	'RETRIEVAL REFERENCE NUMBER': string;

	@ApiProperty({ required: true })
	@IsString()
	'TERMINAL ID': string;

	@ApiProperty({ required: true })
	@IsString()
	'COMERCIO': string;

	@ApiProperty({ required: true })
	@IsString()
	'CARD ACCEPTOR LOCATION': string;

	@ApiProperty({ required: true })
	@IsString()
	'TRANSACTION CURRENCY CODE': string;

	@ApiProperty({ required: true })
	@IsString()
	'DATOS RESERVADOS': string;

	@ApiProperty({ required: true })
	@IsString()
	'DATOS DEL REQUERIMIENTO': string;

	@ApiProperty({ required: true })
	@IsString()
	'LONGITUD DEL REQUERIMIENTO': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE FORMATO': string;

	@ApiProperty({ required: true })
	@IsString()
	'BIN PROCESADOR': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE ACREEDOR': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE PRODUCTO/SERVICIO': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE PLAZA DEL RECAUDADOR': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE AGENCIA DEL RECAUDADOR': string;

	@ApiProperty({ required: true })
	@IsString()
	'TIPO DE DATO DE CONSULTA': string;

	@ApiProperty({ required: true })
	@IsString()
	'DATO DE CONSULTA': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE CIUDAD': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE SERVICIO': string;

	@ApiProperty({ required: true })
	@IsString()
	'NUMERO DE DOCUMENTO': string;

	@ApiProperty({ required: true })
	@IsString()
	'NUMERO DE OPERACIÓN': string;

	@ApiProperty({ required: true })
	@IsString()
	'FILLER': string;

	@ApiProperty({ required: true })
	@IsString()
	'TAMAÑO MAXIMO DE BLOQUE': string;

	@ApiProperty({ required: true })
	@IsString()
	'POSICION DEL ULTIMO DOCUMENTO': string;

	@ApiProperty({ required: true })
	@IsString()
	'PUNTERO DE LA BASE DE DATOS': string;
}

/** Payment */
export class ScotiabankPaymentRequestDTO {
	@ApiProperty({ required: true })
	@IsString()
	'TIPO IDENTIF. MENSAJE': string;

	@ApiProperty({ required: true })
	@IsString()
	'BIT PRIMARIO': string;

	@ApiProperty({ required: true })
	@IsString()
	'BIT SECUNDARIO': string;

	@ApiProperty({ required: true })
	@IsString()
	'NUMERO DE TARJETA': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE PROCESO': string;

	@ApiProperty({ required: true })
	@IsString()
	'MONTO': string;

	@ApiProperty({ required: true })
	@IsString()
	'FECHA Y HORA DE TRANSACCION': string;

	@ApiProperty({ required: true })
	@IsString()
	'TRACE': string;

	@ApiProperty({ required: true })
	@IsString()
	'FECHA DE CAPTURA': string;

	@ApiProperty({ required: true })
	@IsString()
	'MODO DE INGRESO DE DATOS': string;

	@ApiProperty({ required: true })
	@IsString()
	'CANAL': string;

	@ApiProperty({ required: true })
	@IsString()
	'BIN ADQUIRIENTE': string;

	@ApiProperty({ required: true })
	@IsString()
	'FORWARD INSTITUTION CODE': string;

	@ApiProperty({ required: true })
	@IsString()
	'RETRIEVAL REFERENCE NUMBER': string;

	@ApiProperty({ required: true })
	@IsString()
	'TERMINAL ID': string;

	@ApiProperty({ required: true })
	@IsString()
	'COMERCIO': string;

	@ApiProperty({ required: true })
	@IsString()
	'CARD ACCEPTOR LOCATION': string;

	@ApiProperty({ required: true })
	@IsString()
	'TRANSACTION CURRENCY CODE': string;

	@ApiProperty({ required: true })
	@IsString()
	'DATOS RESERVADOS': string;

	@ApiProperty({ required: true })
	@IsString()
	'DATOS DEL REQUERIMIENTO': string;

	@ApiProperty({ required: true })
	@IsString()
	'LONGITUD DE LA TRAMA': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE FORMATO': string;

	@ApiProperty({ required: true })
	@IsString()
	'BIN PROCESADOR': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE ACREEDOR': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE PRODUCTO': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE PLAZA DEL RECAUDADOR': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE AGENCIA DEL RECAUDADOR': string;

	@ApiProperty({ required: true })
	@IsString()
	'TIPO DE DATO DE PAGO': string;

	@ApiProperty({ required: true })
	@IsString()
	'DATO DE PAGO': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE CIUDAD': string;

	@ApiProperty({ required: true })
	@IsString()
	'NUMERO DE PROD/SERV PAGADO': string;

	@ApiProperty({ required: true })
	@IsString()
	'NUMERO TOTAL DE DOC PAGADO': string;

	@ApiProperty({ required: true })
	@IsString()
	'FILLER 1': string;

	@ApiProperty({ required: true })
	@IsString()
	'MEDIO DE PAGO': string;

	@ApiProperty({ required: true })
	@IsString()
	'IMPORTE PAGADO EFECTIVO': string;

	@ApiProperty({ required: true })
	@IsString()
	'IMPORTE PAG.C.CTA': string;

	@ApiProperty({ required: true })
	@IsString()
	'NRO CHEQUE 1': string;

	@ApiProperty({ required: true })
	@IsString()
	'BCO GIRADOR 1': string;

	@ApiProperty({ required: true })
	@IsString()
	'IMPORTE CHEQUE 1': string;

	@ApiProperty({ required: true })
	@IsString()
	'PLAZA CHEQUE 1': string;

	@ApiProperty({ required: true })
	@IsString()
	'NRO CHEQUE 2': string;

	@ApiProperty({ required: true })
	@IsString()
	'BCO GIRADOR 2': string;

	@ApiProperty({ required: true })
	@IsString()
	'IMPORTE CHEQUE 2': string;

	@ApiProperty({ required: true })
	@IsString()
	'PLAZA CHEQUE 2': string;

	@ApiProperty({ required: true })
	@IsString()
	'NRO CHEQUE 3': string;

	@ApiProperty({ required: true })
	@IsString()
	'BCO GIRADOR 3': string;

	@ApiProperty({ required: true })
	@IsString()
	'IMPORTE CHEQUE 3': string;

	@ApiProperty({ required: true })
	@IsString()
	'PLAZA CHEQUE 3': string;

	@ApiProperty({ required: true })
	@IsString()
	'MONEDA DE PAGO': string;

	@ApiProperty({ required: true })
	@IsString()
	'TIPO DE CAMBIO APLICADO': string;

	@ApiProperty({ required: true })
	@IsString()
	'PAGO TOTAL REALIZADO': string;

	@ApiProperty({ required: true })
	@IsString()
	'FILLER 2': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE SERVICIO PAGADO': string;

	@ApiProperty({ required: true })
	@IsString()
	'ESTADO DEL DEUDOR': string;

	@ApiProperty({ required: true })
	@IsString()
	'IMPORTE TOTAL X PROD/SERV': string;

	@ApiProperty({ required: true })
	@IsString()
	'NRO DE CUENTA DE ABONO': string;

	@ApiProperty({ required: true })
	@IsString()
	'NRO DE REFERENCIA DEL ABONO': string;

	@ApiProperty({ required: true })
	@IsString()
	'NRO DE DOCUMENTOS PAGADOS': string;

	@ApiProperty({ required: true })
	@IsString()
	'FILLER 3': string;

	@ApiProperty({ required: true })
	@IsString()
	'TIPO DE DOCUMENTO DE PAGO': string;

	@ApiProperty({ required: true })
	@IsString()
	'NUMERO DE DOCUMENTO DE PAG': string;

	@ApiProperty({ required: true })
	@IsString()
	'PERIODO DE COTIZACION': string;

	@ApiProperty({ required: true })
	@IsString()
	'TIPO DOC ID. DEUDOR': string;

	@ApiProperty({ required: true })
	@IsString()
	'NUMERO DOC ID DEL DEUDOR': string;

	@ApiProperty({ required: true })
	@IsString()
	'IMPORTE ORIGINAL DE LA DEUDA': string;

	@ApiProperty({ required: true })
	@IsString()
	'IMPORTE PAGADO DEL DOCUMENTO': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE CONCEPTO 1': string;

	@ApiProperty({ required: true })
	@IsString()
	'IMPORTE DE CONCEPTO 1': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE CONCEPTO 2': string;

	@ApiProperty({ required: true })
	@IsString()
	'IMPORTE DE CONCEPTO 2': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE CONCEPTO 3': string;

	@ApiProperty({ required: true })
	@IsString()
	'IMPORTE DE CONCEPTO 3': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE CONCEPTO 4': string;

	@ApiProperty({ required: true })
	@IsString()
	'IMPORTE DE CONCEPTO 4': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE CONCEPTO 5': string;

	@ApiProperty({ required: true })
	@IsString()
	'IMPORTE DE CONCEPTO 5': string;

	@ApiProperty({ required: true })
	@IsString()
	'REFERENCIA DE LA DEUDA': string;

	@ApiProperty({ required: true })
	@IsString()
	'FILLER': string;
}

/** Annulment */
export class ScotiabankAnnulmentRequestDTO {
	@ApiProperty({ required: true })
	@IsString()
	'TIPO IDENTIF. MENSAJE 1': string;

	@ApiProperty({ required: true })
	@IsString()
	'BIT PRIMARIO': string;

	@ApiProperty({ required: true })
	@IsString()
	'BIT SECUNDARIO': string;

	@ApiProperty({ required: true })
	@IsString()
	'NUMERO DE TARJETA': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE PROCESO': string;

	@ApiProperty({ required: true })
	@IsString()
	'MONTO': string;

	@ApiProperty({ required: true })
	@IsString()
	'FECHA Y HORA DE TRANSACCION 1': string;

	@ApiProperty({ required: true })
	@IsString()
	'TRACE 1': string;

	@ApiProperty({ required: true })
	@IsString()
	'FECHA DE CAPTURA': string;

	@ApiProperty({ required: true })
	@IsString()
	'MODO DE INGRESO DE DATOS': string;

	@ApiProperty({ required: true })
	@IsString()
	'CANAL': string;

	@ApiProperty({ required: true })
	@IsString()
	'BIN ADQUIRIENTE 1': string;

	@ApiProperty({ required: true })
	@IsString()
	'FORWARD INSTITUTION CODE 1': string;

	@ApiProperty({ required: true })
	@IsString()
	'RETRIEVAL REFERENCE NUMBER': string;

	@ApiProperty({ required: true })
	@IsString()
	'TERMINAL ID': string;

	@ApiProperty({ required: true })
	@IsString()
	'COMERCIO': string;

	@ApiProperty({ required: true })
	@IsString()
	'CARD ACCEPTOR LOCATION': string;

	@ApiProperty({ required: true })
	@IsString()
	'TRANSACTION CURRENCY CODE': string;

	@ApiProperty({ required: true })
	@IsString()
	'ORIGINAL DATA ELEMENTS': string;

	@ApiProperty({ required: true })
	@IsString()
	'TIPO IDENTIF. MENSAJE 2': string;

	@ApiProperty({ required: true })
	@IsString()
	'TRACE 2': string;

	@ApiProperty({ required: true })
	@IsString()
	'FECHA Y HORA DE TRANSACCION 2': string;

	@ApiProperty({ required: true })
	@IsString()
	'BIN ADQUIRIENTE 2': string;

	@ApiProperty({ required: true })
	@IsString()
	'FORWARD INSTITUTION CODE 2': string;

	@ApiProperty({ required: true })
	@IsString()
	'DATOS RESERVADOS': string;

	@ApiProperty({ required: true })
	@IsString()
	'DATOS DEL REQUERIMIENTO': string;

	@ApiProperty({ required: true })
	@IsString()
	'LONGITUD DE DATO': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE FORMATO': string;

	@ApiProperty({ required: true })
	@IsString()
	'BIN PROCESADOR': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE ACREEDOR': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE PRODUCTO/SERVICIO': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE PLAZA DEL RECAUDADOR': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE AGENCIA DEL RECAUDADOR': string;

	@ApiProperty({ required: true })
	@IsString()
	'TIPO DE DATO DE PAGO': string;

	@ApiProperty({ required: true })
	@IsString()
	'DATO DE PAGO': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE CIUDAD': string;

	@ApiProperty({ required: true })
	@IsString()
	'FILLER': string;

	@ApiProperty({ required: true })
	@IsString()
	'CODIGO DE SERVICIO': string;

	@ApiProperty({ required: true })
	@IsString()
	'NUMERO DE DOCUMENTO': string;

	@ApiProperty({ required: true })
	@IsString()
	'DISPONIBLE': string;

	@ApiProperty({ required: true })
	@IsString()
	'NUMERO DE TRANS. DE COB.ORI': string;

	@ApiProperty({ required: true })
	@IsString()
	'NUMERO OPE. ORIGINAL ACREED': string;
}

export const CurrencyDTO = {
	604: 'PEN',
	840: 'USD',
};

export const PaymentTypeDTO = {
	'01': 'EF',
	'02': 'CP',
	'03': 'CJ',
	'04': 'TD', // TODO: revisar tarjeta de debito
	'05': 'CT',
	'06': 'EF',
	'07': 'EF',
	'10': 'EF',
};
