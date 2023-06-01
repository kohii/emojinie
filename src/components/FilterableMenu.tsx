import { Box, Divider, Paper, Text, TextInput, useMantineTheme } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { listen } from "@tauri-apps/api/event";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { HOTKEY_OPTIONS } from "../contants/hotkey";

import { Hotkey } from "./Hotkey";
import { Popover } from "./Popover";

type MenuProps = {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  horizontal?: "start" | "end";
  vertical?: "top" | "bottom";
  width?: number;
  items: {
    label: string;
    shortcutKey?: string;
    onClick: () => void;
  }[];
};

export function FilterableMenu({ width, items, onClose, ...props }: MenuProps) {
  const [selected, setSelected] = useState(0);
  const [filterText, setFilterText] = useState("");
  const filteredItems = useMemo(() => {
    return items.filter((item) => item.label.toLowerCase().includes(filterText.toLowerCase()));
  }, [filterText, items]);

  const filterInputRef = useRef<HTMLInputElement>(null);

  const handleFilterTextChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(ev.currentTarget.value);
    setSelected(0);
  }, []);

  const handleClick = useCallback((ev: React.MouseEvent) => {
    ev.stopPropagation();
    filterInputRef.current?.focus();
  }, []);

  const selectPrevious = useCallback(() => {
    setSelected((selected - 1 + filteredItems.length) % filteredItems.length);
  }, [filteredItems.length, selected]);
  const selectNext = useCallback(() => {
    setSelected((selected + 1) % filteredItems.length);
  }, [filteredItems.length, selected]);

  useEffect(() => {
    setSelected(0);
    setFilterText("");
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

  const theme = useMantineTheme();

  return (
    <Popover {...props} onClose={onClose}>
      <Paper
        withBorder
        sx={{
          width,
          background: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
          boxShadow:
            "0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.175),rgba(0, 0, 0, 0.175) 0 2.25rem 1.75rem -0.4375rem,rgba(0, 0, 0, 0.15) 0 1.0625rem 1.0625rem -0.4375rem",
        }}
        onClick={handleClick}
      >
        <Box p={4}>
          {filteredItems.length === 0 && (
            <Text size="sm" color="text.1" align="center" p={8}>
              No results
            </Text>
          )}
          {filteredItems.map((item, index) => (
            <MenuItem
              key={item.label}
              shortcutKey={item.shortcutKey}
              onClick={item.onClick}
              selected={selected === index}
              onMouseEnter={() => setSelected(index)}
            >
              {item.label}
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
            value={filterText}
            onChange={handleFilterTextChange}
            onKeyDown={getHotkeyHandler([
              ["ArrowUp", selectPrevious, HOTKEY_OPTIONS],
              ["ArrowDown", selectNext, HOTKEY_OPTIONS],
              ["Tab", selectNext, HOTKEY_OPTIONS],
              ["Shift+Tab", selectPrevious, HOTKEY_OPTIONS],
              ["Enter", () => filteredItems[selected]?.onClick(), HOTKEY_OPTIONS],
              ["Escape", onClose, HOTKEY_OPTIONS],
            ])}
          />
        </Box>
      </Paper>
    </Popover>
  );
}

function MenuItem({
  children,
  shortcutKey,
  onClick,
  onMouseEnter,
  selected,
}: {
  children: React.ReactNode;
  shortcutKey?: string;
  onClick: () => void;
  onMouseEnter?: () => void;
  selected?: boolean;
}) {
  const theme = useMantineTheme();
  return (
    <Box
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
                theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2],
            }
          : {}),
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <Text size="sm" color={selected ? "text.0" : "text.1"} sx={{ flexGrow: 1 }}>
        {children}
      </Text>
      {shortcutKey && <Hotkey hotkey={shortcutKey} />}
    </Box>
  );
}
