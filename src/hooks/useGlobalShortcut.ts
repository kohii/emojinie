import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { register, unregister } from "@tauri-apps/api/globalShortcut";
import { useEffect } from "react";

import { useSetting } from "../contexts/SettingsContext";

export function useGlobalShortcut() {
  const hotkey = useSetting("hotkey");

  useEffect(() => {
    if (!hotkey) return;

    register(hotkey, () => {
      invoke("toggle_main_window");
    });

    const unlisten = listen("setting_window:close", async () => {
      // hack: re-register hotkey on setting window close
      await unregister(hotkey);
      await register(hotkey, () => {
        invoke("toggle_main_window");
      });
    });

    return () => {
      unregister(hotkey);
      unlisten.then((f) => f());
    };
  }, [hotkey]);
}
