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
import { getEmojiData, getShortcodes } from "../libs/emojis";
import { Action } from "../types/action";
import { useHotkeys } from "@mantine/hooks";
import { HOTKEY_OPTIONS } from "../contants/hotkey";
import { EmojiMenu } from "../components/EmojiMenu";
import { useMenuControl } from "../hooks/useMenuControl";
import { writeText } from "@tauri-apps/api/clipboard";
import { useMainWindow } from "../hooks/useMainWindow";
import { SuggestWithAILabel } from "../components/SuggestWithAILabel";

const noop = () => undefined;

type InitialPageProps = {
  initialText: string;
};

export function InitialPage({ initialText }: InitialPageProps) {
  const win = useMainWindow();
  const { setRouterState } = useRouterState();
  const [text, setText] = useState("");
  const [focusedEmoji, setFocusedEmoji] = useState<string | null>(null);
  const { emojiData, shortcodes } = useMemo(
    () => {
      if (!focusedEmoji) return { emojiData: undefined, shortcodes: undefined };
      const emojiData = getEmojiData(focusedEmoji);
      const shortcodes = getShortcodes(focusedEmoji);
      return { emojiData, shortcodes };
    },
    [focusedEmoji],
  );
  const trimmedText = text.trim();
  const openAiApiKey = useSetting("openAiApiKey");
  const emojiGridRef = useRef<EmojiGridHandle>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  if (!focusedEmoji && emojiGridRef.current) {
    setFocusedEmoji(emojiGridRef.current.getFocusedEmoji());
  }

  const menuControl = useMenuControl();

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

  const handleSuggest = useCallback(() => {
    if (!trimmedText) return;
    setRouterState({ page: "suggestion-result", text: trimmedText });
  }, [setRouterState, trimmedText]);

  const pasteEmojiAction: Action = {
    label: "Paste emoji",
    shortcutKey: "Enter",
    handler() {
      if (focusedEmoji) {
        invoke("paste", { text: focusedEmoji });
        win.hide();
      }
    },
    state: focusedEmoji ? "enabled" : "disabled",
  };
  const copyEmojiAction: Action = {
    label: "Copy emoji to clipboard",
    shortcutKey: "mod+C",
    handler() {
      if (focusedEmoji) {
        writeText(focusedEmoji);
        win.hide();
      }
    },
    state: focusedEmoji ? "enabled" : "disabled",
  };
  const pasteShortcodeAction: Action = {
    label: "Paste shortcode",
    shortcutKey: "Shift+Enter",
    handler() {
      if (shortcodes) {
        invoke("paste", { text: shortcodes.shortcode });
        win.hide();
      }
    },
    state: shortcodes ? "enabled" : "disabled",
  };
  const copyShortcodeAction: Action = {
    label: "Copy shortcode",
    shortcutKey: "mod+Shift+C",
    handler() {
      if (shortcodes) {
        writeText(shortcodes.shortcode);
        win.hide();
      }
    },
    state: shortcodes ? "enabled" : "disabled",
  };
  const pasteGithubShortcodeForAction: Action = {
    label: "Paste shortcode (GitHub)",
    handler() {
      if (shortcodes) {
        invoke("paste", { text: shortcodes.githubShortcode });
      }
    },
    state: shortcodes ? "enabled" : "disabled",
  };
  const copyGithubShortcodeAction: Action = {
    label: "Copy shortcode (GitHub)",
    handler() {
      if (shortcodes) {
        writeText(shortcodes.githubShortcode);
        win.hide();
      }
    },
    state: shortcodes ? "enabled" : "disabled",
  };
  const suggestAction: Action = {
    // Suggest emojis using AI
    label: "Suggest with AI",
    shortcutKey: "Tab",
    handler: handleSuggest,
    state: trimmedText ? "enabled" : "disabled",
  };
  const settingsAction: Action = {
    label: "Settings",
    shortcutKey: "mod+Comma",
    handler: showSettings,
    state: "enabled",
  };

  const actionsAction: Action = {
    label: "Actions",
    shortcutKey: "mod+K",
    handler: menuControl.toggle,
    state: focusedEmoji ? "enabled" : "disabled",
  };
  const footerActions = [settingsAction, pasteEmojiAction, actionsAction];

  // we do not install submit action and attach it to MainInput.onEnter
  // because we want to prevent submitting when user is composing text
  useInstallActions(
    [
      pasteEmojiAction,
      copyEmojiAction,
      pasteShortcodeAction,
      copyShortcodeAction,
      pasteGithubShortcodeForAction,
      copyGithubShortcodeAction,
      settingsAction,
      actionsAction,
    ],
    { ignoreInputElements: true }
  );

  useHotkeys(
    menuControl.isOpen ? [] : [
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
        rightSection={trimmedText ? <SuggestWithAILabel /> : null}
        onChange={setText}
        onEnter={pasteEmojiAction.handler}
        onEscape={() => appWindow.hide()}
        onTab={suggestAction.handler}
      />
      <EmojiGrid
        searchText={trimmedText}
        onSelect={pasteEmojiAction.handler}
        onFocusChange={(row, column, emoji) => setFocusedEmoji(emoji)}
        ref={emojiGridRef}
      />
      <Footer
        message={
          openAiApiKey ? (
            <Text size="xs" weight="bold" color="text.1">
              {shortcodes?.shortcode}
            </Text>
          ) : (
            <NoApiKey />
          )
        }
        primaryActions={footerActions}
      />
      {focusedEmoji && menuControl.isOpen && <EmojiMenu
        minWidth={320}
        emoji={{ unified: focusedEmoji, name: emojiData?.name ?? "", shortcode: shortcodes?.shortcode ?? "" }}
        actions={[
          pasteEmojiAction,
          copyEmojiAction,
          pasteShortcodeAction,
          copyShortcodeAction,
          pasteGithubShortcodeForAction,
          copyGithubShortcodeAction,
        ]}
        {...menuControl.popoverProps}
        onClose={() => {
          menuControl.close();
          inputRef.current?.focus();
        }}
      />}
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
