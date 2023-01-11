import { useEffect } from 'react';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setLatitude, setLongitude } from '../redux/slices/geoLocationSlice';

const Index = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        dispatch(setLatitude(position.coords.latitude));
        dispatch(setLongitude(position.coords.longitude));
      });
    }
  }, []);

  const latitude = useAppSelector((state) => state.geoLocation.latitude);
  const longitude = useAppSelector((state) => state.geoLocation.longitude);

  console.log(latitude, longitude);

  return (
    <Main
      meta={
        <Meta
          title="Next.js Boilerplate Presentation"
          description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
        />
      }
    >
      <></>
    </Main>
  );
};

export default Index;
