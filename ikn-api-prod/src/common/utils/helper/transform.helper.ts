import { TransformFnParams } from 'class-transformer';

export const TransformGroup = { groups: ['transform'] };

export interface SplitTransformObj {
	toDb: Record<string, any>;
	toReq: Record<string, any>;
}

export function SetTransform(keys: { toDb?: string; toReq?: string }) {
	return ({ value }: TransformFnParams) => ({
		...(keys.toDb ? { toDb: { [keys.toDb]: value } } : {}),
		...(keys.toReq ? { toReq: { [keys.toReq]: value } } : {}),
	});
}

export function SplitTransform(input: Record<string, any>) {
	const toDbObject = {};
	const toReqObject = {};

	function processObject(obj: Record<string, any>, toDb: Record<string, any>, toReq: Record<string, any>) {
		for (const key in obj) {
			if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
				if (obj[key].toDb || obj[key].toReq) {
					if (obj[key].toDb) Object.assign(toDb, obj[key].toDb);
					if (obj[key].toReq) Object.assign(toReq, obj[key].toReq);
				} else {
					toDb[key] = {};
					toReq[key] = {};
					processObject(obj[key], toDb[key], toReq[key]);
					if (Object.keys(toDb[key]).length === 0) delete toDb[key];
					if (Object.keys(toReq[key]).length === 0) delete toReq[key];
				}
			} else if (Array.isArray(obj[key])) {
				toDb[key] = [];
				toReq[key] = [];
				obj[key].forEach((item, index) => {
					const dbItem = {};
					const reqItem = {};
					processObject(item, dbItem, reqItem);
					toDb[key].push(dbItem);
					toReq[key].push(reqItem);
				});
			}
		}
	}
	processObject(input, toDbObject, toReqObject);
	return { toDb: toDbObject, toReq: toReqObject };
}

export function FlattenTransform(input: Record<string, any>) {
	return Object.keys(input).reduce((acc, key) => {
		if (typeof input[key] === 'object' && !Array.isArray(input[key])) return { ...acc, ...input[key] };
		if (Array.isArray(input[key])) return { ...acc, [key]: input[key].map((item) => ({ ...item })) };
		return { ...acc, [key]: input[key] };
	}, {});
}
