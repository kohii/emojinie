import { useState } from "react";

export function useLangs(): string[] {
  const [langs,] = useState<string[]>(() => {
    if (typeof window === "undefined") return ["en"];
    const langs = [...navigator.languages];
    langs.sort();
    return langs;
  });

  return langs;
}