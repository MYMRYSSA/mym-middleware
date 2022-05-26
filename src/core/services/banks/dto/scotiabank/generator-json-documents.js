const quantity = 2;

let result = [];

const n1 = 65;
const n2 = 66;
const n3 = 82;
const n4 = 100;
const n5 = 108;
const n6 = 119;

for (let i = 0; i < quantity; i++) {
	result = result.concat([
		{ id: `TIPO DE SERVICIO ${i + 1}`, start: i * n1 + 346, end: i * n1 + 348 },
		{ id: `NUMERO DE DOCUMENTO ${i + 1}`, start: i * n2 + 349, end: i * n2 + 364 },
		{ id: `REFERENCIA DE LA DEUDA ${i + 1}`, start: i * n3 + 365, end: i * n3 + 380 },
		{ id: `FECHA DE VENCIMIENTO ${i + 1}`, start: i * n4 + 381, end: i * n4 + 388 },
		{ id: `IMPORTE MINIMO ${i + 1}`, start: i * n5 + 389, end: i * n5 + 399, padleft: true },
		{ id: `IMPORTE A TOTAL ${i + 1}`, start: i * n6 + 400, end: i * n6 + 410, padleft: true },
	]);
}

console.log(result);
