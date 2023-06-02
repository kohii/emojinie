import { Kbd, useMantineTheme } from "@mantine/core";

import { toHotkeyTokensForDisplay } from "../libs/hotkey";

import { HStack } from "./HStack";

export function Hotkey({ hotkey }: { hotkey: string }) {
  const theme = useMantineTheme();
  const keys = toHotkeyTokensForDisplay(hotkey);
  return (
    <HStack gap={2}>
      {keys.map((key) => (
        <>
          <Kbd
            key={key}
            py={2}
            sx={{
              backgroundColor:
                theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[0],
              borderColor:
                theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[3],
            }}
          >
            {key}
          </Kbd>
        </>
      ))}
    </HStack>
  );
}
