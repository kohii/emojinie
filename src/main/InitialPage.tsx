import { Box, Text } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { EmojiGrid, EmojiGridHandle } from "../components/EmojiGrid";
import { Footer } from "../components/Footer";
import { MainInput } from "../components/MainInput";
import { useRouterState } from "../contexts/RouterStateContext";
import { useSetting } from "../contexts/SettingsContext";
import { useInstallActions } from "../hooks/useInstallActions";
import { showSettings } from "../libs/command";
import { getShortcodes } from "../libs/emojis";
import { Action } from "../types/action";
import { useHotkeys } from "@mantine/hooks";
import { HOTKEY_OPTIONS } from "../contants/hotkey";

const noop = () => undefined;

type InitialPageProps = {
  initialText: string;
};

export function InitialPage({ initialText }: InitialPageProps) {
  const { setRouterState } = useRouterState();
  const [text, setText] = useState("");
  const [focusedEmoji, setFocusedEmoji] = useState<string | null>(null);
  const focusedEmojiShortcode = useMemo(
    () => (focusedEmoji ? getShortcodes(focusedEmoji).shortcode : null),
    [focusedEmoji],
  );
  const trimmedText = text.trim();
  const openAiApiKey = useSetting("openAiApiKey");
  const emojiGridRef = useRef<EmojiGridHandle>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  if (!focusedEmoji && emojiGridRef.current) {
    setFocusedEmoji(emojiGridRef.current.getFocusedEmoji());
  }

  useEffect(() => {
    setText(initialText);

    const unlisten = listen("show_main_window", () => {
      setText("");
      emojiGridRef.current?.focusFirst();
    });

    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }

    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  const handleSubmit = useCallback(() => {
    if (!trimmedText) return;
    setRouterState({ page: "suggestion-result", text: trimmedText });
  }, [setRouterState, trimmedText]);

  const settingsAction: Action = {
    label: "Settings",
    shortcutKey: "mod+Comma",
    handler: showSettings,
    state: "enabled",
  };
  const submitAction: Action = {
    // Suggest emojis using AI
    label: "Suggest with AI",
    shortcutKey: "Tab",
    handler: handleSubmit,
    state: trimmedText ? "enabled" : "disabled",
  };
  const pasteAction: Action = {
    label: "Paste emoji",
    shortcutKey: "Enter",
    handler() {
      if (focusedEmoji) {
        invoke("paste", { text: focusedEmoji });
      }
    },
    state: focusedEmoji ? "enabled" : "disabled",
  };
  const primaryActions = [...(trimmedText ? [] : [settingsAction]), pasteAction, submitAction];

  // we do not install submit action and attach it to MainInput.onEnter
  // because we want to prevent submitting when user is composing text
  useInstallActions([settingsAction], { ignoreInputElements: true });

  useHotkeys(
    [
      ["ArrowLeft", emojiGridRef.current?.focusLeft ?? noop, HOTKEY_OPTIONS],
      ["ArrowRight", emojiGridRef.current?.focusRight ?? noop, HOTKEY_OPTIONS],
      ["ArrowUp", emojiGridRef.current?.focusUp ?? noop, HOTKEY_OPTIONS],
      ["ArrowDown", emojiGridRef.current?.focusDown ?? noop, HOTKEY_OPTIONS],
      ["mod+ArrowLeft", emojiGridRef.current?.focusFirstInRow ?? noop, HOTKEY_OPTIONS],
      ["mod+ArrowRight", emojiGridRef.current?.focusLastInRow ?? noop, HOTKEY_OPTIONS],
      ["mod+ArrowUp", emojiGridRef.current?.focusFirst ?? noop, HOTKEY_OPTIONS],
      ["mod+ArrowDown", emojiGridRef.current?.focusLast ?? noop, HOTKEY_OPTIONS],
    ],
    [],
  );

  return (
    <Box>
      <MainInput
        ref={inputRef}
        value={text}
        placeholder="Type something..."
        onChange={setText}
        onEnter={pasteAction.handler}
        onEscape={() => appWindow.hide()}
        onTab={submitAction.handler}
      />
      <EmojiGrid
        searchText={trimmedText}
        onSelect={pasteAction.handler}
        onFocusChange={(row, column, emoji) => setFocusedEmoji(emoji)}
        ref={emojiGridRef}
      />
      <Footer
        message={
          openAiApiKey ? (
            <Text size="xs" weight="bold" color="text.1">
              {focusedEmojiShortcode}
            </Text>
          ) : (
            <NoApiKey />
          )
        }
        primaryActions={primaryActions}
      />
    </Box>
  );
}

function NoApiKey() {
  return (
    <Box
      display="flex"
      sx={{ alignItems: "center", gap: 8, cursor: "pointer" }}
      p={4}
      onClick={showSettings}
    >
      <IconAlertTriangle size={16} />
      <Text size="xs" color="text.1">
        Set OpenAI API key in Settings
      </Text>
    </Box>
  );
}
