import { useMantineTheme } from "@mantine/core";
import { useMemo } from "react";

import { useRouterState } from "../contexts/RouterStateContext";
import { useGlobalShortcut } from "../hooks/useGlobalShortcut";
import { useMainWindow } from "../hooks/useMainWindow";
import { assertUnreachable } from "../utils/assertUnreachable";

import { InitialPage } from "./InitialPage";
import { SuggestionResultPage } from "./SuggestionResultPage";

export function App() {
  useMainWindow();
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

  return <Container>{pageContent}</Container>;
}

function Container({ children }: { children: React.ReactNode }) {
  const theme = useMantineTheme();

  return (
    <div
      style={{
        border: "1px solid",
        borderColor: theme.colorScheme === "dark" ? theme.colors.gray[7] : theme.colors.gray[2],
      }}
    >
      {children}
    </div>
  );
}
