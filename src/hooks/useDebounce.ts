import { useCallback } from "react";
import _ from "lodash";

export default function useDebounce(delay = 750) {
  return useCallback(
    (query: string, setQuery: (query: string) => void) =>
      _.debounce(() => {
        setQuery(query);
      }, delay),
    [delay]
  );
}
