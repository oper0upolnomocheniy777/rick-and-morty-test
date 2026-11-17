import type { CharactersResponse } from '../types/character';

const BASE_URL = '/api/rickandmorty';

interface FetchCharactersParams {
  page: number;
  name?: string;
  status?: string;
  signal?: AbortSignal;
}

export async function fetchCharacters({
  page,
  name,
  status,
  signal,
}: FetchCharactersParams): Promise<CharactersResponse> {
  const params = new URLSearchParams();
  params.set('page', String(page));
  if (name) params.set('name', name);
  if (status) params.set('status', status);

  const response = await fetch(`${BASE_URL}?${params.toString()}`, { signal });

  if (!response.ok) {
    if (response.status === 404) {
      return { info: { count: 0, pages: 0, next: null, prev: null }, results: [] };
    }
    throw new Error(`Ошибка запроса: ${response.status}`);
  }

  return response.json();
}