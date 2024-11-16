import { createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

const initialState = { data: null };

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state) {},
    logoutUserState(state) {
      state.data = null;
    },
    setUserState(state, action) {
      state.data = action.payload;
    },
  },
});
export const { login, logoutUserState, setUserState } = userSlice.actions;
