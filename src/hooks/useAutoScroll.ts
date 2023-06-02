import { useEffect } from "react";

import { assertUnreachable } from "../utils/assertUnreachable";

export function useAutoScroll(viewport: HTMLElement | null, focusedIndex: number) {
  useEffect(() => {
    if (!viewport) return;
    const item = viewport.children[focusedIndex];
    if (!item) return;
    const itemPos = item.getBoundingClientRect().top;
    const scrollPos = viewport.getBoundingClientRect().top;

    const itemPosType: "inView" | "above" | "below" =
      itemPos < scrollPos
        ? "above"
        : itemPos >= scrollPos + viewport.clientHeight
        ? "below"
        : "inView";
    switch (itemPosType) {
      case "above":
        item.scrollIntoView({ block: "start" });
        break;
      case "below":
        item.scrollIntoView({ block: "end" });
        break;
      case "inView":
        break;
      default:
        assertUnreachable(itemPosType);
    }
  }, [viewport, focusedIndex]);
}
