"use client";
import { configureStore } from "@reduxjs/toolkit";
import contentReducer from "@/store/contentSlice";
import tutorialReducer from "@/store/tutorialSlice";
import feedbackReducer from "@/store/feedbackCountSlice";

export const store = configureStore({
  reducer: {
    content: contentReducer,
    tutorial: tutorialReducer,
    feedback: feedbackReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
