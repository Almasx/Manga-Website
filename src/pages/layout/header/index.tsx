import clsx from "clsx";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AccountModal from "./AccountModal";
import SignIn from "./Authentication/SignIn";
import Registration from "./Authentication/Registration";
import Image from "next/image";
import { useHideOnScroll } from "../../../hooks/useHideOnScroll";

interface NavigationProps {
  className?: string;
  children?: React.ReactNode;
  dynamicHide?: boolean;
}

const Navigation = ({
  className = "",
  children = null,
  dynamicHide = false,
}: NavigationProps) => {
  const { status, data } = useSession();
  const navigationBar = useHideOnScroll<HTMLDivElement>(dynamicHide);

  const [modal, setModal] = useState<boolean>(false);
  const [hasAccount, setHasAccount] = useState<boolean>(true);

  return (
    <>
      <div
        ref={navigationBar}
        className={clsx(
          className,
          "flex w-full flex-row items-center justify-between gap-10 border-b duration-150",
          "h-12 border-b-stroke-100 bg-black/80 px-5 backdrop-blur-2xl"
        )}
      >
        <Link href="/catalog" className="text-xs text-white/60">
          Каталог
        </Link>
        {children}
        {status === "authenticated" ? (
          <img
            onClick={() => setModal(true)}
            className=" h-8 w-8 rounded-full"
            src={data!.user!.image!}
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
      </div>

      {status === "authenticated" ? (
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

export default Navigation;
