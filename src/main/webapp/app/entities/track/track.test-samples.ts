import { ITrack, NewTrack } from './track.model';

export const sampleWithRequiredData: ITrack = {
  id: 'dc8bcafc-6f23-44a6-984d-2e9c8625d76a',
  name: 'tsunami',
};

export const sampleWithPartialData: ITrack = {
  id: '3e97e04a-52db-4518-bdc9-61d4cd8ae165',
  name: 'meanwhile supposing',
};

export const sampleWithFullData: ITrack = {
  id: 'e9357302-d751-4ac0-8371-ddf9cb79e3ad',
  name: 'tub helpfully whereas',
};

export const sampleWithNewData: NewTrack = {
  name: 'dagger',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
