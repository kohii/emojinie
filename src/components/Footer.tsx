import { Menu, Button, Box, Divider, Text, useMantineTheme } from "@mantine/core";
import React from "react";

import { Hotkey } from "./Hotkey";

export type Action = {
  type: "action";
  shortcutKey: string;
  label: string;
  handler: () => void;
  hidden?: boolean;
};

export type Menu = {
  type: "menu";
  actions: Action[];
  hidden?: boolean;
};

export type FooterItem = Action | Menu;

type Props = {
  message?: React.ReactNode;
  items: FooterItem[];
};

export const Footer = React.memo(function StatusBar({ message, items }: Props) {
  const theme = useMantineTheme();

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
      {items
        .filter((item) => item.hidden !== true)
        .map((item, index) => (
          <>
            {index > 0 && <Divider orientation="vertical" />}
            {item.type === "action" ? (
              <FooterItemAction action={item} />
            ) : (
              <FooterItemMenu menu={item} />
            )}
          </>
        ))}
    </Box>
  );
});

function FooterItemAction({ action }: { action: Action }) {
  return (
    <Box
      key={action.label}
      display="flex"
      sx={{
        flexDirection: "row",
        alignItems: "center",
        padding: "2px 4px",
        gap: 4,
        borderRadius: 4,
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, .2)",
        },
      }}
      onClick={action.handler}
    >
      <Text size="xs" color="text.1">
        {action.label}
      </Text>
      <Hotkey hotkey={action.shortcutKey} />
    </Box>
  );
}

function FooterItemMenu({ menu: { actions } }: { menu: Menu }) {
  return (
    <Menu position="top-end" offset={0} width={240}>
      <Menu.Target>
        <Button size="xs" variant="default">
          Actions
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {actions.map((item) => (
          <Menu.Item
            key={item.label}
            rightSection={
              <Text size="xs" color="dimmed">
                {item.shortcutKey}
              </Text>
            }
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
