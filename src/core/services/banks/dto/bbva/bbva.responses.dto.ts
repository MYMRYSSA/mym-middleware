import { OperationContentDTO } from './bbva.requests.dto';

/** ConsultDebt */
interface IDocumentContentDTO {
	numero: string;
	descripcion: string;
	fechaEmision: string;
	fechaVencimiento: string;
	importeDeuda: number;
	importeDeudaMinima: number;
	indicadorRestriccPago?: string;
	cantidadSubconceptos?: number;
}
interface ISubconceptoContent {
	codigo: number;
	importe: number;
}
interface ITransactionContentDTO {
	numeroReferenciaDeuda: string;
	nombreCliente?: string;
	numeroOperacionEmpresa?: string;
	indMasDeuda?: number;
	cantidadDocsDeuda?: number;
	datosEmpresa?: string;
	listaDocuments?: {
		documento: IDocumentContentDTO[];
	};
	listaSubConceptos?: {
		subconcepto: ISubconceptoContent[];
	};
}
interface IResponseContent {
	codigo: string;
	descripcion: string;
}
export interface IBBVAConsultDebtResponseDTO {
	ConsultarDeudaResponse: {
		recaudosRs: {
			cabecera: {
				operacion: OperationContentDTO;
			};
			detalle: {
				respuesta: IResponseContent;
				transaction: ITransactionContentDTO;
			};
		};
	};
}

/** Payment */
export interface IBBVAPaymentResponseDTO {
	NotificarPagoResponse: {
		recaudosRs: {
			cabecera: {
				operacion: OperationContentDTO;
			};
			detalle: {
				respuesta: IResponseContent;
				transaction: ITransactionContentDTO;
			};
		};
	};
}

/** Annulment */
export interface IBBVAAnnulmentResponseDTO {
	ExtornarPagoResponse: {
		recaudosRs: {
			cabecera: {
				operacion: OperationContentDTO;
			};
			detalle: {
				respuesta: IResponseContent;
				transaction: ITransactionContentDTO;
			};
		};
	};
}
