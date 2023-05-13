import { useMantineTheme } from "@mantine/core";
import { MantineProvider } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { useMemo } from "react";

import { AutoSizing } from "./components/AutoSizing";
import { useRouterState } from "./contexts/RouterStateContext";
import { useSetting } from "./contexts/SettingsContext";
import { useGlobalShortcut } from "./hooks/useGlobalShortcut";
import { useSpotlightWindow } from "./hooks/useSpotlightWindow";
import { InitialPage } from "./pages/InitialPage";
import { SuggestionResultPage } from "./pages/SuggestionResultPage";
import { assertUnreachable } from "./utils/assertUnreachable";

export function App() {
  useSpotlightWindow();
  useGlobalShortcut();

  const { routerState } = useRouterState();

  const pageContent = useMemo(() => {
    console.debug("render", routerState);
    switch (routerState.page) {
      case "initial":
        return <InitialPage {...routerState} />;
      case "suggestion-result":
        return <SuggestionResultPage {...routerState} />;
      default:
        assertUnreachable(routerState);
    }
  }, [routerState]);

  const systemColorScheme = useColorScheme();
  const colorScheme = useSetting("theme");

  return <MantineProvider withGlobalStyles withNormalizeCSS theme={{
    fontFamily: "arial, sans-serif",
    colorScheme: colorScheme === "system" ? systemColorScheme : colorScheme,
    focusRing: "never",
    components: {
      Input: {
        defaultProps: {
          autoCorrect: "off",
          autoCapitalize: "off",
          autoComplete: "off",
        }
      },
    }
  }}>
    <Container>
      {pageContent}
    </Container>
  </MantineProvider>;
}

function Container({ children }: { children: React.ReactNode }) {
  const theme = useMantineTheme();

  return <AutoSizing>
    <div
      style={{
        border: "1px solid",
        borderColor: theme.colorScheme === "dark" ? theme.colors.gray[7] : theme.colors.gray[2],
      }}
    >
      {children}
    </div>
  </AutoSizing>;
}
