import { ActionIcon, Box, Text, useMantineTheme } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { IconChevronLeft } from "@tabler/icons-react";
import { invoke } from "@tauri-apps/api";
import { writeText } from "@tauri-apps/api/clipboard";
import React, { useCallback } from "react";

import { EmojiList } from "../components/EmojiList";
import { StatusBar } from "../components/StatusBar";
import { useRouterState } from "../contexts/RouterStateContext";
import { useFocusState } from "../hooks/useFocutState";
import { useSpotlightWindow } from "../hooks/useSpotlightWindow";
import { useSuggestEmojis } from "../hooks/useSuggestEmojis";
import { useTextColor } from "../hooks/useTextColor";
import { commandErrorToString } from "../libs/command";
import { EmojiItem } from "../types/emoji";

type SuggestionResultPageProps = {
  text: string;
}

export const SuggestionResultPage = React.memo(function SuggestionResultPage({
  text,
}: SuggestionResultPageProps) {
  const emojisQuery = useSuggestEmojis(text);
  const focusState = useFocusState({ listSize: emojisQuery.data?.length || 0 });
  const win = useSpotlightWindow();

  const { reset } = useRouterState();
  const handleBack = useCallback(() => {
    reset({ text });
  }, [reset, text]);

  const handleSelectEmoji = useCallback((emoji: EmojiItem) => {
    console.debug("paste", emoji);
    invoke("paste", { text: emoji.emoji });
    reset();
  }, [reset]);

  useHotkeys([
    ["Enter", () => {
      const emoji = emojisQuery.data?.[focusState.focusedIndex];
      if (emoji) {
        handleSelectEmoji(emoji);
      }
    }],
    ["mod+C", () => {
      const emoji = emojisQuery.data?.[focusState.focusedIndex];
      if (emoji) {
        writeText(emoji.emoji);
        win.hide();
        reset();
      }
    }],
    ["mod+R", () => {
      emojisQuery.refetch();
    }],
    ["ArrowUp", () => focusState.focusPrevious()],
    ["ArrowDown", () => focusState.focusNext()],
    ["Backspace", handleBack],
    ["Escape", handleBack],
  ]);

  const theme = useMantineTheme();
  const textColor = useTextColor();

  return (
    <Box>
      <Box p="xs" display="flex" sx={{ flexDirection: "row", alignItems: "center", gap: 8 }} data-tauri-drag-region>
        <ActionIcon onClick={handleBack} tabIndex={-1}>
          <IconChevronLeft />
        </ActionIcon>
        <Text
          size="sm"
          sx={{
            padding: "6px 12px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            borderRadius: 4,
            flexGrow: 1,
            whiteSpace: "nowrap",
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2],
            color: textColor.primary,
          }}>
          {text}
        </Text>
      </Box>
      {emojisQuery.isFetching && <>
        <Box p="lg" sx={{ textAlign: "center" }}>
          🔄 Loading...
        </Box>
        <StatusBar keymap={{
          "Backspace": "Back to input",
        }} />
      </>}
      {!emojisQuery.isFetching && !!emojisQuery.error && <>
        <Box p="sm">Error: {commandErrorToString(emojisQuery.error)}</Box>
        <StatusBar keymap={{
          "Backspace": "Back to input",
          "⌘+R": "Refresh",
        }} />
      </>}
      {
        !emojisQuery.isFetching && !emojisQuery.error && emojisQuery.data.length === 0 && <>
          <Box p="lg" sx={{ textAlign: "center" }}>No results</Box>
          <StatusBar keymap={{
            "Backspace": "Back to input",
            "⌘+R": "Refresh",
          }} />
        </>
      }
      {
        !emojisQuery.isFetching && !emojisQuery.error && emojisQuery.data.length > 0 && (
          <>
            <EmojiList emojis={emojisQuery.data} focusedIndex={focusState.focusedIndex} setFocusedIndex={focusState.setFocusedIndex} onClick={handleSelectEmoji} />
            <StatusBar keymap={{
              "Backspace": "Back to input",
              "⌘+R": "Refresh",
              "⌘+C": "Copy emoji",
              "↵": "Paste emoji",
            }} />
          </>
        )
      }
    </Box >
  );
});