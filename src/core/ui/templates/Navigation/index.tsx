import "@knocklabs/react-notification-feed/dist/index.css";

import { AccountModal, AuthenticationModal } from "./auth";
import {
  NotificationFeedPopover,
  NotificationIconButton,
} from "@knocklabs/react-notification-feed";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

import Link from "next/link";
import clsx from "clsx";
import { useHideOnScroll } from "lib/hooks/useHideOnScroll";
import { useRef } from "react";
import { useSession } from "next-auth/react";

interface IWrapperProps {
  className?: string;
  children?: React.ReactNode;
  dynamicHide?: boolean;
}

export const showAuthModalAtom = atom<boolean>(false);
export const showNotificationsAtom = atom<boolean>(false);
export const notifButtonRefAtom = atom<any>(null);

const Wrapper = ({
  className = "",
  children = null,
  dynamicHide = false,
}: IWrapperProps) => {
  const { status, data } = useSession();
  const navigationBar = useHideOnScroll<HTMLDivElement>(dynamicHide);
  const notifButtonRef = useRef(null);
  const setNotifButtonRef = useSetAtom(notifButtonRefAtom);
  setNotifButtonRef(notifButtonRef);

  const [showAuthModal, setShowAuthModal] = useAtom(showAuthModalAtom);
  const [showNotifications, setShowNotifications] = useAtom(
    showNotificationsAtom
  );

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
        <>
          <AccountModal
            visible={showAuthModal}
            setVisible={() => setShowAuthModal(false)}
          />
          {data.user?.knockId && (
            <NotificationFeedPopover
              buttonRef={notifButtonRef}
              isVisible={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          )}
        </>
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
  const setShowNotifications = useSetAtom(showNotificationsAtom);
  const notifButtonRef = useAtomValue(notifButtonRefAtom);

  if (status === "authenticated") {
    return (
      <div className="flex gap-4">
        {data.user?.knockId && (
          <NotificationIconButton
            ref={notifButtonRef}
            onClick={() => setShowNotifications((previos) => !previos)}
          />
        )}
        <img
          onClick={() => setShow(true)}
          className="h-8 w-8 rounded-full"
          src={data?.user?.image as string | undefined}
          alt="pfp"
        />
      </div>
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
