import { getCurrent } from "@tauri-apps/api/window";
import { useEffect } from "react";

export function useWindowClose(callback: () => void | Promise<void>) {
  useEffect(() => {
    const win = getCurrent();
    const unlistenCloseRequested = win.onCloseRequested(async () => {
      await callback();
    });

    return () => {
      unlistenCloseRequested.then((f) => f());
    };
  }, [callback]);
}
