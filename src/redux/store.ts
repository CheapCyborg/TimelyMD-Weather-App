import type { Store } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';

import currentWeatherSliceReducer from './slices/currentWeatherSlice';
import geoLocationSliceReducer from './slices/geoLocationSlice';
import weatherForecaseReducer from './slices/weatherForecastSlice';

export const store: Store = configureStore({
  reducer: {
    geoLocation: geoLocationSliceReducer,
    currentWeather: currentWeatherSliceReducer,
    weatherForecast: weatherForecaseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
