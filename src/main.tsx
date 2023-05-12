import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import { AutoSizing } from "./components/AutoSizing";
import "./styles.css";
import { RouterStateProvider } from "./contexts/RouterStateContext";

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
        <RouterStateProvider>
          <App />
        </RouterStateProvider>
      </MantineProvider>
    </AutoSizing>
  </React.StrictMode>
);
