import { Box, Text } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import { useCallback, useEffect, useRef, useState } from "react";

import { Footer } from "../components/Footer";
import { MainInput } from "../components/MainInput";
import { useRouterState } from "../contexts/RouterStateContext";
import { useSetting } from "../contexts/SettingsContext";
import { showSettings } from "../libs/command";

type InitialPageProps = {
  initialText: string;
};

export function InitialPage({ initialText }: InitialPageProps) {
  const { setRouterState } = useRouterState();
  const [text, setText] = useState(initialText);
  const trimmedText = text.trim();
  const openAiApiKey = useSetting("openAiApiKey");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    if (!trimmedText) return;
    setRouterState({ page: "suggestion-result", text: trimmedText });
  }, [setRouterState, trimmedText]);

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
        items={[
          {
            type: "action",
            shortcutKey: "⌘+,",
            label: "Settings",
            handler: showSettings,
          },
          {
            type: "action",
            shortcutKey: "Enter",
            label: "Show emoji suggestions",
            handler: handleSubmit,
            hidden: !trimmedText,
          },
        ]}
      />
    </Box>
  );
}
