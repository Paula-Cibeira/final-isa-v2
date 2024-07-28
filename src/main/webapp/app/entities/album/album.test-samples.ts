import { IAlbum, NewAlbum } from './album.model';

export const sampleWithRequiredData: IAlbum = {
  id: '301a3fb4-dcfd-4223-9094-885fcc2676fa',
  name: 'eggnog into',
};

export const sampleWithPartialData: IAlbum = {
  id: 'd13b3f2c-8fcb-47d8-898c-b05d54b39a35',
  name: 'haggle leach unto',
};

export const sampleWithFullData: IAlbum = {
  id: '376830bc-fdc4-46ed-838a-8b97d013c1dd',
  name: 'sometimes',
};

export const sampleWithNewData: NewAlbum = {
  name: 'um now',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
