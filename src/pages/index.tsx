import { useEffect, useState } from 'react';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  getCity,
  setLatitude,
  setLongitude,
} from '../redux/slices/geoLocationSlice';
import {
  clearWeather,
  getWeather,
  getWeatherByCoords,
} from '../redux/slices/weatherSlice';

const Index = () => {
  const dispatch = useAppDispatch();

  const {
    latitude,
    longitude,
    currentCity,
    currentState,
    currentCountry,
    cityLoading,
  } = useAppSelector((state) => state.geoLocation);
  const { weatherLoading, weatherDescription, tempHigh, tempLow } =
    useAppSelector((state) => state.weather);

  const [city, setCity] = useState(currentCity);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        dispatch(setLatitude(position.coords.latitude));
        dispatch(setLongitude(position.coords.longitude));
      });
    }
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      dispatch(getCity({ latitude, longitude }) as any);
      dispatch(getWeatherByCoords({ latitude, longitude }) as any);
    }
  }, [latitude, longitude]);

  // function to get weather by city name
  const getWeatherByCity = (newCity: string) => {
    // clear weather state
    dispatch(clearWeather());
    dispatch(getWeather(newCity) as any);
  };

  if (cityLoading || weatherLoading) {
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
        <h1 className="text-4xl font-bold text-gray-900">Weather App</h1>
      </div>
      {/* add seatch bar and button for gettign weather by city name  when button is clicked pass input value */}
      <div className="flex flex-col items-center justify-center">
        <input
          type="text"
          placeholder="Enter city name"
          className="rounded-lg border border-gray-300 p-2"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          className="mt-2 rounded-lg bg-blue-500 p-2 text-white"
          onClick={() => getWeatherByCity(city)}
        >
          Search
        </button>
      </div>

      <div className="m-10 flex flex-col items-center md:flex-row md:justify-center">
        <div className="mb-10 flex w-64 cursor-pointer flex-col items-center justify-center rounded-lg border bg-white p-6 text-center transition duration-500 ease-in-out hover:scale-105 md:mr-20">
          <div className="flex flex-col font-bold text-gray-900">
            <span className="uppercase">Today</span>{' '}
            <span className="text-sm font-normal text-gray-700">
              {new Date().toDateString()}
            </span>
            <span className="text-sm font-normal text-gray-700">
              {currentCity}, {currentState}, {currentCountry}
            </span>
          </div>
          {/* Put icon here */}
          <p className="mb-2 text-gray-700">
            {/* if weather then display description and capatilize each word */}
            {weatherDescription}
          </p>
          <div className="mb-6 text-3xl font-bold text-gray-900">
            {/* if weather then display temp */}
            {Math.floor(tempLow)}º
            <span className="mx-1 font-normal text-gray-700">/</span>
            {/* if weather then display temp max */}
            {Math.floor(tempHigh)}º
          </div>
        </div>

        <div className="flex w-64 cursor-pointer flex-col items-center justify-center rounded-lg border bg-blue-500 p-6 text-center transition duration-500 ease-in-out hover:scale-105">
          <div className="flex flex-col font-bold text-white">
            <span className="uppercase">Today</span>{' '}
            <span className="text-sm font-normal text-white">October 22</span>
          </div>
          {/* Put Icon here */}
          <p className="mb-2 text-white">Partly cloud</p>
          <div className="mb-6 text-3xl font-bold text-white">
            32º<span className="mx-1 font-normal text-white">/</span>20º
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Index;
