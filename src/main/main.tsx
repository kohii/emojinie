import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";

import { AutoSizing } from "../components/AutoSizing";
import { UIThemeProvider } from "../components/UIThemeProvider";
import { RouterStateProvider } from "../contexts/RouterStateContext";
import { SettingsProvider } from "../contexts/SettingsContext";

import { App } from "./App";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SettingsProvider>
      <QueryClientProvider client={queryClient}>
        <RouterStateProvider>
          <UIThemeProvider>
            <AutoSizing>
              <App />
            </AutoSizing>
          </UIThemeProvider>
        </RouterStateProvider>
      </QueryClientProvider>
    </SettingsProvider>
  </React.StrictMode>,
);
