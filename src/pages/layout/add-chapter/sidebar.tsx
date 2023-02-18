import SideBar from "core/ui/templates/SideBar";
import { useRouter } from "next/router";

const FormSideBar = () => {
  const { query } = useRouter();

  return (
    <SideBar.Wrapper className="!w-72 p-5 ">
      <img
        src={query.thumbnail as string | undefined}
        alt="lol"
        className="mb-5 rounded-2xl text-white"
      />

      <div className="flex flex-col">
        <h1 className="w-full break-words text-2xl font-bold text-white">
          {query?.title_ru}
        </h1>
        <h3 className="text-base font-bold text-white/30">{query?.title}</h3>
      </div>
    </SideBar.Wrapper>
  );
};

export default FormSideBar;
