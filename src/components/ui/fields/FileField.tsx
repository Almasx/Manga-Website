import clsx from "clsx";
import { ImportCurve } from "iconsax-react";
import React, { forwardRef, useEffect, useState } from "react";
import type { IField } from "../../../types/IField";
import Button from "../primitives/Button";
import Divider from "../primitives/Divider";

export type IFileFieldProps = {
  watchThumbnail: any;
} & IField<HTMLInputElement>;

const FileField = forwardRef<HTMLInputElement, IFileFieldProps>(
  ({ watchThumbnail, name, onChange, onBlur, error }, ref) => {
    const [preview, setPreview] = useState<any>(null);

    useEffect(() => {
      if (watchThumbnail && watchThumbnail[0]) {
        const objectUrl = window.URL.createObjectURL(watchThumbnail[0]);
        setPreview(objectUrl);

        return () => window.URL.revokeObjectURL(objectUrl);
      }
    }, [watchThumbnail]);

    return (
      <div className="col-span-2 flex flex-col">
        <label
          htmlFor="dropzone-file"
          className={clsx(
            "relative flex flex-col items-center overflow-clip",
            "border border-dashed border-primary",
            "rounded-2xl bg-primary/10 px-3 py-6 duration-300",
            error && "!border-red-500 !bg-red-500/10"
          )}
        >
          <div className="text-bold absolute top-2 right-2 z-20 rounded-full bg-black bg-surface/5 py-1 px-2 text-xs">
            227 x 338
          </div>
          <ImportCurve size="64" className="mt-20 mb-6 text-white/30" />
          <div className="flex flex-col items-center gap-3">
            <h6 className="font-meduim font-base">Залейте обложку манги</h6>
            <p className="-mt-2 text-center text-xs text-white/30">
              Поддерживает форматы <br />
              .jpeg, .png, .jpg
            </p>
            <Divider>или</Divider>
            <Button>Выбрать обложку</Button>
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
