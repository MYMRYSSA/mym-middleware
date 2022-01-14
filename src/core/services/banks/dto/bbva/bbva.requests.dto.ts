import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

class OperationContentDTO {
	@ApiProperty({ required: true })
	@IsNumber()
	codigoOperacion: number;

	@ApiProperty({ required: true })
	@IsNumber()
	numeroOperacion: number;

	@ApiProperty({ required: true })
	@IsNumber()
	codigoBanco: number;

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
