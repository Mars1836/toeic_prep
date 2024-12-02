import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setDirection(state, action) {
      state.direction = action.payload;
    },
    setQuizResult(state, action) {
      state.quizResult = action.payload;
    },
    clearSession(state) {
      state = {};
    },
    clearQuizResult(state) {
      state.quizResult = {};
    },
    clearDirection(state) {
      state.direction = "";
    },
  },
});
export const {
  setDirection,
  setQuizResult,
  clearSession,
  clearQuizResult,
  clearDirection,
} = sessionSlice.actions;
