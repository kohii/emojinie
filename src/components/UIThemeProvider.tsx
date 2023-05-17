import { MantineProvider } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";

import { useSetting } from "../contexts/SettingsContext";

export function UIThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const colorScheme = useSetting("theme");

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        fontFamily: "arial, sans-serif",
        colorScheme: colorScheme === "system" ? systemColorScheme : colorScheme,
        focusRing: "never",
        components: {
          Input: {
            defaultProps: {
              autoCorrect: "off",
              autoCapitalize: "off",
              autoComplete: "off",
            },
          },
        },
      }}
    >
      {children}
    </MantineProvider>
  );
}
