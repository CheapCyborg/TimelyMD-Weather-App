import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface Location {
  city: string;
  currentState: string;
  country: string;
}
interface GeoLocationState {
  city: string;
  currentState: string;
  country: string;
  savedLocations: Location[];
  error: string;
  cityLoading: boolean;
}

// Define the initial state using that type
const initialState: GeoLocationState = {
  city: '',
  currentState: '',
  country: 'US',
  savedLocations: [],
  error: '',
  cityLoading: true,
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
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addLocation: (state, action: PayloadAction<Location>) => {
      state.savedLocations.push(action.payload);
    },
    removeLocation: (state, action: PayloadAction<Location>) => {
      state.savedLocations = state.savedLocations.filter(
        (location) =>
          location.city !== action.payload.city &&
          location.currentState !== action.payload.currentState &&
          location.country !== action.payload.country
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCityByCoords.pending, (state) => {
        state.cityLoading = true;
      })
      .addCase(getCityByCoords.fulfilled, (state, action) => {
        state.cityLoading = false;
        if (action.payload.length === 0) {
          state.error = 'Nothing found';
          state.cityLoading = false;
          return;
        }
        state.city = action.payload[0].name;
        state.currentState = action.payload[0].state;
        state.country = action.payload[0].country;
        state.error = '';
      })
      .addCase(getCityByCoords.rejected, (state) => {
        state.cityLoading = false;
      })
      .addCase(getGeoByCity.pending, (state) => {
        state.cityLoading = true;
      })
      .addCase(getGeoByCity.fulfilled, (state, action) => {
        state.cityLoading = false;
        if (action.payload.length === 0) {
          state.error = 'Nothing found';
          state.cityLoading = false;
          return;
        }
        state.city = action.payload[0].name;
        state.currentState = action.payload[0].state;
        state.country = action.payload[0].country;
        state.error = '';
      })
      .addCase(getGeoByCity.rejected, (state) => {
        state.cityLoading = false;
      });
  },
});

export const { addLocation, removeLocation } = geoLocationSlice.actions;

export default geoLocationSlice.reducer;
