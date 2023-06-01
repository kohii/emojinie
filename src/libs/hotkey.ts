export type Hotkey = string;

/**
 * Get a Tauri-style hotkey string from a React keyboard event.
 *
 * @param e React keyboard event
 * @returns Tauri-style hotkey string
 */
export function getHotkeyForTauriFromKeyboardEvent(e: React.KeyboardEvent): Hotkey | null {
  if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
    return null;
  }
  if (!e.key || e.key === "Alt" || e.key === "Control" || e.key === "Meta" || e.key === "Shift") {
    return null;
  }
  const keyString = getKeyStringFromCode(e.code);
  if (!keyString) {
    return null;
  }

  const parts = [];

  if (e.metaKey) {
    parts.push("Command");
  }

  if (e.ctrlKey) {
    parts.push("Control");
  }

  if (e.altKey) {
    parts.push("Alt");
  }

  if (e.shiftKey) {
    parts.push("Shift");
  }

  parts.push(keyString);

  return parts.join("+");
}

function getKeyStringFromCode(code: string) {
  if (code.length === 1) {
    return code.toUpperCase();
  }
  if (code.startsWith("Digit")) {
    return code.slice(5);
  }
  if (code.startsWith("Key")) {
    return code.slice(3);
  }
  if (code.startsWith("Numpad")) {
    return code.slice(6);
  }
  if (code.startsWith("Lang")) {
    return null;
  }
  return code;
}

/**
 * Get a human-readable hotkey string parts from a hotkey string.
 * It supports Tauri-style or Mantine-style hotkey strings.
 * For example, "CommandOrControl+Shift+P" becomes ["⌘", "P"].
 *
 * @param s Tauri-style hotkey string
 * @returns Human-readable hotkey string
 */
export function toHotkeyTokensForDisplay(s: Hotkey): string[] {
  const parts = s.split("+");
  return parts.map((part) => {
    switch (part) {
      case "mod":
      case "Command":
      case "CommandOrControl":
        return "⌘";
      case "Control":
        return "⌃";
      case "Alt":
        return "⌥";
      case "Shift":
        return "⇧";
      case "ArrowUp":
        return "↑";
      case "ArrowDown":
        return "↓";
      case "ArrowLeft":
        return "←";
      case "ArrowRight":
        return "→";
      case "Backspace":
        return "⌫";
      case "Delete":
        return "⌦";
      case "Enter":
        return "⏎";
      case "Escape":
        return "⎋";
      case "Tab":
        return "⇥";
      case "Space":
        return "Space";
      case "PageUp":
        return "⇞";
      case "PageDown":
        return "⇟";
      case "Home":
        return "↖";
      case "End":
        return "↘";
      case "Backslash":
        return "\\";
      case "BracketLeft":
        return "[";
      case "BracketRight":
        return "]";
      case "Comma":
        return ",";
      case "Equal":
        return "=";
      case "Minus":
        return "-";
      case "Period":
        return ".";
      case "Quote":
        return "'";
      case "Semicolon":
        return ";";
      case "Slash":
        return "/";
      case "Backquote":
        return "`";
      case "IntlBackslash":
        return "§";
      default:
        return part;
    }
  });
}
