import { Input, Box, useMantineTheme } from "@mantine/core";
import React, { useCallback, useRef } from "react";

type Props = {
  value: string;
  placeholder?: string;
  readOnly?: boolean;
  multiline?: boolean;
  onChange?: (value: string) => void;
  onEnter?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onEscape?: () => void;
};

export const MainInput = React.forwardRef(function MainInput(
  { onChange, onEnter, onMoveUp, onMoveDown, onMoveLeft, onMoveRight, onEscape, ...props }: Props,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const theme = useMantineTheme();
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    },
    [onChange],
  );

  const isComposing = useRef(false);

  const onCompositionStart = useCallback(() => {
    isComposing.current = true;
  }, []);

  const onCompositionEnd = useCallback(() => {
    isComposing.current = false;
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      if (!isComposing.current && e.keyCode === 13 && e.key === "Enter") {
        e.preventDefault();
        onEnter?.();
      }
      if (!isComposing.current && e.key === "ArrowUp") {
        e.preventDefault();
        onMoveUp?.();
      }
      if (onMoveDown && !isComposing.current && e.key === "ArrowDown") {
        e.preventDefault();
        onMoveDown();
      }
      if (onMoveLeft && !isComposing.current && e.key === "ArrowLeft") {
        e.preventDefault();
        onMoveLeft();
      }
      if (onMoveRight && !isComposing.current && e.key === "ArrowRight") {
        e.preventDefault();
        onMoveRight();
      }
      if (onEscape && !isComposing.current && e.key === "Escape") {
        e.preventDefault();
        onEscape();
      }
    },
    [onMoveDown, onMoveLeft, onMoveRight, onEscape, onEnter, onMoveUp],
  );

  return (
    <Box p="xs" data-tauri-drag-region>
      <Input
        ref={ref}
        variant="filled"
        autoFocus
        sx={{
          input: {
            border: 0,
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2],
            color: "text.0",
          },
        }}
        {...props}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
      />
    </Box>
  );
});
