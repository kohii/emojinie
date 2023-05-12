import { MantineProvider } from "@mantine/core";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import { AutoSizing } from "./components/AutoSizing";
import { RouterStateProvider } from "./contexts/RouterStateContext";


const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AutoSizing>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{
        fontFamily: "arial, sans-serif",
        colorScheme: "dark",
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
        <QueryClientProvider client={queryClient}>
          <RouterStateProvider>
            <App />
          </RouterStateProvider>
        </QueryClientProvider>
      </MantineProvider>
    </AutoSizing>
  </React.StrictMode>
);
