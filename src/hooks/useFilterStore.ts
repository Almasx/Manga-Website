import create from "zustand";

interface IFilterState {
  filter: IFilter;
  toggleGenre: (targetId: number) => void;
  toggleOrder: () => void;
  setQuery: (query: IFilter["query"]) => void;
  setGenreQuery: (query: IFilter["genres"]["query"]) => void;
  setStatus: (status: IFilter["status"]) => void;
  setSort: (sort: IFilter["sort"]) => void;
  resetFilter: () => void;
}

export const useFilterStore = create<IFilterState>((set) => ({
  filter: {
    query: "",
    sort: "year",
    order: "asc",
    status: "ongoing",
    genres: { selected: [], query: "" },
  },

  toggleGenre: (targetId) =>
    set((state) => {
      // clean if already in genres
      if (!state.filter.genres.selected.includes(targetId)) {
        return {
          filter: {
            ...state.filter,
            genres: {
              selected: [...state.filter.genres.selected, targetId],
              query: "",
            },
          },
        };
      }

      return {
        filter: {
          ...state.filter,
          genres: {
            selected: state.filter.genres.selected.filter(
              (id) => id !== targetId
            ),
            query: "",
          },
        },
      };
    }),

  toggleOrder: () =>
    set((state) => ({
      filter: {
        ...state.filter,
        order: state.filter.order === "asc" ? "desc" : "asc",
      },
    })),

  setQuery: (query) =>
    set((state) => ({
      filter: {
        ...state.filter,
        query: query,
      },
    })),

  setGenreQuery: (query) =>
    set((state) => ({
      filter: {
        ...state.filter,
        genres: { selected: state.filter.genres.selected, query: query },
      },
    })),

  setStatus: (status) =>
    set((state) => ({ filter: { ...state.filter, status: status } })),

  setSort: (sort) =>
    set((state) => ({ filter: { ...state.filter, sort: sort } })),

  resetFilter: () =>
    set(() => ({
      filter: {
        query: "",
        sort: "year",
        order: "asc",
        status: "ongoing",
        genres: { selected: [], query: "" },
      },
    })),
}));
