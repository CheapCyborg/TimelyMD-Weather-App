import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addLocation } from '@/redux/slices/geoLocationSlice';
import { capitalize } from '@/utils/capitalize';

const CurrentWeather = () => {
  const dispatch = useAppDispatch();

  const {
    tempHigh,
    tempLow,
    weatherDescription,
    iconID,
    humidity,
    windSpeed,
    feelsLike,
  } = useAppSelector((state) => state.currentWeather);

  const { city, currentState, country } = useAppSelector(
    (state) => state.geoLocation
  );

  return (
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
      <p className="mb-2 text-gray-700">{capitalize(weatherDescription)}</p>
      <div className="mb-6 text-3xl font-bold text-gray-900">
        {tempLow.toFixed(0)}ºF
        <span className="mx-1 font-normal text-gray-700">/</span>
        {tempHigh.toFixed(0)}ºF
      </div>
      <div className="mb-10 flex flex-row items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-gray-900">Humidity</span>
          <span className="text-sm font-normal text-gray-700">{humidity}%</span>
        </div>
        <div className="mx-4 flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-gray-900">Wind Speed</span>
          <span className="text-sm font-normal text-gray-700">
            {windSpeed.toFixed(0)} MPH
          </span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-gray-900">Feels Like</span>
          <span className="text-sm font-normal text-gray-700">
            {feelsLike.toFixed(0)}ºF
          </span>
        </div>
      </div>
      <button
        onClick={() => dispatch(addLocation({ city, currentState, country }))}
        className="group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-black focus:outline-none focus:ring-4 focus:ring-cyan-200 group-hover:from-cyan-500 group-hover:to-blue-500 dark:text-white dark:focus:ring-cyan-800"
      >
        <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-white group-hover:px-5 group-hover:py-2.5 dark:bg-gray-900">
          Save Location
        </span>
      </button>
    </div>
  );
};

export default CurrentWeather;
