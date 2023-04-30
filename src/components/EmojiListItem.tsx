import { Box, Text } from "@mantine/core";
import { useCallback } from "react";

import { EmojiItem } from "../types/emoji";

type EmojiListItemProps = {
	value: EmojiItem;
	focused: boolean;
	onClick: (value: EmojiItem) => void;
	onMouseEnter: () => void;
}

const focusStyle = {
	backgroundColor: "#3478C6",
	color: "#fff",
};

export function EmojiListItem({
	value,
	focused,
	onClick,
	onMouseEnter,
}: EmojiListItemProps) {
	const handleClick = useCallback(() => {
		onClick(value);
	}, [onClick, value]);

	return (
		<Box
			px={"xs"}
			py={8}
			mx="xs"
			display="flex"
			sx={{
				alignItems: "center",
				gap: 4,
				borderRadius: 4,
				userSelect: "none",
				cursor: "default",
				...(focused ? focusStyle : {}),
			}}
			onClick={handleClick}
			onMouseEnter={onMouseEnter}
		>
			<span>{value.emoji}</span>
			<Text fz="sm">{value.slug}</Text>
		</Box>
	);
}