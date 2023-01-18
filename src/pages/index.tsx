import { useEffect, useState } from 'react';

import CurrentWeather from '@/components/CurrentWeather/CurrentWeather';
import Locations from '@/components/SavedLocations/SavedLocations';
import Forecast from '@/components/WeatherForecast/WeatherForecast';
import { Meta } from '@/layouts/Meta';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  getWeatherByCity,
  getWeatherByCoords,
} from '@/redux/slices/currentWeatherSlice';
import { getCityByCoords, getGeoByCity } from '@/redux/slices/geoLocationSlice';
import {
  getWeatherForecastByCity,
  getWeatherForecastByCoords,
} from '@/redux/slices/weatherForecastSlice';
import { Main } from '@/templates/Main';

const Index = () => {
  // REDUX
  const dispatch = useAppDispatch();

  const { weatherLoading, error } = useAppSelector(
    (state) => state.currentWeather
  );

  const { geoLoading, city, currentState, country } = useAppSelector(
    (state) => state.geoLocation
  );

  const { weatherForecastLoading } = useAppSelector(
    (state) => state.weatherForecast
  );

  // STATE
  const [searchQuery, setSearchQuery] = useState(city);

  // FUNCTIONS
  const getWeatherOnClick = (query: string) => {
    let weatherCity = city;
    let weatherState = currentState;
    let weatherCountry = country;

    query.split(',').forEach((item, index) => {
      if (index === 0 && item.trim() !== '') {
        weatherCity = item.trim();
      } else if (index === 1 && item.trim() !== '') {
        weatherState = item.trim();
      } else if (index === 2 && item.trim() !== '') {
        weatherCountry = item.trim();
      }
    });

    dispatch(
      getWeatherByCity({
        city: weatherCity,
        state: weatherState,
        country: weatherCountry,
      }) as any
    );
    dispatch(
      getWeatherForecastByCity({
        city: weatherCity,
        state: weatherState,
        country: weatherCountry,
      }) as any
    );
    dispatch(
      getGeoByCity({
        city: weatherCity,
        state: weatherState,
        country: weatherCountry,
      }) as any
    );
  };

  // HOOKS
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        dispatch(getWeatherByCoords(position.coords) as any);
        dispatch(getCityByCoords(position.coords) as any);
        dispatch(getWeatherForecastByCoords(position.coords) as any);
      });
    }
  }, []);

  // RENDER
  if (weatherLoading || geoLoading || weatherForecastLoading) {
    return (
      <Main meta={<Meta title="Weather App" description="Weather App" />}>
        <div className="flex h-screen items-center justify-center">
          <div
            data-testid="loading-spinner"
            className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"
          ></div>
        </div>
      </Main>
    );
  }

  return (
    <Main meta={<Meta title="Weather App" description="Weather App" />}>
      <div className="flex flex-col items-center justify-center">
        <div>
          <span className="p-3 text-lg font-bold text-gray-900">
            Search by City
          </span>
          <input
            className="mr-4 rounded-lg border p-1 text-gray-900"
            type="text"
            placeholder="Enter City"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="rounded bg-blue-500 py-2 px-4 font-bold text-white transition duration-500 ease-in-out hover:bg-blue-700"
            onClick={() => getWeatherOnClick(searchQuery)}
          >
            Search
          </button>
        </div>
        {error !== '' && (
          <div className="w-auto">
            <div className=" text-red-700" role="alert">
              <p>
                Please search using the format: City, State (optional), Country
                (optional)
              </p>
            </div>
          </div>
        )}
        <div className="mt-10 flex flex-row items-center justify-center">
          <CurrentWeather />
          <Locations />
        </div>
        <Forecast />
      </div>
    </Main>
  );
};

export default Index;
