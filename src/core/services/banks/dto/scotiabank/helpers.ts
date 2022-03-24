import { IDebtInquiresResponse } from 'src/infraestructure/service-clients/interface/mym.inquire.interface';
import * as inquireRequestStructure from './inquire-structure-request.json';
import * as paymentRequestStructure from './payment-structure-request.json';
import * as returnRequestStructure from './return-structure-request.json';
import * as inquireResponseStructure from './inquire-structure-response.json';
import * as paymentResponseStructure from './payment-structure-response.json';
import * as returnResponseStructure from './return-structure-response.json';
import {
	ScotiabankConsultDebtRequestDTO,
	ScotiabankPaymentRequestDTO,
	ScotiabankAnnulmentRequestDTO,
} from './scotiabank.requests.dto';
import {
	IScotiabankAnnulmentResponseDTO,
	IScotiabankConsultDebtResponseDTO,
	IScotiabankPaymentResponseDTO,
} from './scotiabank.responses.dto';
import { IPaymentResponse } from 'src/infraestructure/service-clients/interface/mym.payment.interface';

export enum InputEnum {
	INQUIRE = 'inquire',
	PAYMENT = 'payment',
	RETURN = 'return',
}

export const getInputValues = (input: string, type: InputEnum): any => {
	const obj = {};
	let structure: Array<{ id: string; start: number; end: number }> = [];
	switch (type) {
		case InputEnum.INQUIRE:
			structure = inquireRequestStructure;
			break;
		case InputEnum.PAYMENT:
			structure = paymentRequestStructure;
			break;
		case InputEnum.RETURN:
			structure = returnRequestStructure;
			break;
	}
	structure.forEach(item => {
		obj[item.id] = input.slice(item.start - 1, item.end);
	});
	return obj;
};

export const setOutputValues = (input: any, type: InputEnum): string => {
	let output = '';
	let structure: Array<{ id: string; start: number; end: number; padleft?: boolean }> = [];
	switch (type) {
		case InputEnum.INQUIRE:
			structure = inquireResponseStructure;
			break;
		case InputEnum.PAYMENT:
			structure = paymentResponseStructure;
			break;
		case InputEnum.RETURN:
			structure = returnResponseStructure;
			break;
	}
	structure.forEach(item => {
		let portion = input[item.id];
		const MAX = item.end - item.start + 1;
		if (input[item.id].length > MAX) {
			portion = input[item.id].slice(0, MAX);
		}
		if (input[item.id].length < MAX) {
			if (!!item.padleft) {
				portion = Array(MAX - input[item.id].length + 1).join(' ') + input[item.id];
			} else {
				portion = input[item.id] + Array(MAX - input[item.id].length + 1).join(' ');
			}
		}
		output += portion;
	});
	return output;
};

