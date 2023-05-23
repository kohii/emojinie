import { Box, Radio, Group, PasswordInput } from "@mantine/core";
import { invoke } from "@tauri-apps/api";
import { register, unregister } from "@tauri-apps/api/globalShortcut";

import { HotkeyInput } from "../components/HotkeyInput";
import { useSaveSetting, useSetting } from "../contexts/SettingsContext";
import { useFormValue } from "../hooks/useFormValue";

export function Settings() {
  const openAiApiKey = useSetting("openAiApiKey");
  const hotkey = useSetting("hotkey");
  const appearance = useSetting("appearance");
  const saveSetting = useSaveSetting();

  const openAiApiKeyForm = useFormValue({
    value: openAiApiKey,
    validate: (value) => {
      if (!value) return "Required";
      if (!/^sk-[a-zA-Z0-9]{10,}$/.test(value)) return "Invalid API key";
      return null;
    },
    onChange: (value) => saveSetting("openAiApiKey", value),
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

  const handleHotkeyFocus = () => {
    console.debug("handleHotkeyFocus");
    unregister(hotkey);
  };

  const handleHotkeyBlur = () => {
    console.debug("handleHotkeyFocus");
    register(hotkey, () => {
      invoke("toggle_spotlight_window");
    });
  };

  return (
    <Box maw={400} mx="auto" p={24}>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <PasswordInput label="OpenAI API Key" {...openAiApiKeyForm.inputProps} />

        <HotkeyInput
          label="Hotkey"
          description="Press a key combination to open Recommoji"
          {...hotkeyForm.inputProps}
          onFocus={handleHotkeyFocus}
          onBlur={handleHotkeyBlur}
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
