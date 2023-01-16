import type { Location, WeatherForecast } from './types';

const state = {
  currentWeather: {
    weatherDescription: 'clear sky',
    iconID: '01d',
    tempHigh: 0,
    tempLow: 0,
    humidity: 0,
    windSpeed: 0,
    feelsLike: 0,
    error: '',
    weatherLoading: false,
  },
  geoLocation: {
    city: 'New York',
    currentState: 'NY',
    country: 'US',
    savedLocations: [] as Location[],
    error: '',
  },
  weatherForecast: {
    weatherForecast: [] as WeatherForecast[],
    error: '',
    weatherForecastLoading: false,
  },
};

export const testUseAppSelector = (f: {
  (state: any): any;
  (arg0: {
    currentWeather: {
      weatherDescription: string;
      iconID: string;
      tempHigh: number;
      tempLow: number;
      humidity: number;
      windSpeed: number;
      feelsLike: number;
      error: string;
      weatherLoading: boolean;
    };
    geoLocation: {
      city: string;
      currentState: string;
      country: string;
      savedLocations: Location[];
      error: string;
    };
    weatherForecast: {
      weatherForecast: WeatherForecast[];
      error: string;
      weatherForecastLoading: boolean;
    };
  }): any;
}) => f(state);
