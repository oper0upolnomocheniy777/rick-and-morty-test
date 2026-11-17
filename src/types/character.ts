export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';

export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  image: string;
}

export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface CharactersResponse {
  info: ApiInfo;
  results: Character[];
}