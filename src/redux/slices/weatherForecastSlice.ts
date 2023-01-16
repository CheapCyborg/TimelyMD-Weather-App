import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { WeatherForecastState } from '../types';

const initialState: WeatherForecastState = {
  weatherForecast: [],
  error: '',
  weatherForecastLoading: true,
};

export const getWeatherForecastByCity = createAsyncThunk(
  'weather/fetchWeatherForecastData',
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
        `https://api.openweathermap.org/data/2.5/forecast?q=${city},${state},${country}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=imperial`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  }
);

export const getWeatherForecastByCoords = createAsyncThunk(
  'weather/fetchWeatherForecastDataByCoords',
  async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=imperial`
      );
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      return error;
    }
  }
);

export const weatherForecastSlice = createSlice({
  name: 'weatherForecast',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getWeatherForecastByCity.pending, (state) => {
      state.weatherForecastLoading = true;
    });
    builder.addCase(getWeatherForecastByCity.fulfilled, (state, action) => {
      state.weatherForecastLoading = false;
      state.weatherForecast = action.payload.list;
      console.log(action.payload);
    });
    builder.addCase(getWeatherForecastByCity.rejected, (state, action) => {
      state.weatherForecastLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(getWeatherForecastByCoords.pending, (state) => {
      state.weatherForecastLoading = true;
    });
    builder.addCase(getWeatherForecastByCoords.fulfilled, (state, action) => {
      state.weatherForecastLoading = false;
      state.weatherForecast = action.payload.list;
      console.log(action.payload);
    });
    builder.addCase(getWeatherForecastByCoords.rejected, (state, action) => {
      state.weatherForecastLoading = false;
      state.error = action.error.message;
    });
  },
});

export default weatherForecastSlice.reducer;
