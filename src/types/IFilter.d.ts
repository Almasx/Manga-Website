interface IFilter {
  query: string;
  sort: "saved" | "year" | "rating";
  order: "asc" | "desc";
  genres: {
    selected: string[];
    query: string;
  };
  status: "ongoing" | "finished" | "abandoned";
}
