import { Box } from "@mantine/core";
import { useEffect, useRef } from "react";

import { EmojiItem } from "../types/emoji";
import { assertUnreachable } from "../utils/assertUnreachable";

import { EmojiListItem } from "./EmojiListItem";

type EmojiListProps = {
	emojis: EmojiItem[];
	focusedIndex: number;
	setFocusedIndex: (index: number) => void;
	onClick: (value: EmojiItem) => void;
}

export function EmojiList({
	emojis,
	focusedIndex,
	setFocusedIndex,
	onClick,
}: EmojiListProps) {

	const viewport = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!viewport.current) return;
		const item = viewport.current.children[focusedIndex];
		if (!item) return;
		const itemPos = item.getBoundingClientRect().top;
		const scrollPos = viewport.current.getBoundingClientRect().top;

		const itemPosType: "inView" | "above" | "below" = itemPos < scrollPos ? "above" : itemPos >= scrollPos + viewport.current.clientHeight ? "below" : "inView";
		switch (itemPosType) {
			case "above":
				item.scrollIntoView({ block: "start" });
				break;
			case "below":
				item.scrollIntoView({ block: "end" });
				break;
			case "inView":
				break;
			default:
				assertUnreachable(itemPosType);
		}
	}, [focusedIndex]);

	return (
		<Box pb="xs">
			<Box
				h={320}
				ref={viewport}
				sx={{
					overflowY: "auto",
				}}>
				{emojis.map((emoji, index) => (
					<EmojiListItem key={emoji.emoji} value={emoji} focused={index === focusedIndex} onClick={onClick} onMouseEnter={() => setFocusedIndex(index)} />
				))}
			</Box>
		</Box>
	);
}