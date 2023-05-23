import { useMemo, useState } from "react";

export function useComponentFocused() {
  const [isComponentFocused, setIsComponentFocused] = useState(true);

  return useMemo(
    () => ({
      onFocus() {
        setIsComponentFocused(true);
      },
      onBlur() {
        setIsComponentFocused(false);
      },
      isComponentFocused: isComponentFocused,
    }),
    [isComponentFocused],
  );
}
