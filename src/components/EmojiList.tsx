import { Box } from "@mantine/core";

import { EmojiItem } from "../types/emoji";

import { EmojiListItem } from "./EmojiListItem";

type EmojiListProps = {
	emojis: EmojiItem[];
	focusedIndex: number;
	onClick: (value: EmojiItem) => void;
}

export function EmojiList({
	emojis,
	focusedIndex,
	onClick,
}: EmojiListProps) {
	return (
		<Box>
			{emojis.map((emoji, index) => (
				<EmojiListItem key={emoji.emoji} value={emoji} focused={index === focusedIndex} onClick={onClick} />
			))}
		</Box>
	);
}