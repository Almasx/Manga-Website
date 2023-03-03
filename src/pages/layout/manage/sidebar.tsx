import SideBar from "core/ui/templates/SideBar";

interface IFormSideBarProps {
  thumbnail: string;
  title_ru: string;
  title: string;
}

const FormSideBar = ({ thumbnail, title_ru, title }: IFormSideBarProps) => {
  return (
    <SideBar.Wrapper className="!w-72 p-5 ">
      <img
        src={`https://darkfraction.s3.eu-north-1.amazonaws.com/thumbnails/${thumbnail}`}
        alt="lol"
        className="mb-5 rounded-2xl text-white"
      />

      <div className="flex flex-col">
        <h1 className="w-full break-words text-2xl font-bold text-white">
          {title_ru}
        </h1>
        <h3 className="text-base font-bold text-white/30">{title}</h3>
      </div>
    </SideBar.Wrapper>
  );
};

export default FormSideBar;
