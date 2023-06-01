import { Box } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { useMemo } from "react";

import { assertUnreachable } from "../utils/assertUnreachable";

type PopoverProps = {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  horizontal?: "start" | "end";
  vertical?: "top" | "bottom";
  children: React.ReactNode;
};

export function Popover({
  open,
  anchorEl,
  onClose,
  horizontal = "start",
  vertical = "bottom",
  children,
}: PopoverProps) {
  const { height, width } = useViewportSize();

  const childPositionProps = useMemo(() => {
    if (!anchorEl) {
      return {};
    }
    const props: Record<string, string | number> = {};
    switch (horizontal) {
      case "start":
        props["left"] = anchorEl.offsetLeft;
        break;
      case "end":
        props["right"] = width - (anchorEl.offsetLeft + anchorEl.offsetWidth);
        break;
      default:
        assertUnreachable(horizontal);
    }

    switch (vertical) {
      case "top":
        props["bottom"] = height - anchorEl.offsetTop + 4;
        break;
      case "bottom":
        props["top"] = anchorEl.offsetTop + anchorEl.offsetHeight + 4;
        break;
      default:
        assertUnreachable(vertical);
    }

    return props;
  }, [anchorEl, height, horizontal, vertical, width]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <Box
      top={0}
      left={0}
      right={0}
      bottom={0}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      sx={{
        position: "absolute",
        zIndex: 1,
        display: open && anchorEl ? "block" : "none",
        "& > *": {
          position: "absolute",
          zIndex: 2,
          overflow: "hidden",
          overflowY: "auto",
          ...childPositionProps,
        },
      }}
    >
      {children}
    </Box>
  );
}
