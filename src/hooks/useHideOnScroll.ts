/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useRef, useEffect } from "react";

export const useHideOnScroll = <T extends HTMLElement>(
  dynamicHide: boolean
) => {
  const divRef = useRef<T | null>(null);

  useEffect(() => {
    let prevScrollpos = window.pageYOffset;
    window.onscroll = () => {
      if (dynamicHide) {
        const currentScrollPos = window.pageYOffset;

        if (prevScrollpos > currentScrollPos) {
          divRef.current!.style.top = "0px";
        } else {
          divRef.current!.style.top = `${-divRef.current!.offsetHeight}px`;
        }

        prevScrollpos = currentScrollPos;
      }
    };
  }, [dynamicHide]);

  return divRef;
};
