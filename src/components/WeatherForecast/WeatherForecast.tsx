import { useEffect, useState } from 'react';

import { useAppSelector } from '@/redux/hooks';
import type { WeatherForecast, WeatherForecastData } from '@/redux/types';
import { capitalize } from '@/utils/capitalize';

const Forecast = () => {
  const { weatherForecast } = useAppSelector((state) => state.weatherForecast);

  const [formattedForecast, setFormattedForecast] = useState<WeatherForecast[]>(
    []
  );

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
  };

  useEffect(() => {
    if (weatherForecast.length > 0) {
      getWeatherForecastByDay();
    }
  }, [weatherForecast]);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">5 Day Forecast</h1>
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
  );
};

export default Forecast;
