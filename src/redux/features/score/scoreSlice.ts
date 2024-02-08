import { createSlice } from '@reduxjs/toolkit'
export interface CounterState {
  score: number
}

const initialState: CounterState = {
  score: 0,
};

export const scoreSlice = createSlice({
  name: 'score',
  initialState,
  reducers: {
    increment: (state) => {
      state.score += 1;
    },
    decrement: (state) => {
      state.score -= 1;
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement } = scoreSlice.actions;
export default scoreSlice.reducer;