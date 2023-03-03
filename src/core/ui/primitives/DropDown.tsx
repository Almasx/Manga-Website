import { cloneElement, useState } from "react";

import type { ButtonProps } from "core/ui/primitives/Button";
import type { ReactElement } from "react";
import type { TabProps } from "core/ui/templates/SideBar/Section/Tab";
import clsx from "clsx";

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
      onClick: (event?: any) => {
        option.props.onClick?.call(event);
        setDropDownOption(index);
        setDropdownShow(false);
      },
      active: dropDownOption === index,
    })
  );
  return (
    <div className="text-light">
      {clonedHeader}
      {dropDownShow && (
        <ul
          className={clsx(
            "absolute top-full right-0 left-0 z-10 translate-y-3 rounded-xl border border-gray-dark-secondary bg-dark"
          )}
        >
          {clonedOptions}
        </ul>
      )}
    </div>
  );
};

export default DropDown;
