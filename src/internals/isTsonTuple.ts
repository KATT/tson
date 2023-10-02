import { TsonTuple } from "../types.js";

export function isTsonTuple(v: unknown, nonce: string): v is TsonTuple {
	return Array.isArray(v) && v.length === 3 && v[2] === nonce;
}
