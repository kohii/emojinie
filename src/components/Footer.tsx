import { Box, Button, Divider, Text, useMantineTheme } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import React, { useMemo, useRef } from "react";

import { HOTKEY_OPTIONS } from "../contants/hotkey";
import { usePopover } from "../hooks/usePopovert";
import { Action } from "../types/action";
import { getActionShortcutKey } from "../utils/actions";

import { FilterableMenu } from "./FilterableMenu";
import { Hotkey } from "./Hotkey";

type Props = {
  message?: React.ReactNode;
  primaryActions?: Action[];
  allActions?: Action[];
};

export const Footer = React.memo(function StatusBar({
  message,
  primaryActions,
  allActions,
}: Props) {
  const theme = useMantineTheme();
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuControl = usePopover(menuTriggerRef);
  useHotkeys([["mod+K", () => menuControl.toggle(), HOTKEY_OPTIONS]]);

  const [enabledPrimaryActions, enabledAllActions] = useMemo(() => {
    return [
      primaryActions?.filter((action) => action.state === "enabled"),
      allActions?.filter((action) => action.state === "enabled"),
    ];
  }, [primaryActions, allActions]);

  return (
    <Box
      px="xs"
      py={4}
      display="flex"
      sx={{
        userSelect: "none",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],
        borderTop: "1px solid",
        borderTopColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2],
      }}
    >
      {message}
      <div style={{ flexGrow: 1 }} />
      {enabledPrimaryActions?.map((action, index) => (
        <React.Fragment key={action.label}>
          {index > 0 && <Divider orientation="vertical" />}
          <FooterItemButton
            key={action.label}
            label={action.label}
            shortcutKey={getActionShortcutKey(action)}
            onClick={action.handler}
          />
        </React.Fragment>
      ))}
      {enabledAllActions?.length && (
        <>
          <Divider orientation="vertical" />
          <FooterItemButton
            label="Actions"
            shortcutKey="mod+K"
            onClick={menuControl.toggle}
            ref={menuTriggerRef}
          />
          {menuControl.isOpen && (
            <FilterableMenu
              {...menuControl.popoverProps}
              horizontal="end"
              vertical="top"
              width={280}
              items={enabledAllActions.map((a) => ({
                label: a.label,
                shortcutKey: getActionShortcutKey(a),
                onClick: a.handler,
              }))}
            />
          )}
        </>
      )}
    </Box>
  );
});

const FooterItemButton = React.forwardRef<
  HTMLButtonElement,
  {
    label: string;
    shortcutKey?: string;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
  }
>(function FooterItemButton({ label, shortcutKey, onClick }, ref) {
  return (
    <Button
      variant="subtle"
      py={2}
      px={4}
      sx={{
        borderRadius: 4,
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, .2)",
        },
      }}
      onClick={onClick}
      ref={ref}
    >
      <Box display="flex" sx={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <Text size="xs" color="text.1">
          {label}
        </Text>
        {shortcutKey && <Hotkey hotkey={shortcutKey} />}
      </Box>
    </Button>
  );
});
