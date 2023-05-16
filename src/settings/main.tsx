import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";

import { UIThemeProvider } from "../components/UIThemeProvider";
import { SettingsProvider } from "../contexts/SettingsContext";

import { Settings } from "./Settings";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SettingsProvider>
      <QueryClientProvider client={queryClient}>
        <UIThemeProvider>
          <Settings />
        </UIThemeProvider>
      </QueryClientProvider>
    </SettingsProvider>
  </React.StrictMode >
);
