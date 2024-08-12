import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AnswerListState {
  answerList: string[];
}

const initialState: AnswerListState = {
  answerList: []
};

const answerListSlice = createSlice({
  name: 'answerList',
  initialState,
  reducers: {
    setAnswerList: (state, action: PayloadAction<string[]>) => {
      state.answerList = action.payload;
    },
    addAnswer: (state, action: PayloadAction<string>) => {
      state.answerList.push(action.payload);
    },
    clearAnswerList: (state) => {
      state.answerList = [];
    }
  }
});

export const { setAnswerList, addAnswer, clearAnswerList } = answerListSlice.actions;
export default answerListSlice.reducer;
