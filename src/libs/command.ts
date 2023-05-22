import { invoke } from "@tauri-apps/api";

export async function invokeCommand<T>(name: string, args?: Record<string, unknown>): Promise<T> {
  const result: { Success: T } | { Error: { message: string } } = await invoke(name, args);
  return "Success" in result ? result.Success : Promise.reject(result.Error);
}

export function commandErrorToString(error: unknown): string {
  if (!error) {
    return "Unknown error";
  }
  if (typeof error === "string") {
    return error;
  }
  if (typeof error === "object" && "message" in error) {
    return error.message as string;
  }
  return "Unknown error";
}

export function showSettings() {
  invoke("show_settings_window");
}
