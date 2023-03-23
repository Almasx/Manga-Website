export const getDifferenceObject = <T extends Record<string, any>>(
  initialObject: Partial<T>,
  modifiedObject: Partial<T>
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
