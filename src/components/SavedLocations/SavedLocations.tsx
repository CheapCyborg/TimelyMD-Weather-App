import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { removeLocation } from '@/redux/slices/geoLocationSlice';
import type { Location } from '@/redux/types';

const Locations = () => {
  const dispatch = useAppDispatch();

  const { savedLocations } = useAppSelector((state) => state.geoLocation);

  return (
    <div>
      {savedLocations.length > 0 && (
        <div className="ml-10 flex flex-col items-center justify-center rounded-lg border bg-white p-6">
          <div className="mb-3 flex flex-col text-sm font-bold text-gray-900">
            <span className="w-max">Saved Locations</span>
            <span className="text-sm font-normal text-gray-700"></span>
          </div>
          {savedLocations.map((location: Location, index: number) => (
            <div
              key={index}
              className="mx-2 transition duration-500 ease-in-out hover:scale-105"
            >
              <div className="mb-3 flex flex-col font-bold text-gray-900">
                <span className="text-lg">{location.city}</span>
                <span className="text-sm font-normal text-gray-700">
                  {location.currentState}, {location.country}
                </span>
              </div>
              <button
                onClick={() =>
                  dispatch(
                    removeLocation({
                      city: location.city,
                      currentState: location.currentState,
                      country: location.country,
                    })
                  )
                }
                className=" group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-sm text-sm font-medium text-gray-900 hover:text-black focus:outline-none focus:ring-4 focus:ring-cyan-200 group-hover:from-cyan-500 group-hover:to-blue-500 dark:text-white dark:focus:ring-cyan-800"
              >
                <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-white group-hover:px-5 group-hover:py-2.5 dark:bg-gray-900">
                  Remove
                </span>
              </button>

              <button className="group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-sm p-0.5 text-sm font-medium text-gray-900 hover:text-black focus:outline-none focus:ring-4 focus:ring-cyan-200 group-hover:from-cyan-500 group-hover:to-blue-500 dark:text-white dark:focus:ring-cyan-800">
                <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-white group-hover:px-5 group-hover:py-2.5 dark:bg-gray-900">
                  View
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Locations;
