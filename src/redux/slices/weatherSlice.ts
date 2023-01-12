import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Define a type for the slice state for weather
// interface WeatherStats {
//   temp: number;
//   feels_like: number;
//   temp_min: number;
//   temp_max: number;
//   pressure: number;
//   humidity: number;
// }

interface WeatherState {
  tempHigh: number;
  tempLow: number;
  // weatherStats: WeatherStats;
  weatherDescription: string;
  weatherLoading: boolean;
}

// Define the initial state using that type
const initialState: WeatherState = {
  // weatherStats: {
  //   temp: 0,
  //   feels_like: 0,
  //   temp_min: 0,
  //   temp_max: 0,
  //   pressure: 0,
  //   humidity: 0,
  // },
  tempHigh: 0,
  tempLow: 0,
  weatherDescription: '',
  weatherLoading: true,
};

export const getWeather = createAsyncThunk(
  'weather/fetchWeatherData',
  async (city: string) => {
    return fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=imperial`
    )
      .then((response) => response.json())
      .catch((error) => console.log(error));
  }
);

export const getWeatherByCoords = createAsyncThunk(
  'weather/fetchWeatherDataByCoords',
  async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
    return fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=imperial`
    )
      .then((response) => response.json())
      .catch((error) => console.log(error));
  }
);

export const weatherSlice = createSlice({
  name: 'weather',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setTempHigh: (state, action) => {
      state.tempHigh = action.payload;
    },
    setTempLow: (state, action) => {
      state.tempLow = action.payload;
    },
    clearWeather: (state) => {
      // state.weatherStats = {
      //   temp: 0,
      //   feels_like: 0,
      //   temp_min: 0,
      //   temp_max: 0,
      //   pressure: 0,
      //   humidity: 0,
      // };
      state.weatherDescription = '';
      state.tempHigh = 0;
      state.tempLow = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWeather.pending, (state) => {
        state.weatherLoading = true;
      })
      .addCase(getWeather.fulfilled, (state) => {
        // removed action for now
        // state.weatherDescription = action?.payload?.weather[0]?.description;
        // state.tempHigh = action.payload.main.temp_max;
        // state.tempLow = action.payload.main.temp_min;
        state.weatherLoading = false;
      })
      .addCase(getWeatherByCoords.pending, (state) => {
        state.weatherLoading = true;
      })
      .addCase(getWeatherByCoords.fulfilled, (state, action) => {
        state.weatherDescription = action.payload.weather[0].description;
        state.tempHigh = action.payload.main.temp_max;
        state.tempLow = action.payload.main.temp_min;
        state.weatherLoading = false;
        console.log(action.payload.main);
      });
  },
});

export const { clearWeather } = weatherSlice.actions;

export default weatherSlice.reducer;
