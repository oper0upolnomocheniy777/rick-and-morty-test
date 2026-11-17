import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchCharacters } from '../../api/charactersApi';
import { useDebounce } from '../../hooks/useDebounce';
import type { Character, ApiInfo } from '../../types/character';
import CharacterCard from '../../components/CharacterCard/CharacterCard';
import SearchInput from '../../components/SearchInput/SearchInput';
import StatusFilter from '../../components/StatusFilter/StatusFilter';
import Pagination from '../../components/Pagination/Pagination';
import Loader from '../../components/Loader/Loader';
import styles from './CharactersPage.module.css';

export default function CharactersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const nameFromUrl = searchParams.get('name') || '';
  const statusFromUrl = searchParams.get('status') || '';

  const [searchInput, setSearchInput] = useState(nameFromUrl);
  const debouncedSearch = useDebounce(searchInput, 400);

  const [characters, setCharacters] = useState<Character[]>([]);
  const [info, setInfo] = useState<ApiInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const currentName = searchParams.get('name') || '';
    if (debouncedSearch === currentName) return;

    const newParams = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      newParams.set('name', debouncedSearch);
    } else {
      newParams.delete('name');
    }
    newParams.set('page', '1');
    setSearchParams(newParams, { replace: true });
  }, [debouncedSearch, searchParams, setSearchParams]);

  const handleStatusChange = useCallback(
    (status: string) => {
      const newParams = new URLSearchParams(searchParams);
      if (status) {
        newParams.set('status', status);
      } else {
        newParams.delete('status');
      }
      newParams.set('page', '1');
      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', String(newPage));
      setSearchParams(newParams);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    async function load() {
      setIsLoading(true);
      setError(null);
      setHasSearched(true);

      try {
        const data = await fetchCharacters({
          page,
          name: nameFromUrl,
          status: statusFromUrl,
          signal,
        });
        setCharacters(data.results);
        setInfo(data.info);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setError('Не удалось загрузить данные. Попробуйте позже.');
        setCharacters([]);
        setInfo(null);
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => abortController.abort();
  }, [page, nameFromUrl, statusFromUrl]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Персонажи Rick and Morty</h1>

      <div className={styles.controls}>
        <SearchInput value={searchInput} onChange={setSearchInput} />
        <StatusFilter value={statusFromUrl} onChange={handleStatusChange} />
      </div>

      {isLoading && <Loader />}

      {error && <p className={styles.error}>{error}</p>}

      {!isLoading && !error && characters.length === 0 && hasSearched && (
        <p className={styles.empty}>
          По вашему запросу ничего не найдено. Попробуйте изменить параметры.
        </p>
      )}

      {!isLoading && !error && characters.length > 0 && (
        <>
          <div className={styles.grid}>
            {characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
          {info && (
            <Pagination
              currentPage={page}
              totalPages={info.pages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}