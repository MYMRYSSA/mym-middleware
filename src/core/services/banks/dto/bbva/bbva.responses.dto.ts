import { OperationContentDTO } from './bbva.requests.dto';

/** ConsultDebt */
export interface IDocumentContentDTO {
	numero: string;
	descripcion: string;
	fechaEmision: string;
	fechaVencimiento: string;
	importeDeuda: number;
	importeDeudaMinima: number;
	indicadorRestriccPago?: number;
	cantidadSubconceptos?: number;
}
interface ISubconceptoContent {
	codigo: number;
	importe: number;
}
interface ITransactionContentDTO {
	numeroReferenciaDeuda: string;
	nombreCliente?: string;
	numeroOperacionEmpresa?: number;
	indMasDeuda?: string;
	cantidadDocsDeuda?: number;
	datosEmpresa?: string;
	listaDocumentos?: {
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
				transaccion: ITransactionContentDTO;
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
				transaccion: ITransactionContentDTO;
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
				transaccion: ITransactionContentDTO;
			};
		};
	};
}
