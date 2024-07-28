export interface IArtist {
  id: string;
  name?: string | null;
}

export type NewArtist = Omit<IArtist, 'id'> & { id: null };
