import { Input, Box } from "@mantine/core";
import React, { useCallback, useRef } from "react";

type Props = {
  value: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export const MainInput = React.memo(function MainInput({
  value,
  placeholder,
  onChange,
  onSubmit,
  onMoveUp,
  onMoveDown,
}: Props) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  }, [onChange]);

  const isComposing = useRef(false);

  const onCompositionStart = useCallback(() => {
    console.log("composition start");
    isComposing.current = true;
  }, []);

  const onCompositionEnd = useCallback(() => {
    console.log("composition end");
    isComposing.current = false;
  }, []);


  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!isComposing.current && e.keyCode === 13 && e.key === "Enter") {
      e.preventDefault();
      onSubmit?.();
    }
    if (!isComposing.current && e.key === "ArrowUp") {
      e.preventDefault();
      onMoveUp?.();
    }
    if (!isComposing.current && e.key === "ArrowDown") {
      e.preventDefault();
      onMoveDown?.();
    }
  }, [onSubmit, onMoveUp, onMoveDown]);


  return (
    <Box p="xs" data-tauri-drag-region>
      <Input
        variant="filled"
        value={value}
        placeholder={placeholder}
        autoFocus
        styles={{
          input: {
            border: 0,
            color: "white",
          }
        }}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
      />
    </Box>
  );
});
