import { useMantineTheme } from "@mantine/core";
import React, { useCallback, useMemo, useState } from "react";

import { useLogChange } from "./hooks/useLogChange";
import { useSpotlightWindow } from "./hooks/useSpotlightWindow";
import { InitialPage } from "./pages/InitialPage";
import { SuggestionResultPage } from "./pages/SuggestionResultPage";
import { assertUnreachable } from "./utils/assertUnreachable";

type RouteState = {
  page: "initial";
  text: string;
} | {
  page: "suggestion-result";
  text: string;
}

export function App() {
  const theme = useMantineTheme();

  const [routeState, setRouteState] = useState<RouteState>({
    page: "initial",
    text: "",
  });

  useSpotlightWindow();

  const goToSuggestionResultPage = useCallback((text: string) => {
    setRouteState({ page: "suggestion-result", text });
  }, []);
  const backToInitPage = useCallback(() => {
    setRouteState((prev) => ({ ...prev, page: "initial" }));
  }, []);

  const pageContent = useMemo(() => {
    switch (routeState.page) {
      case "initial":
        return <InitialPage initialText={routeState.text} onSubmit={goToSuggestionResultPage} />;
      case "suggestion-result":
        return <SuggestionResultPage text={routeState.text} onBack={backToInitPage} />;
      default:
        assertUnreachable(routeState);
    }
  }, [routeState, goToSuggestionResultPage, backToInitPage]);

  useLogChange(goToSuggestionResultPage, "goToSuggestionResultPage");
  useLogChange(backToInitPage, "backToInitPage");

  return <div style={{
    border: "1px solid",
    borderColor: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[2],
  }}>{pageContent}</div>;
}
