import { configureStore  } from '@reduxjs/toolkit';
import { listenerMiddleware, startListening } from './listenerMiddleware';
import quizReducer, { initialState as initialQuizState, reset } from './features/quiz/quizSlice';

startListening({
  actionCreator: reset,
  effect: async (_0, listenerApi) => {
    const state = listenerApi.getState();
    localStorage.setItem('HIGH_SCORE', JSON.stringify(state.quiz.highScore));
  }
});

const preloadedState = { quiz: initialQuizState };
const highScore: string | 0 = localStorage.getItem('HIGH_SCORE') || 0;
preloadedState.quiz.highScore = JSON.parse(highScore as string);

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
  preloadedState,
});


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
