import { MantineProvider } from "@mantine/core";
import { register } from "@tauri-apps/api/globalShortcut";
import { appWindow } from "@tauri-apps/api/window";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./styles.css";
import { AutoSizing } from "./components/AutoSizing";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AutoSizing>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{
        colorScheme: "dark", components: {
          Input: {
            defaultProps: {
              autoCorrect: "off",
              autoCapitalize: "off",
              autoComplete: "off",
            }
          }
        }
      }}>
        <App />
      </MantineProvider>
    </AutoSizing>
  </React.StrictMode>
);

register("CommandOrControl+Shift+Space", async () => {
  if (await appWindow.isVisible()) {
    appWindow.hide();
  } else {
    appWindow.show();
    appWindow.setFocus();
  }
});

appWindow.onFocusChanged(({ payload: focused }) => {
  console.log("focused", focused);
  if (!focused) {
    // appWindow.hide();
  }
});