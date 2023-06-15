import { useMantineTheme } from "@mantine/core";
import { Text } from "@mantine/core";

export type LabelProps = {
  children: React.ReactNode;
};

export function Label({ children }: LabelProps) {
  const theme = useMantineTheme();
  return (
    <Text fz="sm" component="label" color={theme.colorScheme === "dark" ? "dark.0" : "gray.9"}>
      {children}
    </Text>
  );
}
