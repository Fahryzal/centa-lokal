export interface CustomRequest extends Request {
	moduleName?: string;
	user: { name: string; token: { Authorization: string } };
}
