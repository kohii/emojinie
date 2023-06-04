import React, { useCallback, useState } from "react";
export function useMouseMove(
  targetSelector: string,
  callback?: (event: { x: number; y: number; target: HTMLElement }) => void,
) {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | undefined>(
    undefined,
  );
  return useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
      if (!mousePosition) return;
      if (mousePosition.x === event.clientX && mousePosition.y === event.clientY) return;

      const target = event.target as HTMLElement;
      if (target.matches(targetSelector)) {
        callback?.({ x: event.clientX, y: event.clientY, target });
      }
      const closest = target.closest(targetSelector);
      if (closest) {
        callback?.({ x: event.clientX, y: event.clientY, target: closest as HTMLElement });
      }
    },
    [targetSelector, callback, mousePosition],
  );
}
