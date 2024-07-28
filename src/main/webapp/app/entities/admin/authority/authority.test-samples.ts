import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: 'a8fba413-98a0-497c-af6e-659adf8b7394',
};

export const sampleWithPartialData: IAuthority = {
  name: 'b8e14cb0-b44c-48d3-aa05-922806d5559c',
};

export const sampleWithFullData: IAuthority = {
  name: '5a039af6-6011-4945-8a95-e93ff5425cbc',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
