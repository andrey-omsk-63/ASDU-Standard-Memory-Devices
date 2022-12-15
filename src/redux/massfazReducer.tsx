import { MASSFAZ_CREATE } from './types';
import { massFaz } from './../App';
//import { Fazer } from './../App';

const intialState = {
  massfaz: massFaz,
};

export const massfazReducer = (state = intialState, action: any) => {
  switch (action.type) {
    case MASSFAZ_CREATE:
      //console.log('!!!massfazReducer:', action, typeof action);
      return {
        ...state,
        massfaz: action.data,
      };

    default:
      return state;
  }
};
