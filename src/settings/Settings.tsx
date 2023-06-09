import { Box, Radio, Group, PasswordInput, Anchor, Checkbox } from "@mantine/core";
import { Text } from "@mantine/core";
import { invoke } from "@tauri-apps/api";
import { emit } from "@tauri-apps/api/event";
import { register, unregister, isRegistered } from "@tauri-apps/api/globalShortcut";
import { useCallback, useRef } from "react";

import { HotkeyInput } from "../components/HotkeyInput";
import { Label } from "../components/Label";
import { useSaveSetting, useSetting } from "../contexts/SettingsContext";
import { useAutoStart } from "../hooks/useAutoStart";
import { useComponentFocused as useComponentFocusChanged } from "../hooks/useComponentFocusChanged";
import { useFormValue } from "../hooks/useFormValue";
import { useWindowClose } from "../hooks/useWindowClose";

export function Settings() {
  const openAiApiKey = useSetting("openAiApiKey");
  const hotkey = useSetting("hotkey");
  const appearance = useSetting("appearance");
  const saveSetting = useSaveSetting();

  const openAiApiKeyForm = useFormValue({
    value: openAiApiKey,
    validate: (value) => (value ? null : "Required"),
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

  const hotkeyInputRef = useRef<HTMLInputElement>(null);

  const { isAutoStartEnabled, setAutoStartEnabled } = useAutoStart();

  // suspend hotkey when focused on hotkey input
  useComponentFocusChanged(
    hotkeyInputRef,
    useCallback(
      async (isHotkeyFocused) => {
        if (isHotkeyFocused) {
          if (await isRegistered(hotkey)) {
            await unregister(hotkey);
            console.debug("suspend hotkey");
          }
        } else {
          if (!(await isRegistered(hotkey))) {
            await register(hotkey, () => {
              invoke("toggle_main_window");
            });
            console.debug("resume hotkey");
          }
        }
      },
      [hotkey],
    ),
  );

  useWindowClose(
    useCallback(async () => {
      emit("setting_window:close");
    }, []),
  );

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
          description={
            <span>
              Get your API key from{" "}
              <Anchor
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
                rel="noreferrer"
              >
                https://platform.openai.com/account/api-keys
              </Anchor>
            </span>
          }
          {...openAiApiKeyForm.inputProps}
          inputWrapperOrder={["label", "input", "description", "error"]}
        />

        <HotkeyInput
          label="Hotkey"
          description="Select this field and type the hotkey to open Emojinie"
          inputRef={hotkeyInputRef}
          {...hotkeyForm.inputProps}
        />

        <Box>
          <Label>Startup</Label>
          <Checkbox
            checked={isAutoStartEnabled}
            onChange={setAutoStartEnabled}
            label="Start at login"
            mt="xs"
          />
        </Box>

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
