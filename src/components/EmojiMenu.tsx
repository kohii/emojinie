import { Box, Divider, Paper, Text, TextInput, useMantineTheme } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { listen } from "@tauri-apps/api/event";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { HOTKEY_OPTIONS } from "../contants/hotkey";
import { useAutoScroll } from "../hooks/useAutoScroll";
import { useMouseMove } from "../hooks/useMouseMove";

import { Hotkey } from "./Hotkey";
import { AbsolutePopover } from "./AbsolutePopover";
import { Action } from "../types/action";
import { getActionShortcutKey } from "../utils/actions";

type Props = {
  emoji: {
    unified: string;
    name: string;
    shortcode: string;
  };
  open: boolean;
  onClose: () => void;
  width?: number;
  minWidth?: number;
  actions: Action[];
};

export function EmojiMenu({ emoji, width, minWidth, actions: actions, onClose, ...props }: Props) {
  const [selected, setSelected] = useState(0);
  const [searchText, setSearchText] = useState("");
  const filteredActions = useMemo(() => {
    return actions.filter((action) => action.state === "enabled" && action.label.toLowerCase().includes(searchText.toLowerCase()));
  }, [searchText, actions]);

  const filterInputRef = useRef<HTMLInputElement>(null);

  const handleSearchTextChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(ev.currentTarget.value);
    setSelected(0);
  }, []);

  const handleClick = useCallback((ev: React.MouseEvent) => {
    ev.stopPropagation();
    filterInputRef.current?.focus();
  }, []);

  const selectPrevious = useCallback(() => {
    setSelected((selected - 1 + filteredActions.length) % filteredActions.length);
  }, [filteredActions.length, selected]);
  const selectNext = useCallback(() => {
    setSelected((selected + 1) % filteredActions.length);
  }, [filteredActions.length, selected]);

  useEffect(() => {
    setSelected(0);
    setSearchText("");
    filterInputRef.current?.focus();
    if (filterInputRef.current) {
      filterInputRef.current.value = "";
    }
  }, [props.open]);

  useEffect(() => {
    const unlisten = listen("show_main_window", () => {
      onClose();
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, [onClose]);

  const viewport = useRef<HTMLDivElement>(null);
  useAutoScroll(viewport.current, selected);

  const theme = useMantineTheme();

  return (
    <AbsolutePopover {...props} right={16} bottom={40} onClose={onClose}>
      <Paper
        display="flex"
        sx={{
          border: `1px solid ${theme.colorScheme === "dark" ? theme.colors.gray[7] : theme.colors.gray[2]}`,
          width,
          minWidth,
          maxHeight: 360,
          flexDirection: "column",
          background: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0],
          boxShadow:
            "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
        }}
        onClick={handleClick}
      >
        <Box
          display="flex"
          px={8}
          sx={{
            alignItems: "center",
            gap: 8,
          }}>
          <Text
            size={40}
          >
            {emoji.unified}
          </Text>
          <Box>
            <Text color="text.1" size="sm" weight="bold">
              {emoji.name}
            </Text>
            <Text color="text.1" size="xs" weight="bold">
              {emoji.shortcode}
            </Text>
          </Box>
        </Box>
        <Divider />
        <Box
          p={8}
          ref={viewport}
          sx={{
            overflowY: "auto",
          }}
          onMouseMove={useMouseMove(".menu-item", ({ target }) => {
            const container = target.parentElement;
            if (!container) return;
            const index = Array.from(container.children).indexOf(target);
            setSelected(index);
          })}
        >
          {filteredActions.length === 0 && (
            <Text size="sm" color="text.1" align="center" p={8}>
              No results
            </Text>
          )}
          {filteredActions.map((action, index) => (
            <MenuItem
              className="menu-item"
              key={action.label}
              shortcutKey={getActionShortcutKey(action)}
              onClick={() => {
                action.handler();
                onClose();
              }}
              selected={selected === index}
            >
              {action.label}
            </MenuItem>
          ))}
        </Box>
        <Divider />
        <Box px={8}>
          <TextInput
            placeholder="Search..."
            autoFocus
            size="sm"
            variant="unstyled"
            color="text.1"
            ref={filterInputRef}
            value={searchText}
            onChange={handleSearchTextChange}
            py={2}
            onKeyDown={getHotkeyHandler([
              ...actionsToHotkeyItems(actions, onClose),
              ["ArrowUp", selectPrevious, HOTKEY_OPTIONS],
              ["ArrowDown", selectNext, HOTKEY_OPTIONS],
              ["Tab", selectNext, HOTKEY_OPTIONS],
              ["Shift+Tab", selectPrevious, HOTKEY_OPTIONS],
              [
                "Enter",
                () => {
                  filteredActions[selected]?.handler();
                  onClose();
                },
                HOTKEY_OPTIONS,
              ],
              [
                "Escape",
                () => {
                  if (searchText) {
                    setSearchText("");
                  } else {
                    onClose();
                  }
                },
                HOTKEY_OPTIONS,
              ],
            ])}
          />
        </Box>
      </Paper>
    </AbsolutePopover>
  );
}

function MenuItem({
  className,
  children,
  shortcutKey,
  onClick,
  selected,
}: {
  className: string;
  children: React.ReactNode;
  shortcutKey?: string;
  onClick: () => void;
  selected?: boolean;
}) {
  const theme = useMantineTheme();
  return (
    <Box
      className={className}
      py={4}
      px={8}
      display="flex"
      tabIndex={-1}
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
        gap: 4,
        borderRadius: 4,
        userSelect: "none",
        cursor: "pointer",
        ...(selected
          ? {
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.gray[7] : theme.colors.gray[3],
          }
          : {}),
      }}
      onClick={onClick}
    >
      <Text size="sm" color={selected ? "text.0" : "text.1"} sx={{ flexGrow: 1 }} py={4}>
        {children}
      </Text>
      {shortcutKey && <Hotkey hotkey={shortcutKey} />}
    </Box>
  );
}

function actionsToHotkeyItems(
  actions: Action[],
  onClose: () => void,
) {
  return actions
    .filter(
      (action) => {
        const shortcutKey = getActionShortcutKey(action);
        return shortcutKey &&
          (shortcutKey.startsWith("mod+") ||
            shortcutKey.startsWith("ctrl+") ||
            shortcutKey.startsWith("alt+"));
      },
    )
    .map((action) => [
      action.shortcutKey,
      (event: React.KeyboardEvent<HTMLElement> | KeyboardEvent) => {
        event.preventDefault();
        event.stopPropagation();
        action.handler();
        onClose();
      },
      HOTKEY_OPTIONS,
    ]) as [
      string,
      (event: React.KeyboardEvent<HTMLElement> | KeyboardEvent) => void,
      { preventDefault: boolean },
    ][];
}
