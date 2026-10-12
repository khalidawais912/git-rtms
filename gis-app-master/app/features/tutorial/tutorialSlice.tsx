"use client";

import { createSlice } from "@reduxjs/toolkit";

const tutorialSlice = createSlice({
  name: "tutorial",
  initialState: {
    currentTutorial: "",
  },
  reducers: {
    setTutorial: (state, action) => {
      state.currentTutorial = action.payload;
    },
  },
});

export const { setTutorial } = tutorialSlice.actions;
export default tutorialSlice.reducer;
