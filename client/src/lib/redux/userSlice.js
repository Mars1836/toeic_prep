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
    updateAvatar(state, action) {
      state.data.avatar = action.payload;
    },
    updateProfile(state, action) {
      state.data = { ...state.data, ...action.payload };
    },
    updateTargetScore(state, action) {
      state.data.targetScore = {
        reading: action.payload.reading,
        listening: action.payload.listening,
      };
    },
  },
});
export const {
  login,
  logoutUserState,
  setUserState,
  updateAvatar,
  updateProfile,
  updateTargetScore,
} = userSlice.actions;
