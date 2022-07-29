import Tick from "../icons/Tick";

const CheckBox = () => {
  return (
    <div className="flex space-x-3 border border-stroke-100 py-3">
      <label className="relative cursor-pointer">
        <input
          type="checkbox"
          className="peer h-[21px] w-[21px] rotate-45 appearance-none rounded-lg border
                       border-stroke-200 bg-surface/5 accent-primary duration-200 checked:bg-primary"
        />
        <div className="invisible absolute top-3 left-1/2 box-content -translate-x-1/2 -translate-y-1/2 transform peer-checked:visible">
          <Tick />
        </div>
      </label>
      <p className="relative text-base font-medium text-white">Выпускается</p>
    </div>
  );
};

export default CheckBox;
