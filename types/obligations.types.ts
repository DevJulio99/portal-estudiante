export interface Payment {
	paidDate: string;
	concept: string;
	fee: string;
	import: string;
	paid: string;
	balance: string;
	status: string;
	documentNumber: string;
}

export interface ObligationPaid {
	period: string;
	debtType: string;
	payments: Payment[];
}

export interface Pago {
	fechaPago: string;
	concepto: string;
	numeroDocumentoPago: string;
	numeroCuota: number;
	importe: number;
	montoPagado: number;
}
export interface ObligacionPagada {
	periodo: string;
	pagos: Pago[];
}