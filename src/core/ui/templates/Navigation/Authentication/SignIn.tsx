import Form from "components/ui/templates/Form";
import Button from "components/ui/primitives/Button";
import Modal from "components/ui/primitives/Modal";
import { z } from "zod";
import OAuth from "./OAuth";

const SignInSchema = z.object({
  email: z.string().email("Enter a real email please.").describe("Email"), // renders TextField
  password: z.string().describe("Password"),
});

interface ISignInProps {
  visible: boolean;
  setVisible: (event?: any) => void;
  setHasAccount: (event?: any) => void;
}

const SignIn = ({ visible, setVisible, setHasAccount }: ISignInProps) => {
  function onSubmit(data: z.infer<typeof SignInSchema>) {
    // gets typesafe data when form is submitted
  }

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <div className="relative flex flex-col items-center p-4 pt-6">
        <div className="absolute -top-0 left-1/2 z-[51] -translate-y-1/2 -translate-x-1/2 transform rounded-full bg-primary px-3 py-2 text-xs font-bold text-white">
          Войти в аккаунт
        </div>
        <h1 className="text-3xl font-bold text-white">Dark Fraction</h1>
        <h2 className="font-meduim text-white/33 mb-8 text-lg">
          Добро пожаловать
        </h2>
        <Form
          schema={SignInSchema}
          onSubmit={onSubmit}
          renderAfter={() => (
            <Button className="w-80 " type="submit">
              Войти
            </Button>
          )}
          formProps={{
            className: "flex w-full flex-col gap-4",
          }}
        />

        <OAuth />

        <p className="my-5 text-center text-xs text-white/30">
          Впервые здесь?{" "}
          <button
            className=" text-primary"
            onClick={() => {
              setHasAccount(false);
            }}
          >
            Зарегистритоваться
          </button>
        </p>
      </div>
    </Modal>
  );
};

export default SignIn;
