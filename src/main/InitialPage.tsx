import { Box } from "@mantine/core";
import { listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import { useCallback, useEffect, useRef, useState } from "react";

import { MainInput } from "../components/MainInput";
import { StatusBar } from "../components/StatusBar";
import { useRouterState } from "../contexts/RouterStateContext";
import { showSettings } from "../libs/command";

type InitialPageProps = {
  initialText: string;
};

export function InitialPage({ initialText }: InitialPageProps) {
  const { setRouterState } = useRouterState();
  const [text, setText] = useState(initialText);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setRouterState({ page: "suggestion-result", text: trimmed });
  }, [setRouterState, text]);

  useEffect(() => {
    const unlisten = listen("show_spotlight_window", () => {
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
      {text && (
        <StatusBar
          keyMaps={[
            {
              key: "⌘+;",
              label: "Settings",
              handler: showSettings,
            },
            {
              key: "Enter",
              label: "Show emoji suggestions",
              handler: handleSubmit,
            },
          ]}
        />
      )}
    </Box>
  );
}
