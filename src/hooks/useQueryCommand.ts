import { invoke } from "@tauri-apps/api";
import { useCallback, useEffect, useState } from "react";

import { assertUnreachable } from "../utils/assertUnreachable";


export type CommandState<T> = {
	data: T | null;
	error: {
		message: string;
		panic: boolean;
	} | null;
	isFetching: boolean;
}

type CommandResult<T> = {
	Success: T;
} | {
	Error: { message: string };
}

type CommandInvoke = (args?: Record<string, unknown>) => Promise<void>;

export function useQueryCommand<T>(
	name: string,
	options: {
		args?: Record<string, unknown>;
		enabled?: boolean;
	}
): CommandState<T> {
	const [state, setState] = useState<CommandState<T>>({
		data: null,
		error: null,
		isFetching: false
	});

	const invokeCommand: CommandInvoke = useCallback(async (args) => {
		setState((currentState) => ({
			...currentState,
			isFetching: true
		}));

		try {
			const result: CommandResult<T> = await invoke(name, args);
			console.debug(`Command ${name} result:`, result);
			if ("Success" in result) {
				setState((currentState) => ({
					...currentState,
					data: result.Success,
					error: null,
					isFetching: false
				}));
				return;
			} else if ("Error" in result) {
				setState((currentState) => ({
					...currentState,
					error: {
						message: result.Error.message,
						panic: false
					},
					isFetching: false
				}));
				return;
			} else {
				assertUnreachable(result);
			}
		} catch (error) {
			setState((currentState) => ({
				...currentState,
				isFetching: false,
				error: {
					message: "An error occurred.",
					panic: true,
				}
			}));
		}
	}, [name]);

	useEffect(() => {
		if (options.enabled !== false) {
			invokeCommand(options.args);
		}
	}, [invokeCommand, options.args, options.enabled]);

	return state;
}
