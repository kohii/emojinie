import { invoke } from "@tauri-apps/api";
import { useEffect, useMemo } from "react";

let spotlightWindowInitialized = false;

export function useSpotlightWindow() {
  useEffect(() => {
    if (spotlightWindowInitialized) return;
    invoke("init_spotlight_window");
    spotlightWindowInitialized = true;
  }, []);

  return useMemo(
    () => ({
      show() {
        invoke("show_spotlight_window");
      },
      hide() {
        invoke("hide_spotlight_window");
      },
    }),
    [],
  );
}
