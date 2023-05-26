import { getCurrent } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";

export function useWindowFocus() {
  const [isFocused, setIsFocused] = useState(true);

  useWindowFocusChanged(setIsFocused);

  return isFocused;
}

export function useWindowFocusChanged(callback: (isFocused: boolean) => void | Promise<void>) {
  useEffect(() => {
    const win = getCurrent();
    const unlistenFocusChanged = win.onFocusChanged(async (ev) => {
      await callback(ev.payload);
    });
    const unlistenCloseRequested = win.onCloseRequested(async () => {
      await callback(false);
    });

    return () => {
      unlistenFocusChanged.then((f) => f());
      unlistenCloseRequested.then((f) => f());
    };
  }, [callback]);
}
