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

export const positions = [410, 475, 540, 605, 670, 735, 800, 865, 930, 995];

export const cutStringResult = (result: string, numberOfDocuments: number): string => {
	if (numberOfDocuments) return result.slice(0, positions[numberOfDocuments - 1]);
	else return result.slice(0, 410);
};

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
		let portion = String(input[item.id]);
		const MAX = 1 + (item.end - item.start);
		if (portion.length > MAX) {
			portion = portion.slice(0, MAX);
		} else if (portion.length < MAX) {
			if (!!item.padleft) {
				portion = Array(1 + (MAX - portion.length)).join(' ') + portion;
			} else {
				portion = portion + Array(1 + (MAX - portion.length)).join(' ');
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
	const temp = {
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
		'RESPONSE CODE': response ? '00' : '21',
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
		'INDICADOR SI HAY MAS DOCUMENTOS': '0',
		'TAMAÑO MAXIMO DE BLOQUE': '01000',
		'POSICION DEL ULTIMO DOCUMENTO': '000',
		'PUNTERO DE LA BASE DE DATOS': '0000000000',
		'ORIGEN DE RESPUESTA': '0',
		'CODIGO DE RESPUESTA': '000',
		'FILLER 1': '',
		'CODIGO DE PRODUCTO/SERVICIO': valueJson['CODIGO DE PRODUCTO/SERVICIO'],
		MONEDA: valueJson['TRANSACTION CURRENCY CODE'],
		'ESTADO DEL DEUDOR': response?.documents?.length > 0 ? 'M' : 'V',
		'MENSAJE 1 AL DEUDOR': `PENDIENTE ${valueJson['TRANSACTION CURRENCY CODE'] === '604' ? 'SOLES' : 'DOLARES'}`,
		'MENSAJE 2 AL DEUDOR': '',
		'INDICADOR DE CRONOLOGIA': String(response.cronologicIndicator),
		'INDICADOR DE PAGOS VENCIDOS': '0',
		'RESTRICCION DE PAGO': '0',
		'DOCUMENTOS POR SERVICIO': `${response?.documents?.length || '0'}`,
		'FILLER 2': '',
		'TIPO DE SERVICIO 1': '',
		'NUMERO DE DOCUMENTO 1': '',
		'REFERENCIA DE LA DEUDA 1': '',
		'FECHA DE VENCIMIENTO 1': '',
		'IMPORTE MINIMO 1': '',
		'IMPORTE A TOTAL 1': '',
		'TIPO DE SERVICIO 2': '',
		'NUMERO DE DOCUMENTO 2': '',
		'REFERENCIA DE LA DEUDA 2': '',
		'FECHA DE VENCIMIENTO 2': '',
		'IMPORTE MINIMO 2': '',
		'IMPORTE A TOTAL 2': '',
		'TIPO DE SERVICIO 3': '',
		'NUMERO DE DOCUMENTO 3': '',
		'REFERENCIA DE LA DEUDA 3': '',
		'FECHA DE VENCIMIENTO 3': '',
		'IMPORTE MINIMO 3': '',
		'IMPORTE A TOTAL 3': '',
		'TIPO DE SERVICIO 4': '',
		'NUMERO DE DOCUMENTO 4': '',
		'REFERENCIA DE LA DEUDA 4': '',
		'FECHA DE VENCIMIENTO 4': '',
		'IMPORTE MINIMO 4': '',
		'IMPORTE A TOTAL 4': '',
		'TIPO DE SERVICIO 5': '',
		'NUMERO DE DOCUMENTO 5': '',
		'REFERENCIA DE LA DEUDA 5': '',
		'FECHA DE VENCIMIENTO 5': '',
		'IMPORTE MINIMO 5': '',
		'IMPORTE A TOTAL 5': '',
		'TIPO DE SERVICIO 6': '',
		'NUMERO DE DOCUMENTO 6': '',
		'REFERENCIA DE LA DEUDA 6': '',
		'FECHA DE VENCIMIENTO 6': '',
		'IMPORTE MINIMO 6': '',
		'IMPORTE A TOTAL 6': '',
		'TIPO DE SERVICIO 7': '',
		'NUMERO DE DOCUMENTO 7': '',
		'REFERENCIA DE LA DEUDA 7': '',
		'FECHA DE VENCIMIENTO 7': '',
		'IMPORTE MINIMO 7': '',
		'IMPORTE A TOTAL 7': '',
		'TIPO DE SERVICIO 8': '',
		'NUMERO DE DOCUMENTO 8': '',
		'REFERENCIA DE LA DEUDA 8': '',
		'FECHA DE VENCIMIENTO 8': '',
		'IMPORTE MINIMO 8': '',
		'IMPORTE A TOTAL 8': '',
		'TIPO DE SERVICIO 9': '',
		'NUMERO DE DOCUMENTO 9': '',
		'REFERENCIA DE LA DEUDA 9': '',
		'FECHA DE VENCIMIENTO 9': '',
		'IMPORTE MINIMO 9': '',
		'IMPORTE A TOTAL 9': '',
		'TIPO DE SERVICIO 10': '',
		'NUMERO DE DOCUMENTO 10': '',
		'REFERENCIA DE LA DEUDA 10': '',
		'FECHA DE VENCIMIENTO 10': '',
		'IMPORTE MINIMO 10': '',
		'IMPORTE A TOTAL 10': '',
	};
	response?.documents.forEach((document, index) => {
		temp[`TIPO DE SERVICIO ${index + 1}`] = '001';
		temp[`NUMERO DE DOCUMENTO ${index + 1}`] = document?.documentId || '';
		temp[`REFERENCIA DE LA DEUDA ${index + 1}`] = response?.customerIdentificationCode || '';
		temp[`FECHA DE VENCIMIENTO ${index + 1}`] = document?.expirationDate || '';
		temp[`IMPORTE MINIMO ${index + 1}`] = removePoint(document?.minimumAmount) || '';
		temp[`IMPORTE A TOTAL ${index + 1}`] = removePoint(document?.totalAmount) || '';
	});
	return temp;
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
		'RESPONSE CODE': response ? '00' : '21',
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
		'CODIGO DE CIUDAD': valueJson['CODIGO DE CIUDAD'],
		'NUMERO DE OPERAC.COBRANZA': '4',
		'NUMERO DE OPERAC.ACREEDOR': response?.operationNumberCompany || '',
		'NUMERO DE PROD/SERV PAGAD.': valueJson['NUMERO DE PROD/SERV PAGADO'],
		'NUMERO TOTAL DE DOC PAGADO': valueJson['NUMERO TOTAL DE DOC PAGADO'],
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
		'CODIGO DE CONCEPTO 1': '01',
		'IMPORTE CONCEPTO 1': valueJson['IMPORTE PAGADO DEL DOCUMENTO'],
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
	isExpired = true,
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
		'RESPONSE CODE': response ? '00' : '21',
		'TERMINAL ID': valueJson['TERMINAL ID'],
		'TRANSACTION CURRENCY CODE': valueJson['TRANSACTION CURRENCY CODE'],
		'DATOS RESERVADOS': valueJson['DATOS RESERVADOS'],
		'DATOS DEL DOCUMENTO A EXTORNAR': '',
		'LONGITUD DE LA TRAMA': '',
		'CODIGO DE FORMATO': '',
		'BIN PROCESADOR': valueJson['BIN PROCESADOR'],
		'CODIGO DE ACREEDOR': valueJson['CODIGO DE ACREEDOR'],
		'CODIGO DE PRODUCTO/SERVICIO 1': valueJson['CODIGO DE PRODUCTO/SERVICIO'],
		'CODIGO DE PLAZA DEL RECAUDADOR': '',
		'CODIGO DE AGENCIA DEL RECAUDADOR': valueJson['CODIGO DE AGENCIA DEL RECAUDADOR'],
		'TIPO DE DATO DE PAGO': '',
		'DATO DE PAGO': '',
		'CODIGO DE CIUDAD': valueJson['CODIGO DE CIUDAD'],
		'NOMBRE DEL CLIENTE': '',
		'RUC DEL DEUDOR': '',
		'RUC DEL ACREEDOR': '',
		'NUMERO DE TRANS. DE COB.ORI': valueJson['NUMERO DE TRANS. DE COB.ORI'],
		'NUMERO OPE. ORIGINAL ACREED': '',
		'FILLER 1': '',
		'ORIGEN DE RESPUESTA': '0',
		'CODIGO DE RESPUESTA EXTEND': isExpired ? '080' : '000',
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
		'TIPO DE DOCUMENTO/SERVICIO': valueJson['CODIGO DE SERVICIO'],
		'DESCRIPCION DEL DOCUMENTO': '',
		'NUMERO DE DOCUMENTO': '',
		'PERIODO DE COTIZACION': '',
		'TIPO DE DOC IDENTIDAD': '',
		'NRO DE DOC IDENTIDAD': '',
		'FECHA DE EMISION': '',
		'FECHA DE VENCIMIENTO': '',
		'IMPORTE ANULADO DEL DCTO.': valueJson.MONTO,
		'CODIGO DE CONCEPTO 1': '01',
		'IMPORTE CONCEPTO 1': valueJson.MONTO,
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

export const removePoint = (num: string) => {
	const arr = num.split('');
	const position = arr.findIndex(n => n === '.');
	if (position) arr.splice(position, 1);
	return arr.join('');
};
