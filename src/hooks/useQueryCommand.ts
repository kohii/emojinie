import { useQuery } from "@tanstack/react-query";

import { invokeCommand } from "../libs/command";

export function useQueryCommand<T>(
  name: string,
  options: {
    args?: Record<string, unknown>;
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
  }
) {
  const { args, ...queryOptions } = options;
  return useQuery({
    queryKey: ["invoke", name, args],
    queryFn: async () => {
      console.debug(`Start command ${name}: args: `, args);
      const result: T = await invokeCommand(name, args);
      console.debug(`End command ${name}: result: `, result);
      return result;
    },
    ...queryOptions,
  });
}
