import AccountModal from "./AccountModal";
import AuthenticationModal from "./AuthenticationModal";
import Link from "next/link";
import clsx from "clsx";
import { useHideOnScroll } from "lib/hooks/useHideOnScroll";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface IWrapperProps {
  className?: string;
  children?: React.ReactNode;
  dynamicHide?: boolean;
  auth?: boolean;
}

const Wrapper = ({
  className = "",
  children = null,
  dynamicHide = false,
  auth = false,
}: IWrapperProps) => {
  const { status, data } = useSession();
  const navigationBar = useHideOnScroll<HTMLDivElement>(dynamicHide);
  const [modal, setModal] = useState<boolean>(false);

  return (
    <>
      <nav
        ref={navigationBar}
        className={clsx(
          "flex w-full flex-row items-center justify-between gap-10 border-b duration-150",
          "h-16 border-b-gray-dark-secondary bg-dark/80 px-5 backdrop-blur-2xl",
          className
        )}
      >
        {children}
        {!auth ? (
          <></>
        ) : status === "authenticated" ? (
          <img
            onClick={() => setModal(true)}
            className=" h-8 w-8 rounded-full"
            src={data?.user?.image as string | undefined}
            alt="pfp"
          />
        ) : (
          <button
            onClick={() => setModal(true)}
            className=" text-xs text-primary"
          >
            Войти
          </button>
        )}
      </nav>

      {!auth ? (
        <></>
      ) : status === "authenticated" ? (
        <AccountModal visible={modal} setVisible={() => setModal(false)} />
      ) : (
        <AuthenticationModal visible={modal} setVisible={setModal as any} />
      )}
    </>
  );
};

const Links = () => {
  return (
    <div className="flex flex-row gap-5">
      <Link href="/" className="text-xs text-light/60">
        Главная
      </Link>
      <Link href="/catalog" className="text-xs text-light/60">
        Каталог
      </Link>
    </div>
  );
};

const Navigation = { Wrapper, Links };

export default Navigation;
