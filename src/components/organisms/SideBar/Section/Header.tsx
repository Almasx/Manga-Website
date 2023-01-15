import React from "react";

interface IHeader {
  text: string;
}

const Header = ({ text }: IHeader) => {
  return <header className="py-4 px-5 text-lg font-bold">{text}</header>;
};

export default Header;
