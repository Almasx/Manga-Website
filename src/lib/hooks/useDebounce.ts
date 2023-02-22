import _ from "lodash";
import { useCallback } from "react";

export default function useDebounce(value: string, delay = 750) {
  return useCallback(
    (query: string, setQuery: (query: string) => void) =>
      _.debounce(() => {
        setQuery(query);
        console.log(value);
      }, delay),
    [delay, value]
  );
}
