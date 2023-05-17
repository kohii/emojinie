import { useMantineTheme } from "@mantine/core";

export function useTextColor() {
  const theme = useMantineTheme();
  return {
    primary: theme.colorScheme === "dark" ? theme.colors.gray[0] : theme.colors.gray[8],
    secondary: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7],
  };
}
