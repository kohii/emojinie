import { MantineProvider, Tuple, DefaultMantineColor } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";

import { useSetting } from "../contexts/SettingsContext";

type ExtendedCustomColors = "text" | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
  }
}

export function UIThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const appearance = useSetting("appearance");
  const colorScheme = appearance === "system" ? systemColorScheme : appearance;

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        fontFamily: "arial, sans-serif",
        colorScheme,
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
        colors: {
          // text.0 for primary text color
          // text.1 for secondary text color
          text: colorScheme === "dark" ? ["#fff", "#A6A7AB"] : ["#141517", "#495057"],
        },
      }}
    >
      {children}
    </MantineProvider>
  );
}
