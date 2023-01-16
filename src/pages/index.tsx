import { useEffect, useState } from 'react';

import { Meta } from '@/layouts/Meta';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  getWeatherByCity,
  getWeatherByCoords,
} from '@/redux/slices/currentWeatherSlice';
import {
  addLocation,
  getCityByCoords,
  getGeoByCity,
  removeLocation,
} from '@/redux/slices/geoLocationSlice';
import { getWeatherForecastByCoords } from '@/redux/slices/weatherForecastSlice';
import type {
  Location,
  WeatherForecast,
  WeatherForecastData,
} from '@/redux/types';
import { Main } from '@/templates/Main';

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
  } = useAppSelector((state) => state.currentWeather);

  const { geoLoading, city, currentState, country, savedLocations } =
    useAppSelector((state) => state.geoLocation);
  const { weatherForecast, weatherForecastLoading } = useAppSelector(
    (state) => state.weatherForecast
  );
  // STATE
  const [searchQuery, setSearchQuery] = useState(city);
  const [formattedForecast, setFormattedForecast] = useState<WeatherForecast[]>(
    []
  );

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
      getGeoByCity({
        city: weatherCity,
        state: weatherState,
        country: weatherCountry,
      }) as any
    );
  };

  const getWeatherForecastByDay = () => {
    const weatherForecastByDay: WeatherForecast[] = [];

    weatherForecast.forEach((forecast: WeatherForecastData) => {
      const forecastDate = new Date(forecast.dt_txt);
      const today = new Date();

      if (forecastDate.getDate() !== today.getDate()) {
        const forecastDay = forecastDate.getDay();
        const forecastDayName = forecastDate.toLocaleString('en-us', {
          weekday: 'long',
        });

        const forecastDayIndex = weatherForecastByDay.findIndex(
          (forecastIndex) => forecastIndex.day === forecastDay
        );

        if (forecastDayIndex === -1) {
          weatherForecastByDay.push({
            day: forecastDay,
            dayName: forecastDayName,
            tempHigh: forecast.main.temp_max,
            tempLow: forecast.main.temp_min,
            weatherDescription: forecast.weather[0].description,
            iconID: forecast.weather[0].icon,
          });
        } else {
          if (
            forecast.main.temp_max >
            weatherForecastByDay[forecastDayIndex].tempHigh
          ) {
            weatherForecastByDay[forecastDayIndex].tempHigh =
              forecast.main.temp_max;
          }

          if (
            forecast.main.temp_min <
            weatherForecastByDay[forecastDayIndex].tempLow
          ) {
            weatherForecastByDay[forecastDayIndex].tempLow =
              forecast.main.temp_min;
          }
        }
      }
    });

    setFormattedForecast(weatherForecastByDay);
    return weatherForecastByDay;
  };

  useEffect(() => {
    if (weatherForecast.length > 0) {
      getWeatherForecastByDay();
    }
  }, [weatherForecast]);

  const capitalize = (str: string) => {
    return str
      .split(' ')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ');
  };

  // RENDER
  if (weatherLoading || geoLoading || weatherForecastLoading) {
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
              onClick={() =>
                dispatch(addLocation({ city, currentState, country }))
              }
              className="group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-black focus:outline-none focus:ring-4 focus:ring-cyan-200 group-hover:from-cyan-500 group-hover:to-blue-500 dark:text-white dark:focus:ring-cyan-800"
            >
              <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-white group-hover:px-5 group-hover:py-2.5 dark:bg-gray-900">
                Save Location
              </span>
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">
            5 Day Forecast
          </h1>
          <div className="mb-10 flex flex-row items-center justify-center">
            {formattedForecast.map((day: WeatherForecast, index: number) => (
              <div
                key={index}
                className="mx-2 flex flex-col items-center justify-center rounded-lg border bg-white p-6 text-center transition duration-500 ease-in-out hover:scale-105"
              >
                <div className="mb-3 flex flex-col text-sm font-bold text-gray-900">
                  <span className="w-max">{day.dayName}</span>
                  <span className="text-sm font-normal text-gray-700"></span>
                </div>
                <img
                  className="h-20 w-20"
                  src={`http://openweathermap.org/img/w/${day.iconID}.png`}
                  alt="weather icon"
                />
                <p className="mb-2 w-max text-sm text-gray-700">
                  {capitalize(day.weatherDescription)}
                </p>
                <div className="mb-6 text-2xl font-bold text-gray-900">
                  {day.tempLow.toFixed(0)}ºF
                  <span className="mx-1 font-normal text-gray-700">/</span>
                  {day.tempHigh.toFixed(0)}ºF
                </div>
              </div>
            ))}
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
                      getWeatherOnClick(
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
