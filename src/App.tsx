import { useMantineTheme } from "@mantine/core";
import { useMemo } from "react";

import { useRouterState } from "./contexts/RouterStateContext";
import { useSpotlightWindow } from "./hooks/useSpotlightWindow";
import { InitialPage } from "./pages/InitialPage";
import { SuggestionResultPage } from "./pages/SuggestionResultPage";
import { assertUnreachable } from "./utils/assertUnreachable";

export function App() {
  const theme = useMantineTheme();

  useSpotlightWindow();

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

  return <div
    style={{
      border: "1px solid",
      borderColor: theme.colorScheme === "dark" ? theme.colors.gray[7] : theme.colors.gray[2],
    }}
  >
    {pageContent}
  </div>;
}
