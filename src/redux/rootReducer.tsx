import { combineReducers } from 'redux';
import { massdkReducer } from './massdkReducer';
import { massrouteReducer } from './massrouteReducer';
import { massrouteproReducer } from './massrouteproReducer';
import { mapReducer } from './mapReducer';
import { coordinatesReducer } from './coordinatesReducer';

export const rootReducer = combineReducers({
  //commReducer,
  mapReducer,
  massdkReducer,
  massrouteReducer,
  massrouteproReducer,
  coordinatesReducer,
});
