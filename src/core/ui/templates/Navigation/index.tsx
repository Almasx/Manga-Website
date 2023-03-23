import { atom, useAtom, useSetAtom } from "jotai";

import AccountModal from "./AccountModal";
import AuthenticationModal from "./AuthenticationModal";
import Link from "next/link";
import clsx from "clsx";
import { useHideOnScroll } from "lib/hooks/useHideOnScroll";
import { useSession } from "next-auth/react";

interface IWrapperProps {
  className?: string;
  children?: React.ReactNode;
  dynamicHide?: boolean;
}

export const showAuthModalAtom = atom<boolean>(false);
const Wrapper = ({
  className = "",
  children = null,
  dynamicHide = false,
}: IWrapperProps) => {
  const { status } = useSession();
  const navigationBar = useHideOnScroll<HTMLDivElement>(dynamicHide);
  const [showAuthModal, setShowAuthModal] = useAtom(showAuthModalAtom);

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
      </nav>

      {status === "authenticated" ? (
        <AccountModal
          visible={showAuthModal}
          setVisible={() => setShowAuthModal(false)}
        />
      ) : (
        <AuthenticationModal
          visible={showAuthModal}
          setVisible={setShowAuthModal as any}
        />
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

const Auth = () => {
  const { status, data } = useSession();
  const setShow = useSetAtom(showAuthModalAtom);
  if (status === "authenticated") {
    return (
      <img
        onClick={() => setShow(true)}
        className="h-8 w-8 rounded-full"
        src={data?.user?.image as string | undefined}
        alt="pfp"
      />
    );
  }

  return (
    <button onClick={() => setShow(true)} className=" text-xs text-primary">
      Войти
    </button>
  );
};

const Navigation = { Wrapper, Links, Auth };

export default Navigation;
