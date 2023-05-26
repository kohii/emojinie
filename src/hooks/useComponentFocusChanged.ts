import { useCallback, useEffect, useState } from "react";

import { useWindowFocusChanged } from "./useWindowFocus";

export function useComponentFocused(
  ref: React.RefObject<HTMLElement>,
  callback: (isFocused: boolean) => void | Promise<void>,
) {
  const [isComponentFocused, setIsComponentFocused] = useState(true);
  const [isWindowFocused, setIsWindowFocused] = useState(true);

  useWindowFocusChanged(
    useCallback(
      (isWindowFocused) => {
        setIsWindowFocused(isWindowFocused);
        return callback(isComponentFocused && isWindowFocused);
      },
      [callback, isComponentFocused],
    ),
  );

  useEffect(() => {
    const onFocus = () => {
      setIsComponentFocused(true);
      callback(isWindowFocused);
    };
    const onBlur = () => {
      setIsComponentFocused(false);
      callback(false);
    };
    const el = ref.current;
    if (!el) return;
    el.addEventListener("focus", onFocus);
    el.addEventListener("blur", onBlur);
    return () => {
      el.removeEventListener("focus", onFocus);
      el.removeEventListener("blur", onBlur);
    };
  }, [callback, isWindowFocused, ref]);
}
