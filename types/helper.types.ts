export enum JobSituation {
	NO = 'NO',
	YES = 'YES',
}

export enum ProfileIDs {
	LABORALINFO = 'infoLaboral',
	PERSONALINFO = 'infoPersonal',
	JOBINFO = 'infoTrabajo',
	TERMS = 'terminosYCondiciones',
	BOSSINFO = 'infoJefe',
	JOBSITUATION = 'situacionLaboral',
	LINKEDINLINK = 'enlaceLinkedin',
	ACADEMICINFO = 'infoAcademica',
	NAME = 'nombre',
	CODE = 'codigo',
	EMAIL = 'correo',
	URLIMAGE = 'urlImagenL',
	BIRTHDATE = 'fechaDeNacimiento',
}

export enum Menu {
	RADIO = 'radio',
}

export enum BtnColor {
	default = 'default',
	black = 'black',
	blueLight= 'blueLight',
	secondary = 'secondary'
}

export enum TagStyle {
	default = 'default',
	light = 'light',
	neutral = 'neutral',
	violet = 'violet',
}

export enum CardStyle {
	default = 'blue',
	dark = 'black',
	secondary = 'pink',
}

export enum StyleColor {
	default = 'blue',
	error = 'red',
}

export enum TypesModality {
	PRESENCIAL = 'Presencial',
	REMOTO = 'Remoto',
	INICIADO = 'Iniciado',
	PORINICIAR = 'PorIniciar',
	FINALIZADO = 'Finalizado',
	RETIRADO = 'Retirado',
	VIRTUAL = 'Virtual',
}

export enum StyleModality {
	Presencial = 'bg-primary text-black',
	Remoto = 'bg-[#6A00B5] text-white',
	Iniciado = 'bg-[#1F7634] text-white',
	PorIniciar = 'bg-[#C1F1CB] text-[#1F7634]',
	Finalizado = 'bg-error text-white',
	Retirado = 'bg-[#FCCFCF] text-[#B7192C]',
	Virtual = 'bg-[#0072AB] text-white',
}
