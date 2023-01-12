import type { Store } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';

import geoLocationSliceReducer from './slices/geoLocationSlice';
import weatherSliceReducer from './slices/weatherSlice';

export const store: Store = configureStore({
  reducer: {
    geoLocation: geoLocationSliceReducer,
    weather: weatherSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
