/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { checkComics } from "./checkComics";
import type { isUserBookmark } from "./isUserBookmark";
import { prisma } from "server/db";
import type { queryResponceData } from "utils/handle-query";

export async function clearSubscriptions(
  comics: queryResponceData<ReturnType<typeof checkComics>>,
  userBookmarks: queryResponceData<ReturnType<typeof isUserBookmark>>
) {
  const comics_bookmarks = comics.bookmarks?.map((bookmark) => bookmark.id);
  const intersection = comics_bookmarks?.filter((value) =>
    userBookmarks.bookmarks.includes(value)
  );

  for await (const bookmarkId of intersection!) {
    await prisma.bookmark.update({
      select: { comics: true },
      where: { id: bookmarkId },
      data: {
        comics: {
          disconnect: { id: comics.id },
        },
      },
    });

    await prisma.comics.update({
      select: { bookmarks: true },
      where: { id: comics.id },
      data: {
        bookmarks: {
          disconnect: { id: bookmarkId },
        },
      },
    });
  }
}
