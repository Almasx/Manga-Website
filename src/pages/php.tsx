import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { useEffect } from "react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "../components/atoms/Button";
import TextField from "../components/atoms/TextField";

const SignInSchema = z.object({
  email: z.string().min(1), // renders TextField
  password: z.string(),
});

type AddComicsSchema = z.infer<typeof SignInSchema>;

const PHP = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddComicsSchema>({
    resolver: zodResolver(SignInSchema),
  });

  function onSubmit(data: z.infer<typeof SignInSchema>) {
    console.log(data);
    alert(data.email + data.password);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full grid-rows-2 gap-5">
        <TextField {...register("email", { required: true })} />
        <TextField {...register("password", { required: true })} />
      </div>
      <Button className="w-80 " type="submit">
        Войти
      </Button>
    </form>
  );
};

export default PHP;