import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import { RouterStateProvider } from "./contexts/RouterStateContext";
import { SettingsProvider } from "./contexts/SettingsContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SettingsProvider>
      <QueryClientProvider client={queryClient}>
        <RouterStateProvider>
          <App />
        </RouterStateProvider>
      </QueryClientProvider>
    </SettingsProvider>
  </React.StrictMode >
);
