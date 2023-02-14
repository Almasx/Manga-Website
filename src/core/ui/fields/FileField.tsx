import clsx from "clsx";
import { FolderCloud } from "iconsax-react";
import type { ChangeEvent } from "react";
import React, { forwardRef, useState } from "react";
import type { IField } from "../../../types/IField";

export type IFileFieldProps = {
  className?: string;
  onPreview?: (e: ChangeEvent<HTMLInputElement>) => void;
} & IField<HTMLInputElement>;

const FileField = forwardRef<HTMLInputElement, IFileFieldProps>(
  ({ name, onChange, onBlur, error, className, onPreview }, ref) => {
    const [preview, setPreview] = useState<any>(null);

    return (
      <div className="col-span-2 flex flex-col">
        <label
          htmlFor="dropzone-file"
          className={clsx(
            "relative flex flex-col items-center overflow-clip",
            "border border-dashed border-primary",
            "rounded-2xl bg-primary/10 px-3 py-6 duration-300",
            error && "!border-red-500 !bg-red-500/10",
            className
          )}
        >
          <div className="text-bold absolute top-2 right-2 z-20 rounded-full bg-black/80  py-1 px-2 text-xs">
            227 x 338
          </div>
          <FolderCloud size="24" variant="Bold" className="mb-4 text-primary" />
          <div className="flex flex-col items-center gap-3">
            <h6 className="font-base font-medium">
              Перетащите или <span className="text-primary">Выберите файл</span>{" "}
              для загрузки
            </h6>
            <p className="-mt-2 text-center text-xs text-white/30">
              Поддерживает форматы .jpeg, .png, .jpg
            </p>
          </div>

          {preview !== null && (
            <img
              src={preview}
              alt="thumbnail image"
              className="absolute inset-0 z-10 min-h-full object-fill"
            />
          )}
        </label>

        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          name={name}
          ref={ref}
          onChange={(e) => {
            onChange && onChange(e);

            onPreview
              ? onPreview(e)
              : e.target.files &&
                e.target.files[0] &&
                setPreview(window.URL.createObjectURL(e.target.files[0]));
          }}
          onBlur={(e) => {
            onBlur && onBlur(e);
          }}
        />

        {error && (
          <p className="mt-2 pl-1 text-sm text-red-600 dark:text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FileField.displayName = "FileField";

export default FileField;
