export type PartialPick<T, F extends keyof T> = Omit<T, F> &
  Partial<Pick<T, F>>;

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export const getKeys = Object.keys as <T extends object>(
  obj: T
) => Array<keyof T>;
