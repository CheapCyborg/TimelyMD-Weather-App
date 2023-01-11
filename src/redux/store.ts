import type { Store } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';

import geoLocationSliceReducer from './slices/geoLocationSlice';

export const store: Store = configureStore({
  reducer: {
    geoLocation: geoLocationSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
