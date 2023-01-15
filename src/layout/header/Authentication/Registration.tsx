import { signIn } from "next-auth/react";
import Button from "../../../components/atoms/Button";
import Modal from "../../../components/atoms/Modal";
import { z } from "zod";
import Form from "../../../components/organisms/Form";
import OAuth from "./OAuth";

const SignUpSchema = z.object({
  name: z.string().describe("Name"),
  email: z.string().email("Enter a real email please.").describe("Email"), // renders TextField
  password: z.string().describe("Password"),
});

interface IRegistrationProps {
  visible: boolean;
  setVisible: (event?: any) => void;
  setHasAccount: (event?: any) => void;
}

const Registration = ({
  visible,
  setVisible,
  setHasAccount,
}: IRegistrationProps) => {
  function onSubmit(data: z.infer<typeof SignUpSchema>) {
    // gets typesafe data when form is submitted
  }

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <form className="relative flex flex-col items-center p-4 pt-6">
        <div className="absolute -top-0 left-1/2 z-[51] -translate-y-1/2 -translate-x-1/2 transform rounded-full bg-primary px-3 py-2 text-xs font-bold text-white">
          Регистрация
        </div>

        <h1 className="text-3xl font-bold text-white">Dark Fraction</h1>
        <h2 className="font-meduim mb-8 text-lg text-white/30">
          Добро пожаловать
        </h2>

        <Form
          schema={SignUpSchema}
          onSubmit={onSubmit}
          renderAfter={() => (
            <Button className="w-80 " type="submit">
              Зарегистритоваться
            </Button>
          )}
          formProps={{
            className: "flex w-full flex-col gap-4",
          }}
        />

        <OAuth />
        <p className="m-5 text-center text-xs text-white/30">
          Уже есть аккаунт?{" "}
          <button
            className=" text-primary"
            onClick={() => {
              setHasAccount(true);
            }}
          >
            Войти
          </button>
        </p>
      </form>
    </Modal>
  );
};

export default Registration;
