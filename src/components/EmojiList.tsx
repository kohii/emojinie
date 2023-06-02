import { Box } from "@mantine/core";
import { useRef } from "react";

import { useAutoScroll } from "../hooks/useAutoScroll";
import { EmojiItem } from "../types/emoji";

import { EmojiListItem } from "./EmojiListItem";

type EmojiListProps = {
  emojis: EmojiItem[];
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  onClick: (value: EmojiItem) => void;
};

export function EmojiList({ emojis, focusedIndex, setFocusedIndex, onClick }: EmojiListProps) {
  const viewport = useRef<HTMLDivElement>(null);

  useAutoScroll(viewport.current, focusedIndex);

  return (
    <Box pb="xs">
      <Box
        h={320}
        ref={viewport}
        sx={{
          overflowY: "auto",
        }}
      >
        {emojis.map((emoji, index) => (
          <EmojiListItem
            key={emoji.emoji}
            value={emoji}
            focused={index === focusedIndex}
            onClick={onClick}
          />
        ))}
      </Box>
    </Box>
  );
}
