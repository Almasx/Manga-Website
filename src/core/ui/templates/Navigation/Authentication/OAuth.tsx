import Button from "components/ui/primitives/Button";
import Divider from "components/ui/primitives/Divider";
import { Google } from "iconsax-react";
import { signIn } from "next-auth/react";
import React from "react";

const OAuth = () => {
  return (
    <>
      <Divider>или</Divider>
      <Button
        className="w-80 bg-white text-black"
        type="button"
        onClick={() => signIn("discord")}
      >
        <div className="flex flex-row gap-3">
          <Google size="24" variant="Bold" /> Войти с помощью Discord
        </div>
      </Button>
    </>
  );
};

export default OAuth;
