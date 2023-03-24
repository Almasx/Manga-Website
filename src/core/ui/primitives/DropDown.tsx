import { cloneElement, useState } from "react";

import type { ButtonProps } from "core/ui/primitives/Button";
import type { ReactElement } from "react";
import type { TabProps } from "core/ui/templates/SideBar/Section";
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
      <ul
        className={clsx(
          " absolute top-full right-0 left-0 z-10 translate-y-3 overflow-clip ",
          "rounded-xl border border-gray-dark-secondary bg-dark/60 backdrop-blur-2xl duration-150",
          dropDownShow ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        {clonedOptions}
      </ul>
    </div>
  );
};

export default DropDown;
