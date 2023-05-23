import { getCurrent } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";

export function useWindowFocus() {
  const [isFocused, setIsFocused] = useState(true);

  useWindowFocusChanged(setIsFocused);

  return isFocused;
}

export function useWindowFocusChanged(callback: (isFocused: boolean) => void) {
  useEffect(() => {
    const win = getCurrent();
    const off = win.onFocusChanged((ev) => {
      callback(ev.payload);
    });

    return () => {
      off.then((f) => f());
    };
  }, [callback]);
}
