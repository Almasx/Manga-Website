import clsx from "clsx";
import type { ReactElement } from "react";
import { cloneElement, useState } from "react";
import type { ButtonProps } from "../atoms/Button";
import type { TabProps } from "../organisms/SideBar/Section/Tab";

interface DropDownProps {
  options: ReactElement<TabProps>[];
  header: ReactElement<ButtonProps>;
}

const DropDown = ({ header, options }: DropDownProps) => {
  const [dropDownShow, setDropdownShow] = useState(false);
  const [dropDownOption, setDropDownOption] = useState<number>(0);
  const clonedHeader = cloneElement(header, {
    onClick: () => setDropdownShow((previos) => !previos),
  });
  const clonedOptions = options.map((option, index) =>
    cloneElement(option, {
      onClick: (event?: unknown) => {
        option.props.onClick?.call(event);
        setDropDownOption(index);
        setDropdownShow(false);
      },
      active: dropDownOption === index,
    })
  );
  return (
    <div className="text-white">
      {clonedHeader}
      {dropDownShow && (
        <ul
          className={clsx(
            "absolute top-full right-0 left-0 z-10 translate-y-3 rounded-xl border border-stroke-100 bg-black"
          )}
        >
          {clonedOptions}
        </ul>
      )}
    </div>
  );
};

export default DropDown;
