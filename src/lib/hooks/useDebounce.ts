import _ from "lodash";
import { useCallback } from "react";

export default function useDebounce(delay = 750) {
  return useCallback(
    _.debounce((setQuery: () => void) => setQuery(), delay),
    []
  );
}
