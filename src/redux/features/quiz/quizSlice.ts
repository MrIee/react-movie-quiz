import { createSlice } from '@reduxjs/toolkit'
export interface CounterState {
  score: number;
  highScore: number;
}

export const initialState: CounterState = {
  score: 0,
  highScore: 0,
};

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    increment: (state) => {
      state.score += 1;
    },
    reset: (state) => {
      if (state.score > state.highScore) {
        state.highScore = state.score;
      }

      state.score = 0;
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, reset } = quizSlice.actions;
export default quizSlice.reducer;