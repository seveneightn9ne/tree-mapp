import { createSlice } from "@reduxjs/toolkit";

export interface UiState {
  loaded: boolean;
}

const initialState: UiState = {
  loaded: false,
};

export default createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoaded: (state) => ({ ...state, loaded: true }),
  },
});
