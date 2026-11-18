export interface ErrorResponse {
	type: string;
	title: string;
	status: number;
	message: string;
	success: boolean;
}

export interface SuccessResponse<T> {
	status: number;
	message: string;
	data: T;
}
