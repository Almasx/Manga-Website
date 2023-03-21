import Link from "next/link";
import type { ReactNode } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useTabBar } from "lib/hooks/useTabBar";

interface TabBarProps<T> {
  tabs: {
    value: string;
    label: T;
  }[];
  onChange?: (value?: any) => void;
  packed?: boolean;
}

export const TabBar = ({
  tabs,
  onChange,
  packed = true,
}: TabBarProps<string>) => {
  const { indicatorRef, tabBarRef, setActiveIndex, activeIndex } = useTabBar<
    HTMLButtonElement,
    HTMLDivElement
  >();

  return (
    <div className="relative pt-5 pb-2 lg:pb-[10px]">
      <div className="flex flex-row gap-x-4 first:ml-0 lg:gap-x-5">
        {tabs.map((tab, index) => (
          <button
            key={tab.value}
            ref={(tabRef) => (tabBarRef.current[index] = tabRef)}
            onClick={() => {
              setActiveIndex(index);
              onChange && onChange(tabs[index]?.value);
            }}
            className={clsx(
              "text-sm font-bold duration-300 ",
              !packed && "!text-lg",
              activeIndex === index
                ? "text-light"
                : "text-light/30 hover:text-primary"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        ref={indicatorRef}
        className="absolute bottom-0 h-[5px] w-16 rounded-t-xl bg-primary duration-200"
      />
    </div>
  );
};

export const NavigationTabBar = ({ tabs }: TabBarProps<string>) => {
  const { indicatorRef, tabBarRef, setActiveIndex } = useTabBar<
    HTMLAnchorElement,
    HTMLDivElement
  >();
  const { asPath } = useRouter();

  return (
    <div className="relative">
      <div className="flex flex-row gap-1 rounded-xl border border-gray-dark-secondary p-1">
        {tabs.map((tab, index) => {
          const link = tabs[index]?.value as string;

          return (
            <Link
              href={`${asPath.substring(0, asPath.lastIndexOf("/"))}/${link}`}
              key={tab.value}
              ref={(tabRef) => (tabBarRef.current[index] = tabRef)}
              onClick={() => {
                setActiveIndex(index);
              }}
              className={clsx(
                "flex h-8 items-center gap-2 rounded-xl px-4 duration-300",
                asPath.endsWith(link)
                  ? " text-light"
                  : "text-light/30 hover:text-light"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
      <div
        ref={indicatorRef}
        className="absolute top-1/2 h-8 w-16 -translate-y-1/2 rounded-xl bg-light/5 duration-200"
      />
    </div>
  );
};

export const RadioFieldTabs = ({
  tabs,
  onChange,
  label,
}: TabBarProps<ReactNode> & { label: string }) => {
  const { indicatorRef, tabBarRef, setActiveIndex, activeIndex } = useTabBar<
    HTMLDivElement,
    HTMLDivElement
  >(false);

  return (
    <div className="relative flex">
      <div className="relative w-24 overflow-hidden rounded-xl border border-gray-dark-secondary">
        <div className="flex h-full flex-row">
          {tabs.map((tab, index) => (
            <div
              key={tab.value}
              ref={(tabRef) => (tabBarRef.current[index] = tabRef)}
              onClick={() => {
                setActiveIndex(index);
                onChange && onChange(tabs[index]?.value);
              }}
              className={clsx(
                "z-20 flex grow items-center justify-center gap-2 rounded-xl duration-300",
                activeIndex === index
                  ? " text-light"
                  : "text-light/30 hover:text-light"
              )}
            >
              {tab.label}
            </div>
          ))}
        </div>

        <div
          ref={indicatorRef}
          className="absolute inset-y-0 w-1/2 bg-primary duration-200"
        />
      </div>
      <label
        className="absolute top-1.5 z-10 origin-[0] -translate-y-4 translate-x-3 transform
                   rounded-full bg-dark px-1.5 text-xs text-light/30 duration-300
                 peer-focus:text-primary "
      >
        {label}
      </label>
    </div>
  );
};
