import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export enum EnumCurrency {
	USD = 'USD',
	PEN = 'PEN',
}
/** ConsultDebt */
export class OperationContentDTO {
	@ApiProperty({ required: true })
	@IsNumber()
	codigoOperacion: number;

	@ApiProperty({ required: true })
	@IsNumber()
	numeroOperacion: number;

	@ApiProperty({ required: true })
	@IsNumber()
	codigoBanco: string;

	@ApiProperty({ required: true })
	@IsNumber()
	codigoConvenio: number;

	@ApiProperty({ required: true })
	@IsString()
	canalOperacion: string;

	@ApiProperty({ required: true })
	@IsString()
	codigoOficina: string;

	@ApiProperty({ required: true })
	@IsString()
	fechaOperacion: string;

	@ApiProperty({ required: true })
	@IsString()
	horaOperacion: string;
}
export class BBVAConsultDebtRequestDTO {
	@ApiProperty({ required: true })
	ConsultarDeuda: {
		recaudosRq: {
			cabecera: {
				operacion: OperationContentDTO;
			};
			detalle: {
				transaccion: {
					numeroReferenciaDeuda: string;
				};
			};
		};
	};
}

/** Payment */
class TransactionContentDTO {
	@ApiProperty({ required: true })
	@IsString()
	numeroReferenciaDeuda: string;

	@ApiProperty({ required: true })
	@IsString()
	numeroDocumento: string;

	@ApiProperty({ required: true })
	@IsNumber()
	importeDeudaPagada: number;

	@ApiProperty({ required: true })
	@IsString()
	numeroOperacionRecaudos: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	numeroOperacionOriginal?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	fechaOperacionOriginal?: string;

	@ApiProperty({ required: true })
	@IsString()
	formaPago: string;

	@ApiProperty({ required: true, type: EnumCurrency })
	codigoMoneda: EnumCurrency;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	datosEmpresa?: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	otrosDatosEmpresa?: string;
}

export class BBVAPaymentRequestDTO {
	NotificarPago: {
		recaudosRq: {
			cabecera: {
				operation: OperationContentDTO;
			};
			detalle: {
				transaccion: TransactionContentDTO;
			};
		};
	};
}

/** Annulment */
export class BBVAAnnulmentRequestDTO {
	ExtornarPago: {
		recaudosRq: {
			cabecera: {
				operacion: OperationContentDTO;
			};
			detalle: {
				transaccion: TransactionContentDTO;
			};
		};
		tipo: string;
	};
}
