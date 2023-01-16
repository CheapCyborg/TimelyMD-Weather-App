import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { GeoLocationState, Location } from '../types';

const savedLocationsLocal: Location[] = [];

if (typeof window !== 'undefined') {
  const savedLocations = localStorage.getItem('savedLocations');
  if (savedLocations) {
    savedLocationsLocal.push(...JSON.parse(savedLocations));
  }
}

const initialState: GeoLocationState = {
  city: '',
  currentState: '',
  country: 'US',
  savedLocations: savedLocationsLocal,
  error: '',
  geoLoading: true,
};

export const getCityByCoords = createAsyncThunk(
  'weather/fetchCityByCoords',
  async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  }
);

export const getGeoByCity = createAsyncThunk(
  'weather/fetchGeoByCity',
  async ({
    city,
    state,
    country,
  }: {
    city: string;
    state: string;
    country: string;
  }) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  }
);

export const geoLocationSlice = createSlice({
  name: 'geoLocation',
  initialState,
  reducers: {
    addLocation: (state, action: PayloadAction<Location>) => {
      state.savedLocations.push(action.payload);
      localStorage.setItem(
        'savedLocations',
        JSON.stringify(state.savedLocations)
      );
    },
    removeLocation: (state, action: PayloadAction<Location>) => {
      state.savedLocations = state.savedLocations.filter(
        (location) =>
          location.city !== action.payload.city &&
          location.currentState !== action.payload.currentState &&
          location.country !== action.payload.country
      );
      localStorage.setItem(
        'savedLocations',
        JSON.stringify(state.savedLocations)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCityByCoords.pending, (state) => {
        state.geoLoading = true;
      })
      .addCase(getCityByCoords.fulfilled, (state, action) => {
        state.geoLoading = false;
        if (action.payload.length === 0) {
          state.error = 'Nothing found';
          state.geoLoading = false;
          return;
        }
        state.city = action.payload[0].name;
        state.currentState = action.payload[0].state;
        state.country = action.payload[0].country;
        state.error = '';
      })
      .addCase(getCityByCoords.rejected, (state) => {
        state.geoLoading = false;
      })
      .addCase(getGeoByCity.pending, (state) => {
        state.geoLoading = true;
      })
      .addCase(getGeoByCity.fulfilled, (state, action) => {
        state.geoLoading = false;
        if (action.payload.length === 0) {
          state.error = 'Nothing found';
          state.geoLoading = false;
          return;
        }
        state.city = action.payload[0].name;
        state.currentState = action.payload[0].state;
        state.country = action.payload[0].country;
        state.error = '';
      })
      .addCase(getGeoByCity.rejected, (state) => {
        state.geoLoading = false;
      });
  },
});

export const { addLocation, removeLocation } = geoLocationSlice.actions;

export default geoLocationSlice.reducer;
