import { invoke } from "@tauri-apps/api";
import { register, unregister } from "@tauri-apps/api/globalShortcut";
import { useEffect } from "react";

import { useSetting } from "../contexts/SettingsContext";

export function useGlobalShortcut() {
  const hotkey = useSetting("hotkey");

  useEffect(() => {
    register(hotkey, () => {
      invoke("toggle_main_window");
    });
    return () => {
      unregister(hotkey);
    };
  }, [hotkey]);
}
