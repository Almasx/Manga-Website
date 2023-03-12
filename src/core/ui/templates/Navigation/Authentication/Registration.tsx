import Button from "core/ui/primitives/Button";
import Form from "core/ui/templates/Form";
import type { IModal } from "types/model";
import Modal from "core/ui/primitives/Modal";
import OAuth from "./OAuth";
import { z } from "zod";

const SignUpSchema = z.object({
  name: z.string().describe("Name"),
  email: z.string().email("Enter a real email please.").describe("Email"), // renders TextField
  password: z.string().describe("Password"),
});

interface IRegistrationProps {
  setHasAccount: (event?: any) => void;
}

const Registration = ({
  visible,
  setVisible,
  setHasAccount,
}: IRegistrationProps & IModal) => {
  function onSubmit(data: z.infer<typeof SignUpSchema>) {
    // gets typesafe data when form is submitted
  }

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <div className="relative flex flex-col items-center p-4 pt-6">
        <div className="absolute -top-0 left-1/2 z-[51] -translate-y-1/2 -translate-x-1/2 transform rounded-full bg-primary px-3 py-2 text-xs font-bold text-light">
          Регистрация
        </div>

        <h1 className="text-3xl font-bold text-light">Dark Fraction</h1>
        <h2 className="font-meduim mb-8 text-lg text-light/30">
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
        <p className="m-5 text-center text-xs text-light/30">
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
      </div>
    </Modal>
  );
};

export default Registration;
