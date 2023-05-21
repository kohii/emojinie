import { Store } from "tauri-plugin-store-api";

export type SettingsSchema = {
  appearance: "dark" | "light" | "system";
  hotkey: string;
  openAiApiKey: string;
};
export type SettingKey = keyof SettingsSchema;

export const DEFAULT_SETTINGS: SettingsSchema = {
  appearance: "system",
  hotkey: "CommandOrControl+Alt+Space",
  openAiApiKey: "",
};

const store = new Store(".settings");

export async function get<T extends SettingKey>(key: T): Promise<SettingsSchema[T]> {
  await store.load();
  const value = await store.get<SettingsSchema[T]>(key);
  if (value == null) {
    return DEFAULT_SETTINGS[key];
  }
  return value;
}

export async function getAll(): Promise<SettingsSchema> {
  await store.load();
  const settings = await store.entries();
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
  };
}

export async function set(key: SettingKey, value: SettingsSchema[SettingKey]) {
  await store.set(key, value);
  await store.save();
  console.log("set", key, value);
}
