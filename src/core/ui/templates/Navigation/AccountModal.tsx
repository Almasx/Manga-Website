import { Logout, Save2, Setting2 } from "iconsax-react";
import { signOut, useSession } from "next-auth/react";

import Button from "core/ui/primitives/Button";
import Modal from "core/ui/primitives/Modal";
import { useRouter } from "next/router";

interface IAccountModalProps {
  visible: boolean;
  setVisible: (event?: unknown) => void;
}

const AccountModal = ({ visible, setVisible }: IAccountModalProps) => {
  const router = useRouter();
  const { data } = useSession();

  return (
    <Modal
      visible={visible}
      setVisible={setVisible}
      backgroundBlur={false}
      className="absolute right-5 top-16 w-64"
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
          <Button
            className=" !justify-start bg-transparent"
            onClick={() => {
              router.push(`/user/${data?.user?.id}`);
            }}
          >
            <div className="flex flex-row items-center gap-3 text-lg font-medium text-light/60">
              <Setting2 size="24" />
              Настройки
            </div>
          </Button>

          <Button
            className=" !justify-start bg-transparent"
            onClick={() => {
              router.push(`/user/${data?.user?.id}`);
            }}
          >
            <div className="flex flex-row items-center gap-3 text-lg font-medium text-light/60">
              <Save2 size="24" />
              Сохранённые
            </div>
          </Button>

          <Button
            className=" !justify-start bg-transparent"
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

export default AccountModal;
