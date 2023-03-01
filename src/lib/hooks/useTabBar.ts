/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useEffect, useRef, useState } from "react";

export const useTabBar = <T extends HTMLElement, U extends HTMLElement>() => {
  const [activeIndex, setActiveIndex] = useState(0);
  const indicatorRef = useRef<U | null>(null);
  const tabBarRef = useRef<Array<T | null>>([]);

  useEffect(() => {
    const width = tabBarRef.current[activeIndex]?.offsetWidth;
    const left = tabBarRef.current[activeIndex]?.offsetLeft;
    indicatorRef.current!.style.width = `${width! - 4}px`;
    indicatorRef.current!.style.left = `${left! + 2}px`;
  }, [activeIndex]);

  return { indicatorRef, tabBarRef, setActiveIndex, activeIndex };
};
