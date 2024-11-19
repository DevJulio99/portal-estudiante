import type { ErrorResponse } from './services.types';

export type DataResponse<T> = {
	message: string;
	flag: boolean;
	error: ErrorResponse;
	data: T;
};
