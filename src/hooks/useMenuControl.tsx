import React, { useCallback, useMemo, useState } from "react";

export function useMenuControl() {
  const [isOpen, setOpen] = useState(false);

  const open = useCallback(() => {
    setOpen(true);
    console.log("open");
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    console.log("close");
  }, []);

  return useMemo(
    () => ({
      popoverProps: {
        open: isOpen,
        onClose: close,
      },
      open,
      close,
      isOpen,
      toggle(event?: React.SyntheticEvent<HTMLElement>) {
        event?.preventDefault();
        event?.stopPropagation();
        if (isOpen) {
          close();
        } else {
          open();
        }
      },
    }),
    [isOpen, close, open],
  );
}
