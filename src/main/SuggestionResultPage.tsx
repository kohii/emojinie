import { ActionIcon, Box, Text, useMantineTheme } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { IconChevronLeft } from "@tabler/icons-react";
import { invoke } from "@tauri-apps/api";
import { writeText } from "@tauri-apps/api/clipboard";
import React, { useCallback } from "react";

import { EmojiList } from "../components/EmojiList";
import { StatusBar } from "../components/StatusBar";
import { useRouterState } from "../contexts/RouterStateContext";
import { useSetting } from "../contexts/SettingsContext";
import { useFocusState } from "../hooks/useFocutState";
import { useMainWindow } from "../hooks/useMainWindow";
import { useSuggestEmojis } from "../hooks/useSuggestEmojis";
import { useTextColor } from "../hooks/useTextColor";
import { commandErrorToString, showSettings } from "../libs/command";
import { EmojiItem } from "../types/emoji";

type SuggestionResultPageProps = {
  text: string;
};

export const SuggestionResultPage = React.memo(function SuggestionResultPage({
  text,
}: SuggestionResultPageProps) {
  const openAiApiKey = useSetting("openAiApiKey");
  const emojisQuery = useSuggestEmojis(text, openAiApiKey);
  const focusState = useFocusState({ listSize: emojisQuery.data?.length || 0 });
  const win = useMainWindow();

  const { reset } = useRouterState();
  const handleBack = useCallback(() => {
    reset({ text });
  }, [reset, text]);

  const handleSelectEmoji = useCallback(
    (emoji: EmojiItem) => {
      console.debug("paste", emoji);
      invoke("paste", { text: emoji.emoji });
      reset();
    },
    [reset],
  );

  const refreshResult = useCallback(() => {
    if (!text) return;
    if (!openAiApiKey) return;
    emojisQuery.refetch();
  }, [emojisQuery, openAiApiKey, text]);

  const pasteEmoji = useCallback(() => {
    const emoji = emojisQuery.data?.[focusState.focusedIndex];
    if (emoji) {
      handleSelectEmoji(emoji);
    }
  }, [emojisQuery, focusState, handleSelectEmoji]);

  const copyEmoji = useCallback(() => {
    const emoji = emojisQuery.data?.[focusState.focusedIndex];
    if (emoji) {
      writeText(emoji.emoji);
      win.hide();
      reset();
    }
  }, [emojisQuery, focusState, win, reset]);

  useHotkeys([
    ["Enter", pasteEmoji],
    ["mod+C", copyEmoji],
    ["mod+R", refreshResult],
    ["ArrowUp", () => focusState.focusPrevious()],
    ["ArrowDown", () => focusState.focusNext()],
    ["Backspace", handleBack],
    ["Escape", handleBack],
  ]);

  const theme = useMantineTheme();
  const textColor = useTextColor();

  return (
    <Box>
      <Box
        p="xs"
        display="flex"
        sx={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        data-tauri-drag-region
      >
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
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2],
            color: textColor.secondary,
          }}
        >
          {text}
        </Text>
      </Box>
      <ResultContent
        emojisQuery={emojisQuery}
        handleBack={handleBack}
        handleSelectEmoji={handleSelectEmoji}
        refreshResult={refreshResult}
        pasteEmoji={pasteEmoji}
        copyEmoji={copyEmoji}
        focusState={focusState}
        isOpenAiApiKeySet={!!openAiApiKey}
      />
    </Box>
  );
});

function ResultContent({
  emojisQuery,
  handleBack,
  handleSelectEmoji,
  refreshResult,
  pasteEmoji,
  copyEmoji,
  focusState,
  isOpenAiApiKeySet,
}: {
  emojisQuery: ReturnType<typeof useSuggestEmojis>;
  handleBack: () => void;
  handleSelectEmoji: (emoji: EmojiItem) => void;
  refreshResult: () => void;
  pasteEmoji: () => void;
  copyEmoji: () => void;
  focusState: ReturnType<typeof useFocusState>;
  isOpenAiApiKeySet: boolean;
}) {
  if (emojisQuery.isFetching) {
    return (
      <>
        <Box p="lg" sx={{ textAlign: "center" }}>
          🔄 Loading...
        </Box>
        <StatusBar
          keyMaps={[
            {
              key: "Backspace",
              label: "Back to input",
              handler: handleBack,
            },
          ]}
        />
      </>
    );
  }
  console.debug("isOpenAiApiKeySet", isOpenAiApiKeySet);
  if (!isOpenAiApiKeySet) {
    return (
      <>
        <Box p="lg" sx={{ textAlign: "center" }}>
          Please set OpenAI API Key in settings
        </Box>
        <StatusBar
          keyMaps={[
            {
              key: "⌘+,",
              label: "Settings",
              handler: showSettings,
            },
            {
              key: "Backspace",
              label: "Back to input",
              handler: handleBack,
            },
          ]}
        />
      </>
    );
  }
  if (emojisQuery.error) {
    return (
      <>
        <Box p="sm">Error: {commandErrorToString(emojisQuery.error)}</Box>
        <StatusBar
          keyMaps={[
            {
              key: "Backspace",
              label: "Back to input",
              handler: handleBack,
            },
            {
              key: "⌘+R",
              label: "Refresh",
              handler: refreshResult,
            },
          ]}
        />
      </>
    );
  }
  if (emojisQuery.data.length === 0) {
    return (
      <>
        <Box p="lg" sx={{ textAlign: "center" }}>
          No results
        </Box>
        <StatusBar
          keyMaps={[
            {
              key: "Backspace",
              label: "Back to input",
              handler: handleBack,
            },
            {
              key: "⌘+R",
              label: "Refresh",
              handler: () => emojisQuery.refetch(),
            },
          ]}
        />
      </>
    );
  }
  if (emojisQuery.data.length > 0) {
    return (
      <>
        <EmojiList
          emojis={emojisQuery.data}
          focusedIndex={focusState.focusedIndex}
          setFocusedIndex={focusState.setFocusedIndex}
          onClick={handleSelectEmoji}
        />
        <StatusBar
          keyMaps={[
            {
              key: "Backspace",
              label: "Back to input",
              handler: handleBack,
            },
            {
              key: "⌘+R",
              label: "Refresh",
              handler: refreshResult,
            },
            {
              key: "⌘+C",
              label: "Copy emoji",
              handler: copyEmoji,
            },
            {
              key: "↵",
              label: "Paste emoji",
              handler: pasteEmoji,
            },
          ]}
        />
      </>
    );
  }
  return null;
}
