import clsx from "clsx";

interface ModalProps {
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
}: ModalProps) => {
  return (
    <div
      className={clsx(
        "fixed top-0 left-0 bottom-0 right-0 z-50 h-screen",
        backgroundBlur && " bg-dark/10 backdrop-blur-md",
        backgroundBlack && "bg-dark/60",
        !visible && "hidden",
        visible && "flex items-center justify-center"
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