export const setConsultDebtResponse = (
	valueJson: ScotiabankConsultDebtRequestDTO,
	response: IDebtInquiresResponse,
): IScotiabankConsultDebtResponseDTO => {
	return {
		'MESSAGE TYPE IDENTIFICATION': '0210',
		'PRIMARY BIT MAP': 'F22080010E808000',
		'SECONDARY BIT MAP': '0000000000000018',
		'CODIGO DE PROCESO': valueJson['CODIGO DE PROCESO'],
		MONTO: valueJson.MONTO,
		'FECHA Y HORA DE TRANSACCION': valueJson['FECHA Y HORA DE TRANSACCION'],
		TRACE: valueJson.TRACE,
		'FECHA DE CAPTURA': valueJson['FECHA DE CAPTURA'],
		'BIN ADQUIRIENTE': valueJson['BIN ADQUIRIENTE'],
		'RETRIEVAL REFERENCE - NUMBER': valueJson['RETRIEVAL REFERENCE NUMBER'],
		'AUTHORIZATION ID RESPONSE': '000000',
		'RESPONSE CODE': response ? '00' : '99',
		'TERMINAL ID': valueJson['TERMINAL ID'],
		'TRANSACTION CURRENCY CODE': valueJson['TRANSACTION CURRENCY CODE'],
		'DATOS RESERVADOS': valueJson['DATOS RESERVADOS'],
		'LONGITUD DEL CAMPO': '',
		'CODIGO DE FORMATO': '',
		'BIN PROCESADOR': '',
		'BIN ACREEDOR': '',
		'CODIGO PRODUCTO / SERVICIO': 'REC',
		AGENCIA: valueJson['CODIGO DE AGENCIA DEL RECAUDADOR'],
		'TIPO DE IDENTIFICACION': valueJson['TIPO DE DATO DE CONSULTA'],
		'NUMERO DE IDENTIFICACION': valueJson['DATO DE CONSULTA'],
		'NOMBRE DEL DEUDOR': response?.customerName || '',
		'NUMERO DE SERVICIOS DEVUELTOS': '01',
		'NUMERO DE OPERACIÓN DE COBRANZA': '000008133016',
		'INDICADOR SI HAY MAS DOCUMENTOS': response?.documents?.length > 1 ? '1' : '0',
		'TAMAÑO MAXIMO DE BLOQUE': '01000',
		'POSICION DEL ULTIMO DOCUMENTO': response?.documents?.length > 1 ? `${response?.documents?.length}` : '000',
		'PUNTERO DE LA BASE DE DATOS': '0000000000',
		'ORIGEN DE RESPUESTA': '0',
		'CODIGO DE RESPUESTA': '000',
		'FILLER 1': '',
		'CODIGO DE PRODUCTO/SERVICIO': valueJson['CODIGO DE PRODUCTO/SERVICIO'],
		MONEDA: valueJson['TRANSACTION CURRENCY CODE'],
		'ESTADO DEL DEUDOR': response?.documents?.length > 0 ? 'M' : 'V',
		'MENSAJE 1 AL DEUDOR': `PENDIENTE ${valueJson['TRANSACTION CURRENCY CODE'] === '604' ? 'SOLES' : 'DOLARES'}`,
		'MENSAJE 2 AL DEUDOR': '',
		'INDICADOR DE CRONOLOGIA': '1',
		'INDICADOR DE PAGOS VENCIDOS': '0',
		'RESTRICCION DE PAGO': '0',
		'DOCUMENTOS POR SERVICIO': `${response?.documents?.length || '0'}`,
		'FILLER 2': '',
		'TIPO DE SERVICIO 1': '001',
		'NUMERO DE DOCUMENTO 1':
			response?.documents?.length > 0
				? `${response?.documents?.[Number(valueJson['POSICION DEL ULTIMO DOCUMENTO'])].documentId}`
				: '',
		'REFERENCIA DE LA DEUDA 1': response?.documents?.length > 0 ? response?.customerIdentificationCode : '',
		'FECHA DE VENCIMIENTO 1':
			response?.documents?.length > 0
				? `${response?.documents?.[Number(valueJson['POSICION DEL ULTIMO DOCUMENTO'])].expirationDate}`
				: '',
		'IMPORTE MINIMO 1':
			response?.documents?.length > 0
				? `${response?.documents?.[Number(valueJson['POSICION DEL ULTIMO DOCUMENTO'])].minimumAmount}`
				: '',
		'IMPORTE A TOTAL 1':
			response?.documents?.length > 0
				? `${response?.documents?.[Number(valueJson['POSICION DEL ULTIMO DOCUMENTO'])].totalAmount}`
				: '',
	};
};

