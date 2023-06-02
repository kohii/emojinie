import React, { useCallback, useMemo, useState } from "react";

export function usePopover(ref: React.RefObject<HTMLElement>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = useCallback(() => {
    setAnchorEl(ref.current);
  }, [ref]);

  const close = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return useMemo(
    () => ({
      popoverProps: {
        anchorEl,
        open: Boolean(anchorEl),
        onClose: close,
      },
      open,
      close,
      isOpen: Boolean(anchorEl),
      toggle(event?: React.SyntheticEvent<HTMLElement>) {
        event?.preventDefault();
        event?.stopPropagation();
        if (anchorEl) {
          close();
        } else {
          open();
        }
      },
    }),
    [anchorEl, close, open],
  );
}
