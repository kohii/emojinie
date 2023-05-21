import { MantineProvider } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";

import { useSetting } from "../contexts/SettingsContext";

export function UIThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const appearance = useSetting("appearance");

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        fontFamily: "arial, sans-serif",
        colorScheme: appearance === "system" ? systemColorScheme : appearance,
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
