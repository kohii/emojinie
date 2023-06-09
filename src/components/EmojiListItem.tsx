import { Box, Text, useMantineTheme } from "@mantine/core";
import { useCallback } from "react";

import { EmojiItem } from "../types/emoji";

type EmojiListItemProps = {
  value: EmojiItem;
  focused: boolean;
  onClick: (value: string) => void;
};

const focusStyle = {
  backgroundColor: "#3478C6",
  color: "#fff",
};

export function EmojiListItem({ value, focused, onClick }: EmojiListItemProps) {
  const theme = useMantineTheme();

  const handleClick = useCallback(() => {
    onClick(value.emoji);
  }, [onClick, value]);

  return (
    <Box
      mx="xs"
      px="xs"
      py={6}
      display="flex"
      sx={{
        alignItems: "center",
        gap: 4,
        borderRadius: 4,
        userSelect: "none",
        cursor: "pointer",
        ...(focused
          ? focusStyle
          : {
              "&:hover": {
                backgroundColor:
                  theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2],
              },
            }),
      }}
      onClick={handleClick}
    >
      <span>{value.emoji}</span>
      <Text fz="sm" color={focused ? "#fff" : "text.1"}>
        {value.shortcode}
      </Text>
    </Box>
  );
}
