import React, { forwardRef, useState } from "react";

import type { ChangeEvent } from "react";
import { FolderCloud } from "iconsax-react";
import type { IField } from "../../../types/field";
import clsx from "clsx";

export type IFileFieldProps = {
  initialValue?: string;
  className?: string;
  onPreview?: (e: ChangeEvent<HTMLInputElement>) => void;
} & IField<HTMLInputElement>;

const FileField = forwardRef<HTMLInputElement, IFileFieldProps>(
  (
    { name, onChange, onBlur, error, className, onPreview, initialValue },
    ref
  ) => {
    const [preview, setPreview] = useState<any>(null);
    const dropping = false;

    return (
      <div className="relative col-span-2 flex flex-col">
        <label
          htmlFor="dropzone-file"
          className={clsx(
            "relative flex flex-col items-center overflow-clip",
            "justify-center border-2 border-dashed bg-dark-secondary",
            "rounded-2xl  border-gray-dark px-3 py-6 duration-300",
            error && "!border-red-500 !bg-red-500/10",
            dropping && "border-primary bg-primary/10 ",
            className
          )}
        >
          <div className="text-bold absolute top-2 right-2 z-20 rounded-full bg-dark/80  py-1 px-2 text-xs">
            227 x 338
          </div>
          <FolderCloud
            size="48"
            variant="Bold"
            className={clsx(
              "mb-4 text-gray-dark-secondary",
              dropping && "text-primary"
            )}
          />
          <div className="flex flex-col items-center  gap-3">
            <h6 className="font-base mx-1 text-center font-medium">
              Перетащите или <span className="text-primary">Выберите </span>
              обложку манги
            </h6>
            <p className="mx-2 -mt-2 text-center text-xs text-light/30">
              Поддерживает форматы .jpeg, .png, .jpg
            </p>
          </div>

          {(preview !== null || initialValue) && (
            <img
              src={preview ?? initialValue}
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
          multiple
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
