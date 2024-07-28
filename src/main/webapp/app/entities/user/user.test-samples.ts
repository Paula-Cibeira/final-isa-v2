import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 'd218bc5a-eacb-48b3-a948-5814c9619ad9',
  login: 'q',
};

export const sampleWithPartialData: IUser = {
  id: '9b9528ed-4427-4de9-8639-448b10417090',
  login: 'cJLz7@S66EOs\\;23YEFj\\/J\\]T7\\`dWrLHj\\}NNkXr',
};

export const sampleWithFullData: IUser = {
  id: '2aebe878-e1e1-43ad-8cec-2d1b019792f2',
  login: '_W88x@ow1\\}9\\ArGLaW\\kO\\?Z2438',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
