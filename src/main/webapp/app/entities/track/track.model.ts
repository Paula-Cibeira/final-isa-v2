import { IAlbum } from 'app/entities/album/album.model';

export interface ITrack {
  id: string;
  name?: string | null;
  album?: IAlbum | null;
}

export type NewTrack = Omit<ITrack, 'id'> & { id: null };
