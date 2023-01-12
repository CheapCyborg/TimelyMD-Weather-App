import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Define a type for the slice state for geoLocation
interface GeoLocationState {
  latitude: number;
  longitude: number;
  currentCity: string;
  currentState: string;
  currentCountry: string;
  cityLoading: boolean;
}

// Define the initial state using that type
const initialState: GeoLocationState = {
  latitude: 0,
  longitude: 0,
  currentCity: '',
  currentState: '',
  currentCountry: '',
  cityLoading: true,
};

export const getCity = createAsyncThunk(
  'weather/fetchWeatherData',
  async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
    return fetch(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
    )
      .then((response) => response.json())
      .catch((error) => console.log(error));
  }
);

export const getGeoByCity = createAsyncThunk(
  'weather/fetchWeatherDataByCoords',
  async (city: string) => {
    return fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
    )
      .then((response) => response.json())
      .catch((error) => console.log(error));
  }
);

export const geoLocationSlice = createSlice({
  name: 'geoLocation',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setLatitude: (state, action: PayloadAction<number>) => {
      state.latitude = action.payload;
    },
    setLongitude: (state, action: PayloadAction<number>) => {
      state.longitude = action.payload;
    },
    setCurrentCity: (state, action: PayloadAction<string>) => {
      state.currentCity = action.payload;
    },
    setCurrentState: (state, action: PayloadAction<string>) => {
      state.currentState = action.payload;
    },
    setCurrentCountry: (state, action: PayloadAction<string>) => {
      state.currentCountry = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCity.pending, (state) => {
        state.cityLoading = true;
      })
      .addCase(getCity.fulfilled, (state, action) => {
        state.cityLoading = false;
        console.log(action?.payload[0]);
        state.currentCity = action.payload[0].name;
        state.currentState = action.payload[0].state;
        state.currentCountry = action.payload[0].country;
      })
      .addCase(getCity.rejected, (state) => {
        state.cityLoading = false;
      });
  },
});

export const {
  setLatitude,
  setLongitude,
  setCurrentCity,
  setCurrentCountry,
  setCurrentState,
} = geoLocationSlice.actions;

export default geoLocationSlice.reducer;
