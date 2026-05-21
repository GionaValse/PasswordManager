import { SearchIcon, XIcon } from 'lucide-react';
import styles from './SearchView.module.css';

interface SearchViewProps {
  id?: string;
  placeholder?: string;
  onSearchInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchView({ id = 'search-view', placeholder, onSearchInput }: SearchViewProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchInput(e);

    if (e.target.value.length > 0) {
      e.target.parentElement?.classList.add(styles.hasValue);
    } else {
      e.target.parentElement?.classList.remove(styles.hasValue);
    }
  };

  const handleClear = () => {
    const input = document.getElementById(`${id}-input`) as HTMLInputElement;
    input.value = '';

    handleChange({ target: input } as React.ChangeEvent<HTMLInputElement>);

    input.focus();
  };

  return (
    <div id={id} data-testid={`test-${id}`} className={styles.searchView}>
      <div className={styles.searchViewContainer}>
        <div
          id={`${id}-icon`}
          data-testid={`test-${id}-icon`}
          className={styles.searchViewInputIcon}
        >
          <SearchIcon size={18} />
        </div>
        <input
          id={`${id}-input`}
          data-testid={`test-${id}-input`}
          required
          placeholder={placeholder}
          className={styles.searchViewInput}
          onChange={handleChange}
          type="search"
          role="searchbox"
        />
        <div className={styles.searchViewInputHighlight}></div>
        <div
          id={`${id}-icon-clear`}
          data-testid={`test-${id}-icon-clear`}
          className={styles.searchViewInputIconClear}
          onClick={handleClear}
        >
          <XIcon size={18} />
        </div>
      </div>
    </div>
  );
}
