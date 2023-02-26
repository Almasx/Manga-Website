import {
  addComicsSchema,
  editComicsSchema,
} from "lib/schemas/modifyComicsSchema";

import Button from "core/ui/primitives/Button";
import FileField from "core/ui/fields/FileField";
import type { ModifyComicsSchema } from "lib/schemas/modifyComicsSchema";
import NumberField from "core/ui/fields/NumberField";
import RadioGroupField from "core/ui/fields/RadioGroupField";
import SelectGenres from "components/organisms/SelectGenres";
import type { SubmitHandler } from "react-hook-form";
import TextAreaField from "core/ui/fields/TextAreaField";
import TextField from "core/ui/fields/TextField";
import _ from "lodash";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const ModifyComics = ({
  defaultValues,
  onSubmit,
}: {
  defaultValues?: Partial<ModifyComicsSchema>;
  onSubmit: SubmitHandler<ModifyComicsSchema>;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ModifyComicsSchema>({
    resolver: zodResolver(defaultValues ? editComicsSchema : addComicsSchema),
    defaultValues: {
      genres: [],
      genresQuery: "",
      status: "ongoing",
      ...defaultValues,
    },
  });

  useEffect(() => {
    register("genres");
    register("genresQuery");
  }, [register]);

  const genresValue = watch("genres");

  return (
    <>
      <h3 className="mb-5 text-xl font-medium text-white/40 ">
        Сведения о манге
      </h3>
      <form
        onSubmit={handleSubmit(onSubmit, (error) => {
          console.log(error);
        })}
        className="grid grid-cols-4 gap-5 md:grid-cols-6 lg:grid-cols-10"
      >
        <FileField
          className="h-full"
          error={errors.thumbnail?.message as string}
          {...register("thumbnail", { required: true })}
          {...(defaultValues?.thumbnail?.id && {
            initialValue: `https://darkfraction.s3.eu-north-1.amazonaws.com/thumbnails/${defaultValues?.thumbnail?.id}`,
          })}
        />

        <div className="col-span-5 col-start-3 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-5">
            <TextField
              label="Название (на английском)"
              placeholder="Введите название манги"
              error={errors.title?.message}
              {...register("title", { required: true })}
            />
            <TextField
              label="Название (на русском)"
              placeholder="Введите название манги на рускком"
              error={errors.title_ru?.message}
              {...register("title_ru", { required: true })}
            />
          </div>
          <TextAreaField
            className="grow"
            label="Описание"
            placeholder="Введите описание манги"
            rows={4}
            {...register("description", { required: true })}
            error={errors.description?.message}
          />
          <NumberField
            label="Год"
            placeholder="Введите год выпуска манги"
            error={errors.year?.message}
            {...register("year", {
              required: true,
              valueAsNumber: true,
              value: new Date().getFullYear(),
            })}
          />
          <div className="grid grid-cols-3 gap-5">
            <RadioGroupField
              label="Выпускается"
              active={!watch("status") || watch("status") === "ongoing"}
              value="ongoing"
              {...register("status")}
            />
            <RadioGroupField
              label="Заброшен"
              active={watch("status") === "abandoned"}
              value="abandoned"
              {...register("status")}
            />
            <RadioGroupField
              label="Завершен"
              active={watch("status") === "finished"}
              value="finished"
              {...register("status")}
            />
          </div>
        </div>

        <SelectGenres
          className="col-span-3 col-start-8"
          selected={genresValue}
          query={watch("genresQuery")}
          onQuery={(query) => setValue("genresQuery", query)}
          onToggleGenre={(targetId) => {
            if (!genresValue.includes(targetId)) {
              setValue("genres", [...genresValue, targetId]);
            } else {
              setValue(
                "genres",
                genresValue.filter((id) => id !== targetId)
              );
            }
          }}
        />

        <Button className="col-span-2 mt-4" type="submit">
          {defaultValues ? "Изменить" : "Добавить мангу"}
        </Button>
      </form>
    </>
  );
};

export default ModifyComics;
