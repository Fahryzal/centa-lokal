export type QueryParamValue = string | number | boolean | Array<string | number | boolean> | object;

export interface QueryParams {
	[key: string]: QueryParamValue | undefined;
}
