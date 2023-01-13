import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface WeatherState {
  tempHigh: number;
  tempLow: number;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  weatherDescription: string;
  iconID: string;
  error: string;
  weatherLoading: boolean;
}

const initialState: WeatherState = {
  tempHigh: 0,
  tempLow: 0,
  humidity: 0,
  windSpeed: 0,
  feelsLike: 0,
  weatherDescription: '',
  iconID: '',
  error: '',
  weatherLoading: true,
};

export const getWeatherByCity = createAsyncThunk(
  'weather/fetchWeatherData',
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
        `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=imperial`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  }
);

export const getWeatherByCoords = createAsyncThunk(
  'weather/fetchWeatherDataByCoords',
  async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=imperial`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  }
);

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setWeatherLoading: (state, action) => {
      state.weatherLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWeatherByCity.pending, (state) => {
        state.weatherLoading = true;
      })
      .addCase(getWeatherByCity.fulfilled, (state, action) => {
        if (action.payload.cod === '404') {
          state.error = action.payload.message;
          state.weatherLoading = false;
          return;
        }
        state.weatherDescription = action.payload.weather[0].description;
        state.iconID = action.payload.weather[0].icon;
        state.tempHigh = action.payload.main.temp_max;
        state.tempLow = action.payload.main.temp_min;
        state.humidity = action.payload.main.humidity;
        state.windSpeed = action.payload.wind.speed;
        state.feelsLike = action.payload.main.feels_like;
        state.error = '';
        state.weatherLoading = false;
      })
      .addCase(getWeatherByCity.rejected, (state) => {
        state.weatherLoading = false;
      })
      .addCase(getWeatherByCoords.pending, (state) => {
        state.weatherLoading = true;
      })
      .addCase(getWeatherByCoords.fulfilled, (state, action) => {
        if (action.payload === undefined) {
          state.error = action.payload.message;
          state.weatherLoading = false;
          return;
        }
        state.weatherDescription = action.payload.weather[0].description;
        state.iconID = action.payload.weather[0].icon;
        state.tempHigh = action.payload.main.temp_max;
        state.tempLow = action.payload.main.temp_min;
        state.humidity = action.payload.main.humidity;
        state.windSpeed = action.payload.wind.speed;
        state.feelsLike = action.payload.main.feels_like;
        state.error = '';
        state.weatherLoading = false;
      })
      .addCase(getWeatherByCoords.rejected, (state) => {
        state.weatherLoading = false;
      });
  },
});

export default weatherSlice.reducer;
