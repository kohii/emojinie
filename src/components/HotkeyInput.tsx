import { TextInput } from "@mantine/core";
import { useCallback } from "react";

import { toHotkeyTokensForDisplay, getHotkeyForTauriFromKeyboardEvent } from "../libs/hotkey";

type Props = {
  label: string;
  value: string;
  description?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

export function HotkeyInput({
  label,
  value,
  description,
  inputRef,
  onChange,
  onFocus,
  onBlur,
}: Props) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const key = getHotkeyForTauriFromKeyboardEvent(event);
      key && onChange(key);
    },
    [onChange],
  );

  return (
    <TextInput
      label={label}
      value={toHotkeyTokensForDisplay(value).join("")}
      onKeyDownCapture={handleKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      description={description}
      readOnly
      inputWrapperOrder={["label", "input", "description", "error"]}
      ref={inputRef}
      sx={{
        input: {
          textAlign: "center",
        },
      }}
    />
  );
}
