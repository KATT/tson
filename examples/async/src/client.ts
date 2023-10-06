import waitPort from "wait-port";

import type { ResponseShape } from "./server.js";

import { mapIterable, readableStreamToAsyncIterable } from "./iteratorUtils.js";
import { tsonAsync } from "./shared.js";

async function main() {
	// do a streamed fetch request
	const port = 3000;
	await waitPort({ port });
	console.log(`Server started on port ${port}!`);
	const response = await fetch(`http://localhost:${port}`);

	if (!response.body) {
		throw new Error("Response body is empty");
	}

	const textDecoder = new TextDecoder();

	// convert the response body to an async iterable
	const stringIterator = mapIterable(
		readableStreamToAsyncIterable(response.body),
		(v) => textDecoder.decode(v),
	);

	const parsedUntyped = await tsonAsync.parse(stringIterator);
	const output = parsedUntyped as ResponseShape;

	console.log({ output });

	const printBigInts = async () => {
		for await (const value of output.bigints) {
			console.log(`Received bigint:`, value);
		}
	};

	const printNumbers = async () => {
		for await (const value of output.numbers) {
			console.log(`Received number:`, value);
		}
	};

	await Promise.all([printBigInts(), printNumbers()]);

	console.log("✅ Output ended");
}

main().catch((err) => {
	console.error(err);
	throw err;
});
