import React, { useEffect, useState } from "react";
import * as autostart from "tauri-plugin-autostart-api";

export function useAutoStart() {
  const [isEnabled, setIsEnabled] = useState(false);
  useEffect(() => {
    (async () => {
      setIsEnabled(await autostart.isEnabled());
    })();
  }, []);

  return {
    isAutoStartEnabled: isEnabled,
    async setAutoStartEnabled(event: React.ChangeEvent<HTMLInputElement>) {
      console.log(event.target.checked);
      const enabled = event.target.checked;
      if (enabled) {
        await autostart.enable();
      } else {
        await autostart.disable();
      }
      setIsEnabled(enabled);
    },
  };
}
