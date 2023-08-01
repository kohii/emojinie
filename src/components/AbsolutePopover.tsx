import { Box } from "@mantine/core";


type PopoverProps = {
  open: boolean;
  onClose: () => void;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  closeOnEscape?: boolean;
  children: React.ReactNode;
};

export function AbsolutePopover({
  open,
  onClose,
  closeOnEscape,
  children,
  ...restProps
}: PopoverProps) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (closeOnEscape && event.key === "Escape") {
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
        display: open ? "block" : "none",
        "& > *": {
          position: "absolute",
          zIndex: 2,
          overflow: "hidden",
          overflowY: "auto",
          ...restProps,
        },
      }}
    >
      {children}
    </Box>
  );
}
