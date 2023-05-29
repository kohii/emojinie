import { Box, Divider, Text, useMantineTheme } from "@mantine/core";
import React from "react";

import { useTextColor } from "../hooks/useTextColor";

import { Hotkey } from "./Hotkey";

type ActionItem = {
  shortcutKey: string;
  label: string;
  handler: () => void;
};

type Props = {
  message?: React.ReactNode;
  primaryActions: ActionItem[];
};

export const Footer = React.memo(function StatusBar({ message, primaryActions }: Props) {
  const theme = useMantineTheme();
  const textColor = useTextColor();

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
      {primaryActions.map((action, index) => (
        <>
          {index > 0 && <Divider orientation="vertical" />}
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
            <Text size="xs" color={textColor.secondary}>
              {action.label}
            </Text>
            <Hotkey hotkey={action.shortcutKey} />
          </Box>
        </>
      ))}
    </Box>
  );
});
