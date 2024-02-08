import { createSlice } from '@reduxjs/toolkit'
export interface CounterState {
  score: number;
  previousScore: number;
}

const initialState: CounterState = {
  score: 0,
  previousScore: 0,
};

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    increment: (state) => {
      state.score += 1;
    },
    reset: (state) => {
      state.previousScore = state.score;
      state.score = 0;
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, reset } = quizSlice.actions;
export default quizSlice.reducer;