export type Action = {
  label: string;
  shortcutKey?: string | [string, ...string[]];
  handler: () => void;
  state: "enabled" | "disabled";
};
