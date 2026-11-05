"use client";

import { createSlice } from "@reduxjs/toolkit";

const contentSlice = createSlice({
  name: "content",
  initialState: {
    currentContent: "",
  },
  reducers: {
    setContent: (state, action) => {
      state.currentContent = action.payload;
    },
  },
});

export const { setContent } = contentSlice.actions;
export default contentSlice.reducer;
