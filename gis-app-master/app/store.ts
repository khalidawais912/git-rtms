"use client";
import { configureStore } from "@reduxjs/toolkit";
import contentReducer from "./features/content/contentSlice";
import tutorialReducer from "./features/tutorial/tutorialSlice";
import feedbackReducer from "./features/feedback/feedbackCountSlice";

export const store = configureStore({
  reducer: {
    content: contentReducer,
    tutorial: tutorialReducer,
    feedback: feedbackReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
