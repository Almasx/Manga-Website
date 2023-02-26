export const getDifferenceObject = <T extends Record<string, any>>(
  initialObject: T,
  modifiedObject: T
) => {
  const differenceObject: Partial<T> = {};
  for (const key of Object.keys(modifiedObject) as Array<keyof T>) {
    if (
      JSON.stringify(modifiedObject[key]) !== JSON.stringify(initialObject[key])
    ) {
      differenceObject[key] = modifiedObject[key];
    }
  }
  return differenceObject;
};
