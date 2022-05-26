let result = [];

const n1 = 65;

for (let i = 0; i < 51; i++) {
	result = result.concat([
		{ id: `TIPO DE SERVICIO ${i + 1}`, start: i * n1 + 346, end: i * n1 + 348 },
		{ id: `NUMERO DE DOCUMENTO ${i + 1}`, start: i * n1 + 349, end: i * n1 + 364 },
		{ id: `REFERENCIA DE LA DEUDA ${i + 1}`, start: i * n1 + 365, end: i * n1 + 380 },
		{ id: `FECHA DE VENCIMIENTO ${i + 1}`, start: i * n1 + 381, end: i * n1 + 388 },
		{ id: `IMPORTE MINIMO ${i + 1}`, start: i * n1 + 389, end: i * n1 + 399, padleft: true },
		{ id: `IMPORTE A TOTAL ${i + 1}`, start: i * n1 + 400, end: i * n1 + 410, padleft: true },
	]);
}

console.log(JSON.stringify(result));
