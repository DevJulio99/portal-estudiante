import type { ErrorResponse } from './services.types';

export type DataResponse<T> = {
	message: string;
	flag: boolean;
	error: ErrorResponse;
	data: T;
	success: boolean;
};

export type DataResponseOffset<T> = {
	message: string;
	count: number;
	flag: boolean;
	error: ErrorResponse | null;
	data: T;
};
