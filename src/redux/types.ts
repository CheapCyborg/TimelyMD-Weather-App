export interface WeatherState {
  tempHigh: number;
  tempLow: number;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  time: number | null;
  weatherDescription: string;
  iconID: string;
  error: string;
  weatherLoading: boolean;
}

export interface Location {
  city: string;
  currentState: string;
  country: string;
}

export interface GeoLocationState {
  city: string;
  currentState: string;
  country: string;
  savedLocations: Location[];
  error: string;
  geoLoading: boolean;
}

export interface WeatherForecastState {
  weatherForecast: WeatherState[];
  error: string;
  weatherForecastLoading: boolean;
}

export interface WeatherForecast {
  day: number;
  dayName: string;
  iconID: string;
  tempHigh: number;
  tempLow: number;
  weatherDescription: string;
}

// //define type for the following {
//         dt_txt: string | number | Date;
//         main: { temp_max: number; temp_min: number };
//         weather: { icon: any; description: string }[];
//       }

export interface WeatherForecastData {
  dt_txt: string | number | Date;
  main: { temp_max: number; temp_min: number };
  weather: { icon: any; description: string }[];
}
