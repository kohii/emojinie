import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type RouterState =
  | {
      page: "initial";
      initialText: string;
    }
  | {
      page: "suggestion-result";
      text: string;
    };

export type RouterStateContextType = {
  routerState: RouterState;
  setRouterState: (state: RouterState) => void;
  reset: (options?: { text?: string }) => void;
};

const initialState: RouterState = {
  page: "initial",
  initialText: "",
};

const RouterStateContext = createContext<RouterStateContextType>({
  routerState: initialState,
  setRouterState: () => undefined,
  reset: () => undefined,
});

export const RouterStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [routerState, setRouterState] = useState<RouterState>(initialState);
  const reset = useCallback(
    (options?: { text?: string }) =>
      setRouterState({
        page: "initial",
        initialText: options?.text ?? "",
      }),
    [],
  );
  const value = useMemo(
    () => ({
      routerState,
      setRouterState,
      reset,
    }),
    [routerState, setRouterState, reset],
  );

  return <RouterStateContext.Provider value={value}>{children}</RouterStateContext.Provider>;
};

export function useRouterState() {
  return useContext(RouterStateContext);
}
