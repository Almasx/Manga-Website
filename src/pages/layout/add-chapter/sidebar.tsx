import NumberField from "components/ui/fields/NumberField";
import TextField from "components/ui/fields/TextField";
import SideBar from "components/ui/templates/SideBar";
import { useRouter } from "next/router";

const FormSideBar = () => {
  const { query } = useRouter();

  return (
    <SideBar.Wrapper className="!w-72">
      <img
        src={query.thumbnail as string | undefined}
        alt="lol"
        className="m-5  rounded-2xl text-white"
      />
      <SideBar.Section.Wrapper>
        <SideBar.Section.Header
          className="mt-3 !py-1 text-white/30"
          text="Том \ глава"
        />
        <div className="flex flex-row gap-3 px-5">
          <NumberField
            className="px-4"
            placeholder={`${query.new_chapter} том`}
          />
          <NumberField
            className="px-4"
            placeholder={`${query.new_chapter} глава`}
          />
        </div>
        <SideBar.Section.Header
          className="mt-1 !py-1 text-white/30"
          text="Название"
        />
        <TextField className="px-4" placeholder="пр: Вот это поворот" />
      </SideBar.Section.Wrapper>
    </SideBar.Wrapper>
  );
};

export default FormSideBar;
