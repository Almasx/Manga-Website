import { Logout, Save2, Setting2 } from "iconsax-react";
import { signOut, useSession } from "next-auth/react";

import Button from "core/ui/primitives/Button";
import type { IModal } from "types/model";
import Link from "next/link";
import Modal from "core/ui/primitives/Modal";
import VK from "../../../../../public/icons/VK.svg";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export const AccountModal = ({ visible, setVisible }: IModal) => {
  const router = useRouter();
  const { data } = useSession();

  return (
    <Modal
      visible={visible}
      setVisible={setVisible}
      backgroundBlur={false}
      className="absolute right-5 top-20 w-64 !bg-dark/90 backdrop-blur-xl "
      classNameInner="bg-transparent"
    >
      <div className="relative flex flex-col overflow-hidden rounded-2xl text-light">
        {data?.user?.image && (
          <img
            src={data?.user?.image}
            alt=""
            className="absolute top-[10px] left-4 h-16 w-16 rounded-full"
          />
        )}
        <div className="h-[42px] border-b border-b-gray-dark-secondary" />
        <div className="flex flex-col px-4 pt-[42px] pb-3">
          <h4 className="mb-1 text-2xl font-bold">{data?.user?.name}</h4>
          <Link
            className="flex justify-start rounded-xl px-3 py-2 duration-150 hover:bg-white/10"
            href={`/user/${data?.user?.id}`}
          >
            <div className="flex flex-row items-center gap-3 text-lg font-medium text-light/60">
              <Setting2 size="24" />
              Настройки
            </div>
          </Link>

          <Link
            className="flex justify-start rounded-xl px-3 py-2 duration-150 hover:bg-white/10"
            href={`/user/${data?.user?.id}`}
          >
            <div className="flex flex-row items-center gap-3 text-lg font-medium text-light/60">
              <Save2 size="24" />
              Сохранённые
            </div>
          </Link>

          <Button
            className=" !justify-start bg-transparent duration-150 hover:bg-white/10"
            onClick={() => signOut()}
          >
            <div className="flex flex-row items-center gap-3 text-lg font-medium text-light/60">
              <Logout size="24" />
              Выход
            </div>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const AuthenticationModal = ({ visible, setVisible }: IModal) => {
  return (
    <Modal visible={visible} setVisible={setVisible}>
      <div className="relative flex flex-col items-center p-4 pt-6">
        <div className="absolute -top-0 left-1/2 z-[51] -translate-y-1/2 -translate-x-1/2 transform rounded-full bg-primary px-3 py-2 text-xs font-bold text-light">
          Регистрация
        </div>

        <h1 className="text-3xl font-bold text-light">Dark Fraction</h1>
        <h2 className="font-meduim mb-6 text-lg text-light/30">
          Добро пожаловать
        </h2>

        <Button
          className="w-80 bg-[#0077ff] "
          type="button"
          onClick={() => signIn("vk")}
        >
          <div className="flex flex-row items-center gap-5">
            <VK /> Войти с помощью VK
          </div>
        </Button>
      </div>
    </Modal>
  );
};

export default AuthenticationModal;
