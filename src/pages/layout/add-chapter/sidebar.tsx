import NumberField from "components/ui/fields/NumberField";
import SideBar from "components/ui/templates/SideBar";
import { useRouter } from "next/router";

const FormSideBar = () => {
  const { query } = useRouter();

  return (
    <SideBar.Wrapper className="col-span-2 ">
      <SideBar.Section.Wrapper>
        <img
          src={query.thumbnail as string | undefined}
          alt="lol"
          className="m-5 mb-0 rounded-2xl text-white"
        />

        <SideBar.Section.Header text="Том \ глава" />
        <div className="flex flex-row gap-5 px-5">
          <NumberField placeholder={`${query.new_chapter} том`} />
          <NumberField placeholder={`${query.new_chapter} глава`} />
        </div>
      </SideBar.Section.Wrapper>
    </SideBar.Wrapper>
  );
};

export default FormSideBar;
