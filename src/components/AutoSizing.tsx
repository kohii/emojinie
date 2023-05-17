import { LogicalSize, appWindow } from "@tauri-apps/api/window";
import { useCallback, useEffect, useRef } from "react";

type AutoSizingProps = {
  children: React.ReactNode;
};

export function AutoSizing({ children }: AutoSizingProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const setWindowHeight = useCallback(async (height: number) => {
    const factor = await appWindow.scaleFactor();
    const size = await appWindow.innerSize();
    const logical = size.toLogical(factor);

    appWindow.setSize(new LogicalSize(logical.width, height));
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((el) => {
        setWindowHeight(el.contentRect.height);
      });
    });
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [setWindowHeight]);

  return <div ref={ref}>{children}</div>;
}
