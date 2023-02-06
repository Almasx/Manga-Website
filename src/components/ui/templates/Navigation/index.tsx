import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import AccountModal from "./AccountModal";
import SignIn from "./Authentication/SignIn";
import Registration from "./Authentication/Registration";
import Links from "./Links";
import { useHideOnScroll } from "hooks/useHideOnScroll";

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
  const [hasAccount, setHasAccount] = useState<boolean>(true);

  return (
    <>
      <nav
        ref={navigationBar}
        className={clsx(
          className,
          "flex w-full flex-row items-center justify-between gap-10 border-b duration-150",
          "h-16 border-b-stroke-100 bg-black/80 px-5 backdrop-blur-2xl"
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
      ) : hasAccount ? (
        <SignIn
          visible={modal}
          setVisible={setModal}
          setHasAccount={() => setHasAccount(false)}
        />
      ) : (
        <Registration
          visible={modal}
          setVisible={setModal}
          setHasAccount={() => setHasAccount(false)}
        />
      )}
    </>
  );
};

const Navigation = { Wrapper, Links };

export default Navigation;