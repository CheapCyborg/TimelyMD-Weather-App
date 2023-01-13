import { useEffect, useState } from 'react';

import { Meta } from '@/layouts/Meta';
import type { Location } from '@/redux/slices/geoLocationSlice';
import {
  addLocation,
  getCityByCoords,
  getGeoByCity,
  removeLocation,
} from '@/redux/slices/geoLocationSlice';
import { Main } from '@/templates/Main';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  getWeatherByCity,
  getWeatherByCoords,
} from '../redux/slices/weatherSlice';

const Index = () => {
  // REDUX
  const dispatch = useAppDispatch();

  const {
    weatherLoading,
    error,
    tempHigh,
    tempLow,
    weatherDescription,
    iconID,
    humidity,
    windSpeed,
    feelsLike,
  } = useAppSelector((state) => state.weather);

  const { city, currentState, country, savedLocations } = useAppSelector(
    (state) => state.geoLocation
  );

  // STATE
  const [searchQuery, setSearchQuery] = useState(city);

  // HOOKS
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        dispatch(getWeatherByCoords(position.coords) as any);
        dispatch(getCityByCoords(position.coords) as any);
      });
    }
  }, []);
  // FUNCTIONS
  const getWeatherCity = (query: string) => {
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
      getGeoByCity({
        city: weatherCity,
        state: weatherState,
        country: weatherCountry,
      }) as any
    );
  };

  const capitalize = (str: string) => {
    return str
      .split(' ')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ');
  };

  // RENDER
  if (weatherLoading) {
    return (
      <Main meta={<Meta title="Weather App" description="Weather App" />}>
        <div className="flex h-screen items-center justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
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
            className="rounded-lg bg-blue-500 p-2 text-white"
            onClick={() => getWeatherCity(searchQuery)}
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
        <div className="mt-8 flex flex-col items-center justify-center">
          <div className="mb-10 flex w-auto cursor-pointer flex-col items-center justify-center rounded-lg border bg-white p-6 text-center transition duration-500 ease-in-out hover:scale-105">
            <div className="mb-3 flex flex-col font-bold text-gray-900">
              <span className="uppercase">Today</span>{' '}
              <span className="text-sm font-normal text-gray-700">
                {new Date().toDateString()}
              </span>
              <span className="text-sm font-normal text-gray-700">
                {city}, {currentState}, {country}
              </span>
            </div>
            <img
              className="h-20 w-20"
              src={`http://openweathermap.org/img/w/${iconID}.png`}
              alt="weather icon"
            />

            <p className="mb-2 text-gray-700">
              {capitalize(weatherDescription)}
            </p>
            <div className="mb-6 text-3xl font-bold text-gray-900">
              {tempLow.toFixed(0)}ºF
              <span className="mx-1 font-normal text-gray-700">/</span>
              {tempHigh.toFixed(0)}ºF
            </div>
            <div className="mb-10 flex flex-row items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-gray-900">
                  Humidity
                </span>
                <span className="text-sm font-normal text-gray-700">
                  {humidity}%
                </span>
              </div>
              <div className="mx-4 flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-gray-900">
                  Wind Speed
                </span>
                <span className="text-sm font-normal text-gray-700">
                  {windSpeed} mph
                </span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-gray-900">
                  Feels Like
                </span>
                <span className="text-sm font-normal text-gray-700">
                  {feelsLike.toFixed(0)}ºF
                </span>
              </div>
            </div>
            <button
              className="rounded-md bg-blue-500 p-1 text-white"
              onClick={() =>
                dispatch(addLocation({ city, currentState, country } as any))
              }
            >
              Save Location
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-900">Saved Locations</h1>
          <div>
            {savedLocations.map((location: Location, index: number) => (
              <div key={index}>
                <span className="mr-4 text-gray-900">
                  {location.city}, {location.currentState}, {location.country}
                </span>
                <div className="flex flex-row items-center justify-center">
                  <button
                    className="rounded-md bg-red-500 p-1 text-white"
                    onClick={() =>
                      dispatch(removeLocation({ city, currentState, country }))
                    }
                  >
                    Remove
                  </button>
                  <button
                    className="rounded-md bg-blue-500 p-1 text-white"
                    onClick={() =>
                      getWeatherCity(
                        `${location.city}, ${location.currentState}, ${location.country}`
                      )
                    }
                  >
                    Get Weather
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Index;
