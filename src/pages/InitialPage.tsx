import { Box } from "@mantine/core";
import { appWindow } from "@tauri-apps/api/window";
import { useCallback, useEffect, useRef, useState } from "react";

import { MainInput } from "../components/MainInput";
import { useRouterState } from "../contexts/RouterStateContext";

type InitialPageProps = {
	initialText: string;
}

export function InitialPage({
	initialText,
}: InitialPageProps) {
	const { setRouterState } = useRouterState();
	const [text, setText] = useState(initialText);

	const inputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = useCallback(() => {
		const trimmed = text.trim();
		if (!trimmed) return;
		setRouterState({ page: "suggestion-result", text: trimmed });
	}, [setRouterState, text]);

	useEffect(() => {
		if (!inputRef.current) return;
		inputRef.current.focus();
		inputRef.current.select();
	}, []);

	return (
		<Box>
			<MainInput
				ref={inputRef}
				value={text}
				onChange={setText}
				onEnter={handleSubmit}
				onEscape={() => appWindow.hide()}
			/>
		</Box>
	);
}