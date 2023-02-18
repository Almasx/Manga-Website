import NumberField from "core/ui/fields/NumberField";
import SideBar from "core/ui/templates/SideBar";
import TextField from "core/ui/fields/TextField";
import { useRouter } from "next/router";

const FormSideBar = () => {
  const { query } = useRouter();

  return (
    <SideBar.Wrapper className="w-72">
      <img
        src={query.thumbnail as string | undefined}
        alt="lol"
        className="m-5  rounded-2xl text-white"
      />
    </SideBar.Wrapper>
  );
};

export default FormSideBar;
