import { HotkeyItem, useHotkeys } from "@mantine/hooks";

import { HOTKEY_OPTIONS } from "../contants/hotkey";
import { Action } from "../types/action";

export function useInstallActions(
  actions: Action[],
  options?: {
    ignoreInputElements?: boolean;
  },
) {
  useHotkeys(
    actions
      .filter((a) => a.state === "enabled")
      .flatMap((a) =>
        toArray(a.shortcutKey).map((key) => [key, a.handler, HOTKEY_OPTIONS] as HotkeyItem),
      ),
    options?.ignoreInputElements ? [] : undefined,
  );
}

function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
