import { ArrowUp2, ArrowDown2, ArrowForward } from "iconsax-react";
import profile from "../../assets/pfp.png";

const Comments = () => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-stroke-200 p-4 text-white ">
      <div className="flex flex-row items-center gap-3">
        <img className="h-9 w-9 rounded-full" src={profile} alt="" />
        <div className="flex flex-col">
          <h1 className="text-sm font-medium text-white">John Doe</h1>
          <h3 className="text-xs text-white/30">11.09.2011</h3>
        </div>
      </div>
      <p className="font-base leading-5 text-white/60">
        Ac nisl mauris hendrerit consequat bibendum pellentesque ut congue. In
        consequat commodo libero urna in netus metus. Ac nisl mauris hendrerit
        consequat bibendum pellentesque ut congue. In consequat commodo libero
        urna in netus metus.Ac nisl mauris hendrerit consequat bibendum
        pellentesque ut congue. In consequat commodo libero{" "}
      </p>
      <div className="flex flex-row gap-5 ">
        <div className="flex flex-row gap-3">
          <ArrowUp2 /> 10 <ArrowDown2 />
        </div>
        <ArrowForward className="-scale-x-100 " />
      </div>
    </div>
  );
};

export default Comments;
