interface AmountDetail {
	description: string;
	fee: string;
	amount: string;
	price: string;
	subtotal: string;
}

export interface PendingPaymentsData {
	docType: string;
	numDoc: string;
	expirationDate: string;
	semester: string;
	arrearsTotal: string;
	amountPaid: string;
	balance: string;
	debtAmount: string;
	debtType: string;
	invoice: string | null;
	amountDetail: AmountDetail[];
	debtDisabled: boolean | null;
	debtChecked: boolean | null;
	isExpired: boolean | null;
}

export interface PaymentMethodsData {
	nombreMedioDePago: string;
	descripcion: string | null;
	url: string;
	prioridad: number;
	abrirNuevaPagina: boolean;
	icono: string | null;
}

export interface PaymentOrderConceptData {
	coditem: string;
	description: string;
	price: string;
	quantity: number;
	subtotal: string;
	arrears: string;
	total: string;
	invoice: string | null;
}

export interface PaymentOrderData {
	userId: string | undefined;
	methodPayment: string | null;
	period: string | null | undefined;
	campusCode: string | null | undefined;
	eticket: string | null;
	serviceId: string | null;
	date: string | null;
	billingType: string | null;
	amountOfCourses: number | null;
	totalAmount: number | undefined;
	unitCostPerService: number;
	serviceCode: string | null;
	operativeUnit: string | null | undefined;
	concept: PaymentOrderConceptData[];
}

export interface PaymentOrderLinkData {
	url: string | null;
}

export interface PendingPaymentsHomeData {
	total: number;
	countAT: number;
	countPV: number;
	countV: number;
}