export const setPaymentResponse = (
	valueJson: ScotiabankPaymentRequestDTO,
	response: IPaymentResponse,
): IScotiabankPaymentResponseDTO => {
	return {
		'MESSAGE TYPE IDENTIFICATION': '0210',
		'PRIMARY BIT MAP': 'F220848188E08000',
		'SECONDARY BIT MAP': '0000000000000018',
		'CODIGO DE PROCESO': valueJson['CODIGO DE PROCESO'],
		MONTO: valueJson.MONTO,
		'FECHA Y HORA DE TRANSACCION': valueJson['FECHA Y HORA DE TRANSACCION'],
		TRACE: valueJson.TRACE,
		'FECHA DE CAPTURA': valueJson['FECHA DE CAPTURA'],
		'IDENTIFICACION EMPRESA': valueJson['BIN ADQUIRIENTE'],
		'RETRIEVAL REFERENCE - NUMBER': valueJson['RETRIEVAL REFERENCE NUMBER'],
		'AUTHORIZATION ID RESPONSE': '4',
		'RESPONSE CODE': response ? '00' : '99',
		'TERMINAL ID': valueJson['TERMINAL ID'],
		'TRANSACTION CURRENCY CODE': valueJson['TRANSACTION CURRENCY CODE'],
		'DATOS RESERVADOS': valueJson['DATOS RESERVADOS'],
		'TAMAÑO DEL BLOQUE': '',
		'CODIGO DE FORMATO': '01',
		'BIN PROCESADOR': '000000',
		'CODIGO DE ACREEDOR': '000000',
		'CODIGO DE PRODUCTO/SERVICIO': 'REC',
		'CODIGO DE PLAZA DEL RECAUDADOR': '0000',
		'CODIGO DE AGENCIA DEL RECAUDADOR': valueJson['CODIGO DE AGENCIA DEL RECAUDADOR'],
		'TIPO DE DATO DE PAGO': valueJson['TIPO DE DATO DE PAGO'],
		'DATO DE PAGO': valueJson['DATO DE PAGO'],
		'CODIGO DE CIUDAD': '',
		'NUMERO DE OPERAC.COBRANZA': '4',
		'NUMERO DE OPERAC.ACREEDOR': response?.operationNumberCompany || '',
		'NUMERO DE PROD/SERV PAGAD.': '01',
		'NUMERO TOTAL DE DOC PAGAD.': '001',
		'FILLER 1': '',
		'ORIGEN DE RESPUESTA': '0',
		'CODIGO DE RESPUESTA EXTEND': '000',
		'DESCRIPC. DE LA RPTA APLICATIV': response ? 'TRANSACCION PROCESADA OK' : 'TRANSACCION NO PROCESADA',
		'NOMBRE DEL DEUDOR': response?.clientName || '',
		'RUC DEL DEUDOR': '',
		'RUC DEL ACREEDOR': '',
		'CODIGO DE ZONA DEL DEUDOR': '',
		'FILLER 2': '',
		'CODIGO DEL PROD/SERVICIO': '001',
		'DESCRIPC. DEL PROD.SERV': `RECAUDACION ${valueJson['TRANSACTION CURRENCY CODE'] === '604' ? 'SOL' : 'DOL'}`,
		'IMPORTE TOTAL POR PROD/SERV': valueJson['IMPORTE TOTAL X PROD/SERV'],
		'MENSAJE 1': `RECAUDACION ${valueJson['TRANSACTION CURRENCY CODE'] === '604' ? 'SOLES' : 'DOLARES'}`,
		'MENSAJE 2': '',
		'NUMERO DE DOCUMENTOS': '01',
		'FILLER 3': '',
		'TIPO DE SERVICIO': '001',
		'DESCRIPCION DEL DOCUMENTO': 'Recibo de Servi',
		'NUMERO DEL DOCUMENTO': valueJson['NUMERO DE DOCUMENTO DE PAG'],
		'PERIODO DE COTIZACION': '',
		'TIPO DOC IDENTIDAD': '',
		'NUMERO DOCUMENTO IDENTIDAD': '',
		'FECHA DE EMISION': '00000000',
		'FECHA DE VENCIMIENTO': '',
		'IMPORTE PAGADO': valueJson['IMPORTE TOTAL X PROD/SERV'],
		'CODIGO DE CONCEPTO 1': valueJson['CODIGO DE CONCEPTO 1'],
		'IMPORTE CONCEPTO 1': valueJson['IMPORTE DE CONCEPTO 1'],
		'CODIGO DE CONCEPTO 2': '00',
		'IMPORTE CONCEPTO 2': '00000000000',
		'CODIGO DE CONCEPTO 3': '00',
		'IMPORTE CONCEPTO 3': '00000000000',
		'CODIGO DE CONCEPTO 4': '00',
		'IMPORTE CONCEPTO 4': '00000000000',
		'CODIGO DE CONCEPTO 5': '00',
		'IMPORTE CONCEPTO 5': '00000000000',
		'INDICADOR DE FACTURACION': '0',
		'NUMERO DE FACTURA': '',
		'REFERENCIA DE LA DEUDA': valueJson['REFERENCIA DE LA DEUDA'],
		'FILLER 4': '',
	};
};

