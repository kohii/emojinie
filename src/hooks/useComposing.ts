import { useCallback, useRef } from "react";

export function useComposing() {
  const isComposing = useRef(false);

  const onCompositionStart = useCallback(() => {
    isComposing.current = true;
  }, []);

  const onCompositionEnd = useCallback(() => {
    isComposing.current = false;
  }, []);

  return [
    isComposing.current,
    {
      onCompositionStart,
      onCompositionEnd,
    },
  ] as const;
}
