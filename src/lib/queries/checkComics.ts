import prisma from "server/db/client";

export async function checkComics(comicsId: string) {
  const comics = await prisma.comics.findUnique({
    where: { id: comicsId },
    include: { bookmarks: true },
  });

  if (!comics) {
    return {
      status: "error" as const,
      code: "NOT_FOUND" as const,
      message: "Comics not found",
    };
  }

  return {
    status: "success" as const,
    data: comics,
  };
}
