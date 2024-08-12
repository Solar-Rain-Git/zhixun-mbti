// store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './index';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type userState = ReturnType<typeof store.getState>;
