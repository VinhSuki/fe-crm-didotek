import { combineReducers } from '@reduxjs/toolkit';
import genericPageReducer from './slices/genericPage.slice';

const rootReducer = combineReducers({
  genericPage:genericPageReducer,
});

export default rootReducer;
