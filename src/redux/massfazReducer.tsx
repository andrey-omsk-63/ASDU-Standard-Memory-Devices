import { MASSFAZ_CREATE } from "./types";
import { massFaz } from "./../App";

const intialState = {
  massfaz: massFaz,
};

export const massfazReducer = (state = intialState, action: any) => {
  //console.log('1massfazReducer:', action);
  switch (action.type) {
    case MASSFAZ_CREATE:
      return {
        ...state,
        massfaz: action.data,
      };

    default:
      return state;
  }
};
