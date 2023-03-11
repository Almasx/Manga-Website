/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useEffect, useRef, useState } from "react";

export const useTabBar = <T extends HTMLElement, U extends HTMLElement>(
  offset?: boolean
) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const indicatorRef = useRef<U | null>(null);
  const tabBarRef = useRef<Array<T | null>>([]);

  useEffect(() => {
    const width = tabBarRef.current[activeIndex]?.offsetWidth;
    const left = tabBarRef.current[activeIndex]?.offsetLeft;
    indicatorRef.current!.style.width = `${
      width! - (offset === true || offset === undefined ? 4 : 0)
    }px`;
    indicatorRef.current!.style.left = `${
      left! + (offset === true || offset === undefined ? 2 : 0)
    }px`;
  }, [activeIndex]);

  return { indicatorRef, tabBarRef, setActiveIndex, activeIndex };
};
