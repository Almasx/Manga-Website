import Button from "core/ui/primitives/Button";
import type { IModal } from "types/model";
import Modal from "core/ui/primitives/Modal";
import VK from "../../../../../public/icons/VK.svg";
import { signIn } from "next-auth/react";

const AuthenticationModal = ({ visible, setVisible }: IModal) => {
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
