import { useCallback, useEffect, useMemo, useState } from "react";

export const SCREEN_PHONE = "sm";
export const SCREEN_TABLET = "md";
export const SCREEN_LAPTOP = "lg";
export const SCREEN_DESKTOP = "xl";
export const SCREEN_TV = "2xl";

export default function useScreen() {
  const [width, setWidth] = useState(0);

  const getDeviceType = useCallback(() => {
    const media = {
      [SCREEN_PHONE]: 640,
      [SCREEN_TABLET]: 768,
      [SCREEN_LAPTOP]: 1024,
      [SCREEN_DESKTOP]: 1280,
      [SCREEN_TV]: 1536,
    };

    if (width <= media[SCREEN_PHONE]) {
      return SCREEN_PHONE;
    }
    if (width < media[SCREEN_TABLET]) {
      return SCREEN_TABLET;
    }
    if (width < media[SCREEN_LAPTOP]) {
      return SCREEN_LAPTOP;
    }
    if (width < media[SCREEN_DESKTOP]) {
      return SCREEN_DESKTOP;
    }
    return SCREEN_TV;
  }, [width]);

  const isPhone = useMemo(
    () => getDeviceType() === SCREEN_PHONE,
    [getDeviceType]
  );

  const isTablet = useMemo(
    () => getDeviceType() === SCREEN_TABLET,
    [getDeviceType]
  );

  const isLaptop = useMemo(
    () => getDeviceType() === SCREEN_LAPTOP,
    [getDeviceType]
  );

  const isDesktop = useMemo(
    () => getDeviceType() === SCREEN_DESKTOP,
    [getDeviceType]
  );

  const isTV = useMemo(() => getDeviceType() === SCREEN_TV, [getDeviceType]);

  const isSmallDevice = useMemo(
    () => [SCREEN_PHONE, SCREEN_TABLET].includes(getDeviceType()),
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
    isLaptop,
    isDesktop,
    isTV,
    isSmallDevice,
  };
}
