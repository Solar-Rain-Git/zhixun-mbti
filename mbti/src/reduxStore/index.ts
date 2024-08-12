import { configureStore } from "@reduxjs/toolkit";
import answerListReducer from "./answerList";
import userReducer from "./userStore";

// 组合 reducers
const globalStore = configureStore({
  reducer: {
    answerList: answerListReducer,
    user: userReducer,
  },
});

export default globalStore;
