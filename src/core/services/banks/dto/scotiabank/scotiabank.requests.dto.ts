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
export class ScotiabankPaymentRequestDTO {}

/** Annulment */
export class ScotiabankAnnulmentRequestDTO {}

export const CurrencyDTO = {
	604: 'PEN',
	840: 'USD',
};
