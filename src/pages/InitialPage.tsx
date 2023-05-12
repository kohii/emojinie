import { Box, Kbd } from "@mantine/core";
import { appWindow } from "@tauri-apps/api/window";
import { useCallback, useEffect, useRef, useState } from "react";

import { MainInput } from "../components/MainInput";

type InitialPageProps = {
	initialText: string;
	onSubmit: (text: string) => void;
}

export function InitialPage({
	initialText,
	onSubmit,
}: InitialPageProps) {
	const [text, setText] = useState(initialText);

	const inputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = useCallback(() => {
		const trimmed = text.trim();
		if (!trimmed) return;
		onSubmit(trimmed);
	}, [text, onSubmit]);

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