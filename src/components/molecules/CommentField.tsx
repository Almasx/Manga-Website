import Button from "components/ui/primitives/Button";
import React from "react";

const CommentField = () => {
  return (
    <div className="relative">
      <textarea
        rows={3}
        className=" h-full w-full rounded-2xl border border-stroke-200 bg-black p-4 placeholder:text-white/30 focus:outline-none"
        placeholder="Оставьте здесь комментарий.."
      ></textarea>
      <div className="absolute bottom-0 right-0">
        <Button className=" rounded-2xl rounded-tr-none rounded-bl-none px-5">
          Отправить
        </Button>
      </div>
    </div>
  );
};

export default CommentField;
