import { useCallback, useEffect, useMemo, useState } from "react";

export const SCREEN_PHONE = "phone";
export const SCREEN_TABLET = "tablet";
export const SCREEN_DESKTOP = "desktop";

export default function useScreen() {
  const [width, setWidth] = useState(0);

  const getDeviceType = useCallback(() => {
    const media = {
      [SCREEN_PHONE]: 640,
      [SCREEN_TABLET]: 768,
      [SCREEN_DESKTOP]: 1024,
    };

    if (width <= media[SCREEN_PHONE]) {
      return SCREEN_PHONE;
    }
    if (width < media[SCREEN_DESKTOP]) {
      return SCREEN_TABLET;
    }
    return SCREEN_DESKTOP;
  }, [width]);

  const isPhone = useMemo(
    () => getDeviceType() === SCREEN_PHONE,
    [getDeviceType]
  );
  const isTablet = useMemo(
    () => getDeviceType() === SCREEN_TABLET,
    [getDeviceType]
  );
  const isDesktop = useMemo(
    () => getDeviceType() === SCREEN_DESKTOP,
    [getDeviceType]
  );

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isPhone,
    isTablet,
    isDesktop,
  };
}
