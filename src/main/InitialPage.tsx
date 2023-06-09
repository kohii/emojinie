import { Box, Text } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import { useCallback, useEffect, useRef, useState } from "react";

import { Footer } from "../components/Footer";
import { MainInput } from "../components/MainInput";
import { useRouterState } from "../contexts/RouterStateContext";
import { useSetting } from "../contexts/SettingsContext";
import { useInstallActions } from "../hooks/useInstallActions";
import { showSettings } from "../libs/command";
import { Action } from "../types/action";

type InitialPageProps = {
  initialText: string;
};

export function InitialPage({ initialText }: InitialPageProps) {
  const { setRouterState } = useRouterState();
  const [text, setText] = useState(initialText);
  const trimmedText = text.trim();
  const openAiApiKey = useSetting("openAiApiKey");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unlisten = listen("show_main_window", () => {
      setText("");
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
    label: "Show emoji suggestions",
    shortcutKey: "Enter",
    handler: handleSubmit,
    state: trimmedText ? "enabled" : "disabled",
  };
  const actions = [settingsAction, submitAction];

  // we do not install submit action and attach it to MainInput.onEnter
  // because we want to prevent submitting when user is composing text
  useInstallActions([settingsAction], { ignoreInputElements: true });

  return (
    <Box>
      <MainInput
        ref={inputRef}
        value={text}
        placeholder="Type something..."
        onChange={setText}
        onEnter={handleSubmit}
        onEscape={() => appWindow.hide()}
      />
      <Footer
        message={
          openAiApiKey ? undefined : (
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
          )
        }
        primaryActions={actions}
      />
    </Box>
  );
}
