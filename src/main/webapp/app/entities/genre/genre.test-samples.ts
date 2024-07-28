import { IGenre, NewGenre } from './genre.model';

export const sampleWithRequiredData: IGenre = {
  id: '00042ccd-2d21-4266-af35-f56bda73e19a',
  name: 'accounting by',
};

export const sampleWithPartialData: IGenre = {
  id: '159fd0c1-56e8-4875-9c8f-99ea4b4d1c8c',
  name: 'kindheartedly decency',
};

export const sampleWithFullData: IGenre = {
  id: '30ce7f47-8032-4821-88b2-9ab63a5c404d',
  name: 'astride illusion rawhide',
};

export const sampleWithNewData: NewGenre = {
  name: 'indulge',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
