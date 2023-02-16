import { TRPCError } from "@trpc/server";

export type queryResponce<T> = Promise<
  | {
      status: "error";
      code: "NOT_FOUND" | "BAD_REQUEST";
      message: string;
      data: undefined;
    }
  | {
      status: "success";
      data: T;
      code: undefined;
      message: undefined;
    }
>;

export type queryResponceData<T> = T extends Promise<infer U>
  ? U extends { status: "success"; data: infer D }
    ? D
    : never
  : never;

export const handleQuery = async <T>(
  queryResponce: T extends queryResponce<queryResponceData<T>> ? T : any
) => {
  const res = await queryResponce;

  if (res.status === "error") {
    throw new TRPCError({ code: res.code, message: res.message });
  }

  return res.data;
};
