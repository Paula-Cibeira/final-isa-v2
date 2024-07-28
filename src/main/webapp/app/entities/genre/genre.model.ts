export interface IGenre {
  id: string;
  name?: string | null;
}

export type NewGenre = Omit<IGenre, 'id'> & { id: null };
