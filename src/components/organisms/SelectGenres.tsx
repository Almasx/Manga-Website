import Badge from "core/ui/primitives/Badge";
import { SearchNormal } from "iconsax-react";
import TextField from "core/ui/fields/TextField";
import clsx from "clsx";
import { trpc } from "utils/trpc";
import useDebounce from "lib/hooks/useDebounce";
import { useGenres } from "lib/hooks/useGenres";

interface ISelectGenresProps {
  selected: IFilter["genres"]["selected"];
  query: IFilter["query"];
  onQuery: (query: string) => void;
  onToggleGenre: (target_id: number) => void;
  className?: string;
}

const SelectGenres = ({
  selected,
  query,
  onQuery,
  onToggleGenre,
  className = "",
}: ISelectGenresProps) => {
  const genres = trpc.comics.getGenres.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  const sortedAndSearchedGenres = useGenres(genres.data ?? [], selected, query);
  const debounce = useDebounce();

  return (
    <div className={clsx("flex flex-col ", className)}>
      <TextField
        placeholder="пр: детектив, драма..."
        endIcon={<SearchNormal size="20" className="text-white/30 " />}
        onChange={(event: { target: { value: string } }) =>
          onQuery(event.target.value)
        } // debounce(event.target.value, onQuery)
      />
      <div className="mt-4 mb-auto flex flex-row flex-wrap items-center justify-start overflow-y-auto">
        {sortedAndSearchedGenres.map((genre) => (
          <Badge
            className="mr-2 mb-2"
            onClick={() => {
              onToggleGenre(genre.id);
            }}
            active={selected.includes(genre.id)}
            key={genre.id}
          >
            {genre.title}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SelectGenres;
