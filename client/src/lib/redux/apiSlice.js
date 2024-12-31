import { createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
const initialState = { url: null };

export const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    setUrl(state, action) {
      state.url = action.payload;
    },
  },
});
export const { setUrl } = apiSlice.actions;
