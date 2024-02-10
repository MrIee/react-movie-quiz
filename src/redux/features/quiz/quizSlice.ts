import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CounterState {
  score: number;
  highScore: number;
  previousHighScore: number;
}

export const initialState: CounterState = {
  score: 0,
  highScore: 0,
  previousHighScore: 0,
};

const setHighScoreToScore = (state: CounterState) => {
  if (state.score > state.highScore) {
    state.highScore = state.score;
  }
};

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setPreviousHighScore: (state, action: PayloadAction<number>) => {
      state.previousHighScore = action.payload;
    },
    incrementScoreCorrect: (state) => {
      state.score += 2;
      setHighScoreToScore(state);
    },
    incrementScoreWrong: (state) => {
      state.score -= 1;

      if (state.score < 0) {
        state.score = 0;
      }

      setHighScoreToScore(state);
    },
    resetScore: (state) => {
      state.score = 0;
    },
  },
});

// Action creators are generated for each case reducer function
export const { incrementScoreCorrect, incrementScoreWrong, setPreviousHighScore, resetScore } = quizSlice.actions;
export default quizSlice.reducer;