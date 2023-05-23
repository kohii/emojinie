import { Box, Divider, Text, useMantineTheme } from "@mantine/core";
import React from "react";

import { useTextColor } from "../hooks/useTextColor";

import { Hotkey } from "./Hotkey";

type KeyMapItem = {
  key: string;
  label: React.ReactNode;
  handler: () => void;
};

type Props = {
  keyMaps: KeyMapItem[];
};

export const StatusBar = React.memo(function StatusBar({ keyMaps }: Props) {
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
        justifyContent: "flex-end",
        gap: 2,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],
        borderTop: "1px solid",
        borderTopColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2],
      }}
    >
      {keyMaps.map((keyMap, index) => (
        <>
          {index > 0 && <Divider orientation="vertical" />}
          <Box
            key={keyMap.key}
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
            onClick={keyMap.handler}
          >
            <Text size="xs" color={textColor.secondary}>
              {keyMap.label}
            </Text>
            <Hotkey hotkey={keyMap.key} />
          </Box>
        </>
      ))}
    </Box>
  );
});
