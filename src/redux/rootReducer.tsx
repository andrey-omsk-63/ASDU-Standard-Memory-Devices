import { combineReducers } from 'redux';
import { massdkReducer } from './massdkReducer';
import { massfazReducer } from './massfazReducer';
import { massmodeReducer } from './massmodeReducer';
import { statsaveReducer } from './statsaveReducer';
// import { massrouteReducer } from './massrouteReducer';
// import { massrouteproReducer } from './massrouteproReducer';
import { mapReducer } from './mapReducer';
import { coordinatesReducer } from './coordinatesReducer';

export const rootReducer = combineReducers({
  //commReducer,
  mapReducer,
  massdkReducer,
  massfazReducer,
  massmodeReducer,
  statsaveReducer,
  // massrouteReducer,
  // massrouteproReducer,
  coordinatesReducer,
});
