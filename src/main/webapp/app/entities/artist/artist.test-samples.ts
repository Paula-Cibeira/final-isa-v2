import { IArtist, NewArtist } from './artist.model';

export const sampleWithRequiredData: IArtist = {
  id: '39e73f48-9466-4f71-9a4d-35731e7167b9',
  name: 'indeed',
};

export const sampleWithPartialData: IArtist = {
  id: '2a62bcd7-c194-492a-a1d3-56add76fd50f',
  name: 'icicle zany unhinge',
};

export const sampleWithFullData: IArtist = {
  id: '7433b300-f115-4808-be8f-900620b069f1',
  name: 'diesel whenever',
};

export const sampleWithNewData: NewArtist = {
  name: 'determined',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
