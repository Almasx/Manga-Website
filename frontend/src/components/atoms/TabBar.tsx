import clsx from "clsx";
import { forwardRef, ReactNode, useEffect, useRef, useState } from "react";

interface TabBarProps {
  tabs: string[];
}

const TabBar = ({ tabs }: TabBarProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const tabBarRef = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const width = tabBarRef.current[activeIndex]!.offsetWidth;
    const left = tabBarRef.current[activeIndex]!.offsetLeft;
    console.log(left);
    indicatorRef.current!.style.width = `${width - 4}px`;
    indicatorRef.current!.style.left = `${left + 2}px`;
  }, [activeIndex]);

  return (
    <div className="relative pt-5 pb-2 lg:pb-[10px]">
      <div className="flex flex-row space-x-4 first:ml-0 lg:space-x-5">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            ref={(tabRef) => (tabBarRef.current[index] = tabRef)}
            active={activeIndex === index}
            onClick={() => {
              setActiveIndex(index);
            }}
          >
            {tab}
          </Tab>
        ))}
      </div>
      <div
        ref={indicatorRef}
        className="absolute bottom-0 h-[5px] w-16 rounded-t-xl bg-primary duration-300"
      ></div>
    </div>
  );
};

interface TabProps {
  active: boolean;
  children: ReactNode;
  onClick?: (event?: any) => void;
}

const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ active, children, onClick }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={clsx(
          "text-sm font-bold duration-300 lg:text-base",
          active ? "text-white" : "text-white/33 hover:text-primary"
        )}
      >
        {children}
      </button>
    );
  }
);

export default TabBar;
