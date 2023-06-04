import { Action } from "../types/action";

export function getActionShortcutKey(action: Action): string | undefined {
  return Array.isArray(action.shortcutKey) ? action.shortcutKey[0] : action.shortcutKey;
}

export function getActionShortcutKeys(action: Action): string[] {
  if (!action.shortcutKey) return [];
  return Array.isArray(action.shortcutKey) ? action.shortcutKey : [action.shortcutKey];
}
