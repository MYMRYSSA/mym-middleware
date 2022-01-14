import { ApiProperty } from '@nestjs/swagger';
import { OperationContentDTO } from './bbva.requests.dto';

export class BBVAConsultDebtResponseDTO {
	@ApiProperty({ required: true })
	ConsultarDeudaResponse: {
		recaudosRs: {
			cabecera: {
				operacion: OperationContentDTO;
			};
			detalle: {
				respuesta: {
					codigo: string;
					descripcion: string;
				};
			};
		};
	};
}
