import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import * as settingsStore from "../libs/settings";
import { DEFAULT_SETTINGS, SettingKey, SettingsSchema } from "../libs/settings";

export type SettingsContextType = {
  settings: SettingsSchema;
  setSetting(key: SettingKey, value: SettingsSchema[SettingKey]): Promise<void>;
};

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  setSetting: () => Promise.resolve(),
});

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<SettingsSchema>(DEFAULT_SETTINGS);

  useEffect(() => {
    settingsStore.onChange((key, value) => {
      setSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
    });
  }, []);

  const value = useMemo(
    () => ({
      settings,
      async setSetting(key: SettingKey, value: SettingsSchema[SettingKey]) {
        await settingsStore.set(key, value);
        setSettings({
          ...settings,
          [key]: value,
        });
      },
    }),
    [settings],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export function useSetting<T extends SettingKey>(key: T): SettingsSchema[T] {
  return useContext(SettingsContext).settings[key]!;
}

export function useSaveSetting() {
  return useContext(SettingsContext).setSetting;
}
