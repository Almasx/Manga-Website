import Button from "core/ui/primitives/Button";
import type { ITextFieldProps } from "core/ui/fields/TextField";

type ICommentFieldProps = {
  rows?: number;
  onClick: (event?: unknown) => void;
} & ITextFieldProps<HTMLTextAreaElement>;

const CommentField = ({ value, onChange, onClick }: ICommentFieldProps) => {
  return (
    <div className="relative">
      <textarea
        rows={3}
        onChange={(e) => {
          onChange && onChange(e);
        }}
        value={value}
        className=" h-full w-full rounded-2xl border border-stroke-200 bg-black p-4 placeholder:text-white/30 focus:outline-none"
        placeholder="Оставьте здесь комментарий.."
      />
      <div className="absolute bottom-0 right-0">
        <Button
          className=" rounded-2xl rounded-tr-none rounded-bl-none px-5"
          onClick={onClick}
        >
          Отправить
        </Button>
      </div>
    </div>
  );
};

export default CommentField;
