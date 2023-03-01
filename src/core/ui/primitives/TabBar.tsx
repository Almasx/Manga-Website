import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useTabBar } from "lib/hooks/useTabBar";

interface TabBarProps {
  tabs: {
    value: string;
    label: string;
  }[];
  onChange?: (event?: any) => void;
}

export const TabBar = ({ tabs, onChange }: TabBarProps) => {
  const { indicatorRef, tabBarRef, setActiveIndex, activeIndex } = useTabBar<
    HTMLButtonElement,
    HTMLDivElement
  >();

  return (
    <div className="relative pt-5 pb-2 lg:pb-[10px]">
      <div className="flex flex-row gap-x-4 first:ml-0 lg:gap-x-5">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            ref={(tabRef) => (tabBarRef.current[index] = tabRef)}
            onClick={() => {
              setActiveIndex(index);
              onChange && onChange(tabs[index]?.value);
            }}
            className={clsx(
              "text-sm font-bold duration-300 lg:text-base",
              activeIndex === index
                ? "text-white"
                : "text-white/30 hover:text-primary"
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

export const BoxyTabBar = ({ tabs }: TabBarProps) => {
  const { indicatorRef, tabBarRef, setActiveIndex } = useTabBar<
    HTMLAnchorElement,
    HTMLDivElement
  >();
  const { asPath } = useRouter();

  return (
    <div className="relative">
      <div className="flex flex-row gap-1 rounded-xl border border-stroke-100 p-1">
        {tabs.map((tab, index) => {
          const link = tabs[index]?.value as string;

          return (
            <Link
              href={`${asPath.substring(0, asPath.lastIndexOf("/"))}/${link}`}
              key={tab.label}
              ref={(tabRef) => (tabBarRef.current[index] = tabRef)}
              onClick={() => {
                setActiveIndex(index);
              }}
              className={clsx(
                "flex h-8 items-center gap-2 rounded-xl px-4 duration-300",
                asPath.endsWith(link)
                  ? " text-white"
                  : "text-white/30 hover:text-white"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
      <div
        ref={indicatorRef}
        className="absolute top-1/2 h-8 w-16 -translate-y-1/2 rounded-xl bg-white/5 duration-200"
      />
    </div>
  );
};
