import { Box, Radio, Group, PasswordInput } from "@mantine/core";
import { invoke } from "@tauri-apps/api";
import { register, unregister } from "@tauri-apps/api/globalShortcut";
import { useEffect } from "react";

import { HotkeyInput } from "../components/HotkeyInput";
import { useSaveSetting, useSetting } from "../contexts/SettingsContext";
import { useComponentFocused } from "../hooks/useFocusHandlerWithWindow";
import { useFormValue } from "../hooks/useFormValue";
import { useWindowFocus } from "../hooks/useWindowFocus";

export function Settings() {
  const openAiApiKey = useSetting("openAiApiKey");
  const hotkey = useSetting("hotkey");
  const appearance = useSetting("appearance");
  const saveSetting = useSaveSetting();

  const openAiApiKeyForm = useFormValue({
    value: openAiApiKey,
    validate: (value) => (value ? null : "Required"),
    onChange: (value, isValid) => isValid && saveSetting("openAiApiKey", value),
  });

  const hotkeyForm = useFormValue({
    value: hotkey,
    validate: (value) => (value ? null : "Required"),
    onChange: (value) => saveSetting("hotkey", value),
  });

  const appearanceForm = useFormValue({
    value: appearance,
    onChange: (value) => saveSetting("appearance", value),
    cast: (value: string) => value as typeof appearance,
  });

  const { isComponentFocused, ...hotkeyInputProps } = useComponentFocused();
  const isWindowFocused = useWindowFocus();
  const isHotkeyFocused = isComponentFocused && isWindowFocused;

  // suspend hotkey when focused on hotkey input
  useEffect(() => {
    if (isHotkeyFocused) {
      unregister(hotkey);
    } else {
      register(hotkey, () => {
        invoke("toggle_spotlight_window");
      });
    }
  }, [hotkey, isHotkeyFocused]);

  return (
    <Box mx="auto" p={32} pt={24}>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <PasswordInput
          label="OpenAI API Key"
          {...openAiApiKeyForm.inputProps}
          inputWrapperOrder={["label", "input", "description", "error"]}
        />

        <HotkeyInput
          label="Hotkey"
          description="Press a key combination to open Recommoji"
          {...hotkeyForm.inputProps}
          {...hotkeyInputProps}
        />

        <Radio.Group label="Appearance" {...appearanceForm.inputProps}>
          <Group mt="xs">
            <Radio value="light" label="Light" />
            <Radio value="dark" label="Dark" />
            <Radio value="system" label="System" />
          </Group>
        </Radio.Group>
      </form>
    </Box>
  );
}
