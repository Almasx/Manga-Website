import { getKeys } from "./util-types";

export type queryChapter = {
  id: string;
  createdAt: Date;
  chapterIndex: number;
  volumeIndex: number;
}[];

export const preprocessQueryObject = (chapters: queryChapter) => {
  return chapters.reduce((acc, obj) => {
    const { volumeIndex, chapterIndex } = obj;
    if (volumeIndex in acc) {
      acc[volumeIndex]?.push(chapterIndex);
    } else {
      acc[volumeIndex] = [chapterIndex];
    }
    return acc;
  }, {} as { [key: number]: number[] });
};

export const getDefaultVolumeAndChapterIndex = (chapters: queryChapter) => {
  let defaultVolumeIndex = 1;
  let defaultChapterIndex = 1;
  const chapterObject = preprocessQueryObject(chapters);

  const latestVolume = getKeys(chapterObject).sort((a, b) => b - a)[0];
  if (latestVolume) {
    defaultVolumeIndex = +(latestVolume as string | number);
    defaultChapterIndex = Math.max(...(chapterObject[latestVolume] ?? [0])) + 1;
  }
  return { defaultVolumeIndex, defaultChapterIndex, chapterObject };
};
