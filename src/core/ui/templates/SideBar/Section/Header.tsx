import clsx from "clsx";

interface IHeader {
  text: string;
  className?: string;
}

const Header = ({ text, className }: IHeader) => {
  return (
    <header className={clsx("py-4 px-5 text-lg font-bold", className)}>
      {text}
    </header>
  );
};

export default Header;
