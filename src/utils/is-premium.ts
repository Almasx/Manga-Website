export const isPublic = (publicAt: Date | null) => {
  return publicAt ? publicAt.valueOf() - new Date().valueOf() <= 0 : true;
};
