import { ActionIcon, Box, Text, useMantineTheme } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { IconChevronLeft } from "@tabler/icons-react";
import { invoke } from "@tauri-apps/api";
import { writeText } from "@tauri-apps/api/clipboard";
import React, { useCallback } from "react";

import { EmojiList } from "../components/EmojiList";
import { Footer } from "../components/Footer";
import { HOTKEY_OPTIONS } from "../contants/hotkey";
import { useRouterState } from "../contexts/RouterStateContext";
import { useSetting } from "../contexts/SettingsContext";
import { useFocusState } from "../hooks/useFocutState";
import { useInstallActions } from "../hooks/useInstallActions";
import { useMainWindow } from "../hooks/useMainWindow";
import { useSuggestEmojis } from "../hooks/useSuggestEmojis";
import { commandErrorToString, showSettings } from "../libs/command";
import { Action } from "../types/action";
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

  const pasteAction: Action = {
    label: "Paste emoji",
    shortcutKey: "Enter",
    handler() {
      const emoji = emojisQuery.data?.[focusState.focusedIndex];
      if (emoji) {
        handleSelectEmoji(emoji);
      }
    },
    state: emojisQuery.data?.length ? "enabled" : "disabled",
  };
  const copyAction: Action = {
    label: "Copy emoji to clipboard",
    shortcutKey: "mod+C",
    handler() {
      const emoji = emojisQuery.data?.[focusState.focusedIndex];
      if (emoji) {
        writeText(emoji.emoji);
        win.hide();
        reset();
      }
    },
    state: emojisQuery.data?.length ? "enabled" : "disabled",
  };
  const backAction: Action = {
    label: "Back to input",
    shortcutKey: ["Backspace", "Escape"],
    handler() {
      reset({ text });
    },
    state: "enabled",
  };
  const refreshAction: Action = {
    label: "Refresh",
    shortcutKey: "mod+R",
    handler() {
      if (!text) return;
      if (!openAiApiKey) return;
      emojisQuery.refetch();
    },
    state: text && openAiApiKey ? "enabled" : "disabled",
  };
  const settingsAction: Action = {
    label: "Settings",
    shortcutKey: "mod+,",
    handler: showSettings,
    state: "enabled",
  };
  const actions = [pasteAction, copyAction, backAction, refreshAction, settingsAction];
  useInstallActions(actions);

  useHotkeys([
    ["ArrowUp", () => focusState.focusPrevious(), HOTKEY_OPTIONS],
    ["ArrowDown", () => focusState.focusNext(), HOTKEY_OPTIONS],
    ["Shift+Tab", () => focusState.focusPrevious(), HOTKEY_OPTIONS],
    ["Tab", () => focusState.focusNext(), HOTKEY_OPTIONS],
  ]);

  const theme = useMantineTheme();

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
          }}
          color="text.1"
          onClick={backAction.handler}
        >
          {text}
        </Text>
      </Box>
      <ResultContent
        emojisQuery={emojisQuery}
        handleSelectEmoji={handleSelectEmoji}
        focusState={focusState}
        isOpenAiApiKeySet={!!openAiApiKey}
      />
      <Footer primaryActions={[pasteAction]} allActions={actions} />
    </Box>
  );
});

function ResultContent({
  emojisQuery,
  handleSelectEmoji,
  focusState,
  isOpenAiApiKeySet,
}: {
  emojisQuery: ReturnType<typeof useSuggestEmojis>;
  handleSelectEmoji: (emoji: EmojiItem) => void;
  focusState: ReturnType<typeof useFocusState>;
  isOpenAiApiKeySet: boolean;
}) {
  if (emojisQuery.isFetching) {
    return (
      <>
        <Box p="lg" sx={{ textAlign: "center" }}>
          🔄 Loading...
        </Box>
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
      </>
    );
  }
  if (emojisQuery.error) {
    return (
      <>
        <Box p="sm">Error: {commandErrorToString(emojisQuery.error)}</Box>
      </>
    );
  }
  if (emojisQuery.data.length === 0) {
    return (
      <>
        <Box p="lg" sx={{ textAlign: "center" }}>
          No results
        </Box>
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
      </>
    );
  }
  return null;
}
