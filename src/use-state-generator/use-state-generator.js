import { useState, useMemo, useEffect } from "../core/core";
import { isFunction } from "../core/utils";
import { ARRAY_EMPTY } from "../core/constants";
const promiseIgnore = new Promise(() => {});

export const CONTINUE = Symbol();

export function delay(ms) {
	return new Promise(resolve => setTimeout(() => resolve(CONTINUE), ms));
}

export function useStateGenerator(stream, initialState, vars = ARRAY_EMPTY) {
	let [value, setValue] = useState(() => createState(initialState));
	useEffect(() => value.cancel, []);

	value.stream = stream;

	return [
		value.state,
		useMemo(
			() =>
				value.send(() => {
					setValue(value);
				}),
			vars
		)
	];
}

function consumer(value, process, id, subscribe) {
	return Promise.resolve(value).then(value => {
		if (isFunction(value)) {
			return consumer(value(process.state), process, id, subscribe);
		}

		if (typeof value == "object" && isFunction(value.next)) {
			return new Promise(resolve => {
				function scan(generator) {
					Promise.resolve(generator.next(process.state)).then(
						({ value, done }) =>
							consumer(value, process, id, subscribe).then(() =>
								done ? resolve(process.state) : scan(generator)
							)
					);
				}
				scan(value);
			});
		}
		return process.next(value, subscribe, id);
	});
}

function createState(state) {
	let currentID = 0;
	let process = { state, next, cancel, send };

	function next(value, subscribe, id) {
		if (id != currentID) return promiseIgnore;
		if (value != CONTINUE) {
			process.state = value;
			subscribe && subscribe(value);
		}
		return process.state;
	}
	function cancel() {
		currentID++;
	}
	function send(subscribe) {
		return consumer(process.stream, process, ++currentID, subscribe);
	}

	return process;
}
