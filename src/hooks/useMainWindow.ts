import { invoke } from "@tauri-apps/api";
import { useEffect, useMemo } from "react";

let mainWindowInitialized = false;

export function useMainWindow() {
  useEffect(() => {
    if (mainWindowInitialized) return;
    invoke("init_main_window");
    mainWindowInitialized = true;
  }, []);

  return useMemo(
    () => ({
      show() {
        invoke("show_main_window");
      },
      hide() {
        invoke("hide_main_window");
      },
    }),
    [],
  );
}
