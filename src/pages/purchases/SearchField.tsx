import { SearchIcon } from '../../components/icons'
import { PURCHASES_COPY } from './copy'

type SearchFieldProps = {
  query: string
  onQueryChange: (query: string) => void
}

export function SearchField({ query, onQueryChange }: SearchFieldProps) {
  return (
    <label className="purchases-search">
      <SearchIcon />
      <input
        type="search"
        enterKeyHint="search"
        aria-label={PURCHASES_COPY.searchPlaceholder}
        placeholder={PURCHASES_COPY.searchPlaceholder}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
    </label>
  )
}
