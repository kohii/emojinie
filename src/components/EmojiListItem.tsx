import { Box, Text } from "@mantine/core";
import { useCallback } from "react";

import { EmojiItem } from "../types/emoji";

type EmojiListItemProps = {
	value: EmojiItem;
	focused: boolean;
	onClick: (value: EmojiItem) => void;
}

export function EmojiListItem({
	value,
	focused,
	onClick,
}: EmojiListItemProps) {
	const handleClick = useCallback(() => {
		onClick(value);
	}, [onClick, value]);

	return (
		<Box
			p={"xs"}
			mx="xs"
			display="flex"
			sx={{
				alignItems: "center",
				gap: 8,
				// TODO: light theme
				backgroundColor: focused ? "rgba(255, 255, 255, 0.1)" : "transparent",
				"&:hover": {
					backgroundColor: "rgba(255, 255, 255, 0.08)",
				},
				borderRadius: 4,
				userSelect: "none",
				cursor: "default",
			}}
			onClick={handleClick}
		>
			<span>{value.emoji}</span>
			<Text fz="sm">{value.name}</Text>
		</Box>
	);
}