"use client";

import { createSlice } from "@reduxjs/toolkit";

const feedbackCountSlice = createSlice({
  name: "feedbackCount",
  initialState: {
    currentCount: 0,
  },
  reducers: {
    setFeedbackCount: (state, action) => {
      state.currentCount = action.payload;
    },
  },
});

export const { setFeedbackCount } = feedbackCountSlice.actions;
export default feedbackCountSlice.reducer;