export const setAnullmentResponse = (
	valueJson: ScotiabankAnnulmentRequestDTO,
	response: IPaymentResponse,
): IScotiabankAnnulmentResponseDTO => {
	return {
		'MESSAGE TYPE IDENTIFICATION': '0210',
		'PRIMARY BIT MAP': 'F220848188E08000',
		'SECONDARY BIT MAP': '0000004000000018',
		'CODIGO DE PROCESO': valueJson['CODIGO DE PROCESO'],
		MONTO: valueJson.MONTO,
		'FECHA Y HORA DE TRANSACCION': valueJson['FECHA Y HORA DE TRANSACCION 1'],
		TRACE: valueJson['TRACE 1'],
		'FECHA DE CAPTURA': valueJson['FECHA DE CAPTURA'],
		'IDENTIFICACION EMPRESA': valueJson['FORWARD INSTITUTION CODE 1'],
		'RETRIEVAL REFERENCE - NUMBER': valueJson['RETRIEVAL REFERENCE NUMBER'],
		'AUTHORIZATION ID RESPONSE': '4',
		'RESPONSE CODE': response ? '00' : '99',
		'TERMINAL ID': valueJson['TERMINAL ID'],
		'TRANSACTION CURRENCY CODE': valueJson['TRANSACTION CURRENCY CODE'],
		'DATOS RESERVADOS': valueJson['DATOS RESERVADOS'],
		'DATOS DEL DOCUMENTO A EXTORNAR': '',
		'LONGITUD DE LA TRAMA': '',
		'CODIGO DE FORMATO': '',
		'BIN PROCESADOR': '',
		'CODIGO DE ACREEDOR': '',
		'CODIGO DE PRODUCTO/SERVICIO 1': 'REC',
		'CODIGO DE PLAZA DEL RECAUDADOR': '',
		'CODIGO DE AGENCIA DEL RECAUDADOR': '',
		'TIPO DE DATO DE PAGO': '',
		'DATO DE PAGO': '',
		'CODIGO DE CIUDAD': '',
		'NOMBRE DEL CLIENTE': '',
		'RUC DEL DEUDOR': '',
		'RUC DEL ACREEDOR': '',
		'NUMERO DE TRANS. DE COB.ORI': '',
		'NUMERO OPE. ORIGINAL ACREED': '',
		'FILLER 1': '',
		'ORIGEN DE RESPUESTA': '0',
		'CODIGO DE RESPUESTA EXTEND': '000',
		'DESCRIPC DE LA RPTA APLICA': response ? 'TRANSACCION PROCESADA OK' : 'TRANSACCION NO PROCESADA',
		'CODIGO DE PRODUCTO/SERVICIO 2': '001',
		'DESCRIPC DEL PROD/SERVICIO': `RECAUDACION ${
			valueJson['TRANSACTION CURRENCY CODE'] === '604' ? 'SOLES' : 'DOLARES'
		}`,
		'IMPORTE DEL PROD./SERVICIO': valueJson.MONTO,
		'MENSAJE 1 MARKETING': `RECAUDACION ${valueJson['TRANSACTION CURRENCY CODE'] === '604' ? 'SOLES' : 'DOLARES'}`,
		'MENSAJE 2 MARKETING': '',
		'NUMERO DE DOCUMENTOS': '01',
		'FILLER 2': '',
		'TIPO DE DOCUMENTO/SERVICIO': 'REC',
		'DESCRIPCION DEL DOCUMENTO': '',
		'NUMERO DE DOCUMENTO': '',
		'PERIODO DE COTIZACION': '',
		'TIPO DE DOC IDENTIDAD': '',
		'NRO DE DOC IDENTIDAD': '',
		'FECHA DE EMISION': '',
		'FECHA DE VENCIMIENTO': '',
		'IMPORTE ANULADO DEL DCTO.': valueJson.MONTO,
		'CODIGO DE CONCEPTO 1': '',
		'IMPORTE CONCEPTO 1': '',
		'CODIGO DE CONCEPTO 2': '',
		'IMPORTE CONCEPTO 2': '',
		'CODIGO DE CONCEPTO 3': '',
		'IMPORTE CONCEPTO 3': '',
		'CODIGO DE CONCEPTO 4': '',
		'IMPORTE CONCEPTO 4': '',
		'CODIGO DE CONCEPTO 5': '',
		'IMPORTE CONCEPTO 5': '',
		'INDICADOR DE COMPROBANTE': '',
		'NUMERO DE FACTURA ANULADA': '',
		'REFERENCIA DE LA DEUDA': '',
		'FILLER 3': '',
	};
};
