import clsx from "clsx";

interface IModalProps {
  children: React.ReactNode;
  className?: string;
  classNameInner?: string;
  backgroundBlur?: boolean;
  backgroundBlack?: boolean;
  visible: boolean;
  setVisible: (event?: any) => void;
}

const Modal = ({
  children,
  className = "",
  classNameInner = "",
  backgroundBlur = true,
  backgroundBlack = false,
  visible,
  setVisible,
}: IModalProps) => {
  return (
    <div
      className={clsx(
        "fixed inset-0 z-20 h-screen duration-150",
        backgroundBlur && " bg-dark/10 backdrop-blur-md",
        backgroundBlack && "bg-dark/60",
        !visible && "invisible opacity-0",
        visible && "visible flex items-center justify-center opacity-100"
      )}
      onClick={() => setVisible()}
    >
      <div
        className={clsx(
          "rounded-2xl border border-gray-dark bg-dark",
          className
        )}
      >
        <div
          className={clsx(
            "h-full w-full rounded-2xl bg-dark-secondary",
            classNameInner
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
