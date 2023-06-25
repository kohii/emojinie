import { MantineProvider, Tuple, DefaultMantineColor } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";

import { useSetting } from "../contexts/SettingsContext";

type ExtendedCustomColors = "text" | "background" | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
  }
}

const textColors = {
  dark: {
    primary: "#fff",
    secondary: "#A6A7AB",
  },
  light: {
    primary: "#141517",
    secondary: "#5C5F66",
  },
};

const backgroundColors = {
  dark: "#1A1B1E",
  light: "#fff",
};

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
            styles: {
              input: {
                color: textColors[colorScheme].primary,
              },
            },
          },
          TextInput: {
            styles: {
              input: {
                color: textColors[colorScheme].primary,
              },
            },
          },
          Text: {
            defaultProps: {
              color: "text.0",
            },
          },
        },
        colors: {
          // text.0 for primary text color
          // text.1 for secondary text color
          text:
            colorScheme === "dark"
              ? [textColors.dark.primary, textColors.dark.secondary]
              : [textColors.light.primary, textColors.light.secondary],
          background: colorScheme === "dark" ? [backgroundColors.dark] : [backgroundColors.light],
        },
      }}
    >
      {children}
    </MantineProvider>
  );
}
