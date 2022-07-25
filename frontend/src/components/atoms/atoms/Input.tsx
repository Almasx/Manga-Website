interface A extends React.ComponentPropsWithoutRef<"input"> {
  labelShowed?: false;
  placeholder: string;
}

interface B extends React.ComponentPropsWithoutRef<"input"> {
  labelShowed: true;
  placeholder?: string;
}

type Props = A | B;

const Input = ({ labelShowed = false, placeholder = " ", ...props }: Props) => {
  return (
    <div className="relative">
      <input
        type="text"
        id="floating_outlined"
        placeholder={placeholder}
        className="block px-5 py-3 w-full text-sm text-white/33 placeholder:text-white/33 bg-black rounded-2xl border
        border-stroke-200 focus:outline-none focus:ring-2 focus:border-primary peer bg-surface/5
        duration-300 ease"
        {...props}
      />
      {labelShowed && (
        <label
          htmlFor="floating_outlined"
          className="absolute text-sm text-white/33 duration-300 transform rounded-full
                     top-1/2 -translate-y-1/2 translate-x-4 z-10 origin-[0] bg-transparent 
                   peer-focus:text-primary peer-focus:top-1.5 peer-focus:text-xs peer-focus:-translate-y-4
                     peer-focus:bg-black/80 peer-focus:px-1.5 peer-focus:translate-x-3"
        >
          Search
        </label>
      )}
    </div>
  );
};

export default Input;
