import NumberField from "../../../components/atoms/NumberField";
import SideBar from "../../../components/organisms/SideBar";

const FormSideBar = () => {
  return (
    <SideBar.Wrapper className="col-span-2 ">
      <SideBar.Section.Wrapper>
        <SideBar.Section.Header text="Том \ глава" />
        <div className="flex flex-row gap-5 px-5">
          <NumberField placeholder="4 том" />
          <NumberField placeholder="20 глава" />
        </div>
      </SideBar.Section.Wrapper>
    </SideBar.Wrapper>
  );
};

export default FormSideBar;
