import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

// Define a type for the slice state for geoLocation
interface GeoLocationState {
  latitude: number;
  longitude: number;
}

// Define the initial state using that type
const initialState: GeoLocationState = {
  latitude: 0,
  longitude: 0,
};

export const geoLocationSlice = createSlice({
  name: 'geoLocation',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setLatitude: (state, action: PayloadAction<number>) => {
      state.latitude = action.payload;
    },
    setLongitude: (state, action: PayloadAction<number>) => {
      state.longitude = action.payload;
    },
  },
});

export const { setLatitude, setLongitude } = geoLocationSlice.actions;

export default geoLocationSlice.reducer;
