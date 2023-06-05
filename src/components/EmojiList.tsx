import { Box } from "@mantine/core";
import { useRef } from "react";

import { useAutoScroll } from "../hooks/useAutoScroll";
import { EmojiItem } from "../types/emoji";

import { EmojiListItem } from "./EmojiListItem";

type EmojiListProps = {
  emojis: EmojiItem[];
  focusedIndex: number;
  onSelect: () => void;
};

export function EmojiList({ emojis, focusedIndex, onSelect }: EmojiListProps) {
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
            onClick={onSelect}
          />
        ))}
      </Box>
    </Box>
  );
}
