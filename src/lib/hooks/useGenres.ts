import type { Genre } from "@prisma/client";
import type { IFilter } from "./useFilterStore";
import { useMemo } from "react";

export const useSortedGenres = (
  genres: Genre[],
  selected: IFilter["genres"]["selected"]
) => {
  const sortedGenres = useMemo(() => {
    return [...genres].sort((a, b) => {
      return Number(selected.includes(b.id)) - Number(selected.includes(a.id));
    });
  }, [selected, genres]);

  return sortedGenres;
};

export const useGenres = (
  genres: Genre[],
  selected: IFilter["genres"]["selected"],
  query: IFilter["query"]
) => {
  const sortedGenres = useSortedGenres(genres, selected);

  const sortedAndSearchedGenres = useMemo(() => {
    return [...sortedGenres].filter((genre) =>
      genre.title.toLowerCase().includes(query)
    );
  }, [query, sortedGenres]);

  return sortedAndSearchedGenres;
};
