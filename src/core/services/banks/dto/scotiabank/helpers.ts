import { IDebtInquiresResponse } from 'src/infraestructure/service-clients/interface/mym.inquire.interface';
import * as inquireRequestStructure from './inquire-structure-request.json';
import * as paymentRequestStructure from './payment-structure-request.json';
import * as returnRequestStructure from './return-structure-request.json';
import * as inquireResponseStructure from './inquire-structure-response.json';
import * as paymentResponseStructure from './payment-structure-response.json';
import * as returnResponseStructure from './return-structure-response.json';
import { ScotiabankConsultDebtRequestDTO } from './scotiabank.requests.dto';
import { IScotiabankConsultDebtResponseDTO } from './scotiabank.responses.dto';

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
				portion = Array(MAX - input[item.id].length + 1).join('*') + input[item.id];
			} else {
				portion = input[item.id] + Array(MAX - input[item.id].length + 1).join('*');
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
		'RESPONSE CODE': '0',
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
		'NOMBRE DEL DEUDOR': response.customerName,
		'NUMERO DE SERVICIOS DEVUELTOS': '01',
		'NUMERO DE OPERACIÓN DE COBRANZA': '000008133016',
		'INDICADOR SI HAY MAS DOCUMENTOS': response.documents.length > 1 ? '1' : '0',
		'TAMAÑO MAXIMO DE BLOQUE': '01000',
		'POSICION DEL ULTIMO DOCUMENTO': response.documents.length > 1 ? `${response.documents.length}` : '000',
		'PUNTERO DE LA BASE DE DATOS': '0000000000',
		'ORIGEN DE RESPUESTA': '0',
		'CODIGO DE RESPUESTA': '000',
		'FILLER 1': '',
		'CODIGO DE PRODUCTO/SERVICIO': valueJson['CODIGO DE PRODUCTO/SERVICIO'],
		MONEDA: valueJson['TRANSACTION CURRENCY CODE'],
		'ESTADO DEL DEUDOR': response.documents.length > 0 ? 'M' : 'V',
		'MENSAJE 1 AL DEUDOR': `PENDIENTE ${valueJson['TRANSACTION CURRENCY CODE'] === '604' ? 'SOLES' : 'DOLARES'}`,
		'MENSAJE 2 AL DEUDOR': '',
		'INDICADOR DE CRONOLOGIA': '1',
		'INDICADOR DE PAGOS VENCIDOS': '0',
		'RESTRICCION DE PAGO': '0',
		'DOCUMENTOS POR SERVICIO': `${response.documents.length}`,
		'FILLER 2': '',
		'TIPO DE SERVICIO 1': '001',
		'NUMERO DE DOCUMENTO 1':
			response.documents.length > 0
				? `${response.documents[Number(valueJson['POSICION DEL ULTIMO DOCUMENTO'])].description}`
				: '',
		'REFERENCIA DE LA DEUDA 1':
			response.documents.length > 0
				? `${response.documents[Number(valueJson['POSICION DEL ULTIMO DOCUMENTO'])].documentId}`
				: '',
		'FECHA DE VENCIMIENTO 1':
			response.documents.length > 0
				? `${response.documents[Number(valueJson['POSICION DEL ULTIMO DOCUMENTO'])].expirationDate}`
				: '',
		'IMPORTE MINIMO 1':
			response.documents.length > 0
				? `${response.documents[Number(valueJson['POSICION DEL ULTIMO DOCUMENTO'])].minimumAmount}`
				: '',
		'IMPORTE A TOTAL 1':
			response.documents.length > 0
				? `${response.documents[Number(valueJson['POSICION DEL ULTIMO DOCUMENTO'])].totalAmount}`
				: '',
	};
};
