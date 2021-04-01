import { configureStore } from '@reduxjs/toolkit';
import appDataReducer from './slices/appDataSlice';

export default configureStore({
  reducer: {
    appData: appDataReducer
  }
});

