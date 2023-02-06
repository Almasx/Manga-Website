import NumberField from "components/ui/fields/NumberField";
import TextField from "components/ui/fields/TextField";
import SideBar from "components/ui/templates/SideBar";
import { useRouter } from "next/router";

const FormSideBar = () => {
  const { query } = useRouter();

  return (
    <SideBar.Wrapper className="">
      <img
        src={query.thumbnail as string | undefined}
        alt="lol"
        className="m-5  rounded-2xl text-white"
      />
    </SideBar.Wrapper>
  );
};

export default FormSideBar;
